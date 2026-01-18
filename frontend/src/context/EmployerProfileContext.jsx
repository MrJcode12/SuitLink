import { createContext, useContext, useState, useEffect } from "react";
import companyService from "../services/companyService";

const EmployerProfileContext = createContext();

export const EmployerProfileProvider = ({ children, user }) => {
  const [companyProfile, setCompanyProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCompanyProfile = async () => {
    // Only fetch if user exists and is an employer
    if (!user || user.role !== 'employer') {
      setCompanyProfile(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await companyService.getProfile();

      if (response.success) {
        setCompanyProfile(response.data);
      }
    } catch (err) {
      console.error("Error fetching company profile:", err);
      setError(err.message);
      setCompanyProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    await fetchCompanyProfile();
  };

  const clearProfile = () => {
    setCompanyProfile(null);
    setError(null);
    setLoading(false);
  };

  // Initial fetch when user changes
  useEffect(() => {
    fetchCompanyProfile();
  }, [user?._id, user?.role]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setCompanyProfile(null);
    };
  }, []);

  return (
    <EmployerProfileContext.Provider
      value={{
        companyProfile,
        loading,
        error,
        refreshProfile,
        clearProfile,
      }}
    >
      {children}
    </EmployerProfileContext.Provider>
  );
};

export const useEmployerProfile = () => {
  const context = useContext(EmployerProfileContext);
  if (!context) {
    throw new Error("useEmployerProfile must be used within EmployerProfileProvider");
  }
  return context;
};

export default useEmployerProfile;
