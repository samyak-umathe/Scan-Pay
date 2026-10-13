const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrderById,
  getMyOrders,
  getAllOrders
} = require('../controllers/order.controller');
const { protect } = require('../middleware/auth.middleware');
const { admin } = require('../middleware/admin.middleware');

router.use(protect);

router.route('/')
  .post(createOrder)
  .get(getMyOrders);

router.get('/admin/all', admin, getAllOrders);
router.get('/:id', getOrderById);

module.exports = router;
