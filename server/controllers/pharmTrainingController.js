const {pool: db} = require('../db/database');
const check_role = require('./controller_utils/check_role');
const logger = require('../utils/logger');

// Get all pharmacy trainings
const getPharmTrainings = async (req, res) => {
	try {
		const pharmacy_id = req.query.pharmacy_id;
		const result = await db.query(
			`SELECT * FROM pharmacy_training
				WHERE pharmacy_id = ($1)`,
			[ pharmacy_id ]
		);
		res.json(result.rows);
	}
	catch (err) {
		console.error('Error getting pharmacy trainings:', err);
		res.status(500).send('Server error');
	}
};

// Insert new pharmacy training(s)
const newPharmTraining = async (req, res) => {
	const { pharmacy_id, training_ids } = req.body;
	try {
		// Validate user access level
		if (check_role(req.user.role, 'admin'))
			return res.status(403).json({ error: 'Insufficient permissions' });

		// Construct values in format ($1, $2), ($1, $3), etc...
		const values = training_ids.map((_, i) => `($1, $${i + 2})`).join(', ');
		const ids = [pharmacy_id, ...training_ids];
		const result = await db.query(
			`INSERT INTO pharmacy_training (pharmacy_id, training_id)
				VALUES ${values}
				RETURNING *`,
			ids
		);
		res.status(201).json(result.rows);
	}
	catch (err) {
		console.error('Error creating pharmacy training(s):', err);
		res.status(500).send('Server error');
	}
}

// Update existing pharmacy-training associations
const updatePharmTrainings = async (req, res) => {
	const { pharmacy_id, training_ids } = req.body;
	try {
		// Validate user access level
		if (check_role(req.user.role, 'admin'))
			return res.status(403).json({ error: 'Insufficient permissions' });

		// Check db for existing id pairs
		const check = await db.query(
			`SELECT training_id FROM pharmacy_training
				WHERE pharmacy_id = ($1)`,
			[pharmacy_id]
		);
		// Get array of currently paired training_ids
		const found = check.rows.map((x) => x.training_id);

		// Find values that are in one arr and not the other, ignore others
		const foundSet = new Set(found);
		const newSet = new Set(training_ids);
		const remArr = [...new Set(found.filter(rid => !newSet.has(rid)))];
		const addArr = [...new Set(training_ids.filter(rid => !foundSet.has(rid)))];

		if (addArr.length > 0) {
			// Construct values in format ($1, $2), ($1, $3), etc...
			const addValues = addArr.map((_, i) => `($1, $${i + 2})`).join(', ');
			const addIds = [pharmacy_id, ...addArr];
			// Add missing pharm-training associations
			const addQuery = await db.query(
				`INSERT INTO pharmacy_training (pharmacy_id, training_id)
					VALUES ${addValues}
					RETURNING *`,
				addIds
			);
		}
		if (remArr.length > 0) {
			// Remove deselected pharm-training associations
			const remQuery = await db.query(
				`DELETE FROM pharmacy_training
					WHERE pharmacy_id = ANY($1) AND
					training_id = ANY($2)`,
				[[pharmacy_id], remArr]
			);
		}
		res.status(201).json('Pharmacy trainings updated!');

		// Logging
		if (remArr.length === 0 && addArr.length === 0) return;
		const user = await logger.getUser(req.user.id);
		const pharm = await db.query(`SELECT name FROM pharmacies WHERE id = $1`, [pharmacy_id]);
		logger.info({
			actingUser: user,
			target: pharm.rows[0].name,
			action: `Updated associated trainings`,
			changes: {
				targetId: pharmacy_id,
				fields: {
					pharm_trainings: {
						from: found,
						to: training_ids,
					},
				},
			},
		});
	}
	catch (err) {
		console.error('Error updating pharmacy training(s):', err);
		res.status(500).send('Server error');
	}
}

module.exports = {
	getPharmTrainings,
	newPharmTraining,
	updatePharmTrainings,
};