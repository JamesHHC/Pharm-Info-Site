const db = require('../db');
const check_role = require('./check_role');
const logger = require('../utils/logger');

// Get all users
const getUsers = async (req, res) => {
	try {
		const result = await db.query(`SELECT id, username, role FROM users`);
		res.json(result.rows);
	}
	catch (err) {
		console.error('Error getting users:', err);
		res.status(500).send('Server error');
	}
};

// Update user role
const updateRole = async (req, res) => {
	const { id, role } = req.body;
	try {
		// Validate user access level
		if (check_role(req.user.role, 'admin'))
			return res.status(403).json({ error: 'Insufficient permissions' });

		const result = await db.query(
			`UPDATE users
				SET role = $2
				WHERE id = $1`,
			[id, role]
		);
		res.status(201).json({ conf: role });

		// Logging
		const user = await logger.getUser(req.user.id);
		const target = await logger.getUser(id);
		logger.info({
			actingUser: user,
			targetUser: target,
			action: `Changed role to ${role}`,
		});
	}
	catch (err) {
		console.error('Error updating user role:', err);
		res.status(500).send('Server error');
	}
};

module.exports = {
	getUsers,
	updateRole,
};