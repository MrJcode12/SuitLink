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

// // Placeholder Dashboard component
// const DashboardPlaceholder = () => {
//   React.useEffect(() => {
//     console.log("Dashboard page - Coming soon!");
//   }, []);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-background">
//       <div className="text-center">
//         <h1 className="text-4xl font-bold text-foreground mb-4">
//           Dashboard Coming Soon
//         </h1>
//         <p className="text-muted-foreground mb-8">
//           This page is under construction
//         </p>
//         <button
//           onClick={() => (window.location.href = "/login")}
//           className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
//         >
//           Back to Login
//         </button>
//       </div>
//     </div>
//   );
// };

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

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
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
        {/* Dashboard - Placeholder */}
        {/* Employer's Dashboard */}
        <Route path="/dashboard" element={<EmployerDashboardPage />} />
        <Route path="/employer/post-job" element={<PostJobPage />} />
        <Route path="/employer-profile" element={<EmployerProfile />} />

        {/* Default redirect */}
        <Route path="/" element={<LandingPage />} />

        {/* 404 - Catch all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
