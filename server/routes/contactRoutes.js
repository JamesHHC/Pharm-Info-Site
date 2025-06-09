const express = require('express');
const router = express.Router();
const { getContacts, newContact, getSomeContacts, deleteContact } = require('../controllers/contactController');

router.get('/', getContacts);
router.post('/', newContact);
router.post('/some', getSomeContacts);
router.delete('/', deleteContact);

module.exports = router;