import applicationsApi from "../api/applicationConfig";

export const applicationsApiService = {
  getMyApplications: async (params = {}) => {
    const { page = 1, limit = 10 } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    return applicationsApi.get(`/my?${queryParams.toString()}`);
  },
};

export default applicationsApiService;
