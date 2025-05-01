const express = require('express');
const router = express.Router();
const { getPharmTrainings, newPharmTraining } = require('../controllers/pharmTrainingController');

router.get('/', getPharmTrainings);
router.post('/', newPharmTraining);

module.exports = router;