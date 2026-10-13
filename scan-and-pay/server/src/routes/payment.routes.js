const express = require('express');
const router = express.Router();
const { processPayment, verifyPayment } = require('../controllers/payment.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/create', protect, processPayment);
router.post('/verify', protect, verifyPayment);

module.exports = router;
