const express = require('express');
const router = express.Router();
const { getRules, newRule, getSomeRules, updateRule, deleteRule } = require('../controllers/ruleController');

router.get('/', getRules);
router.post('/', newRule);
router.post('/some', getSomeRules);
router.put('/', updateRule);
router.delete('/', deleteRule);

module.exports = router;