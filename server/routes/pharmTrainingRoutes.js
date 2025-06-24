const express = require('express');
const router = express.Router();
const { getPharmTrainings, newPharmTraining, updatePharmTrainings } = require('../controllers/pharmTrainingController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/', getPharmTrainings);
router.post('/', authenticate, newPharmTraining);
router.patch('/', authenticate, updatePharmTrainings);

module.exports = router;