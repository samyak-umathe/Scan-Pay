import api from './api';

export const paymentService = {
  createPayment: async (paymentData) => {
    const res = await api.post('/payment/create', paymentData);
    return res.data.data;
  },

  verifyPayment: async (verificationData) => {
    const res = await api.post('/payment/verify', verificationData);
    return res.data.data;
  }
};
