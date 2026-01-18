import axios from "axios";

const API_BASE_URL = "http://localhost:8888/api/v1/applications";

const employerApplicationsApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor
employerApplicationsApi.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || "An error occurred";
    throw new Error(message);
  }
);

export const employerApplicationsService = {
  // Get applicants for a specific job (employer only)
  getApplicantsByJob: async (jobPostingId) => {
    return employerApplicationsApi.get(`/job/${jobPostingId}`);
  },

  // Update application status (employer only)
  updateApplicationStatus: async (applicationId, status) => {
    return employerApplicationsApi.patch(`/${applicationId}/status`, {
      status,
    });
  },
};

export default employerApplicationsService;
