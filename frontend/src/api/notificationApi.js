import axios from './axios';

export const notificationApi = {
    getNotifications: async () => {
        const response = await axios.get('/notifications');
        return response.data;
    },

    getUnreadCount: async () => {
        const response = await axios.get('/notifications/unread-count');
        return response.data.count;
    },

    markAsRead: async (id) => {
        await axios.put(`/notifications/${id}/read`);
    },

    markAllAsRead: async () => {
        await axios.put('/notifications/read-all');
    },
};

export default notificationApi;
