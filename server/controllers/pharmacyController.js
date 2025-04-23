const db = require('../db');

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
	const { name, communication, verbal_orders, general_notes, oncall_prefs, rules, training_req } = req.body;
	try {
		const result = await db.query(
			`INSERT INTO pharmacies (name, communication, verbal_orders, general_notes, oncall_prefs, rules, training_req)
				VALUES ($1, $2, $3, $4, $5, $6, $7)
				RETURNING *`,
			[name, communication, verbal_orders, general_notes, oncall_prefs, rules, training_req]
		);
		res.status(201).json(result.rows[0]);
	}
	catch (err) {
		console.error('Error creating pharmacy:', err);
		res.status(500).send('Server error');
	}
}

module.exports = {
	getPharmacies,
	newPharmacy,
};