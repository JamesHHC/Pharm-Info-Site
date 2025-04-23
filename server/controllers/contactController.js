const db = require('../db');

// Get all contacts
const getContacts = async (req, res) => {
	try {
		const result = await db.query('SELECT * FROM contacts');
		res.json(result.rows);
	}
	catch (err) {
		console.error('Error getting contacts:', err);
		res.status(500).send('Server error');
	}
};

// Insert a new contact
const newContact = async (req, res) => {
	const { name, email, phone, title, preferences, dnc, intake_only, contact_type } = req.body;
	try {
		const result = await db.query(
			`INSERT INTO contacts (name, email, phone, title, preferences, dnc, intake_only, contact_type)
				VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
				RETURNING *`,
			[name, email, phone, title, preferences, dnc, intake_only, contact_type]
		);
		res.status(201).json(result.rows[0]);
	}
	catch (err) {
		console.error('Error creating contact:', err);
		res.status(500).send('Server error');
	}
}

module.exports = {
	getContacts,
	newContact,
};