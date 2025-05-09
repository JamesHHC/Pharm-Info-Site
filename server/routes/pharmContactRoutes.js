const express = require('express');
const router = express.Router();
const { getPharmContacts, newPharmContacts, getContactPharms, newContactPharms } = require('../controllers/pharmContactController');

// One pharmacy, multiple contacts
router.get('/contacts', getPharmContacts);
router.post('/contacts', newPharmContacts);

// One contact, multiple pharmacies
router.get('/pharmacies', getContactPharms);
router.post('/pharmacies', newContactPharms);

module.exports = router;