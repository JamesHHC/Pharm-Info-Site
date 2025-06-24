const db = require('../db');
const check_role = require('./check_role');

// Get all pharmacy blurbs
const getPharmBlurbs = async (req, res) => {
	try {
		const pharmacy_id = req.query.pharmacy_id;
		const result = await db.query(
			`SELECT * FROM pharmacy_blurbs
				WHERE pharmacy_id = ($1)`,
			[ pharmacy_id ]
		);
		res.json(result.rows);
	}
	catch (err) {
		console.error('Error getting pharmacy blurbs:', err);
		res.status(500).send('Server error');
	}
};

// Insert new pharmacy blurb(s)
const newPharmBlurb = async (req, res) => {
	const { pharmacy_id, blurb_ids } = req.body;
	try {
		// Validate user access level
		if (check_role(req.user.role, 'admin'))
			return res.status(403).json({ error: 'Insufficient permissions' });

		// Construct values in format ($1, $2), ($1, $3), etc...
		const values = blurb_ids.map((_, i) => `($1, $${i + 2})`).join(', ');
		const ids = [pharmacy_id, ...blurb_ids];
		const result = await db.query(
			`INSERT INTO pharmacy_blurbs (pharmacy_id, blurb_id)
				VALUES ${values}
				RETURNING *`,
			ids
		);
		res.status(201).json(result.rows);
	}
	catch (err) {
		console.error('Error creating pharmacy blurb(s):', err);
		res.status(500).send('Server error');
	}
}

// Update existing pharmacy-blurb associations
const updatePharmBlurbs = async (req, res) => {
	const { pharmacy_id, blurb_ids } = req.body;
	try {
		// Validate user access level
		if (check_role(req.user.role, 'admin'))
			return res.status(403).json({ error: 'Insufficient permissions' });

		// Check db for existing id pairs
		const check = await db.query(
			`SELECT blurb_id FROM pharmacy_blurbs
				WHERE pharmacy_id = ($1)`,
			[pharmacy_id]
		);
		// Get array of currently paired blurb_ids
		const found = check.rows.map((x) => x.blurb_id);

		// Find values that are in one arr and not the other, ignore others
		const foundSet = new Set(found);
		const newSet = new Set(blurb_ids);
		const remArr = [...new Set(found.filter(bid => !newSet.has(bid)))];
		const addArr = [...new Set(blurb_ids.filter(bid => !foundSet.has(bid)))];

		if (addArr.length > 0) {
			// Construct values in format ($1, $2), ($1, $3), etc...
			const addValues = addArr.map((_, i) => `($1, $${i + 2})`).join(', ');
			const addIds = [pharmacy_id, ...addArr];
			// Add missing pharm-blurb associations
			const addQuery = await db.query(
				`INSERT INTO pharmacy_blurbs (pharmacy_id, blurb_id)
					VALUES ${addValues}
					RETURNING *`,
				addIds
			);
		}
		if (remArr.length > 0) {
			// Remove deselected pharm-blurb associations
			const remQuery = await db.query(
				`DELETE FROM pharmacy_blurbs
					WHERE pharmacy_id = ANY($1) AND
					blurb_id = ANY($2)`,
				[[pharmacy_id], remArr]
			);
		}

		res.status(201).json('Pharmacy blurbs updated!');
	}
	catch (err) {
		console.error('Error updating pharmacy blurb(s):', err);
		res.status(500).send('Server error');
	}
}

module.exports = {
	getPharmBlurbs,
	newPharmBlurb,
	updatePharmBlurbs,
};