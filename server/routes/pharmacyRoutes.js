const express = require('express');
const router = express.Router();
const {
	getPharmacies,
	newPharmacy,
	getSomePharmacies,
	deletePharmacy,
	updatePharmacy,
	pharmacyActive,
} = require('../controllers/pharmacyController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/', getPharmacies);
router.post('/', authenticate, newPharmacy);
router.post('/some', getSomePharmacies);
router.delete('/', authenticate, deletePharmacy);
router.put('/', authenticate, updatePharmacy);
router.post('/active', authenticate, pharmacyActive);

module.exports = router;