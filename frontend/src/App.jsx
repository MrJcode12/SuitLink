import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UnifiedProfileProvider } from "./context/ProfileContext";
import LoginPage from "./pages/auth/LoginPage";
import SignUpPage from "./pages/auth/SignUpPage";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";
import VerifyEmailSuccessPage from "./pages/auth/VerifyEmailSuccessPage";
import ForgotPassPage from "./pages/auth/ForgotPassPage";
import ForgotPassSuccessPage from "./pages/auth/ForgotPassSuccessPage";
import ResetPassPage from "./pages/auth/ResetPassPage";
import LandingPage from "./pages/landingPage/LandingPage";
import EmployerDashboardPage from "./pages/dashboard/EmployerDashboardPage";
import PostJobPage from "./pages/dashboard/PostJobPage";
import JobListingsPage from "./pages/jobs/JobListingsPage";
import JobDetailsPage from "./pages/jobs/JobDetailsPage";
import EmployerProfile from "./pages/profiles/EmployerProfile";
import ApplicantProfilePage from "./pages/profiles/ApplicantProfilePage";
import ApplicationsPage from "./pages/dashboard/ApplicationsPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import useAuth from "./hooks/useAuth";
import JobSeekerDashboardPage from "./pages/dashboard/JobSeekerDashboardPage";
import EmployerApplicantsPage from "./pages/dashboard/EmployerApplicantsPage";
import JobApplicantsPage from "./pages/dashboard/JobApplicantsPage";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">Page not found</p>
        <button
          onClick={() => (window.location.href = "/login")}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <UnifiedProfileProvider>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route
            path="/verify-email-success"
            element={<VerifyEmailSuccessPage />}
          />
          <Route path="/forgot-password" element={<ForgotPassPage />} />
          <Route path="/reset-password" element={<ResetPassPage />} />
          <Route
            path="/forgot-password-success"
            element={<ForgotPassSuccessPage />}
          />

          {/* Job Browsing - Protected */}
          <Route
            path="/jobs"
            element={
              <ProtectedRoute>
                <JobListingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs/:jobId"
            element={
              <ProtectedRoute>
                <JobDetailsPage />
              </ProtectedRoute>
            }
          />
          {/* Employer Protected Routes */}
          <Route
            path="/employer-dashboard"
            element={
              <ProtectedRoute requireEmployer={true}>
                <EmployerDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/post-job"
            element={
              <ProtectedRoute requireEmployer={true}>
                <PostJobPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer-profile"
            element={
              <ProtectedRoute requireEmployer={true}>
                <EmployerProfile />
              </ProtectedRoute>
            }
          />
          <Route
  path="/employer/my-jobs"
  element={
    <ProtectedRoute requireEmployer>
      <EmployerDashboardPage />
    </ProtectedRoute>
  }
/>

          {/* Applicant Protected Routes */}
          <Route
            path="/applicant-dashboard"
            element={
              <ProtectedRoute requireApplicant={true}>
                <JobSeekerDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/applications"
            element={
              <ProtectedRoute requireApplicant={true}>
                <ApplicationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/applicant-profile"
            element={
              <ProtectedRoute requireApplicant={true}>
                <ApplicantProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
  path="/employer/applicants"
  element={
    <ProtectedRoute requireEmployer={true}>
      <EmployerApplicantsPage />
    </ProtectedRoute>
  }
/>
<Route
  path="/employer/jobs/:jobId/applicants"
  element={
    <ProtectedRoute requireEmployer={true}>
      <JobApplicantsPage />
    </ProtectedRoute>
  }
/>

          {/* Smart /dashboard redirect based on role */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <SmartDashboardRedirect />
              </ProtectedRoute>
            }
          />

          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* 404 - Catch all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </UnifiedProfileProvider>
    </BrowserRouter>
  );
};

const SmartDashboardRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-chart-1"></div>
      </div>
    );
  }

  if (user?.role === "employer") {
    return <Navigate to="/employer-dashboard" replace />;
  }

  if (user?.role === "applicant") {
    return <Navigate to="/applicant-dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
};

export default App;
