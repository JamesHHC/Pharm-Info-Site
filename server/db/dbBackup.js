const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { Blob } = require('buffer');
dotenv.config();

const { config: dbConfig } = require('./database');

const {
	CLIENT_ID,
	CLIENT_SECRET,
	TENANT_ID,
	SITE_ID,
	DRIVE_ID
} = process.env;

const BACKUP_DIR = path.resolve('db/pg_backups');
if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR);

function createBackup() {
	const timestamp = new Date().toISOString().replace(/[:T]/g, '-').split('.')[0];
	const filename = `backup-${timestamp}.sql`;
	const filepath = path.join(BACKUP_DIR, filename);

	const { user, host, database, password } = dbConfig;
	return new Promise((resolve, reject) => {
		const command = `pg_dump -U ${user} -h ${host} -F c -f "${filepath}" ${database}`;
		exec(command, { env: { ...process.env, PGPASSWORD: password } }, (error) => {
			if (error) return reject(error);
			resolve({ filepath, filename });
		});
	});
}

function cleanLocalBackups(dir, keep = 5) {
	const files = fs.readdirSync(dir)
		.filter(f => f.endsWith('.sql'))
		.map(f => ({ name: f, time: fs.statSync(path.join(dir, f)).mtime.getTime() }))
		.sort((a, b) => b.time - a.time); // newest first

	const filesToDelete = files.slice(keep);

	for (const file of filesToDelete) {
		const fullPath = path.join(dir, file.name);
		fs.unlinkSync(fullPath);
		console.log('[Cleanup] Deleted old local backup:', file.name);
	}
}

async function getAccessToken() {
	const res = await fetch(`https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({
			grant_type: 'client_credentials',
			client_id: CLIENT_ID,
			client_secret: CLIENT_SECRET,
			scope: 'https://graph.microsoft.com/.default'
		}),
	});
	if (!res.ok) {
		const text = await res.text();
		throw new Error(`Failed to get token: ${text}`);
	}
	const data = await res.json();
	return data.access_token;
}

async function uploadToSharePoint(filepath, filename, accessToken) {
	const uploadUrl = `https://graph.microsoft.com/v1.0/sites/${SITE_ID}/drives/${DRIVE_ID}/root:/Pharmacy Info Site/${filename}:/content`;
	
	const fileBuffer = fs.readFileSync(filepath);
	const fileBlob = new Blob([fileBuffer]);

	const res = await fetch(uploadUrl, {
		method: 'PUT',
		headers: {
			'Authorization': `Bearer ${accessToken}`,
			'Content-Type': 'application/octet-stream',
		},
		body: fileBlob.stream(),
		duplex: 'half',
	});
	if (!res.ok) {
		const text = await res.text();
		throw new Error(`SharePoint upload failed: ${text}`);
	}
}

async function deleteOldSharePointBackups(accessToken, days = 30) {
	const url = `https://graph.microsoft.com/v1.0/sites/${SITE_ID}/drives/${DRIVE_ID}/root:/Pharmacy Info Site:/children`;

	const res = await fetch(url, {
		headers: {
			Authorization: `Bearer ${accessToken}`
		},
	});
	const data = await res.json();
	if (!res.ok) throw new Error(data.error?.message || 'Failed to list files');

	const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
	for (const file of data.value) {
		const created = new Date(file.createdDateTime).getTime();
		if (created < cutoff) {
			const deleteUrl = `https://graph.microsoft.com/v1.0/drives/${DRIVE_ID}/items/${file.id}`;
			await fetch(deleteUrl, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});
			console.log('[Cleanup] Deleted old SharePoint backup:', file.name);
		}
	}
}

async function backupAndUpload() {
	try {
		const { filepath, filename } = await createBackup();
		await cleanLocalBackups(BACKUP_DIR, 5);

		const token = await getAccessToken();
		await uploadToSharePoint(filepath, filename, token);
		await deleteOldSharePointBackups(token, 30);
		console.log('beep');
		return filename;
	}
	catch (err) {
		console.error('Database backup failed:', err.message || err);
	}
}

module.exports = backupAndUpload;