const express = require('express');
const router = express.Router();
const { getPharmRules, newPharmRule, updatePharmRules } = require('../controllers/pharmRuleController');

router.get('/', getPharmRules);
router.post('/', newPharmRule);
router.patch('/', updatePharmRules);

module.exports = router;