const CategoryModel = require('../models/Category');

const CategoryService = {
  async findAll() {
    return CategoryModel.findAll();
  },

  async create(name) {
    return CategoryModel.create(name);
  },
};

module.exports = CategoryService;
