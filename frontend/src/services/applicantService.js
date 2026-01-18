import applicantApi from "../api/applicantConfig";

const applicantService = {
  // Get applicant profile
  getProfile: async () => {
    return applicantApi.get("/profile");
  },

  // Create applicant profile
  createProfile: async (profileData) => {
    return applicantApi.post("/profile", profileData);
  },

  // Update applicant profile
  updateProfile: async (profileData) => {
    return applicantApi.patch("/profile", profileData);
  },

  // Upload profile avatar
  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append("avatar", file);

    return axios
      .put(`${API_BASE_URL}/profile/avatar`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => res.data);
  },

  // Education endpoints
  addEducation: async (educationData) => {
    return applicantApi.post("/education", educationData);
  },

  updateEducation: async (educationId, educationData) => {
    return applicantApi.patch(`/education/${educationId}`, educationData);
  },

  deleteEducation: async (educationId) => {
    return applicantApi.delete(`/education/${educationId}`);
  },

  // Experience endpoints
  addExperience: async (experienceData) => {
    return applicantApi.post("/experience", experienceData);
  },

  updateExperience: async (experienceId, experienceData) => {
    return applicantApi.patch(`/experience/${experienceId}`, experienceData);
  },

  deleteExperience: async (experienceId) => {
    return applicantApi.delete(`/experience/${experienceId}`);
  },

  // Resume endpoints
  uploadResume: async (file) => {
    const formData = new FormData();
    formData.append("resume", file);

    return axios
      .post(`${API_BASE_URL}/resume`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => res.data);
  },

  deleteResume: async (resumeId) => {
    return applicantApi.delete(`/resume/${resumeId}`);
  },
};

export default applicantService;
