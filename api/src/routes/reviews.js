const express = require('express');
const router = express.Router();
const ReviewController = require('../controllers/ReviewController');
const { authMiddleware } = require('../middleware/auth');

router.get('/:id/reviews', ReviewController.getBySpot);
router.post('/:id/reviews', authMiddleware, ReviewController.create);
router.delete('/reviews/:id', authMiddleware, ReviewController.remove);

module.exports = router;
