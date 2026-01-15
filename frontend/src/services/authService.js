import api from "../api/axiosConfig.js";

export const authService = {
  // Register new account
  register: async (name, email, password) => {
    return api.post("/register", { name, email, password });
  },

  // Verify email with code
  verifyEmail: async (email, code) => {
    return api.post("/verify-email", { email, code });
  },

  // Resend verification code
  resendVerification: async (email) => {
    return api.post("/resend-verification", { email });
  },

  // Login
  login: async (email, password) => {
    return api.post("/login", { email, password });
  },

  // Logout
  logout: async () => {
    return api.post("/logout", {});
  },

  // Forgot password - send reset code
  forgotPassword: async (email) => {
    return api.post("/forgot-password", { email });
  },

  // Reset password with code
  resetPassword: async (email, code, newPassword) => {
    return api.post("/reset-password", { email, code, newPassword });
  },

  // Resend password reset code
  resendResetPassword: async (email) => {
    return api.post("/resend-reset-password", { email });
  },
};

export default authService;
