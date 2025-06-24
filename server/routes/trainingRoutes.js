const express = require('express');
const router = express.Router();
const { getTrainings, newTraining, getSomeTrainings, updateTraining, deleteTraining } = require('../controllers/trainingController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/', getTrainings);
router.post('/', authenticate, newTraining);
router.post('/some', getSomeTrainings);
router.put('/', authenticate, updateTraining);
router.delete('/', authenticate, deleteTraining);

module.exports = router;