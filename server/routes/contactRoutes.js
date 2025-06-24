const express = require('express');
const router = express.Router();
const {
	getContacts,
	newContact,
	getSomeContacts,
	deleteContact,
	updateContact,
	contactActive,
} = require('../controllers/contactController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/', getContacts);
router.post('/', authenticate, newContact);
router.post('/some', getSomeContacts);
router.delete('/', authenticate, deleteContact);
router.put('/', authenticate, updateContact);
router.post('/active', authenticate, contactActive);

module.exports = router;