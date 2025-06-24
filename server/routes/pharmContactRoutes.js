const express = require('express');
const router = express.Router();
const { 
	getPharmContacts,
	newPharmContacts,
	updatePharmContacts,
	getContactPharms,
	newContactPharms,
	updateContactPharms,
} = require('../controllers/pharmContactController');
const { authenticate } = require('../middleware/authMiddleware');

// One pharmacy, multiple contacts
router.get('/contacts', getPharmContacts);
router.post('/contacts', authenticate, newPharmContacts);
router.patch('/contacts', authenticate, updatePharmContacts);

// One contact, multiple pharmacies
router.get('/pharmacies', getContactPharms);
router.post('/pharmacies', authenticate, newContactPharms);
router.patch('/pharmacies', authenticate, updateContactPharms);

module.exports = router;