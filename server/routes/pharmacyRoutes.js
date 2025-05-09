const express = require('express');
const router = express.Router();
const { getPharmacies, newPharmacy, getSomePharmacies } = require('../controllers/pharmacyController');

router.get('/', getPharmacies);
router.post('/', newPharmacy);
router.post('/some', getSomePharmacies);

module.exports = router;