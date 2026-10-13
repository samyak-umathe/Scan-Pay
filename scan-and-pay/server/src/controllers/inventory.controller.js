const inventoryService = require('../services/inventory.service');

// @desc    Get all inventory records with smart velocity metrics
// @route   GET /api/inventory
// @access  Private/Admin
const getInventory = async (req, res, next) => {
  try {
    const inventory = await inventoryService.getSmartInventoryList();
    res.json({ success: true, data: inventory });
  } catch (error) {
    next(error);
  }
};

// @desc    Get inventory alerts (low/critical stock)
// @route   GET /api/inventory/alerts
// @access  Private/Admin
const getInventoryAlerts = async (req, res, next) => {
  try {
    const alerts = await inventoryService.getInventoryAlerts();
    res.json({ success: true, data: alerts });
  } catch (error) {
    next(error);
  }
};

// @desc    Update inventory stock manually
// @route   PUT /api/inventory/:productId
// @access  Private/Admin
const updateInventory = async (req, res, next) => {
  try {
    const { currentStock, minimumStock } = req.body;
    const updatedInventory = await inventoryService.updateProductInventory(
      req.params.productId,
      { currentStock, minimumStock }
    );
    res.json({ success: true, data: updatedInventory });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getInventory,
  getInventoryAlerts,
  updateInventory,
};
