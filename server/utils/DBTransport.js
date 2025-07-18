const Transport = require('winston-transport');

class DbTransport extends Transport {
	constructor(opts) {
		super(opts);
		this.db = opts.db;
	}

	async log(info, callback) {
		setImmediate(() => this.emit('logged', info));
		const { level, message, timestamp } = info;
		const {
			actingUser,
			action,
			target = null,
			originIP = null,
		} = message || {};

		try {
			await this.db.query(
				`INSERT INTO logs (timestamp, level, acting_user, action, target, origin_ip)
				 	VALUES ($1, $2, $3, $4, $5, $6)`,
				[timestamp, level, actingUser, action, target, originIP]
			);
		}
		catch (err) {
			console.error('Error saving log to DB!', err);
		}
		callback();
	}
}

module.exports = DbTransport;