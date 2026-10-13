const express = require('express');
const router = express.Router();
const {
  getInventory,
  getInventoryAlerts,
  updateInventory
} = require('../controllers/inventory.controller');
const { protect } = require('../middleware/auth.middleware');
const { admin } = require('../middleware/admin.middleware');

router.route('/')
  .get(protect, admin, getInventory);

router.get('/alerts', protect, admin, getInventoryAlerts);

router.route('/:productId')
  .put(protect, admin, updateInventory);

module.exports = router;
