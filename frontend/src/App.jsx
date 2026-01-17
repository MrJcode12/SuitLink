import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import EmployerProfile from "./pages/profiles/EmployerProfile";
import ProtectedRoute from "./routes/ProtectedRoute";
import useAuth from "./hooks/useAuth";

// 404 Not Found component
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

// ✅ ADD: Temporary Applicant Dashboard (placeholder)
const ApplicantDashboardPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Applicant Dashboard
        </h1>
        <p className="text-gray-600 mb-8">This page is under construction.</p>
        <button
          onClick={() => (window.location.href = "/login")}
          className="px-6 py-3 bg-chart-1 text-white rounded-lg hover:opacity-90"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
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

        {/* ✅ ADD: Applicant Protected Routes */}
        <Route
          path="/applicant-dashboard"
          element={
            <ProtectedRoute requireApplicant={true}>
              <ApplicantDashboardPage />
            </ProtectedRoute>
          }
        />

        {/* ✅ FIX: Smart /dashboard redirect based on role */}
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
    </BrowserRouter>
  );
};

// ✅ ADD: Smart redirect component that checks user role
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
