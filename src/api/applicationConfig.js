import axios from "axios";

const API_BASE_URL = "http://localhost:8888/api/v1/applications";

// Configure axios defaults
axios.defaults.withCredentials = true;

const applicationsApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

applicationsApi.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Improved error handling
    const message =
      error.response?.data?.message || error.message || "An error occurred";
    console.error("Applications API Error:", message);
    throw new Error(message);
  }
);

export default applicationsApi;
