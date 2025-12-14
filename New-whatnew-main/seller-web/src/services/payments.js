import api from './api';

export const paymentService = {
  // Get seller earnings
  getSellerEarnings: async () => {
    const response = await api.get('/api/payments/seller/earnings/');
    return response.data;
  },

  // Get seller credits (from auth service)
  getSellerCredits: async () => {
    const response = await api.get('/api/auth/seller/credits/');
    return response.data;
  },

  // Get credit transactions history
  getCreditTransactions: async () => {
    const response = await api.get('/api/payments/credit-purchases/');
    return response.data;
  },

  // Get payment history
  getPaymentHistory: async () => {
    const response = await api.get('/api/payments/payments/');
    return response.data;
  },

  // Get payment statistics
  getPaymentStats: async () => {
    const response = await api.get('/api/payments/seller/stats/');
    return response.data;
  },

  // Get withdrawal requests
  getWithdrawalRequests: async () => {
    const response = await api.get('/api/payments/withdrawals/');
    return response.data;
  },

  // Request withdrawal
  requestWithdrawal: async (withdrawalData) => {
    const response = await api.post('/api/payments/seller/withdraw/', withdrawalData);
    return response.data;
  },

  // Get withdrawal history (same as withdrawal requests for now)
  getWithdrawalHistory: async () => {
    return await paymentService.getWithdrawalRequests();
  },

  // Get seller bank details
  getBankDetails: async () => {
    const response = await api.get('/api/payments/seller/bank-details/');
    return response.data;
  },

  // Update seller bank details
  updateBankDetails: async (bankData) => {
    const response = await api.post('/api/payments/seller/update-bank-details/', bankData);
    return response.data;
  },

  // Purchase credits
  purchaseCredits: async (creditData) => {
    const response = await api.post('/api/payments/credits/purchase/', creditData);
    return response.data;
  },

  // Verify credit payment
  verifyCreditPayment: async (paymentData) => {
    const response = await api.post('/api/payments/verify-payment/', paymentData);
    return response.data;
  },

  // Handle payment failure
  handlePaymentFailure: async (paymentData) => {
    const response = await api.post('/api/payments/payment-failed/', paymentData);
    return response.data;
  },

  // Download invoice
  downloadInvoice: async (transactionId) => {
    const response = await api.get(`/api/payments/invoice/${transactionId}/download/`, {
      responseType: 'blob'
    });
    return response;
  },

  // Get usage history
  getUsageHistory: async () => {
    const response = await api.get('/api/payments/usage-history/');
    return response.data;
  },

  // Download report
  downloadReport: async (filters) => {
    const response = await api.post('/api/payments/download-report/', filters, {
      responseType: 'blob'
    });
    return response;
  },

  // Verify payment
  verifyPayment: async (paymentData) => {
    const response = await api.post('/api/payments/verify-payment/', paymentData);
    return response.data;
  },

  // Get base URL
  getBaseURL: () => {
    return api.defaults.baseURL || 'https://api.whatnew.in';
  }
};
