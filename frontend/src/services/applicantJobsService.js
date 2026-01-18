import jobsApi from "../api/jobsAxiosConfig";

const jobsApiService = {
  // GET /api/v1/jobs - Browse all jobs (applicant read-only)
  getJobs: async (params = {}) => {
    const {
      page = 1,
      limit = 10,
      search = "",
      employmentType = "",
      remote = "",
      salaryMin = "",
      salaryMax = "",
    } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (search) queryParams.append("search", search);
    if (employmentType) queryParams.append("employmentType", employmentType);
    if (remote !== "") queryParams.append("remote", remote);
    if (salaryMin) queryParams.append("salaryMin", salaryMin);
    if (salaryMax) queryParams.append("salaryMax", salaryMax);

    return jobsApi.get(`?${queryParams.toString()}`);
  },

  // GET /api/v1/jobs/:jobId - Get single job details
  getJobById: async (jobId) => {
    return jobsApi.get(`/${jobId}`);
  },

  // GET /api/v1/jobs/applied - Get jobs the applicant has applied to
  getAppliedJobs: async (params = {}) => {
    const { page = 1, limit = 10 } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    return jobsApi.get(`/applied?${queryParams.toString()}`);
  },
};

export default jobsApiService;
