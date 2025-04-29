const express = require('express');
const router = express.Router();
const { getTrainings, newTraining } = require('../controllers/trainingController');

router.get('/', getTrainings);
router.post('/', newTraining);

module.exports = router;