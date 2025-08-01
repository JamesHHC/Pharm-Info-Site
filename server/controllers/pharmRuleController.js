const {pool: db} = require('../db/database');
const check_role = require('./controller_utils/check_role');
const logger = require('../utils/logger');

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
		// Validate user access level
		if (check_role(req.user.role, 'admin'))
			return res.status(403).json({ error: 'Insufficient permissions' });

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

// Update existing pharmacy-rule associations
const updatePharmRules = async (req, res) => {
	const { pharmacy_id, rule_ids } = req.body;
	try {
		// Validate user access level
		if (check_role(req.user.role, 'admin'))
			return res.status(403).json({ error: 'Insufficient permissions' });
		
		// Check db for existing id pairs
		const check = await db.query(
			`SELECT rules_id FROM pharmacy_rules
				WHERE pharmacy_id = ($1)`,
			[pharmacy_id]
		);
		// Get array of currently paired rules_ids
		const found = check.rows.map((x) => x.rules_id);

		// Find values that are in one arr and not the other, ignore others
		const foundSet = new Set(found);
		const newSet = new Set(rule_ids);
		const remArr = [...new Set(found.filter(rid => !newSet.has(rid)))];
		const addArr = [...new Set(rule_ids.filter(rid => !foundSet.has(rid)))];

		if (addArr.length > 0) {
			// Construct values in format ($1, $2), ($1, $3), etc...
			const addValues = addArr.map((_, i) => `($1, $${i + 2})`).join(', ');
			const addIds = [pharmacy_id, ...addArr];
			// Add missing pharm-rule associations
			const addQuery = await db.query(
				`INSERT INTO pharmacy_rules (pharmacy_id, rules_id)
					VALUES ${addValues}
					RETURNING *`,
				addIds
			);
		}
		if (remArr.length > 0) {
			// Remove deselected pharm-rule associations
			const remQuery = await db.query(
				`DELETE FROM pharmacy_rules
					WHERE pharmacy_id = ANY($1) AND
					rules_id = ANY($2)`,
				[[pharmacy_id], remArr]
			);
		}
		res.status(201).json('Pharmacy rules updated!');

		// Logging
		if (remArr.length === 0 && addArr.length === 0) return;
		const user = await logger.getUser(req.user.id);
		const pharm = await db.query(`SELECT name FROM pharmacies WHERE id = $1`, [pharmacy_id]);
		logger.info({
			actingUser: user,
			target: pharm.rows[0].name,
			action: `Updated associated rules`,
			changes: {
				targetId: pharmacy_id,
				fields: {
					pharm_rules: {
						from: found,
						to: rule_ids,
					},
				},
			},
		});
	}
	catch (err) {
		console.error('Error updating pharmacy rule(s):', err);
		res.status(500).send('Server error');
	}
}

module.exports = {
	getPharmRules,
	newPharmRule,
	updatePharmRules,
};