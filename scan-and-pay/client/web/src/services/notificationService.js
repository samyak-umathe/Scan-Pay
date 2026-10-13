import api from './api';

export const notificationService = {
  getUserNotifications: async () => {
    const res = await api.get('/notifications');
    return res.data.data;
  },

  createNotification: async (notificationData) => {
    const res = await api.post('/notifications', notificationData);
    return res.data;
  },

  markAsRead: async (id) => {
    const res = await api.put(`/notifications/${id}/read`);
    return res.data.data;
  }
};
