const express = require('express');
const router = express.Router();
const { getBlurbs, newBlurb, getSomeBlurbs, updateBlurb, deleteBlurb } = require('../controllers/blurbController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/', getBlurbs);
router.post('/', authenticate, newBlurb);
router.post('/some', getSomeBlurbs);
router.put('/', authenticate, updateBlurb);
router.delete('/', authenticate, deleteBlurb);

module.exports = router;