const express = require('express');
const router = express.Router();
const { getPharmBlurbs, newPharmBlurb, updatePharmBlurbs } = require('../controllers/pharmBlurbController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/', getPharmBlurbs);
router.post('/', authenticate, newPharmBlurb);
router.patch('/', authenticate, updatePharmBlurbs);

module.exports = router;