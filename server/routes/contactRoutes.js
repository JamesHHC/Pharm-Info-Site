const express = require('express');
const router = express.Router();
const { getContacts, newContact, getSomeContacts } = require('../controllers/contactController');

router.get('/', getContacts);
router.post('/', newContact);
router.post('/some', getSomeContacts);

module.exports = router;