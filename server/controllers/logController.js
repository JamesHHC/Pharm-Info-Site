const {pool: db} = require('../db/database');
const check_role = require('./controller_utils/check_role');

// Get all users
const getLogs = async (req, res) => {
	try {
		// Validate user access level
		if (check_role(req.user.role, 'admin'))
			return res.status(403).json({ error: 'Insufficient permissions' });

		const result = await db.query(`SELECT * FROM logs`);
		res.json(result.rows);
	}
	catch (err) {
		console.error('Error getting logs:', err);
		res.status(500).send('Server error');
	}
};

module.exports = {
	getLogs
};