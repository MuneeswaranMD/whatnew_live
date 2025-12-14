import api from './api';

export const authService = {
  // Seller registration
  registerSeller: async (userData) => {
    const response = await api.post('/api/auth/register/seller/', userData);
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Login
  login: async (credentials) => {
    console.log('AuthService: Sending login request with:', credentials);
    const response = await api.post('/api/auth/login/', credentials);
    console.log('AuthService: Login response:', response.data);
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Logout
  logout: async () => {
    try {
      await api.post('/api/auth/logout/');
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  },

  // Get profile
  getProfile: async () => {
    const response = await api.get('/api/auth/profile/');
    return response.data;
  },

  // Update profile
  updateProfile: async (profileData) => {
    const response = await api.patch('/api/auth/profile/update/', profileData);
    return response.data;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Get seller credits
  getSellerCredits: async () => {
    const response = await api.get('/api/auth/seller/credits/');
    return response.data;
  },

  // Get seller verification status
  getVerificationStatus: async () => {
    const response = await api.get('/api/auth/seller/verification-status/');
    return response.data;
  }
};
