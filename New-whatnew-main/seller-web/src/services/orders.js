import api from './api';

export const orderService = {
  // Get seller orders
  getSellerOrders: async (params = {}) => {
    const response = await api.get('/api/orders/seller/orders/', { params });
    return response.data;
  },

  // Update order status
  updateOrderStatus: async (orderId, statusData) => {
    const response = await api.patch(`/api/orders/seller/orders/${orderId}/update-status/`, statusData);
    return response.data;
  },

  // Get order tracking
  getOrderTracking: async (orderId) => {
    const response = await api.get(`/api/orders/orders/${orderId}/track/`);
    return response.data;
  }
};
