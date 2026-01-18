import axios from "axios";

const API_BASE_URL = "http://localhost:8888/api/v1/applicant";

const applicantProfileService = {
  // Get current applicant profile
  getProfile: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/profile`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch profile";
      throw new Error(message);
    }
  },

  // Create applicant profile (initial setup)
  createProfile: async (profileData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/profile`,
        profileData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to create profile";
      throw new Error(message);
    }
  },

  // Update applicant profile (partial updates)
  updateProfile: async (profileData) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/profile`,
        profileData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update profile";
      throw new Error(message);
    }
  },

  // Upload profile avatar
  uploadAvatar: async (file) => {
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await axios.put(
        `${API_BASE_URL}/profile/avatar`,
        formData,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to upload avatar";
      throw new Error(message);
    }
  },

  // Upload resume (POST to /resume endpoint)
  uploadResume: async (file) => {
    try {
      const formData = new FormData();
      formData.append("resume", file);

      const response = await axios.post(`${API_BASE_URL}/resume`, formData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to upload resume";
      throw new Error(message);
    }
  },

  // Delete resume
  deleteResume: async (resumeId) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/resume/${resumeId}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to delete resume";
      throw new Error(message);
    }
  },

  // Education endpoints
  addEducation: async (educationData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/education`,
        educationData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to add education";
      throw new Error(message);
    }
  },

  updateEducation: async (educationId, educationData) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/education/${educationId}`,
        educationData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update education";
      throw new Error(message);
    }
  },

  deleteEducation: async (educationId) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/education/${educationId}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to delete education";
      throw new Error(message);
    }
  },

  // Experience endpoints
  addExperience: async (experienceData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/experience`,
        experienceData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to add experience";
      throw new Error(message);
    }
  },

  updateExperience: async (experienceId, experienceData) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/experience/${experienceId}`,
        experienceData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update experience";
      throw new Error(message);
    }
  },

  deleteExperience: async (experienceId) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/experience/${experienceId}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to delete experience";
      throw new Error(message);
    }
  },
};

export default applicantProfileService;
