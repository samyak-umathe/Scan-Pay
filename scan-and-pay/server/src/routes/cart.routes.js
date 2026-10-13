const express = require('express');
const router = express.Router();
const {
  getCart,
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
  clearCart
} = require('../controllers/cart.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect); // All cart routes are protected

router.route('/')
  .get(getCart)
  .delete(clearCart);

router.post('/items', addItemToCart);

router.route('/items/:productId')
  .put(updateItemQuantity)
  .delete(removeItemFromCart);

module.exports = router;
