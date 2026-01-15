import api from "../api/axiosConfig";

export const jobService = {
  // Create a new job posting
  createJob: async (jobData) => {
    return api.post("/jobs", jobData);
  },

  // Save job as draft
  saveDraft: async (jobData) => {
    return api.post("/jobs/draft", jobData);
  },

  // Update existing job
  updateJob: async (jobId, jobData) => {
    return api.put(`/jobs/${jobId}`, jobData);
  },

  // Get job by ID
  getJobById: async (jobId) => {
    return api.get(`/jobs/${jobId}`);
  },

  // Get all jobs for employer
  getEmployerJobs: async (params = {}) => {
    return api.get("/jobs/employer", { params });
  },

  // Delete job
  deleteJob: async (jobId) => {
    return api.delete(`/jobs/${jobId}`);
  },

  // Publish draft
  publishDraft: async (jobId) => {
    return api.patch(`/jobs/${jobId}/publish`);
  },

  // Close job posting
  closeJob: async (jobId) => {
    return api.patch(`/jobs/${jobId}/close`);
  },
};

export default jobService;
