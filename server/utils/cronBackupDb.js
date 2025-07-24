const cron = require('node-cron');
const backupAndUpload = require('../db/dbBackup');

cron.schedule('0 8 * * 5', async () => {
	console.log('[Cron] Starting scheduled DB backup...');
	backupAndUpload()
	.then(filename => {
		console.log(`[Cron] Uploaded ${filename} to SharePoint`);
	})
	.catch(err => {
		console.error('[Cron] Backup failed:', err.message || err);
	});
});

console.log('\x1b[36m%s\x1b[0m', '[Cron] SharePoint DB backups enabled');