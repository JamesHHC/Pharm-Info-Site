const db = require('../db');

// Get all pharmacy rules
const getPharmRules = async (req, res) => {
	try {
		const pharmacy_id = req.query.pharmacy_id;
		const result = await db.query(
			`SELECT * FROM pharmacy_rules
				WHERE pharmacy_id = ($1)`,
			[ pharmacy_id ]
		);
		res.json(result.rows);
	}
	catch (err) {
		console.error('Error getting pharmacy rules:', err);
		res.status(500).send('Server error');
	}
};

// Insert new pharmacy rule(s)
const newPharmRule = async (req, res) => {
	const { pharmacy_id, rule_ids } = req.body;
	try {
		// Construct values in format ($1, $2), ($1, $3), etc...
		const values = rule_ids.map((_, i) => `($1, $${i + 2})`).join(', ');
		const ids = [pharmacy_id, ...rule_ids];
		const result = await db.query(
			`INSERT INTO pharmacy_rules (pharmacy_id, rules_id)
				VALUES ${values}
				RETURNING *`,
			ids
		);
		res.status(201).json(result.rows);
	}
	catch (err) {
		console.error('Error creating pharmacy rule(s):', err);
		res.status(500).send('Server error');
	}
}

module.exports = {
	getPharmRules,
	newPharmRule,
};