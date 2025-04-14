const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg');

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const db = new Pool({
	connectionString: process.env.DATABASE_URL,
});

app.get('/api/pharmacies', async (req, res) => {
	try {
		const result = await db.query('SELECT * FROM pharmacies');
		res.json(result.rows);
	} catch (err) {
		console.error(err);
		res.status(500).send('Server error');
	}
});

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});