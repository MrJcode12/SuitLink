import AuthService from "../services/auth.service.js";
import {
  sendForgotPasswordCode,
  sendVerificationEmail,
} from "../services/mail.service.js";

/*
  ENDPOINTS:
  POST /register
  POST /verify-email
  POST /resend-verification
  POST /login
  POST /logout
  POST /forgot-password
  POST /reset-password
  POST /resend-reset-password
  GET  /me
  PATCH /update-email
*/

// POST /register
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const { code } = await AuthService.register(name, email, password, role);
    await sendVerificationEmail(email, code);

    const responseObj = {
      success: true,
      message: "Registration successful. Please verify your email.",
    };

    res.status(201).json(responseObj);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// POST /verify-email
const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    const { token } = await AuthService.verifyEmail(email, code);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    const responseObj = {
      success: true,
      message: "Email verified successfully. You are now logged in.",
    };

    res.status(200).json(responseObj);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// POST /resend-verification
const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    const { code } = await AuthService.resendVerification(email);
    await sendVerificationEmail(email, code);

    const responseObj = {
      success: true,
      message: "Verification code has been resent. Please check your email.",
    };

    res.status(200).json(responseObj);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// POST /login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { token } = await AuthService.login(email, password);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    const responseObj = {
      success: true,
      message: "Logged in successfully!",
    };

    res.status(200).json(responseObj);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// POST /logout
const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  const responseObj = {
    success: true,
    message: "Logged out successfully!",
  };

  res.status(200).json(responseObj);
};

// POST /forgot-password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const { code } = await AuthService.forgotPassword(email);
    await sendForgotPasswordCode(email, code);

    const responseObj = {
      success: true,
      message: "Password reset code sent to your email.",
    };

    res.status(200).json(responseObj);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// POST /reset-password
const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    await AuthService.resetPassword(email, code, newPassword);

    const responseObj = {
      success: true,
      message: "Password reset successfully.",
    };

    res.status(200).json(responseObj);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// POST /resend-reset-password
const resendResetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const { code } = await AuthService.resendResetPasswordCode(email);
    await sendForgotPasswordCode(email, code);

    const responseObj = {
      success: true,
      message: "Password reset code resent. Please check your email.",
    };

    res.status(200).json(responseObj);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// GET /me
const getCurrentUser = async (req, res) => {
  try {
    const user = req.user;

    const responseObj = {
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        accStatus: user.accStatus,
        isEmailVerified: user.isEmailVerified,
      },
    };

    res.status(200).json(responseObj);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
const updateEmail = async (req, res) => {
  try {
    const userId = req.user._id;
    const { email } = req.body;

    const user = await AuthService.updateEmail(userId, email);

    const responseObj = {
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        accStatus: user.accStatus,
        isEmailVerified: user.isEmailVerified,
      },
    };

    res.status(200).json(responseObj);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export {
  register,
  verifyEmail,
  resendVerification,
  login,
  logout,
  forgotPassword,
  resetPassword,
  resendResetPassword,
  getCurrentUser,
  updateEmail,
};
