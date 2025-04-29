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
}

module.exports = {
	getTrainings,
	newTraining,
};