const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product',
    unique: true,
  },
  currentStock: {
    type: Number,
    required: true,
    default: 0,
  },
  minimumStock: {
    type: Number,
    required: true,
    default: 10,
  },
  reorderLevel: {
    type: Number,
    required: true,
    default: 20,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['healthy', 'low', 'critical'],
    default: 'healthy',
  }
}, {
  timestamps: true,
});

const Inventory = mongoose.model('Inventory', inventorySchema);
module.exports = Inventory;
