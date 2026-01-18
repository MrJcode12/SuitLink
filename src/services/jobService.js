import axios from "axios";

const API_BASE_URL = "http://localhost:8888/api/v1/jobs";

// Create axios instance with credentials
const jobApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor
jobApi.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || "An error occurred";
    throw new Error(message);
  }
);

export const jobService = {
  // Create a new job posting
  createJob: async (jobData) => {
    return jobApi.post("/", jobData);
  },

  // Get all jobs (public)
  getJobs: async (params = {}) => {
    return jobApi.get("/", { params });
  },

  // Get job by ID
  getJobById: async (jobId) => {
    return jobApi.get(`/${jobId}`);
  },

  // Get employer's own jobs
  getMyJobs: async () => {
    return jobApi.get("/my-jobs");
  },

  // Update job
  updateJob: async (jobId, jobData) => {
    return jobApi.patch(`/${jobId}`, jobData);
  },

  // Close job posting
  closeJob: async (jobId) => {
    return jobApi.patch(`/${jobId}/close`);
  },

  // Reopen job posting
  reopenJob: async (jobId) => {
    return jobApi.patch(`/${jobId}/open`);
  },
};

export default jobService;
