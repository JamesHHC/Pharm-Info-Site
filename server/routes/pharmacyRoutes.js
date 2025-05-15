const express = require('express');
const router = express.Router();
const { getPharmacies, newPharmacy, getSomePharmacies, deletePharmacy } = require('../controllers/pharmacyController');

router.get('/', getPharmacies);
router.post('/', newPharmacy);
router.post('/some', getSomePharmacies);
router.delete('/', deletePharmacy);

module.exports = router;