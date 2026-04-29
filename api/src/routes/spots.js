const express = require('express');
const router = express.Router();
const SpotController = require('../controllers/SpotController');
const { authMiddleware, adminOnly } = require('../middleware/auth');

router.get('/', SpotController.list);
router.get('/nearby', SpotController.nearby);
router.get('/:id', SpotController.getOne);
router.post('/', authMiddleware, adminOnly, SpotController.create);
router.put('/:id', authMiddleware, adminOnly, SpotController.update);
router.delete('/:id', authMiddleware, adminOnly, SpotController.remove);

module.exports = router;
