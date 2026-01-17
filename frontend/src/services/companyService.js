import axios from "axios";

const API_BASE_URL = "http://localhost:8888/api/v1/company";

// Create axios instance with credentials
const companyApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor
companyApi.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || "An error occurred";
    throw new Error(message);
  }
);

export const companyService = {
  // Get company profile
  getProfile: async () => {
    return companyApi.get("/profile");
  },

  // Create company profile
  createProfile: async (profileData) => {
    return companyApi.post("/profile", profileData);
  },

  // Update company profile
  updateProfile: async (profileData) => {
    return companyApi.patch("/profile", profileData);
  },

  // Upload company logo
  uploadLogo: async (file) => {
    const formData = new FormData();
    formData.append("logo", file);

    return axios
      .post(`${API_BASE_URL}/profile/logo`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => res.data);
  },

  // Delete company profile
  deleteProfile: async () => {
    return companyApi.delete("/profile");
  },
};

export default companyService;
