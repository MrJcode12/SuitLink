import api from "../api/axiosConfig.js";

export const authService = {
  // Register new account
  register: async (name, email, password) => {
    return api.post("/auth/register", { name, email, password });
  },

  // Verify email with code
  verifyEmail: async (email, code) => {
    return api.post("/auth/verify-email", { email, code });
  },

  // Resend verification code
  resendVerification: async (email) => {
    return api.post("/auth/resend-verification", { email });
  },

  // Login
  login: async (email, password) => {
    return api.post("/auth/login", { email, password });
  },

  // Logout
  logout: async () => {
    return api.post("/auth/logout", {});
  },

  // Forgot password - send reset code
  forgotPassword: async (email) => {
    return api.post("/auth/forgot-password", { email });
  },

  // Reset password with code
  resetPassword: async (email, code, newPassword) => {
    return api.post("/auth/reset-password", { email, code, newPassword });
  },

  // Resend password reset code
  resendResetPassword: async (email) => {
    return api.post("/auth/resend-reset-password", { email });
  },
};

export default authService;
