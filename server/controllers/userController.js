const {pool: db} = require('../db/database');
const check_role = require('./controller_utils/check_role');
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
			target: target,
			action: `Changed role to ${role}`,
		});
	}
	catch (err) {
		console.error('Error updating user role:', err);
		res.status(500).send('Server error');
	}
};

// Delete given user
const deleteUser = async (req, res) => {
	const id = req.query.id;
	try {
		// Validate user access level
		if (check_role(req.user.role, 'admin'))
			return res.status(403).json({ error: 'Insufficient permissions' });

		// Get target prior to delete for logging
		const user = await logger.getUser(req.user.id);
		const target = await logger.getUser(id);
		
		await db.query(
			`DELETE FROM users
				WHERE id = $1`,
			[id]
		);
		res.status(201).send('User deleted!');

		// Logging
		logger.info({
			actingUser: user,
			target: target,
			action: `Deleted user`,
		});
	}
	catch (err) {
		console.error('Error deleting user:', err);
		res.status(500).send('Server error');
	}
};

module.exports = {
	getUsers,
	updateRole,
	deleteUser,
};