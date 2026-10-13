const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product',
  },
  reason: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  }
}, {
  timestamps: true,
});

const Recommendation = mongoose.model('Recommendation', recommendationSchema);
module.exports = Recommendation;
