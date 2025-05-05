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
	const { name, communication, verbal_orders, general_notes, oncall_prefs } = req.body;
	try {
		const result = await db.query(
			`INSERT INTO pharmacies (name, communication, verbal_orders, general_notes, oncall_prefs)
				VALUES ($1, $2, $3, $4, $5)
				RETURNING *`,
			[name, communication, verbal_orders, general_notes, oncall_prefs]
		);
		res.status(201).json(result.rows[0]);
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

module.exports = {
	getPharmacies,
	newPharmacy,
	getSomePharmacies,
};