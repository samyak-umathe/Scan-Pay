import api from './api';

export const cartService = {
  getCart: async () => {
    const res = await api.get('/cart');
    return res.data.data;
  },

  addItem: async (productId, quantity = 1) => {
    const res = await api.post('/cart/items', { productId, quantity });
    return res.data.data;
  },

  updateQuantity: async (productId, quantity) => {
    const res = await api.put(`/cart/items/${productId}`, { quantity });
    return res.data.data;
  },

  removeItem: async (productId) => {
    const res = await api.delete(`/cart/items/${productId}`);
    return res.data.data;
  },

  clearCart: async () => {
    const res = await api.delete('/cart');
    return res.data.data;
  }
};
