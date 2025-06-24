const express = require('express');
const router = express.Router();
const { getPharmacies, newPharmacy, getSomePharmacies, deletePharmacy, updatePharmacy } = require('../controllers/pharmacyController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/', getPharmacies);
router.post('/', authenticate, newPharmacy);
router.post('/some', getSomePharmacies);
router.delete('/', authenticate, deletePharmacy);
router.put('/', authenticate, updatePharmacy);

module.exports = router;