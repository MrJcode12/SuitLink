import { createContext, useContext } from "react";
import { ApplicantProfileProvider, useApplicantProfile } from "./ApplicantProfileContext";
import { EmployerProfileProvider, useEmployerProfile } from "./EmployerProfileContext";
import useAuth from "../hooks/useAuth";

const UnifiedProfileContext = createContext();

/**
 * UnifiedProfileProvider - Smart role-based profile provider
 *
 * Automatically provides the correct profile context based on user role:
 * - Applicants get ApplicantProfileContext
 * - Employers get EmployerProfileContext
 */
export const UnifiedProfileProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();

  // Wait for auth to resolve before mounting role-specific providers
  if (authLoading) {
    return (
      <UnifiedProfileContext.Provider value={{ loading: true }}>
        {children}
      </UnifiedProfileContext.Provider>
    );
  }

  // No user = no profile to fetch
  if (!user) {
    return (
      <UnifiedProfileContext.Provider value={{ loading: false }}>
        {children}
      </UnifiedProfileContext.Provider>
    );
  }

  // Mount role-specific provider
  if (user.role === 'applicant') {
    return (
      <ApplicantProfileProvider user={user}>
        {children}
      </ApplicantProfileProvider>
    );
  }

  if (user.role === 'employer') {
    return (
      <EmployerProfileProvider user={user}>
        {children}
      </EmployerProfileProvider>
    );
  }

  // Fallback for unknown roles
  return (
    <UnifiedProfileContext.Provider value={{ loading: false }}>
      {children}
    </UnifiedProfileContext.Provider>
  );
};

/**
 * useProfile - Smart hook that returns the correct profile based on role
 *
 * For applicants: returns { profile, loading, error, refreshProfile, clearProfile }
 * For employers: returns { companyProfile, loading, error, refreshProfile, clearProfile }
 *
 * Usage in components:
 * const { profile } = useProfile(); // for applicants
 * const { companyProfile } = useProfile(); // for employers
 */
export const useProfile = () => {
  const { user } = useAuth();

  // Try applicant context first
  let applicantContext;
  try {
    applicantContext = useApplicantProfile();
  } catch (e) {
    // Not in applicant provider, that's ok
  }

  // Try employer context
  let employerContext;
  try {
    employerContext = useEmployerProfile();
  } catch (e) {
    // Not in employer provider, that's ok
  }

  // Return the active context
  if (user?.role === 'applicant' && applicantContext) {
    return {
      ...applicantContext,
      user,
    };
  }

  if (user?.role === 'employer' && employerContext) {
    return {
      ...employerContext,
      user,
    };
  }

  // Fallback for when no profile context is active
  return {
    profile: null,
    companyProfile: null,
    loading: false,
    error: null,
    user,
    refreshProfile: async () => {},
    clearProfile: () => {},
  };
};

export default useProfile;
