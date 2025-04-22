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

module.exports = {
	getContacts,
};