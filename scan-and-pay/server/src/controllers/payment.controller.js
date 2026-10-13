const Payment = require('../models/Payment');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Inventory = require('../models/Inventory');
const Cart = require('../models/Cart');
const Notification = require('../models/Notification');
const { generateReceiptId } = require('../utils/generateReceipt');
const crypto = require('crypto');

// @desc    Process mock payment / transaction
// @route   POST /api/payment/create
// @access  Private
const processPayment = async (req, res, next) => {
  try {
    const { orderId, amount, paymentMethod } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    if (order.paymentStatus === 'paid') {
      res.status(400);
      throw new Error('Order has already been paid');
    }

    // 1. Generate unique transaction ID
    const transactionId = `TXN_${Date.now()}_${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    // 2. Generate official receipt ID
    const receiptId = generateReceiptId();

    // 3. Create Payment Record
    const payment = await Payment.create({
      orderId,
      userId: req.user._id,
      amount,
      paymentMethod: paymentMethod || 'UPI',
      transactionId,
      status: 'completed'
    });

    // 4. Update Order Status & Receipt ID
    order.paymentStatus = 'paid';
    order.orderStatus = 'completed';
    order.receiptId = receiptId;
    await order.save();

    // 5. Safely reduce Product stock & update Inventory status
    for (const item of order.items) {
      if (item.productId) {
        const product = await Product.findById(item.productId);
        if (product) {
          product.stock = Math.max(0, product.stock - item.quantity);
          await product.save();

          let inventory = await Inventory.findOne({ productId: product._id });
          if (inventory) {
            inventory.currentStock = product.stock;
            if (inventory.currentStock <= 0) {
              inventory.status = 'critical';
            } else if (inventory.currentStock <= inventory.minimumStock) {
              inventory.status = 'low';
            } else {
              inventory.status = 'healthy';
            }
            inventory.lastUpdated = Date.now();
            await inventory.save();
          }
        }
      }
    }

    // 6. Clear user's active Cart
    await Cart.findOneAndUpdate(
      { userId: req.user._id },
      { items: [], total: 0 }
    );

    // 7. Send Customer Order Confirmation Notification
    await Notification.create({
      userId: req.user._id,
      title: 'Payment Successful 🎉',
      message: `Your payment of ₹${amount} for Order ${receiptId} was successful. Digital receipt is ready.`,
      type: 'order'
    });

    res.status(201).json({
      success: true,
      data: {
        payment,
        order
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Payment
// @route   POST /api/payment/verify
// @access  Private
const verifyPayment = async (req, res, next) => {
  try {
    const { transactionId, orderId } = req.body;
    const payment = await Payment.findOne({ transactionId, orderId });

    if (!payment) {
      res.status(404);
      throw new Error('Payment transaction verification failed');
    }

    res.json({
      success: true,
      data: payment
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  processPayment,
  verifyPayment
};
