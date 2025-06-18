const express = require('express');
const router = express.Router();
const { getPharmBlurbs, newPharmBlurb, updatePharmBlurbs } = require('../controllers/pharmBlurbController');

router.get('/', getPharmBlurbs);
router.post('/', newPharmBlurb);
router.patch('/', updatePharmBlurbs);

module.exports = router;