const db = require('../db');

// Get all rules
const getRules = async (req, res) => {
	try {
		const result = await db.query('SELECT * FROM rules');
		res.json(result.rows);
	}
	catch (err) {
		console.error('Error getting rules:', err);
		res.status(500).send('Server error');
	}
};

// Insert a new rule
const newRule = async (req, res) => {
	const { rule } = req.body;
	try {
		const result = await db.query(
			`INSERT INTO rules (rule)
				VALUES ($1)
				RETURNING *`,
			[rule]
		);
		res.status(201).json(result.rows[0]);
	}
	catch (err) {
		console.error('Error creating rule:', err);
		res.status(500).send('Server error');
	}
}

module.exports = {
	getRules,
	newRule,
};