const express = require('express');
const router = express.Router();
const { getRules, newRule, getSomeRules } = require('../controllers/ruleController');

router.get('/', getRules);
router.post('/', newRule);
router.post('/some', getSomeRules);

module.exports = router;