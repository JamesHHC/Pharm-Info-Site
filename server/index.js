const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const pharmacyRoutes = require('./routes/pharmacyRoutes.js');

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/pharmacies', pharmacyRoutes);

app.listen(port, () => {
	console.log('\x1b[36m%s\x1b[0m', `Server running on port ${port}`);
});