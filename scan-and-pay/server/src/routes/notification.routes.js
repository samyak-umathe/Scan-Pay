const express = require('express');
const router = express.Router();
const {
  getNotifications,
  createNotification,
  markAsRead
} = require('../controllers/notification.controller');
const { protect } = require('../middleware/auth.middleware');
const { admin } = require('../middleware/admin.middleware');

router.get('/', protect, getNotifications);
router.post('/', protect, admin, createNotification);
router.put('/:id/read', protect, markAsRead);

module.exports = router;
