import jobsApi from "../api/jobsAxiosConfig";

// GET /api/v1/jobs - Browse all jobs with search support
const getJobs = (params = {}) => {
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

  // Add search parameter for job title or company name
  if (search) queryParams.append("search", search);

  if (employmentType) queryParams.append("employmentType", employmentType);
  if (remote !== "") queryParams.append("remote", remote);
  if (salaryMin) queryParams.append("salaryMin", salaryMin);
  if (salaryMax) queryParams.append("salaryMax", salaryMax);

  return jobsApi.get(`?${queryParams.toString()}`);
};

// GET /api/v1/jobs/:jobId - Get single job details
const getJobById = (jobId) => {
  return jobsApi.get(`/${jobId}`);
};

const jobsApiService = {
  getJobs,
  getJobById,
};

export default jobsApiService;
