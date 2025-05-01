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

// Insert a new pharmacy training
const newPharmTraining = async (req, res) => {
	const { pharmacy_id, training_id } = req.body;
	try {
		const result = await db.query(
			`INSERT INTO pharmacy_training (pharmacy_id, training_id)
				VALUES ($1, $2)
				RETURNING *`,
			[pharmacy_id, training_id]
		);
		res.status(201).json(result.rows[0]);
	}
	catch (err) {
		console.error('Error creating pharmacy training:', err);
		res.status(500).send('Server error');
	}
}

module.exports = {
	getPharmTrainings,
	newPharmTraining,
};