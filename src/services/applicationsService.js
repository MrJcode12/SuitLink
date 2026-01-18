import applicationsApi from "../api/applicationConfig";

const getMyApplications = async (params = {}) => {
  try {
    const { page = 1, limit = 10 } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await applicationsApi.get(`/me?${queryParams.toString()}`);
    return response;
  } catch (error) {
    console.error("Error in getMyApplications:", error);
    throw error;
  }
};

// POST /api/v1/applications - Apply to a job (APPLICANT)
const applyToJob = async (jobPostingId, resumeId, coverLetter = "") => {
  try {
    const response = await applicationsApi.post("/", {
      jobPostingId,
      resumeId,
      coverLetter,
    });
    return response;
  } catch (error) {
    console.error("Error in applyToJob:", error);
    throw error;
  }
};

// GET /api/v1/applications/job/:jobPostingId - Get applicants for a job (EMPLOYER)
const getJobApplicants = async (jobPostingId, params = {}) => {
  try {
    const { page = 1, limit = 10, status = "" } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (status) queryParams.append("status", status);

    const response = await applicationsApi.get(
      `/job/${jobPostingId}?${queryParams.toString()}`
    );
    return response;
  } catch (error) {
    console.error("Error in getJobApplicants:", error);
    throw error;
  }
};

// PATCH /api/v1/applications/:applicationId/status - Update application status (EMPLOYER)
const updateApplicationStatus = async (applicationId, status) => {
  try {
    const response = await applicationsApi.patch(`/${applicationId}/status`, {
      status,
    });
    return response; // Returns { success, data: application }
  } catch (error) {
    console.error("Error in updateApplicationStatus:", error);
    throw error;
  }
};

const applicationsApiService = {
  getMyApplications,
  applyToJob,
  getJobApplicants,
  updateApplicationStatus,
};

export default applicationsApiService;
