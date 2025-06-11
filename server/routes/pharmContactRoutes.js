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

// One pharmacy, multiple contacts
router.get('/contacts', getPharmContacts);
router.post('/contacts', newPharmContacts);
router.patch('/contacts', updatePharmContacts);

// One contact, multiple pharmacies
router.get('/pharmacies', getContactPharms);
router.post('/pharmacies', newContactPharms);
router.patch('/pharmacies', updateContactPharms);

module.exports = router;