const recommendationService = require('../services/recommendation.service');

// @desc    Get personalized recommendations for logged-in user
// @route   GET /api/recommendations
// @access  Private
const getRecommendations = async (req, res, next) => {
  try {
    const data = await recommendationService.getUserRecommendations(req.user._id);
    res.json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get store-wide co-purchase matrix (Admin)
// @route   GET /api/recommendations/admin/matrix
// @access  Private/Admin
const getMatrix = async (req, res, next) => {
  try {
    const data = await recommendationService.getCoOccurrenceMatrix();
    res.json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRecommendations,
  getMatrix
};
