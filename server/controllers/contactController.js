const {pool: db} = require('../db/database');
const check_role = require('./check_role');
const logger = require('../utils/logger');

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
	const { name, email, phone, title, preferences, dnc, intake_only, contact_type, vip } = req.body;
	try {
		// Validate user access level
		if (check_role(req.user.role, 'editor'))
			return res.status(403).json({ error: 'Insufficient permissions' });

		const result = await db.query(
			`INSERT INTO contacts (name, email, phone, title, preferences, dnc, intake_only, contact_type, vip)
				VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
				RETURNING *`,
			[name, email, phone, title, preferences, dnc, intake_only, contact_type, vip]
		);
		res.status(201).json(result.rows[0]);

		// Logging
		const user = await logger.getUser(req.user.id);
		logger.info({
			actingUser: user,
			target: name,
			action: `Created new contact`,
		});
	}
	catch (err) {
		console.error('Error creating contact:', err);
		res.status(500).send('Server error');
	}
};

// Get rows where IDs match those in the provided array
const getSomeContacts = async (req, res) => {
	const { ids } = req.body;
	try {
		const result = await db.query(
			`SELECT * FROM contacts
				WHERE id IN (${ids.map((_, i) => `$${i + 1}`).join(',')})`,
			ids
		);
		res.json(result.rows);
	}
	catch (err) {
		console.error('Error getting some contacts:', err);
		res.status(500).send('Server error');
	}
};

// Delete contact matching given id
// including entries in pharmacy_contacts
const deleteContact = async (req, res) => {
	const id = req.query.id;
	try {
		// Validate user access level
		if (check_role(req.user.role, 'superadmin'))
			return res.status(403).json({ error: 'Insufficient permissions' });

		await db.query(`
			DELETE FROM pharmacy_contacts
				WHERE contact_id = ($1)`,
			[id]
		);
		const result = await db.query(`
			DELETE FROM contacts
				WHERE id = ($1)
				RETURNING name`,
			[id]
		);
		res.status(201).json('Contact deleted!');

		// Logging
		const user = await logger.getUser(req.user.id);
		logger.info({
			actingUser: user,
			target: result.rows[0]?.name,
			action: `Deleted contact`,
		});
	}
	catch (err) {
		console.error('Error deleting contact:', err);
		res.status(500).send('Server error');
	}
};

// Overwrite values of existing contact for given id
const updateContact = async (req, res) => {
	const { id, name, email, phone, title, preferences, dnc, intake_only, contact_type, vip } = req.body;
	try {
		// Validate user access level
		if (check_role(req.user.role, 'editor'))
			return res.status(403).json({ error: 'Insufficient permissions' });
		
		const result = await db.query(
			`UPDATE contacts SET (name, email, phone, title, preferences, dnc, intake_only, contact_type, vip) =
				($2, $3, $4, $5, $6, $7, $8, $9, $10)
				WHERE id = ($1)
				RETURNING *`,
			[id, name, email, phone, title, preferences, dnc, intake_only, contact_type, vip]
		);
		res.status(201).json(result.rows[0]);

		// Logging
		const user = await logger.getUser(req.user.id);
		logger.info({
			actingUser: user,
			target: name,
			action: `Updated contact`,
		});
	}
	catch (err) {
		console.error('Error updating contact:', err);
		res.status(500).send('Server error');
	}
};

// Update contact active status
const contactActive = async (req, res) => {
	const { id, active } = req.body;
	try {
		// Validate user access level
		if (check_role(req.user.role, 'editor'))
			return res.status(403).json({ error: 'Insufficient permissions' });

		const result = await db.query(`
			UPDATE contacts
				SET active = $2
				WHERE id = $1
				RETURNING name`,
			[id, active]
		);
		res.status(201).send(active ? 'Contact activated' : 'Contact archived');

		// Logging
		const user = await logger.getUser(req.user.id);
		logger.info({
			actingUser: user,
			target: result.rows[0]?.name,
			action: `${active ? 'Activated' : 'Archived'} contact`,
		});
	}
	catch (err) {
		console.error('Error updating contact active status:', err);
		res.status(500).send('Server error');
	}
};

module.exports = {
	getContacts,
	newContact,
	getSomeContacts,
	deleteContact,
	updateContact,
	contactActive,
};