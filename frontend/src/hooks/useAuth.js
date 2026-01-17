import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "http://localhost:8888/api/v1/auth";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/me`, {
        withCredentials: true,
      });

      if (response.data.success) {
        setUser(response.data.data);
      }
    } catch (err) {
      console.error("Auth check failed:", err);
      setUser(null);
      // Don't redirect here - let individual pages handle it
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    isEmployer: user?.role === "employer",
    isApplicant: user?.role === "applicant",
    checkAuth,
    logout,
  };
};

export default useAuth;
