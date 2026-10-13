import api from './api';

export const analyticsService = {
  getSales: async () => {
    const res = await api.get('/analytics/sales');
    return res.data.data;
  },

  getTopProducts: async () => {
    const res = await api.get('/analytics/top-products');
    return res.data.data;
  },

  getCategories: async () => {
    const res = await api.get('/analytics/categories');
    return res.data.data;
  },

  getCustomers: async () => {
    const res = await api.get('/analytics/customers');
    return res.data.data;
  },

  getInsights: async () => {
    const res = await api.get('/analytics/insights');
    return res.data.data;
  }
};
