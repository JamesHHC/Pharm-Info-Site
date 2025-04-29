const express = require('express');
const router = express.Router();
const { getRules, newRule } = require('../controllers/ruleController');

router.get('/', getRules);
router.post('/', newRule);

module.exports = router;