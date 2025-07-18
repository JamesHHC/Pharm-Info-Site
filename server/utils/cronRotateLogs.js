const cron = require('node-cron');
const db = require('../db');

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