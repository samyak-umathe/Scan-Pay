import api from './api';

export const inventoryService = {
  getAll: async () => {
    const res = await api.get('/inventory');
    return res.data.data;
  },

  getAlerts: async () => {
    const res = await api.get('/inventory/alerts');
    return res.data.data;
  },

  updateStock: async (productId, data) => {
    const res = await api.put(`/inventory/${productId}`, data);
    return res.data.data;
  }
};
