import applicantProfileApi from "../api/applicantProfileConfig";

export const applicantProfileService = {
  // Get current applicant profile
  getProfile: async () => {
    return applicantProfileApi.get("/profile");
  },

  // Update applicant profile (partial updates)
  updateProfile: async (profileData) => {
    return applicantProfileApi.patch("/profile", profileData);
  },

  // Upload resume (replaces existing)
  uploadResume: async (file) => {
    const formData = new FormData();
    formData.append("resume", file);

    return axios
      .put(`${API_BASE_URL}/resume`, formData, {
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

  // Get resume info
  getResume: async () => {
    return applicantProfileApi.get("/resume");
  },
};

export default applicantProfileService;
