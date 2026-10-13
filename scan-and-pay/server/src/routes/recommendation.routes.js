const express = require('express');
const router = express.Router();
const { getRecommendations, getMatrix } = require('../controllers/recommendation.controller');
const { protect } = require('../middleware/auth.middleware');
const { admin } = require('../middleware/admin.middleware');

router.get('/', protect, getRecommendations);
router.get('/admin/matrix', protect, admin, getMatrix);

module.exports = router;
