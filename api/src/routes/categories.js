const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/CategoryController');
const { authMiddleware, adminOnly } = require('../middleware/auth');

router.get('/', CategoryController.list);
router.post('/', authMiddleware, adminOnly, CategoryController.create);

module.exports = router;
