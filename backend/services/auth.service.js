import User from "../models/User.js";
import generateToken from "./token.service.js";
import verificationCode from "../utils/verification.utils.js";

class AuthService {
  // Registration
  static async register(name, email, password, role) {
    const exists = await User.findOne({ email });

    if (exists) {
      throw new Error("Email already exists!");
    }

    if (!role || !["applicant", "employer"].includes(role)) {
      throw new Error("Valid role is required");
    }

    const { code, expiryTime } = verificationCode();

    const userReg = {
      name,
      email,
      passwordHash: password,
      role,
      isEmailVerified: false,
      emailVerificationCode: code,
      emailVerificationExpires: expiryTime,
    };

    const user = await User.create(userReg);

    return { userId: user._id, email: user.email, code };
  }

  // Email verification
  static async verifyEmail(email, code) {
    const user = await User.findOne({ email }).select("+emailVerificationCode");

    if (!user) {
      throw new Error("User not found!");
    }

    if (user.isEmailVerified) {
      throw new Error("Email already verified!");
    }

    if (!user.emailVerificationCode || user.emailVerificationCode !== code) {
      throw new Error("Invalid verification code!");
    }

    if (user.emailVerificationExpires < Date.now()) {
      throw new Error("Verification code expired!");
    }

    user.isEmailVerified = true;
    user.emailVerifiedAt = new Date();
    user.emailVerificationCode = undefined;
    user.emailVerificationExpires = undefined;
    user.emailVerificationAttempts = 0;
    await user.save();

    const token = generateToken(user._id);
    return { user, token };
  }

  // Resend Verification Code
  static async resendVerification(email) {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User not found!");
    }

    if (user.isEmailVerified) {
      throw new Error("Email already verified!");
    }

    if (
      user.emailVerificationExpires &&
      user.emailVerificationExpires < Date.now()
    ) {
      user.emailVerificationAttempts = 0;
    }

    if (user.emailVerificationAttempts >= 3) {
      throw new Error("Too many requests. Please wait for the code to expire.");
    }

    const { code, expiryTime } = verificationCode();

    user.emailVerificationCode = code;
    user.emailVerificationExpires = expiryTime;
    user.emailVerificationAttempts += 1;
    await user.save();

    return { email: user.email, code };
  }

  // Logging In
  static async login(email, password) {
    const user = await User.findOne({ email }).select("+passwordHash");

    if (!user) {
      throw new Error("User not found!");
    }

    if (user.accStatus !== "active") {
      throw new Error("Account not active!");
    }

    if (!user.isEmailVerified) {
      throw new Error("Please verify your email first!");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error("Invalid password!");
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = generateToken(user._id);
    return { user, token };
  }

  // Code for Forgot Password
  static async forgotPassword(email) {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User not found!");
    }

    if (user.forgotPasswordExpires && user.forgotPasswordExpires < Date.now()) {
      user.forgotPasswordAttempts = 0;
    }

    if (user.forgotPasswordAttempts >= 3) {
      throw new Error(
        "Too many requests. Please wait before requesting another reset code."
      );
    }

    const { code, expiryTime } = verificationCode();

    user.forgotPasswordCode = code;
    user.forgotPasswordExpires = expiryTime;
    user.forgotPasswordAttempts += 1;

    await user.save();

    return { email: user.email, code };
  }

  // Reset Password
  static async resetPassword(email, codeFromUser, newPassword) {
    const user = await User.findOne({ email }).select("+passwordHash");

    if (!user) {
      throw new Error("User not found!");
    }

    if (!user.forgotPasswordCode) {
      throw new Error("Reset password code does not exist!");
    }

    if (user.forgotPasswordCode !== codeFromUser) {
      throw new Error("Invalid reset code!");
    }

    if (user.forgotPasswordExpires < Date.now()) {
      throw new Error("Reset code has expired!");
    }

    user.passwordHash = newPassword;

    user.forgotPasswordCode = undefined;
    user.forgotPasswordExpires = undefined;
    user.forgotPasswordAttempts = 0;

    await user.save();

    return {
      email: user.email,
      message: "Password reset successfully!",
    };
  }

  // Resend Reset Password Code
  static async resendResetPasswordCode(email) {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User not found!");
    }

    if (user.forgotPasswordExpires && user.forgotPasswordExpires < Date.now()) {
      user.forgotPasswordAttempts = 0;
    }

    if (user.forgotPasswordAttempts >= 3) {
      throw new Error(
        "Too many requests. Please wait for the reset code to expire."
      );
    }

    const { code, expiryTime } = verificationCode();

    user.forgotPasswordCode = code;
    user.forgotPasswordExpires = expiryTime;
    user.forgotPasswordAttempts += 1;

    await user.save();

    return {
      email: user.email,
      code,
    };
  }
}

export default AuthService;
