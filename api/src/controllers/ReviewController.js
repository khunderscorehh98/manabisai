const ReviewService = require('../services/ReviewService');

const ReviewController = {
  async getBySpot(req, res, next) {
    try {
      const reviews = await ReviewService.findBySpotId(req.params.id);
      res.json({ success: true, data: reviews });
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const { rating, comment } = req.body;
      if (!rating) {
        return res.status(400).json({ success: false, message: 'Rating is required' });
      }
      const data = {
        user_id: req.user.id,
        spot_id: req.params.id,
        rating: parseInt(rating, 10),
        comment: comment || null,
      };
      const id = await ReviewService.create(data);
      res.status(201).json({ success: true, data: { id } });
    } catch (err) {
      next(err);
    }
  },

  async remove(req, res, next) {
    try {
      await ReviewService.remove(req.params.id, req.user.id);
      res.json({ success: true, message: 'Review deleted' });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = ReviewController;
