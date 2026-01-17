import axios from './axios';

export const followApi = {
    follow: (userId) => axios.post(`/follow/${userId}`),
    unfollow: (userId) => axios.delete(`/follow/${userId}`),
    getFollowers: () => axios.get('/follow/followers'),
    getFollowing: () => axios.get('/follow/following'),
    checkFollowing: (userId) => axios.get(`/follow/check/${userId}`),
    getStats: () => axios.get('/follow/stats'),
};

export const connectionApi = {
    sendRequest: (userId) => axios.post(`/connections/request/${userId}`),
    accept: (id) => axios.put(`/connections/${id}/accept`),
    reject: (id) => axios.put(`/connections/${id}/reject`),
    getConnections: () => axios.get('/connections'),
    getPending: () => axios.get('/connections/pending'),
    getSent: () => axios.get('/connections/sent'),
    checkConnection: (userId) => axios.get(`/connections/check/${userId}`),
};

export const searchApi = {
    search: (query, type = 'all') => axios.get('/search', { params: { q: query, type } }),
};

export const directChatApi = {
    getOrCreateChat: (userId) => axios.get(`/chats/direct/${userId}`),
};

export default { followApi, connectionApi, searchApi, directChatApi };
