const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Inventory = require('../models/Inventory');

/**
 * Get comprehensive sales metrics and daily timeline
 */
const getSalesAnalytics = async () => {
  const paidOrders = await Order.find({ paymentStatus: 'paid' }).sort({ createdAt: 1 });
  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = paidOrders.length;
  const averageOrderValue = totalOrders > 0 ? parseFloat((totalRevenue / totalOrders).toFixed(2)) : 0;

  // Group by day
  const dailyMap = {};
  paidOrders.forEach(order => {
    const day = new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
    if (!dailyMap[day]) {
      dailyMap[day] = { date: day, revenue: 0, orders: 0 };
    }
    dailyMap[day].revenue += order.total;
    dailyMap[day].orders += 1;
  });

  const dailyTrend = Object.values(dailyMap);

  return {
    totalRevenue: parseFloat(totalRevenue.toFixed(2)),
    totalOrders,
    averageOrderValue,
    dailyTrend
  };
};

/**
 * Get top-selling products by quantity and revenue using MongoDB aggregation
 */
const getTopProducts = async () => {
  const topProducts = await Order.aggregate([
    { $match: { paymentStatus: 'paid' } },
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.productId',
        name: { $first: '$items.name' },
        totalQuantity: { $sum: '$items.quantity' },
        totalRevenue: { $sum: '$items.subtotal' }
      }
    },
    { $sort: { totalQuantity: -1 } },
    { $limit: 10 }
  ]);

  return topProducts;
};

/**
 * Get sales breakdown by category
 */
const getCategoryAnalytics = async () => {
  const [orders, products] = await Promise.all([
    Order.find({ paymentStatus: 'paid' }),
    Product.find({})
  ]);

  const productCategoryMap = {};
  products.forEach(p => {
    productCategoryMap[p._id.toString()] = p.category;
    productCategoryMap[p.name] = p.category;
  });

  const categorySales = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      const category = (item.productId && productCategoryMap[item.productId.toString()]) ||
                       productCategoryMap[item.name] ||
                       'General';
      categorySales[category] = (categorySales[category] || 0) + item.subtotal;
    });
  });

  return Object.entries(categorySales).map(([category, revenue]) => ({
    category,
    revenue: parseFloat(revenue.toFixed(2))
  })).sort((a, b) => b.revenue - a.revenue);
};

/**
 * Get customer acquisition and purchase frequency metrics
 */
const getCustomerAnalytics = async () => {
  const [totalCustomers, customerOrders] = await Promise.all([
    User.countDocuments({ role: 'customer' }),
    Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      {
        $group: {
          _id: '$userId',
          orderCount: { $sum: 1 },
          totalSpent: { $sum: '$total' },
          lastPurchase: { $max: '$createdAt' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      { $unwind: '$userDetails' },
      {
        $project: {
          _id: 1,
          name: '$userDetails.name',
          email: '$userDetails.email',
          phone: '$userDetails.phone',
          orderCount: 1,
          totalSpent: 1,
          lastPurchase: 1
        }
      },
      { $sort: { totalSpent: -1 } }
    ])
  ]);

  const activeCustomers = customerOrders.length;
  const repeatCustomers = customerOrders.filter(c => c.orderCount > 1).length;
  const repeatRate = activeCustomers > 0 ? parseFloat(((repeatCustomers / activeCustomers) * 100).toFixed(1)) : 0;

  return {
    totalCustomers,
    activeCustomers,
    repeatCustomers,
    repeatRate,
    topCustomers: customerOrders
  };
};

/**
 * Generate Smart Business Insights based on real store statistics
 */
const getBusinessInsights = async () => {
  const [sales, topProducts, categories, inventoryAlerts, customers] = await Promise.all([
    getSalesAnalytics(),
    getTopProducts(),
    getCategoryAnalytics(),
    Inventory.find({ status: { $in: ['low', 'critical'] } }).populate('productId'),
    getCustomerAnalytics()
  ]);

  const insights = [];

  // Insight 1: Revenue Velocity
  if (sales.totalOrders > 0) {
    insights.push({
      type: 'positive',
      title: 'Strong Self-Checkout Adoption',
      message: `Customers have completed ${sales.totalOrders} automated checkout orders with an Average Order Value of ₹${sales.averageOrderValue}.`
    });
  }

  // Insight 2: Top Selling Product
  if (topProducts.length > 0) {
    const leader = topProducts[0];
    insights.push({
      type: 'info',
      title: 'High-Demand Product',
      message: `${leader.name} is the top revenue generator with ${leader.totalQuantity} units sold totaling ₹${leader.totalRevenue}.`
    });
  }

  // Insight 3: Category Performance
  if (categories.length > 0) {
    const topCat = categories[0];
    insights.push({
      type: 'growth',
      title: 'Dominant Category',
      message: `${topCat.category} leads grocery revenue with ₹${topCat.revenue} in digital checkout sales.`
    });
  }

  // Insight 4: Inventory Alerts
  if (inventoryAlerts.length > 0) {
    insights.push({
      type: 'warning',
      title: 'Restock Action Required',
      message: `${inventoryAlerts.length} product(s) are at or below safety stock threshold (${inventoryAlerts.map(i => i.productId?.name).filter(Boolean).slice(0, 3).join(', ')}).`
    });
  }

  // Insight 5: Customer Retention
  if (customers.repeatRate > 0) {
    insights.push({
      type: 'highlight',
      title: 'Customer Loyalty & Repeat Rate',
      message: `${customers.repeatRate}% of shoppers have returned for multiple self-checkout transactions.`
    });
  }

  return insights;
};

module.exports = {
  getSalesAnalytics,
  getTopProducts,
  getCategoryAnalytics,
  getCustomerAnalytics,
  getBusinessInsights
};
