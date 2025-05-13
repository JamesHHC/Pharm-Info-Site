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
};

// Get rows where IDs match those in the provided array
const getSomeRules = async (req, res) => {
	const { ids } = req.body;
	try {
		const result = await db.query(
			`SELECT * FROM rules
				WHERE id IN (${ids.map((_, i) => `$${i + 1}`).join(',')})`,
			ids
		);
		res.json(result.rows);
	}
	catch (err) {
		console.error('Error getting some rules:', err);
		res.status(500).send('Server error');
	}
};

// Update rule with matching id
const updateRule = async (req, res) => {
	const { rule, id } = req.body;
	try {
		const result = await db.query(
			`UPDATE rules
				SET rule = ($1)
				WHERE id = ($2)`,
			[rule, id]
		);
		res.status(201).json(result.rows[0]);
	}
	catch (err) {
		console.error('Error updating rule:', err);
		res.status(500).send('Server error');
	}
};

module.exports = {
	getRules,
	newRule,
	getSomeRules,
	updateRule,
};