const CategoryService = require('../services/CategoryService');

const CategoryController = {
  async list(req, res, next) {
    try {
      const categories = await CategoryService.findAll();
      res.json({ success: true, data: categories });
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ success: false, message: 'Category name is required' });
      }
      const id = await CategoryService.create(name);
      res.status(201).json({ success: true, data: { id } });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = CategoryController;
