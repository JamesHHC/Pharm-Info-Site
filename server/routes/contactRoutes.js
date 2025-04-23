const express = require('express');
const router = express.Router();
const { getContacts, newContact } = require('../controllers/contactController');

router.get('/', getContacts);
router.post('/', newContact)

module.exports = router;