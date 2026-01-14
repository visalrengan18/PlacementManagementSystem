import axios from './axios';

export const companyApi = {
    search: async (query = '', page = 0, size = 10) => {
        const response = await axios.get('/companies', {
            params: { query, page, size },
        });
        return response.data;
    },

    getDetails: async (id) => {
        const response = await axios.get(`/companies/${id}`);
        return response.data;
    },

    getJobs: async (id, page = 0, size = 10) => {
        const response = await axios.get(`/companies/${id}/jobs`, {
            params: { page, size },
        });
        return response.data;
    },
};

export default companyApi;
