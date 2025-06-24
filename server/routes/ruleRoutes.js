const express = require('express');
const router = express.Router();
const { getRules, newRule, getSomeRules, updateRule, deleteRule } = require('../controllers/ruleController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/', getRules);
router.post('/', authenticate, newRule);
router.post('/some', getSomeRules);
router.put('/', authenticate, updateRule);
router.delete('/', authenticate, deleteRule);

module.exports = router;