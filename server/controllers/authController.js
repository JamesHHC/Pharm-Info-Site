const {pool: db} = require('../db/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const REFRESH_SECRET = process.env.REFRESH_SECRET || 'fallback_refresh_secret';

// Issue tokens
function generateTokens(user) {
	const accessToken = jwt.sign(
		{ id: user.id, role: user.role },
		process.env.JWT_SECRET,
		{ expiresIn: '15m' },
	);
	const refreshToken = jwt.sign(
		{ id: user.id },
		REFRESH_SECRET,
		{ expiresIn: '7d' },
	);
	return { accessToken, refreshToken };
}

// Register a new user
const register = async (req, res) => {
	const {username, password} = req.body;
	const hash = await bcrypt.hash(password, 10);

	try {
		// Create a new user
		await db.query(`
			INSERT INTO users (username, password_hash, role)
				VALUES ($1, $2, $3)`,
			[username, hash, 'user']
		);
		res.status(201).json({ conf: 'User created' });

		// Logging
		logger.info({
			actingUser: username,
			originIP: req.ip,
			action: `Registered user`,
		});
	}
	catch (err) {
		res.status(400).json({ error: 'Username may already exist' });
	}
};

// Check user credentials and assign token if valid
const login = async (req, res) => {
	const {username, password} = req.body;
	const result = await db.query(`
		SELECT * FROM users
			WHERE username ILIKE $1`,
		[username]
	);
	const user = result.rows[0];
	// Validate user
	if (!user || !(await bcrypt.compare(password, user.password_hash))) {
		return res.status(401).json({ error: 'Invalid credentials' });
	}
	// Create JWT token
	const tokens = generateTokens(user);

	// Send refresh token in cookie
	res.cookie('refreshToken', tokens.refreshToken, {
		httpOnly: true,
		secure: false,
		sameSite: 'Lax',
		maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
	});

	res.json({ token: tokens.accessToken });
};

// Get user info
const me = async (req, res) => {
	const user = await db.query(`
		SELECT id, username, role FROM users
			WHERE id = $1`,
		[req.user.id]
	);
	res.status(201).json(user.rows[0]);
};

// Refresh token
const refresh = async (req, res) => {
	const token = req.cookies.refreshToken;
	if (!token) return res.status(401).json({error: 'No refresh token' });

	try {
		const payload = jwt.verify(token, REFRESH_SECRET);

		// Get role from db
		const result = await db.query(`
			SELECT role FROM users
				WHERE id = $1
		`, [payload.id]);

		// Sign new access token
		const accessToken = jwt.sign(
			{ id: payload.id, role: result.rows[0].role },
			process.env.JWT_SECRET,
			{ expiresIn: '15m' },
		);
		res.json({ token: accessToken });
	}
	catch (err) {
		return res.status(403).json({ error: 'Invalid refresh token' });
	}
};

// Logout user (remove refreshToken cookie)
const logout = async (req, res) => {
	res.clearCookie('refreshToken', {
		httpOnly: true,
		secure: false,
		sameSite: 'Lax',
		path: '/'
	});
	res.sendStatus(200);
};

module.exports = {
	register,
	login,
	me,
	refresh,
	logout,
};