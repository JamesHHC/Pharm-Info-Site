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

// Insert a new pharmacy rule
const newPharmRule = async (req, res) => {
	const { pharmacy_id, rules_id } = req.body;
	try {
		const result = await db.query(
			`INSERT INTO pharmacy_rules (pharmacy_id, rules_id)
				VALUES ($1, $2)
				RETURNING *`,
			[pharmacy_id, rules_id]
		);
		res.status(201).json(result.rows[0]);
	}
	catch (err) {
		console.error('Error creating pharmacy rule:', err);
		res.status(500).send('Server error');
	}
}

module.exports = {
	getPharmRules,
	newPharmRule,
};