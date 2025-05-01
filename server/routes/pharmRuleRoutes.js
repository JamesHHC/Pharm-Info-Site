const express = require('express');
const router = express.Router();
const { getPharmRules, newPharmRule } = require('../controllers/pharmRuleController');

router.get('/', getPharmRules);
router.post('/', newPharmRule);

module.exports = router;