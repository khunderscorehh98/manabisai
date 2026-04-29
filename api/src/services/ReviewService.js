const ReviewModel = require('../models/Review');
const SpotModel = require('../models/Spot');

const ReviewService = {
  async findBySpotId(spotId) {
    const spot = await SpotModel.findById(spotId);
    if (!spot) throw new Error('Spot not found');
    return ReviewModel.findBySpotId(spotId);
  },

  async create(data) {
    const spot = await SpotModel.findById(data.spot_id);
    if (!spot) throw new Error('Spot not found');
    return ReviewModel.create(data);
  },

  async remove(id, userId) {
    const deleted = await ReviewModel.remove(id, userId);
    if (!deleted) throw new Error('Review not found or not owned by user');
  },
};

module.exports = ReviewService;
