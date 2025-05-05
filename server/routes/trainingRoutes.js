const express = require('express');
const router = express.Router();
const { getTrainings, newTraining, getSomeTrainings } = require('../controllers/trainingController');

router.get('/', getTrainings);
router.post('/', newTraining);
router.post('/some', getSomeTrainings);

module.exports = router;