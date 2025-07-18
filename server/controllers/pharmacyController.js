const db = require('../db');
const check_role = require('./check_role');
const logger = require('../utils/logger');

// Get all pharmacies
const getPharmacies = async (req, res) => {
	try {
		const result = await db.query('SELECT * FROM pharmacies');
		res.json(result.rows);
	}
	catch (err) {
		console.error('Error getting pharmacies:', err);
		res.status(500).send('Server error');
	}
};

// Insert a new pharmacy
const newPharmacy = async (req, res) => {
	const { name, communication, verbal_orders, general_notes, oncall_prefs } = req.body;
	try {
		// Validate user access level
		if (check_role(req.user.role, 'admin creator'))
			return res.status(403).json({ error: 'Insufficient permissions' });

		const result = await db.query(
			`INSERT INTO pharmacies (name, communication, verbal_orders, general_notes, oncall_prefs)
				VALUES ($1, $2, $3, $4, $5)
				RETURNING *`,
			[name, communication, verbal_orders, general_notes, oncall_prefs]
		);
		res.status(201).json(result.rows[0]);

		// Logging
		const user = await logger.getUser(req.user.id);
		logger.info({
			actingUser: user,
			target: name,
			action: `Created new pharmacy`,
		});
	}
	catch (err) {
		console.error('Error creating pharmacy:', err);
		res.status(500).send('Server error');
	}
};

// Get rows where IDs match those in the provided array
const getSomePharmacies = async (req, res) => {
	const { ids } = req.body;
	try {
		const result = await db.query(
			`SELECT * FROM pharmacies
				WHERE id IN (${ids.map((_, i) => `$${i + 1}`).join(',')})`,
			ids
		);
		res.json(result.rows);
	}
	catch (err) {
		console.error('Error getting some pharmacies:', err);
		res.status(500).send('Server error');
	}
};

// Delete pharmacy matching given id
// including entries in pharmacy_rules, pharmacy_training, & pharmacy_contacts
const deletePharmacy = async (req, res) => {
	const id = req.query.id;
	try {
		// Validate user access level
		if (check_role(req.user.role, 'superadmin'))
			return res.status(403).json({ error: 'Insufficient permissions' });

		await db.query(`DELETE FROM pharmacy_rules WHERE pharmacy_id = ($1)`, [id]);
		await db.query(`DELETE FROM pharmacy_training WHERE pharmacy_id = ($1)`, [id]);
		await db.query(`DELETE FROM pharmacy_blurbs WHERE pharmacy_id = ($1)`, [id]);
		await db.query(`DELETE FROM pharmacy_contacts WHERE pharmacy_id = ($1)`, [id]);
		const result = await db.query(`
			DELETE FROM pharmacies
				WHERE id = ($1)
				RETURNING name`,
			[id]
		);
		res.status(201).json('Pharmacy deleted!');

		// Logging
		const user = await logger.getUser(req.user.id);
		logger.info({
			actingUser: user,
			target: result.rows[0]?.name,
			action: `Deleted pharmacy`,
		});
	}
	catch (err) {
		console.error('Error deleting pharmacy:', err);
		res.status(500).send('Server error');
	}
};

// Overwrite values of existing pharmacy for given id
const updatePharmacy = async (req, res) => {
	const { id, name, communication, verbal_orders, general_notes, oncall_prefs } = req.body;
	try {
		// Validate user access level
		if (check_role(req.user.role, 'editor'))
			return res.status(403).json({ error: 'Insufficient permissions' });
		
		const result = await db.query(
			`UPDATE pharmacies SET (name, communication, verbal_orders, general_notes, oncall_prefs) =
				($2, $3, $4, $5, $6)
				WHERE id = ($1)
				RETURNING *`,
			[id, name, communication, verbal_orders, general_notes, oncall_prefs]
		);
		res.status(201).json(result.rows[0]);

		// Logging
		const user = await logger.getUser(req.user.id);
		logger.info({
			actingUser: user,
			target: name,
			action: `Updated pharmacy`,
		});
	}
	catch (err) {
		console.error('Error updating pharmacy:', err);
		res.status(500).send('Server error');
	}
};

// Update pharmacy active status
const pharmacyActive = async (req, res) => {
	const { id, active } = req.body;
	try {
		// Validate user access level
		if (check_role(req.user.role, 'admin creator'))
			return res.status(403).json({ error: 'Insufficient permissions' });

		const result = await db.query(`
			UPDATE pharmacies
				SET active = $2
				WHERE id = $1
				RETURNING name`,
			[id, active]
		);
		res.status(201).send(active ? 'Pharmacy activated' : 'Pharmacy archived');

		// Logging
		const user = await logger.getUser(req.user.id);
		logger.info({
			actingUser: user,
			targetID: result.rows[0]?.name,
			action: `${active? 'Activated' : 'Archived'} pharmacy`,
		});
	}
	catch (err) {
		console.error('Error updating pharmacy active status:', err);
		res.status(500).send('Server error');
	}
};

module.exports = {
	getPharmacies,
	newPharmacy,
	getSomePharmacies,
	deletePharmacy,
	updatePharmacy,
	pharmacyActive,
};