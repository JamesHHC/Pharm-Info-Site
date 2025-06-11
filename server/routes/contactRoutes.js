const express = require('express');
const router = express.Router();
const { getContacts, newContact, getSomeContacts, deleteContact, updateContact } = require('../controllers/contactController');

router.get('/', getContacts);
router.post('/', newContact);
router.post('/some', getSomeContacts);
router.delete('/', deleteContact);
router.put('/', updateContact);

module.exports = router;