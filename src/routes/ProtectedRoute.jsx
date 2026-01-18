import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const ProtectedRoute = ({
  children,
  requireEmployer = false,
  requireApplicant = false,
}) => {
  const { user, loading, isEmployer, isApplicant } = useAuth();

  // Wait for auth resolution
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-chart-1 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ✅ FIX: Proper role-based redirects
  if (requireEmployer && !isEmployer) {
    // If user is applicant, send to applicant dashboard
    // Otherwise, send to login (shouldn't happen, but safety)
    return (
      <Navigate to={isApplicant ? "/applicant-dashboard" : "/login"} replace />
    );
  }

  if (requireApplicant && !isApplicant) {
    // If user is employer, send to employer dashboard
    // Otherwise, send to login (shouldn't happen, but safety)
    return (
      <Navigate to={isEmployer ? "/employer-dashboard" : "/login"} replace />
    );
  }

  return children;
};

export default ProtectedRoute;
