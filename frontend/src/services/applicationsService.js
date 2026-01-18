import applicationsApi from "../api/applicationConfig";

// POST /api/v1/applications - Apply to a job
const applyToJob = (jobPostingId, resumeId, coverLetter = "") => {
  return applicationsApi.post("/", {
    jobPostingId,
    resumeId,
    coverLetter,
  });
};

// GET /api/v1/applications/me - Get my applications
const getMyApplications = (params = {}) => {
  const { page = 1, limit = 10 } = params;

  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  return applicationsApi.get(`/me?${queryParams.toString()}`);
};

const applicationsApiService = {
  applyToJob,
  getMyApplications,
};

export default applicationsApiService;
