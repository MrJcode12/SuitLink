import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import SignUpPage from "./pages/auth/SignUpPage";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";
import VerifyEmailSuccessPage from "./pages/auth/VerifyEmailSuccessPage";
import ForgotPassPage from "./pages/auth/ForgotPassPage";
import ForgotPassSuccessPage from "./pages/auth/ForgotPassSuccessPage";

const App = () => {
  return (
    <>
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
          <Route
            path="/forgot-password-success"
            element={<ForgotPassSuccessPage />}
          />

          {/* Default redirect, will be replaced by the Landing page. */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* 404 - Catch all, will be replaced by 404 handler */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
