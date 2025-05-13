const db = require('../db');

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
		const result = await db.query(
			`INSERT INTO training (name, description)
				VALUES ($1, $2)
				RETURNING *`,
			[name, description]
		);
		res.status(201).json(result.rows[0]);
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
		const result = await db.query(
			`UPDATE training
				SET (name, description) = ($1, $2)
				WHERE id = ($3)`,
			[name, description, id]
		);
		res.status(201).json(result.rows[0]);
	}
	catch (err) {
		console.error('Error updating training:', err);
		res.status(500).send('Server error');
	}
};

module.exports = {
	getTrainings,
	newTraining,
	getSomeTrainings,
	updateTraining,
};