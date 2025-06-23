const express = require('express');
const router = express.Router();
const { register, login, me, refresh } = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, me);
router.post('/refresh', refresh);

module.exports = router;