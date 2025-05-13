const express = require('express');
const router = express.Router();
const { getTrainings, newTraining, getSomeTrainings, updateTraining } = require('../controllers/trainingController');

router.get('/', getTrainings);
router.post('/', newTraining);
router.post('/some', getSomeTrainings);
router.put('/', updateTraining);

module.exports = router;