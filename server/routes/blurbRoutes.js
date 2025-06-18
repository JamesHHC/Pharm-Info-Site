const express = require('express');
const router = express.Router();
const { getBlurbs, newBlurb, getSomeBlurbs, updateBlurb, deleteBlurb } = require('../controllers/blurbController');

router.get('/', getBlurbs);
router.post('/', newBlurb);
router.post('/some', getSomeBlurbs);
router.put('/', updateBlurb);
router.delete('/', deleteBlurb);

module.exports = router;