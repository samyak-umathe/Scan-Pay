const notificationService = require('../services/notification.service');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res, next) => {
  try {
    const notifications = await notificationService.getUserNotifications(req.user._id);
    res.json({ success: true, data: notifications });
  } catch (error) {
    next(error);
  }
};

// @desc    Create / Broadcast notification (Admin)
// @route   POST /api/notifications
// @access  Private/Admin
const createNotification = async (req, res, next) => {
  try {
    const { title, message, type, userId } = req.body;

    if (!title || !message) {
      res.status(400);
      throw new Error('Title and message are required');
    }

    if (userId) {
      const notification = await notificationService.createUserNotification({ userId, title, message, type });
      res.status(201).json({ success: true, data: notification });
    } else {
      const result = await notificationService.broadcastNotification({ title, message, type });
      res.status(201).json({ success: true, data: result, message: `Broadcast sent to ${result.sentCount} customers` });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res, next) => {
  try {
    const updated = await notificationService.markNotificationAsRead(req.params.id, req.user._id);
    if (!updated) {
      res.status(404);
      throw new Error('Notification not found');
    }
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotifications,
  createNotification,
  markAsRead
};
