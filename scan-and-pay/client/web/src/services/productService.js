import api from './api';

export const productService = {
  getAll: async () => {
    const res = await api.get('/products');
    return res.data.data;
  },

  getById: async (id) => {
    const res = await api.get(`/products/${id}`);
    return res.data.data;
  },

  getByBarcode: async (barcode) => {
    const res = await api.get(`/products/barcode/${barcode}`);
    return res.data.data;
  },

  create: async (productData) => {
    const res = await api.post('/products', productData);
    return res.data.data;
  },

  update: async (id, productData) => {
    const res = await api.put(`/products/${id}`, productData);
    return res.data.data;
  },

  delete: async (id) => {
    const res = await api.delete(`/products/${id}`);
    return res.data;
  },

  bulkCreate: async (products) => {
    const res = await api.post('/products/bulk', { products });
    return res.data;
  }
};
