import { createContext, useContext, useState, useEffect } from "react";
import applicantProfileService from "../services/applicantProfileService";
import { authService } from "../services/authService";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch both user and profile data
      const [userResponse, profileResponse] = await Promise.all([
        authService.getCurrentUser(),
        applicantProfileService.getProfile(),
      ]);

      if (userResponse.success) {
        setUser(userResponse.data);
      }

      if (profileResponse.success) {
        setProfile(profileResponse.data);
      }
    } catch (err) {
      console.error("Error fetching profile data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    await fetchProfile();
  };

  const clearProfile = () => {
    setProfile(null);
    setUser(null);
    setError(null);
    setLoading(false);
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clear profile data when component unmounts
      setProfile(null);
      setUser(null);
    };
  }, []);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        user,
        loading,
        error,
        refreshProfile,
        clearProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within ProfileProvider");
  }
  return context;
};

export default useProfile;
