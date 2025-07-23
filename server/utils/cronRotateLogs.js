const cron = require('node-cron');
const {pool: db} = require('../db/database');

cron.schedule('0 2 * * *', async () => {
	console.log('[Cron] Starting log cleanup...');
	try {
		const result = await db.query(
			`DELETE FROM logs
				WHERE timestamp < NOW() - INTERVAL '30 days'`
		);
		console.log(`[Cron] Deleted ${result.rowCount} old logs.`);
	}
	catch (err) {
		console.error('[Cron] Failed to clean up logs!', err.message || err);
	}
});

console.log('\x1b[36m%s\x1b[0m', '[Cron] Automated DB log rotation enabled');