import { createContext, useContext, useState, useEffect } from "react";
import applicantProfileService from "../services/applicantProfileService";

const ApplicantProfileContext = createContext();

export const ApplicantProfileProvider = ({ children, user }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    // Only fetch if user exists and is an applicant
    if (!user || user.role !== 'applicant') {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const profileResponse = await applicantProfileService.getProfile();

      if (profileResponse.success) {
        setProfile(profileResponse.data);
      }
    } catch (err) {
      console.error("Error fetching applicant profile:", err);
      setError(err.message);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    await fetchProfile();
  };

  const clearProfile = () => {
    setProfile(null);
    setError(null);
    setLoading(false);
  };

  // Initial fetch when user changes
  useEffect(() => {
    fetchProfile();
  }, [user?._id, user?.role]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setProfile(null);
    };
  }, []);

  return (
    <ApplicantProfileContext.Provider
      value={{
        profile,
        loading,
        error,
        refreshProfile,
        clearProfile,
      }}
    >
      {children}
    </ApplicantProfileContext.Provider>
  );
};

export const useApplicantProfile = () => {
  const context = useContext(ApplicantProfileContext);
  if (!context) {
    throw new Error("useApplicantProfile must be used within ApplicantProfileProvider");
  }
  return context;
};

export default useApplicantProfile;
