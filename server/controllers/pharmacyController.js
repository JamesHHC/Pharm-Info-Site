const db = require('../db');

const getPharmacies = async (req, res) => {
	try {
		const result = await db.query('SELECT * FROM pharmacies');
		res.json(result.rows);
	} catch (err) {
		console.error(err);
		res.status(500).send('Server error');
	}
};

module.exports = { getPharmacies };