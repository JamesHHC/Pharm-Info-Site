const express = require('express');
const router = express.Router();
const { getPharmRules, newPharmRule, updatePharmRules } = require('../controllers/pharmRuleController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/', getPharmRules);
router.post('/', authenticate, newPharmRule);
router.patch('/', authenticate, updatePharmRules);

module.exports = router;