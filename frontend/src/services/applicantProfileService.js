import applicantProfileApi from "../api/applicantProfileConfig";

const applicantProfileService = {
  // Get current applicant profile
  getProfile: async () => {
    return applicantProfileApi.get("/profile");
  },

  // Create applicant profile (initial setup)
  createProfile: async (profileData) => {
    return applicantProfileApi.post("/profile", profileData);
  },

  // Update applicant profile (partial updates)
  updateProfile: async (profileData) => {
    return applicantProfileApi.patch("/profile", profileData);
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

  // Upload resume (POST to /resume endpoint)
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

  // Delete resume
  deleteResume: async (resumeId) => {
    return applicantProfileApi.delete(`/resume/${resumeId}`);
  },

  // Education endpoints
  addEducation: async (educationData) => {
    return applicantProfileApi.post("/education", educationData);
  },

  updateEducation: async (educationId, educationData) => {
    return applicantProfileApi.patch(
      `/education/${educationId}`,
      educationData
    );
  },

  deleteEducation: async (educationId) => {
    return applicantProfileApi.delete(`/education/${educationId}`);
  },

  // Experience endpoints
  addExperience: async (experienceData) => {
    return applicantProfileApi.post("/experience", experienceData);
  },

  updateExperience: async (experienceId, experienceData) => {
    return applicantProfileApi.patch(
      `/experience/${experienceId}`,
      experienceData
    );
  },

  deleteExperience: async (experienceId) => {
    return applicantProfileApi.delete(`/experience/${experienceId}`);
  },
};

export default applicantProfileService;
