const {pool: db} = require('../db/database');
const check_role = require('./controller_utils/check_role');
const get_changes = require('./controller_utils/get_changes');
const logger = require('../utils/logger');

// Get all blurbs
const getBlurbs = async (req, res) => {
	try {
		const result = await db.query('SELECT * FROM vn_blurbs');
		res.json(result.rows);
	}
	catch (err) {
		console.error('Error getting blurbs:', err);
		res.status(500).send('Server error');
	}
};

// Insert a new blurb
const newBlurb = async (req, res) => {
	const { name, description, type } = req.body;
	try {
		// Validate user access level
		if (check_role(req.user.role, 'admin'))
			return res.status(403).json({ error: 'Insufficient permissions' });

		const result = await db.query(
			`INSERT INTO vn_blurbs (name, description, type)
				VALUES ($1, $2, $3)
				RETURNING *`,
			[name, description, type]
		);
		res.status(201).json(result.rows[0]);

		// Logging
		const user = await logger.getUser(req.user.id);
		logger.info({
			actingUser: user,
			target: name,
			action: `Created new blurb`,
		});
	}
	catch (err) {
		console.error('Error creating blurb:', err);
		res.status(500).send('Server error');
	}
};

// Get rows where IDs match those in the provided array
const getSomeBlurbs = async (req, res) => {
	const { ids } = req.body;
	try {
		const result = await db.query(
			`SELECT * FROM vn_blurbs
				WHERE id IN (${ids.map((_, i) => `$${i + 1}`).join(',')})`,
			ids
		);
		res.json(result.rows);
	}
	catch (err) {
		console.error('Error getting some blurbs:', err);
		res.status(500).send('Server error');
	}
};

// Update blurb with matching id
const updateBlurb = async (req, res) => {
	const { name, description, type, id } = req.body;
	try {
		// Validate user access level
		if (check_role(req.user.role, 'admin'))
			return res.status(403).json({ error: 'Insufficient permissions' });

		const blrb = await db.query(
			`SELECT * FROM vn_blurbs 
				WHERE id = $1`,
			[id]
		);
		const changeJson = get_changes(req.body, blrb.rows[0]);

		const result = await db.query(
			`UPDATE vn_blurbs
				SET (name, description, type) = ($1, $2, $3)
				WHERE id = $4`,
			[name, description, type, id]
		);
		res.status(201).json(result.rows[0]);

		// Logging
		const user = await logger.getUser(req.user.id);
		logger.info({
			actingUser: user,
			target: name,
			action: `Updated VN blurb`,
			changes: {
				targetId: id,
				fields: changeJson,
			},
		});
	}
	catch (err) {
		console.error('Error updating blurb:', err);
		res.status(500).send('Server error');
	}
};

// Delete blurb, including entries in pharmacy_blurbs
const deleteBlurb = async (req, res) => {
	const id = req.query.id;
	try {
		// Validate user access level
		if (check_role(req.user.role, 'superadmin'))
			return res.status(403).json({ error: 'Insufficient permissions' });
		
		await db.query(
			`DELETE FROM pharmacy_blurbs
				WHERE blurb_id = ($1)`,
			[id]
		);
		const result = await db.query(
			`DELETE FROM vn_blurbs
				WHERE id = ($1)
				RETURNING name`,
			[id]
		);
		res.status(201).json('Blurb deleted!');

		// Logging
		const user = await logger.getUser(req.user.id);
		logger.info({
			actingUser: user,
			target: result.rows[0]?.name,
			action: `Deleted VN blurb`,
		});
	}
	catch (err) {
		console.error('Error deleting blurb:', err);
		res.status(500).send('Server error');
	}
};

module.exports = {
	getBlurbs,
	newBlurb,
	getSomeBlurbs,
	updateBlurb,
	deleteBlurb
};