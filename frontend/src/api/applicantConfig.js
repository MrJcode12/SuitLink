import axios from "axios";

const API_BASE_URL = "http://localhost:8888/api/v1/applicant";

const applicantApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor
applicantApi.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || "An error occurred";
    throw new Error(message);
  }
);

export default applicantApi;
