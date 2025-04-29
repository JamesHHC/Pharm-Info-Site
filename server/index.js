const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const pharmacyRoutes = require('./routes/pharmacyRoutes.js');
const contactRoutes = require('./routes/contactRoutes.js');
const ruleRoutes = require('./routes/ruleRoutes.js');
const trainingRoutes = require('./routes/trainingRoutes.js');

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/pharmacies', pharmacyRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/rules', ruleRoutes);
app.use('/api/training', trainingRoutes);

app.listen(port, () => {
	console.log('\x1b[36m%s\x1b[0m', `Server running on port ${port}`);
});