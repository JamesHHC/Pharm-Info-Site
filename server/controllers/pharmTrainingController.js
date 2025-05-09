const db = require('../db');

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

module.exports = {
	getPharmTrainings,
	newPharmTraining,
};