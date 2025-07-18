const db = require('../db');
const check_role = require('./check_role');
const logger = require('../utils/logger');

// Get all trainings
const getTrainings = async (req, res) => {
	try {
		const result = await db.query('SELECT * FROM training');
		res.json(result.rows);
	}
	catch (err) {
		console.error('Error getting trainings:', err);
		res.status(500).send('Server error');
	}
};

// Insert a new training
const newTraining = async (req, res) => {
	const { name, description } = req.body;
	try {
		// Validate user access level
		if (check_role(req.user.role, 'admin'))
			return res.status(403).json({ error: 'Insufficient permissions' });

		const result = await db.query(
			`INSERT INTO training (name, description)
				VALUES ($1, $2)
				RETURNING *`,
			[name, description]
		);
		res.status(201).json(result.rows[0]);

		// Logging
		const user = await logger.getUser(req.user.id);
		logger.info({
			actingUser: user,
			target: name,
			action: `Created new training`,
		});
	}
	catch (err) {
		console.error('Error creating training:', err);
		res.status(500).send('Server error');
	}
};

// Get rows where IDs match those in the provided array
const getSomeTrainings = async (req, res) => {
	const { ids } = req.body;
	try {
		const result = await db.query(
			`SELECT * FROM training
				WHERE id IN (${ids.map((_, i) => `$${i + 1}`).join(',')})`,
			ids
		);
		res.json(result.rows);
	}
	catch (err) {
		console.error('Error getting some trainings:', err);
		res.status(500).send('Server error');
	}
};

// Update training with matching id
const updateTraining = async (req, res) => {
	const { name, description, id } = req.body;
	try {
		// Validate user access level
		if (check_role(req.user.role, 'admin'))
			return res.status(403).json({ error: 'Insufficient permissions' });

		const result = await db.query(
			`UPDATE training
				SET (name, description) = ($1, $2)
				WHERE id = ($3)`,
			[name, description, id]
		);
		res.status(201).json(result.rows[0]);

		// Logging
		const user = await logger.getUser(req.user.id);
		logger.info({
			actingUser: user,
			target: name,
			action: `Updated training`,
		});
	}
	catch (err) {
		console.error('Error updating training:', err);
		res.status(500).send('Server error');
	}
};

// Delete training, including entries in pharmacy_training
const deleteTraining = async (req, res) => {
	const id = req.query.id;
	try {
		// Validate user access level
		if (check_role(req.user.role, 'admin'))
			return res.status(403).json({ error: 'Insufficient permissions' });

		await db.query(
			`DELETE FROM pharmacy_training
				WHERE training_id = ($1)`,
			[id]
		);
		const result = await db.query(
			`DELETE FROM training
				WHERE id = ($1)
				RETURNING name`,
			[id]
		);
		res.status(201).json('Training deleted!');

		// Logging
		const user = await logger.getUser(req.user.id);
		logger.info({
			actingUser: user,
			target: result.rows[0]?.name,
			action: `Deleted training`,
		});
	}
	catch (err) {
		console.error('Error deleting training:', err);
		res.status(500).send('Server error');
	}
};

module.exports = {
	getTrainings,
	newTraining,
	getSomeTrainings,
	updateTraining,
	deleteTraining,
};