import api from './api';

export const orderService = {
  createOrder: async (orderData) => {
    const res = await api.post('/orders', orderData);
    return res.data.data;
  },

  getOrderById: async (id) => {
    const res = await api.get(`/orders/${id}`);
    return res.data.data;
  },

  getMyOrders: async () => {
    const res = await api.get('/orders');
    return res.data.data;
  },

  getAllOrders: async () => {
    const res = await api.get('/orders/admin/all');
    return res.data.data;
  },

  updateStatus: async (id, orderStatus) => {
    const res = await api.put(`/orders/${id}/status`, { orderStatus });
    return res.data.data;
  }
};
