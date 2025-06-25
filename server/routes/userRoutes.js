const express = require('express');
const router = express.Router();
const { getUsers, updateRole } = require('../controllers/userController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/', getUsers);
router.patch('/role', authenticate, updateRole);

module.exports = router;