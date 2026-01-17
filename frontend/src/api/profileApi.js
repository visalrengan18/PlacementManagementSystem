import axios from './axios';

export const profileApi = {
    // Seeker profile
    getSeekerProfile: async () => {
        const response = await axios.get('/profile/seeker');
        return response.data;
    },

    updateSeekerProfile: async (profileData) => {
        const response = await axios.put('/profile/seeker', profileData);
        return response.data;
    },

    // Company profile
    getCompanyProfile: async () => {
        const response = await axios.get('/profile/company');
        return response.data;
    },

    updateCompanyProfile: async (profileData) => {
        const response = await axios.put('/profile/company', profileData);
        return response.data;
    },

    // Get public seeker profile (for companies viewing applicants)
    getPublicSeekerProfile: async (seekerId) => {
        const response = await axios.get(`/profile/seeker/${seekerId}`);
        return response.data;
    },

    // Get public company profile (for seekers viewing jobs)
    getPublicCompanyProfile: async (companyId) => {
        const response = await axios.get(`/profile/company/${companyId}`);
        return response.data;
    },

    // Get any user profile by user ID
    getPublicProfileByUserId: async (userId) => {
        const response = await axios.get(`/profile/user/${userId}`);
        return response.data;
    },
};

export default profileApi;
