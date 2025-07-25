const cron = require('node-cron');
const backupAndUpload = require('../db/dbBackup');
const logger = require('./logger');

cron.schedule('0 8 * * 5', async () => {
	console.log('[Cron] Starting scheduled DB backup...');
	backupAndUpload()
	.then(filename => {
		console.log(`[Cron] Uploaded ${filename} to SharePoint`);
		// Logging
		logger.info({
			actingUser: 'SYSTEM',
			action: 'Created database backup',
			target: filename,
		});
	})
	.catch(err => {
		console.error('[Cron] Backup failed:', err.message || err);
	});
});

console.log('\x1b[36m%s\x1b[0m', '[Cron] SharePoint DB backups enabled');