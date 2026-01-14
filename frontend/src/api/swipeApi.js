import axios from './axios';

export const swipeApi = {
    // Seeker: Swipe on a job
    swipeJob: async (jobId, direction) => {
        const response = await axios.post('/swipes/job', {
            jobId,
            direction, // 'RIGHT' for apply, 'LEFT' for skip
        });
        return response.data;
    },

    // Company: Swipe on an applicant
    swipeApplicant: async (applicationId, direction) => {
        const response = await axios.post('/swipes/applicant', {
            applicationId,
            direction, // 'RIGHT' for accept, 'LEFT' for reject
        });
        return response.data;
    },

    // Get seeker's applied jobs
    getAppliedJobs: async (page = 0, size = 10) => {
        const response = await axios.get('/applications/seeker', {
            params: { page, size },
        });
        return response.data;
    },

    // Get seeker's matches
    getSeekerMatches: async () => {
        const response = await axios.get('/matches/seeker');
        return response.data;
    },

    // Get company's matches
    getCompanyMatches: async () => {
        const response = await axios.get('/matches/company');
        return response.data;
    },
};

export default swipeApi;
