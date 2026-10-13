const Notification = require('../models/Notification');
const User = require('../models/User');

/**
 * Send notification to a specific user
 */
const createUserNotification = async ({ userId, title, message, type = 'system' }) => {
  return await Notification.create({
    userId,
    title,
    message,
    type,
    read: false
  });
};

/**
 * Broadcast promotional or alert notification to all registered customers
 */
const broadcastNotification = async ({ title, message, type = 'promotional' }) => {
  const customers = await User.find({ role: 'customer' });
  const notifications = customers.map(customer => ({
    userId: customer._id,
    title,
    message,
    type,
    read: false
  }));

  if (notifications.length > 0) {
    await Notification.insertMany(notifications);
  }

  return { sentCount: notifications.length };
};

/**
 * Get notifications for a specific user
 */
const getUserNotifications = async (userId) => {
  return await Notification.find({ userId }).sort({ createdAt: -1 }).limit(30);
};

/**
 * Mark notification as read
 */
const markNotificationAsRead = async (notificationId, userId) => {
  return await Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { read: true },
    { new: true }
  );
};

module.exports = {
  createUserNotification,
  broadcastNotification,
  getUserNotifications,
  markNotificationAsRead
};
