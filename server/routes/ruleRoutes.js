const express = require('express');
const router = express.Router();
const { getRules, newRule, getSomeRules, updateRule } = require('../controllers/ruleController');

router.get('/', getRules);
router.post('/', newRule);
router.post('/some', getSomeRules);
router.put('/', updateRule)

module.exports = router;