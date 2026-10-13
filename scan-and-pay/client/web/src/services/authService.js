import api from './api';

export const authService = {
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    return res.data.data;
  },

  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    return res.data.data;
  },

  getProfile: async () => {
    const res = await api.get('/auth/me');
    return res.data.data;
  },

  updateProfile: async (data) => {
    const res = await api.put('/auth/profile', data);
    return res.data.data;
  }
};
