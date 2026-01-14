import axios from './axios';

export const authApi = {
    login: async (email, password) => {
        const response = await axios.post('/auth/login', { email, password });
        return response.data;
    },

    register: async (userData) => {
        const response = await axios.post('/auth/register', userData);
        return response.data;
    },

    logout: async () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser: async () => {
        const response = await axios.get('/auth/me');
        return response.data;
    },

    updatePassword: async (currentPassword, newPassword) => {
        const response = await axios.put('/auth/password', {
            currentPassword,
            newPassword,
        });
        return response.data;
    },
};

export default authApi;
