import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Briefcase, ArrowLeft, CheckCircle } from "lucide-react";
import { authService } from "../../services/authService";

const ResetPassPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const code = location.state?.code;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if no email or code provided
  useEffect(() => {
    if (!email || !code) {
      navigate("/forgot-password");
    }
  }, [email, code, navigate]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password length
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    // Debug: Log what we're sending
    console.log("Resetting password with:", {
      email,
      code,
      newPassword: "***hidden***",
    });

    setLoading(true);

    try {
      // Backend validates the code and resets password
      const response = await authService.resetPassword(
        email,
        code,
        newPassword
      );
      console.log("Reset password response:", response);

      // Success - redirect to success page
      navigate("/forgot-password-success", { state: { email } });
    } catch (err) {
      console.error("Reset password error:", err);

      // Check if error is related to invalid/expired code
      const errorMsg = err.message.toLowerCase();
      if (
        errorMsg.includes("does not exist") ||
        errorMsg.includes("invalid") ||
        errorMsg.includes("expired") ||
        errorMsg.includes("code")
      ) {
        // Code is invalid/expired - redirect back to forgot password to get new code
        alert(
          "Your reset code has expired or is invalid. Please request a new code."
        );
        navigate("/forgot-password");
      } else {
        // Other errors (like weak password, etc.)
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Don't render if redirecting
  if (!email || !code) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 min-h-screen lg:min-h-0">
        <div className="w-full max-w-md">
          {/* Logo */}
          <button
            onClick={() => navigate("/login")}
            className="inline-flex items-center gap-2 mb-8 text-foreground hover:opacity-80 transition-opacity"
          >
            <Briefcase className="w-5 h-5" style={{ color: "#047857" }} />
            <span className="text-base font-normal">SuitLink</span>
          </button>

          {/* Header */}
          <div className="mb-6">
            <button
              type="button"
              onClick={() => navigate("/forgot-password", { state: { email } })}
              className="group inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground hover:underline mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back
            </button>
            <h1 className="text-2xl mb-2 font-normal text-foreground">
              Create new password
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter a new password for{" "}
              <span className="text-foreground font-medium">{email}</span>
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Reset Password Form */}
          <form className="space-y-4" onSubmit={handleResetPassword}>
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm mb-1.5 text-foreground font-normal"
              >
                New password
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm text-foreground placeholder:text-muted-foreground transition-shadow bg-input-background"
                autoComplete="new-password"
                required
                disabled={loading}
                minLength={8}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Must be at least 8 characters
              </p>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm mb-1.5 text-foreground font-normal"
              >
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm text-foreground placeholder:text-muted-foreground transition-shadow bg-input-background"
                autoComplete="new-password"
                required
                disabled={loading}
                minLength={8}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white py-2.5 rounded-lg hover:opacity-90 transition-opacity text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#047857" }}
            >
              {loading ? "Resetting password..." : "Reset password"}
            </button>
          </form>

          {/* Security Info */}
          <div
            className="mt-6 p-4 rounded-lg border border-border"
            style={{ backgroundColor: "#f9fafb" }}
          >
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground font-medium">
                Security tip:
              </strong>{" "}
              Choose a strong password with a mix of letters, numbers, and
              special characters.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Marketing Content */}
      <div
        className="hidden lg:flex w-full lg:w-1/2 p-8 lg:p-12 items-center justify-center relative overflow-hidden min-h-[500px] lg:min-h-screen"
        style={{ backgroundColor: "#065f46" }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')`,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(6, 95, 70, 0.9) 0%, rgba(4, 47, 46, 0.95) 100%)",
          }}
        />

        <div className="relative z-10 max-w-md">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
            <h3 className="text-2xl text-white mb-4 font-medium">
              Reset your password securely
            </h3>
            <p className="text-white/80 mb-6 leading-relaxed">
              We use industry-standard verification to ensure only you can reset
              your password and access your account.
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-white font-medium mb-1">
                    Two-factor verification
                  </div>
                  <div className="text-white/80 text-sm">
                    Email code ensures account ownership
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-white font-medium mb-1">
                    Time-limited codes
                  </div>
                  <div className="text-white/80 text-sm">
                    Codes expire for added security
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-white font-medium mb-1">
                    Encrypted password storage
                  </div>
                  <div className="text-white/80 text-sm">
                    Your password is securely hashed
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassPage;
