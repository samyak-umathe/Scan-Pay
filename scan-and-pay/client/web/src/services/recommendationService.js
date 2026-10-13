import api from './api';

export const recommendationService = {
  getRecommendations: async () => {
    const res = await api.get('/recommendations');
    return res.data.data;
  },

  getAdminMatrix: async () => {
    const res = await api.get('/recommendations/admin/matrix');
    return res.data.data;
  }
};
