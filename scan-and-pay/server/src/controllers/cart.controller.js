const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Helper function to calculate totals securely
const calculateTotals = async (items) => {
  let total = 0;
  for (let item of items) {
    const product = await Product.findById(item.productId);
    if (!product) throw new Error(`Product ${item.productId} not found`);
    
    // Securely use backend price
    item.price = product.price;
    item.name = product.name;
    item.subtotal = product.price * item.quantity;
    total += item.subtotal;
  }
  return { updatedItems: items, total };
};

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id });
    
    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, items: [], total: 0 });
    }
    
    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/items
// @access  Private
const addItemToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [] });
    }
    
    const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    
    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity, price: 0, subtotal: 0, name: '' });
    }
    
    const { updatedItems, total } = await calculateTotals(cart.items);
    cart.items = updatedItems;
    cart.total = total;
    
    await cart.save();
    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Update item quantity in cart
// @route   PUT /api/cart/items/:productId
// @access  Private
const updateItemQuantity = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;
    
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      res.status(404);
      throw new Error('Cart not found');
    }
    
    const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    
    if (existingItemIndex > -1) {
      if (quantity <= 0) {
        cart.items.splice(existingItemIndex, 1);
      } else {
        cart.items[existingItemIndex].quantity = quantity;
      }
      
      const { updatedItems, total } = await calculateTotals(cart.items);
      cart.items = updatedItems;
      cart.total = total;
      
      await cart.save();
      res.json({ success: true, data: cart });
    } else {
      res.status(404);
      throw new Error('Item not found in cart');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:productId
// @access  Private
const removeItemFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;
    
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      res.status(404);
      throw new Error('Cart not found');
    }
    
    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    
    const { updatedItems, total } = await calculateTotals(cart.items);
    cart.items = updatedItems;
    cart.total = total;
    
    await cart.save();
    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id });
    if (cart) {
      cart.items = [];
      cart.total = 0;
      await cart.save();
    }
    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
  clearCart
};
