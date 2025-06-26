const express = require('express');
const router = express.Router();
const { getUsers, updateRole, deleteUser } = require('../controllers/userController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/', getUsers);
router.patch('/role', authenticate, updateRole);
router.delete('/', authenticate, deleteUser);

module.exports = router;