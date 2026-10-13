const analyticsService = require('../services/analytics.service');

// @desc    Get sales analytics
// @route   GET /api/analytics/sales
// @access  Private/Admin
const getSales = async (req, res, next) => {
  try {
    const data = await analyticsService.getSalesAnalytics();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// @desc    Get top selling products
// @route   GET /api/analytics/top-products
// @access  Private/Admin
const getTopProducts = async (req, res, next) => {
  try {
    const data = await analyticsService.getTopProducts();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// @desc    Get category analytics
// @route   GET /api/analytics/categories
// @access  Private/Admin
const getCategories = async (req, res, next) => {
  try {
    const data = await analyticsService.getCategoryAnalytics();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// @desc    Get customer analytics
// @route   GET /api/analytics/customers
// @access  Private/Admin
const getCustomers = async (req, res, next) => {
  try {
    const data = await analyticsService.getCustomerAnalytics();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// @desc    Get smart business insights
// @route   GET /api/analytics/insights
// @access  Private/Admin
const getInsights = async (req, res, next) => {
  try {
    const data = await analyticsService.getBusinessInsights();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSales,
  getTopProducts,
  getCategories,
  getCustomers,
  getInsights
};
