const cron = require('node-cron');
const backupAndUpload = require('../db/dbBackup');

cron.schedule('0 23 * * 5', async () => {
	console.log('[Cron] Starting scheduled DB backup...');
	backupAndUpload()
	.then(filename => {
		console.log(`[Cron] Uploaded ${filename} to SharePoint`);
	})
	.catch(err => {
		console.error('[Cron] Backup failed:', err.message || err);
	});
});