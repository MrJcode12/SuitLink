import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useProfile } from "../context/ProfileContext";

const API_BASE_URL = "http://localhost:8888/api/v1/auth";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { clearProfile } = useProfile();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${API_BASE_URL}/me`, {
        withCredentials: true,
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      });

      if (response?.data?.success && response?.data?.data) {
        setUser(response.data.data);
      } else {
        setUser(null);
        clearProfile(); // Clear profile when no user
      }
    } catch (err) {
      console.error("Auth check failed:", err);
      setUser(null);
      clearProfile(); // Clear profile on auth failure
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
      clearProfile(); // Clear profile on logout
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
