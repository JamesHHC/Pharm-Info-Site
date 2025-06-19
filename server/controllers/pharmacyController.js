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

// Delete pharmacy matching given id
// including entries in pharmacy_rules, pharmacy_training, & pharmacy_contacts
const deletePharmacy = async (req, res) => {
	const id = req.query.id;
	try {
		await db.query(`DELETE FROM pharmacy_rules WHERE pharmacy_id = ($1)`, [id]);
		await db.query(`DELETE FROM pharmacy_training WHERE pharmacy_id = ($1)`, [id]);
		await db.query(`DELETE FROM pharmacy_blurbs WHERE pharmacy_id = ($1)`, [id]);
		await db.query(`DELETE FROM pharmacy_contacts WHERE pharmacy_id = ($1)`, [id]);
		await db.query(`DELETE FROM pharmacies WHERE id = ($1)`, [id]);
		res.status(201).json('Pharmacy deleted!');
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
		const result = await db.query(
			`UPDATE pharmacies SET (name, communication, verbal_orders, general_notes, oncall_prefs) =
				($2, $3, $4, $5, $6)
				WHERE id = ($1)
				RETURNING *`,
			[id, name, communication, verbal_orders, general_notes, oncall_prefs]
		);
		res.status(201).json(result.rows[0]);
	}
	catch (err) {
		console.error('Error updating pharmacy:', err);
		res.status(500).send('Server error');
	}
};

module.exports = {
	getPharmacies,
	newPharmacy,
	getSomePharmacies,
	deletePharmacy,
	updatePharmacy,
};