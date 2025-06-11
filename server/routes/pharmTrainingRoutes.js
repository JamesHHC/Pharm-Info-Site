const express = require('express');
const router = express.Router();
const { getPharmTrainings, newPharmTraining, updatePharmTrainings } = require('../controllers/pharmTrainingController');

router.get('/', getPharmTrainings);
router.post('/', newPharmTraining);
router.patch('/', updatePharmTrainings);

module.exports = router;