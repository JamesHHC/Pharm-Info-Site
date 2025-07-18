const db = require('../db');
const winston = require('winston');
const DBTransport = require('./DBTransport');
require('winston-daily-rotate-file');

const transport = new winston.transports.DailyRotateFile({
	filename: 'logs/%DATE%.log',
	datePattern: 'YYYY-MM-DD',
	maxSize: '10m',
	maxFiles: '60d',
});

const logger = winston.createLogger({
	level: 'info',
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.json()
	),
	transports: [
		transport,
		new DBTransport({ db }),
		new winston.transports.Console(),
	],
});

logger.getUser = async (id) => {
	try {
		const result = await db.query('SELECT username FROM users WHERE id = $1', [id]);
		return result.rows[0].username;
	}
	catch (err) {
		console.error('Could not find username!', err);
		return `${id}`;
	}
};

module.exports = logger;