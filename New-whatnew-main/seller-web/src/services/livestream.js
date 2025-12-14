import api from './api';

export const livestreamService = {
  // Get livestreams (with query parameters)
  getLivestreams: async (params = {}) => {
    const response = await api.get('/api/livestreams/livestreams/', { params });
    return response.data;
  },

  // Get my livestreams (seller's livestreams)
  getMyLivestreams: async () => {
    const response = await api.get('/api/livestreams/livestreams/my_livestreams/');
    return response.data;
  },

  // Get live streams
  getLiveNow: async () => {
    const response = await api.get('/api/livestreams/livestreams/live_now/');
    return response.data;
  },

  // Get single livestream
  getLivestream: async (id) => {
    const response = await api.get(`/api/livestreams/livestreams/${id}/`);
    return response.data;
  },

  // Create livestream
  createLivestream: async (livestreamData) => {
    const response = await api.post('/api/livestreams/livestreams/', livestreamData);
    return response.data;
  },

  // Update livestream
  updateLivestream: async (id, livestreamData) => {
    const response = await api.put(`/api/livestreams/livestreams/${id}/`, livestreamData);
    return response.data;
  },

  // Delete livestream
  deleteLivestream: async (id) => {
    await api.delete(`/api/livestreams/livestreams/${id}/`);
  },

  // Start livestream
  startLivestream: async (id) => {
    const response = await api.patch(`/api/livestreams/livestreams/${id}/start/`);
    return response.data;
  },

  // End livestream
  endLivestream: async (id) => {
    const response = await api.patch(`/api/livestreams/livestreams/${id}/end/`);
    return response.data;
  },

  // Check and process credit deduction
  processCreditDeduction: async (id) => {
    const response = await api.post(`/api/livestreams/livestreams/${id}/check_credits/`);
    return response.data;
  },

  // Join livestream
  joinLivestream: async (id) => {
    const response = await api.post(`/api/livestreams/livestreams/${id}/join/`);
    return response.data;
  },

  // Leave livestream
  leaveLivestream: async (id) => {
    const response = await api.patch(`/api/livestreams/livestreams/${id}/leave/`);
    return response.data;
  },

  // Get Agora token
  getAgoraToken: async (id) => {
    const response = await api.get(`/api/livestreams/livestreams/${id}/agora-token/`);
    return response.data;
  },

  // Bidding Management
  // Get biddings (with query parameters)
  getBiddings: async (params = {}) => {
    const response = await api.get('/api/livestreams/biddings/', { params });
    return response.data;
  },

  // Get single bidding
  getBidding: async (id) => {
    const response = await api.get(`/api/livestreams/biddings/${id}/`);
    return response.data;
  },

  // Create product bidding (alias for easier use)
  startBidding: async (livestreamId, biddingData) => {
    const response = await api.post('/api/livestreams/biddings/', {
      livestream: livestreamId,
      ...biddingData
    });
    return response.data;
  },

  // Create product bidding
  createBidding: async (biddingData) => {
    const response = await api.post('/api/livestreams/biddings/', biddingData);
    return response.data;
  },

  // Update bidding
  updateBidding: async (id, biddingData) => {
    const response = await api.put(`/api/livestreams/biddings/${id}/`, biddingData);
    return response.data;
  },

  // End bidding
  endBidding: async (id) => {
    const response = await api.patch(`/api/livestreams/biddings/${id}/end/`);
    return response.data;
  },

  // Place bid (this is for buyers, but included for completeness)
  placeBid: async (id, bidData) => {
    const response = await api.post(`/api/livestreams/biddings/${id}/place-bid/`, bidData);
    return response.data;
  }
};
