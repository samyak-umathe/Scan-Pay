const Inventory = require('../models/Inventory');
const Product = require('../models/Product');
const Order = require('../models/Order');

/**
 * Calculate smart inventory forecast & velocity metrics for all products
 */
const getSmartInventoryList = async () => {
  const [inventoryDocs, products, paidOrders] = await Promise.all([
    Inventory.find({}).populate('productId'),
    Product.find({}),
    Order.find({ paymentStatus: 'paid', createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } })
  ]);

  // Calculate 30-day item sales volume
  const salesMap = {};
  paidOrders.forEach(order => {
    order.items.forEach(item => {
      if (item.productId) {
        const pId = item.productId.toString();
        salesMap[pId] = (salesMap[pId] || 0) + item.quantity;
      }
    });
  });

  const productMap = {};
  products.forEach(p => { productMap[p._id.toString()] = p; });

  const result = inventoryDocs.map(inv => {
    const product = inv.productId || productMap[inv.productId?.toString()];
    if (!product) return null;

    const totalSold30Days = salesMap[product._id.toString()] || 0;
    // Average daily sales (minimum 0.5 to prevent division by zero in forecast)
    const averageDailySales = parseFloat(Math.max(0.5, totalSold30Days / 30).toFixed(2));
    const currentStock = inv.currentStock ?? product.stock ?? 0;
    const minimumStock = inv.minimumStock ?? product.minimumStock ?? 10;
    
    // Estimated days of stock remaining
    const estimatedDaysRemaining = parseFloat((currentStock / averageDailySales).toFixed(1));

    // Status evaluation
    let status = 'healthy';
    if (currentStock <= 0) {
      status = 'critical';
    } else if (currentStock <= minimumStock || estimatedDaysRemaining <= 3) {
      status = 'low';
    }

    // Recommended reorder quantity (covers 14 days of supply + safety stock)
    const recommendedReorderQty = Math.max(20, Math.ceil(averageDailySales * 14 + minimumStock - currentStock));

    return {
      _id: inv._id,
      productId: product,
      currentStock,
      minimumStock,
      reorderLevel: inv.reorderLevel || minimumStock + 10,
      averageDailySales,
      totalSold30Days,
      estimatedDaysRemaining,
      recommendedReorderQty,
      status,
      lastUpdated: inv.lastUpdated || inv.updatedAt
    };
  }).filter(Boolean);

  return result;
};

/**
 * Get critical and low inventory alerts
 */
const getInventoryAlerts = async () => {
  const allInventory = await getSmartInventoryList();
  return allInventory.filter(item => item.status === 'low' || item.status === 'critical');
};

/**
 * Update stock manually for a product
 */
const updateProductInventory = async (productId, { currentStock, minimumStock }) => {
  let inventory = await Inventory.findOne({ productId });
  
  if (!inventory) {
    inventory = new Inventory({ productId, currentStock: currentStock || 0, minimumStock: minimumStock || 10 });
  }

  if (currentStock !== undefined) inventory.currentStock = currentStock;
  if (minimumStock !== undefined) inventory.minimumStock = minimumStock;

  if (inventory.currentStock <= 0) {
    inventory.status = 'critical';
  } else if (inventory.currentStock <= inventory.minimumStock) {
    inventory.status = 'low';
  } else {
    inventory.status = 'healthy';
  }

  inventory.lastUpdated = Date.now();
  await inventory.save();

  // Keep Product collection synchronized
  await Product.findByIdAndUpdate(productId, {
    stock: inventory.currentStock,
    minimumStock: inventory.minimumStock
  });

  return inventory;
};

module.exports = {
  getSmartInventoryList,
  getInventoryAlerts,
  updateProductInventory
};
