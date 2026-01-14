import axios from './axios';

export const jobApi = {
    // Get all jobs for seekers to swipe
    getJobsForSwipe: async (page = 0, size = 10) => {
        const response = await axios.get('/jobs/swipe', {
            params: { page, size },
        });
        return response.data;
    },

    // Get job details
    getJobById: async (jobId) => {
        const response = await axios.get(`/jobs/${jobId}`);
        return response.data;
    },

    // Company: Create a job posting
    createJob: async (jobData) => {
        const response = await axios.post('/jobs', jobData);
        return response.data;
    },

    // Company: Update a job posting
    updateJob: async (jobId, jobData) => {
        const response = await axios.put(`/jobs/${jobId}`, jobData);
        return response.data;
    },

    // Company: Delete a job posting
    deleteJob: async (jobId) => {
        const response = await axios.delete(`/jobs/${jobId}`);
        return response.data;
    },

    // Company: Get all jobs posted by company
    getCompanyJobs: async () => {
        const response = await axios.get('/jobs/company');
        return response.data;
    },

    // Company: Close a job posting
    closeJob: async (jobId) => {
        const response = await axios.put(`/jobs/${jobId}/close`);
        return response.data;
    },

    // Company: Get applicants for a job
    getJobApplicants: async (jobId, page = 0, size = 10) => {
        const response = await axios.get(`/jobs/${jobId}/applicants`, {
            params: { page, size },
        });
        return response.data;
    },
};

export default jobApi;
