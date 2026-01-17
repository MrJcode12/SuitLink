import axios from "axios";

const API_BASE_URL = "http://localhost:8888/api/v1/company";

const employerProfileApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

employerProfileApi.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Extract error message
    const message = error.response?.data?.message || "An error occurred";
    const errors = error.response?.data?.errors;

    // For validation errors, return structured error
    if (errors) {
      const validationError = new Error(message);
      validationError.validationErrors = errors;
      throw validationError;
    }

    throw new Error(message);
  }
);

export default employerProfileApi;
