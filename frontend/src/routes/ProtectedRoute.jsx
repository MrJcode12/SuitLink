import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const ProtectedRoute = ({
  children,
  requireEmployer = false,
  requireApplicant = false,
}) => {
  const { user, loading, isEmployer, isApplicant } = useAuth();

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

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireEmployer && !isEmployer) {
    return <Navigate to="/applicant-dashboard" replace />;
  }

  if (requireApplicant && !isApplicant) {
    return <Navigate to="/employer-dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
