const db = require('../db');
const check_role = require('./check_role');

// PHARMACY-CONTACT //////////////////////////////////////////////////////

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
		// Validate user access level
		if (check_role(req.user.role, 'editor'))
			return res.status(403).json({ error: 'Insufficient permissions' });

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

// Update existing pharmacy-contact associations
const updatePharmContacts = async (req, res) => {
	const { pharmacy_id, contact_ids } = req.body;
	try {
		// Validate user access level
		if (check_role(req.user.role, 'editor'))
			return res.status(403).json({ error: 'Insufficient permissions' });

		// Check db for existing id pairs
		const check = await db.query(
			`SELECT contact_id FROM pharmacy_contacts
				WHERE pharmacy_id = ($1)`,
			[pharmacy_id]
		);
		// Get array of currently paired contact_ids
		const found = check.rows.map((x) => x.contact_id);

		// Find values that are in one arr and not the other, ignore others
		const foundSet = new Set(found);
		const newSet = new Set(contact_ids);
		const remArr = [...new Set(found.filter(cid => !newSet.has(cid)))];
		const addArr = [...new Set(contact_ids.filter(cid => !foundSet.has(cid)))];

		if (addArr.length > 0) {
			// Construct values in format ($1, $2), ($1, $3), etc...
			const addValues = addArr.map((_, i) => `($1, $${i + 2})`).join(', ');
			const addIds = [pharmacy_id, ...addArr];
			// Add missing pharm-contact associations
			const addQuery = await db.query(
				`INSERT INTO pharmacy_contacts (pharmacy_id, contact_id)
					VALUES ${addValues}
					RETURNING *`,
				addIds
			);
		}
		if (remArr.length > 0) {
			// Remove deselected pharm-contact associations
			const remQuery = await db.query(
				`DELETE FROM pharmacy_contacts
					WHERE pharmacy_id = ANY($1) AND
					contact_id = ANY($2)`,
				[[pharmacy_id], remArr]
			);
		}

		res.status(201).json('Pharmacy contacts updated!');
	}
	catch (err) {
		console.error('Error updating pharmacy contact(s):', err);
		res.status(500).send('Server error');
	}
};

// CONTACT-PHARMACY //////////////////////////////////////////////////////

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
		// Validate user access level
		if (check_role(req.user.role, 'editor'))
			return res.status(403).json({ error: 'Insufficient permissions' });

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

// Update existing contact-pharmacy associations
const updateContactPharms = async (req, res) => {
	const { contact_id, pharmacy_ids } = req.body;
	try {
		// Validate user access level
		if (check_role(req.user.role, 'editor'))
			return res.status(403).json({ error: 'Insufficient permissions' });
		
		// Check db for existing id pairs
		const check = await db.query(
			`SELECT pharmacy_id FROM pharmacy_contacts
				WHERE contact_id = ($1)`,
			[contact_id]
		);
		// Get array of currently paired pharmacy_ids
		const found = check.rows.map((x) => x.pharmacy_id);

		// Find values that are in one arr and not the other, ignore others
		const foundSet = new Set(found);
		const newSet = new Set(pharmacy_ids);
		const remArr = [...new Set(found.filter(pid => !newSet.has(pid)))];
		const addArr = [...new Set(pharmacy_ids.filter(pid => !foundSet.has(pid)))];

		if (addArr.length > 0) {
			// Construct values in format ($1, $2), ($1, $3), etc...
			const addValues = addArr.map((_, i) => `($1, $${i + 2})`).join(', ');
			const addIds = [contact_id, ...addArr];
			// Add missing contact-pharm associations
			const addQuery = await db.query(
				`INSERT INTO pharmacy_contacts (contact_id, pharmacy_id)
					VALUES ${addValues}
					RETURNING *`,
				addIds
			);
		}
		if (remArr.length > 0) {
			// Remove deselected contact-pharm associations
			const remQuery = await db.query(
				`DELETE FROM pharmacy_contacts
					WHERE contact_id = ANY($1) AND
					pharmacy_id = ANY($2)`,
				[[contact_id], remArr]
			);
		}

		res.status(201).json('Contact pharmacies updated!');
	}
	catch (err) {
		console.error('Error updating contact pharmacy(s):', err);
		res.status(500).send('Server error');
	}
};

module.exports = {
	getPharmContacts,
	newPharmContacts,
	updatePharmContacts,
	getContactPharms,
	newContactPharms,
	updateContactPharms,
};