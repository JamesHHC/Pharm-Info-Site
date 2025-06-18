const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const pharmacyRoutes = require('./routes/pharmacyRoutes.js');
const contactRoutes = require('./routes/contactRoutes.js');
const ruleRoutes = require('./routes/ruleRoutes.js');
const trainingRoutes = require('./routes/trainingRoutes.js');
const pharmRuleRoutes = require('./routes/pharmRuleRoutes.js');
const pharmTrainingRoutes = require('./routes/pharmTrainingRoutes.js');
const pharmContactRoutes = require('./routes/pharmContactRoutes.js');
const pharmBlurbRoutes = require('./routes/pharmBlurbRoutes.js');
const blurbRoutes = require('./routes/blurbRoutes.js');

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
app.use('/api/pharmrules', pharmRuleRoutes);
app.use('/api/pharmtraining', pharmTrainingRoutes);
app.use('/api/pharmcontacts', pharmContactRoutes);
app.use('/api/pharmblurbs', pharmBlurbRoutes);
app.use('/api/blurbs', blurbRoutes);

app.listen(port, () => {
	console.log('\x1b[36m%s\x1b[0m', `Server running on port ${port}`);
});