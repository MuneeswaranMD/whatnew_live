import api from './api';

export const chatService = {
  // Get chat messages for a livestream
  getChatMessages: async (livestreamId, params = {}) => {
    const response = await api.get(`/api/chat/messages/${livestreamId}/`, { params });
    return response.data;
  },

  // Send chat message
  sendMessage: async (livestreamId, messageData) => {
    const response = await api.post(`/api/chat/messages/${livestreamId}/send/`, messageData);
    return response.data;
  },

  // Delete message (moderation)
  deleteMessage: async (messageId) => {
    await api.delete(`/api/chat/messages/${messageId}/delete/`);
  },

  // Get chat moderators
  getChatModerators: async (livestreamId) => {
    const response = await api.get(`/api/chat/livestreams/${livestreamId}/moderators/`);
    return response.data;
  },

  // Add chat moderator
  addChatModerator: async (livestreamId, moderatorData) => {
    const response = await api.post(`/api/chat/livestreams/${livestreamId}/moderators/`, moderatorData);
    return response.data;
  },

  // Remove chat moderator
  removeChatModerator: async (moderatorId) => {
    await api.delete(`/api/chat/moderators/${moderatorId}/remove/`);
  },

  // Ban user
  banUser: async (livestreamId, banData) => {
    const response = await api.post(`/api/chat/livestreams/${livestreamId}/ban-user/`, banData);
    return response.data;
  },

  // Unban user
  unbanUser: async (banId) => {
    const response = await api.patch(`/api/chat/banned-users/${banId}/unban/`);
    return response.data;
  },

  // Get banned users
  getBannedUsers: async (livestreamId) => {
    const response = await api.get(`/api/chat/livestreams/${livestreamId}/banned-users/`);
    return response.data;
  }
};
