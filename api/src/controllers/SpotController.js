const SpotService = require('../services/SpotService');

const SpotController = {
  async list(req, res, next) {
    try {
      const spots = await SpotService.findAll();
      res.json({ success: true, data: spots });
    } catch (err) {
      next(err);
    }
  },

  async getOne(req, res, next) {
    try {
      const spot = await SpotService.findById(req.params.id);
      res.json({ success: true, data: spot });
    } catch (err) {
      next(err);
    }
  },

  async nearby(req, res, next) {
    try {
      const { lat, lng, radius } = req.query;
      if (!lat || !lng) {
        return res.status(400).json({ success: false, message: 'lat and lng query parameters are required' });
      }
      const spots = await SpotService.findNearby(
        parseFloat(lat),
        parseFloat(lng),
        parseFloat(radius) || 5
      );
      res.json({ success: true, data: spots });
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const { name, description, latitude, longitude, address, category_id, is_halal } = req.body;
      const id = await SpotService.create({ name, description, latitude, longitude, address, category_id, is_halal });
      res.status(201).json({ success: true, data: { id } });
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const { name, description, latitude, longitude, address, category_id, is_halal } = req.body;
      await SpotService.update(req.params.id, { name, description, latitude, longitude, address, category_id, is_halal });
      res.json({ success: true, message: 'Spot updated' });
    } catch (err) {
      next(err);
    }
  },

  async remove(req, res, next) {
    try {
      await SpotService.remove(req.params.id);
      res.json({ success: true, message: 'Spot deleted' });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = SpotController;
