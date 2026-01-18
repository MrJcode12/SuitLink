import React, { createContext, useContext, useState, useEffect } from "react";
import applicantProfileService from "../services/applicantProfileService";

const ProfileContext = createContext(null);

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await applicantProfileService.getProfile();
      if (response.success && response.data) {
        setProfile(response.data);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = () => {
    fetchProfile();
  };

  useEffect(() => {
    // Only fetch if user is authenticated - check this in your auth context
    fetchProfile();
  }, []);

  return (
    <ProfileContext.Provider
      value={{ profile, loading, refreshProfile, setProfile }}
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

export default ProfileContext;
