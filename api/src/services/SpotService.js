const SpotModel = require('../models/Spot');

const SpotService = {
  async findAll() {
    return SpotModel.findAll();
  },

  async findById(id) {
    const spot = await SpotModel.findById(id);
    if (!spot) throw new Error('Spot not found');
    return spot;
  },

  async findNearby(lat, lng, radius) {
    return SpotModel.findNearby(lat, lng, radius);
  },

  async create(data) {
    return SpotModel.create(data);
  },

  async update(id, data) {
    const spot = await SpotModel.findById(id);
    if (!spot) throw new Error('Spot not found');
    return SpotModel.update(id, data);
  },

  async remove(id) {
    const spot = await SpotModel.findById(id);
    if (!spot) throw new Error('Spot not found');
    return SpotModel.remove(id);
  },
};

module.exports = SpotService;
