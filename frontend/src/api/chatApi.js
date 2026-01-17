import axios from './axios';

export const chatApi = {
    getChatRooms: async () => {
        const response = await axios.get('/chats');
        return response.data;
    },

    // Match-based methods (for initiating chat from matches page)
    getChatRoom: async (matchId) => {
        const response = await axios.get(`/chats/${matchId}`);
        return response.data;
    },

    getMessages: async (matchId, page = 0, size = 20) => {
        const response = await axios.get(`/chats/${matchId}/messages?page=${page}&size=${size}`);
        return response.data;
    },

    sendMessage: async (matchId, content) => {
        const response = await axios.post(`/chats/${matchId}/messages`, { content });
        return response.data;
    },

    markAsRead: async (matchId) => {
        await axios.put(`/chats/${matchId}/read`);
    },

    // Chat room ID based methods (for navigating from chat list)
    getChatRoomById: async (chatRoomId) => {
        const response = await axios.get(`/chats/room/${chatRoomId}`);
        return response.data;
    },

    getMessagesByChatRoomId: async (chatRoomId, page = 0, size = 20) => {
        const response = await axios.get(`/chats/room/${chatRoomId}/messages?page=${page}&size=${size}`);
        return response.data;
    },

    sendMessageToChatRoom: async (chatRoomId, content) => {
        const response = await axios.post(`/chats/room/${chatRoomId}/messages`, { content });
        return response.data;
    },

    markChatRoomAsRead: async (chatRoomId) => {
        await axios.put(`/chats/room/${chatRoomId}/read`);
    },

    getOnlineUsers: async () => {
        const response = await axios.get('/chats/online');
        return response.data;
    }
};

export default chatApi;
