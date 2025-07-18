const express = require('express');
const router = express.Router();
const { getLogs } = require('../controllers/logController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/', authenticate, getLogs);

module.exports = router;