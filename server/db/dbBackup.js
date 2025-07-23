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
			'Content-Type': 'application/octet-stream'
		},
		body: fileBlob.stream(),
		duplex: 'half',
	});
	if (!res.ok) {
		const text = await res.text();
		throw new Error(`SharePoint upload failed: ${text}`);
	}
}

async function backupAndUpload() {
	try {
		const { filepath, filename } = await createBackup();
		const token = await getAccessToken();
		await uploadToSharePoint(filepath, filename, token);
		return filename;
	}
	catch (err) {
		console.error('Database backup failed:', err.message || err);
	}
}

module.exports = backupAndUpload;