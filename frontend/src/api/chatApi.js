import axios from './axios';

export const chatApi = {
    getChatRooms: async () => {
        const response = await axios.get('/chats');
        return response.data;
    },

    getChatRoom: async (matchId) => {
        const response = await axios.get(`/chats/${matchId}`);
        return response.data;
    },

    getMessages: async (matchId) => {
        const response = await axios.get(`/chats/${matchId}/messages`);
        return response.data;
    },

    sendMessage: async (matchId, content) => {
        const response = await axios.post(`/chats/${matchId}/messages`, { content });
        return response.data;
    },

    markAsRead: async (matchId) => {
        await axios.put(`/chats/${matchId}/read`);
    },
};

export default chatApi;
