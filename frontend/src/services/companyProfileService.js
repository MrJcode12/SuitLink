import companyProfileAxiosConfig from "../api/companyProfileAxiosConfig.js";

export const companyProfileService = {
  // Check if company profile exists
  getProfile: async () => {
    return companyApi.get("/profile");
  },

  // Create company profile
  createProfile: async (profileData) => {
    return companyApi.post("/profile", profileData);
  },

  // Update company profile
  updateProfile: async (updates) => {
    return companyApi.patch("/profile", updates);
  },

  // Upload company logo
  uploadLogo: async (file) => {
    const formData = new FormData();
    formData.append("logo", file);

    return companyApi.put("/profile/logo", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Delete company profile
  deleteProfile: async () => {
    return companyApi.delete("/profile");
  },
};

export default companyProfileService;
