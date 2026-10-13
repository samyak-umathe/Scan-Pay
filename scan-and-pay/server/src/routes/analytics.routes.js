const express = require('express');
const router = express.Router();
const {
  getSales,
  getTopProducts,
  getCategories,
  getCustomers,
  getInsights
} = require('../controllers/analytics.controller');
const { protect } = require('../middleware/auth.middleware');
const { admin } = require('../middleware/admin.middleware');

router.get('/sales', protect, admin, getSales);
router.get('/top-products', protect, admin, getTopProducts);
router.get('/categories', protect, admin, getCategories);
router.get('/customers', protect, admin, getCustomers);
router.get('/insights', protect, admin, getInsights);

module.exports = router;
