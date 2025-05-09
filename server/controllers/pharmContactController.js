const db = require('../db');

// Get all pharmacy contacts
const getPharmContacts = async (req, res) => {
	try {
		const pharmacy_id = req.query.pharmacy_id;
		const result = await db.query(
			`SELECT * FROM pharmacy_contacts
				WHERE pharmacy_id = ($1)`,
			[ pharmacy_id ]
		);
		res.json(result.rows);
	}
	catch (err) {
		console.error('Error getting pharmacy contacts:', err);
		res.status(500).send('Server error');
	}
};

// Insert new pharmacy contact(s)
const newPharmContacts = async (req, res) => {
	const { pharmacy_id, contact_ids } = req.body;
	try {
		// Construct values in format ($1, $2), ($1, $3), etc...
		const values = contact_ids.map((_, i) => `($1, $${i + 2})`).join(', ');
		const ids = [pharmacy_id, ...contact_ids];
		const result = await db.query(
			`INSERT INTO pharmacy_contacts (pharmacy_id, contact_id)
				VALUES ${values}
				RETURNING *`,
			ids
		);
		res.status(201).json(result.rows);
	}
	catch (err) {
		console.error('Error creating pharmacy contact(s):', err);
		res.status(500).send('Server error');
	}
}

// Get all contact pharmacies
const getContactPharms = async (req, res) => {
	try {
		const contact_id = req.query.contact_id;
		const result = await db.query(
			`SELECT * FROM pharmacy_contacts
				WHERE contact_id = ($1)`,
			[ contact_id ]
		);
		res.json(result.rows);
	}
	catch (err) {
		console.error('Error getting contact pharmacies:', err);
		res.status(500).send('Server error');
	}
};

// Insert new contact pharmacy(s)
const newContactPharms = async (req, res) => {
	const { contact_id, pharmacy_ids } = req.body;
	try {
		// Construct values in format ($1, $2), ($1, $3), etc...
		const values = pharmacy_ids.map((_, i) => `($1, $${i + 2})`).join(', ');
		const ids = [contact_id, ...pharmacy_ids];
		const result = await db.query(
			`INSERT INTO pharmacy_contacts (contact_id, pharmacy_id)
				VALUES ${values}
				RETURNING *`,
			ids
		);
		res.status(201).json(result.rows);
	}
	catch (err) {
		console.error('Error creating contact pharmacy(s):', err);
		res.status(500).send('Server error');
	}
}

module.exports = {
	getPharmContacts,
	newPharmContacts,
	getContactPharms,
	newContactPharms,
};