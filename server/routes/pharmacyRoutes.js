const express = require('express');
const router = express.Router();
const { getPharmacies, newPharmacy } = require('../controllers/pharmacyController');

router.get('/', getPharmacies);
router.post('/', newPharmacy);

module.exports = router;