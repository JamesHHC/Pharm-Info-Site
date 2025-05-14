const express = require('express');
const router = express.Router();
const { getTrainings, newTraining, getSomeTrainings, updateTraining, deleteTraining } = require('../controllers/trainingController');

router.get('/', getTrainings);
router.post('/', newTraining);
router.post('/some', getSomeTrainings);
router.put('/', updateTraining);
router.delete('/', deleteTraining);

module.exports = router;