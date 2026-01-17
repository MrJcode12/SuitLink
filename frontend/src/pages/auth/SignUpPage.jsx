import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, Eye, EyeOff, CheckCircle } from "lucide-react";
import { authService } from "../../services/authService";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "jobseeker",
    agreedToTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate terms agreement
    if (!formData.agreedToTerms) {
      setError("Please agree to the Terms of Service and Privacy Policy");
      return;
    }

    setLoading(true);

    try {
      await authService.register(
        formData.fullName,
        formData.email,
        formData.password
      );

      // Registration successful
      navigate("/verify-email", {
        state: { email: formData.email },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background">
      {/* Left Side - Sign Up Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 min-h-screen lg:min-h-0">
        <div className="w-full max-w-md">
          {/* Logo */}
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 mb-8 text-foreground hover:opacity-80 transition-opacity"
          >
            <Briefcase className="w-5 h-5" style={{ color: "#047857" }} />
            <span className="text-base font-normal">SuitLink</span>
          </button>

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-normal mb-2 text-foreground">
              Create account
            </h1>
            <p className="text-sm text-muted-foreground font-normal">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="font-normal hover:opacity-80 transition-opacity underline"
                style={{ color: "#047857" }}
              >
                Sign in
              </button>
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Sign Up Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* User Type Selection */}
            <div>
              <label className="block text-sm font-normal mb-1.5 text-foreground">
                I am a
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, userType: "jobseeker" })
                  }
                  disabled={loading}
                  className={`py-2.5 px-4 rounded-lg border transition-all text-sm font-normal ${
                    formData.userType === "jobseeker"
                      ? "bg-accent text-foreground"
                      : "border-border hover:bg-accent/50"
                  }`}
                  style={
                    formData.userType === "jobseeker"
                      ? {
                          borderColor: "#047857",
                          backgroundColor: "#d1fae5",
                          color: "#047857",
                        }
                      : {}
                  }
                >
                  Job Seeker
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, userType: "employer" })
                  }
                  disabled={loading}
                  className={`py-2.5 px-4 rounded-lg border transition-all text-sm font-normal ${
                    formData.userType === "employer"
                      ? "bg-accent text-foreground"
                      : "border-border hover:bg-accent/50"
                  }`}
                  style={
                    formData.userType === "employer"
                      ? {
                          borderColor: "#047857",
                          backgroundColor: "#d1fae5",
                          color: "#047857",
                        }
                      : {}
                  }
                >
                  Employer
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-normal mb-1.5 text-foreground"
              >
                Full name
              </label>
              <input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                placeholder="Enter your full name"
                className="w-full px-3.5 py-2.5 bg-input-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                autoComplete="name"
                required
                disabled={loading}
              />
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-normal mb-1.5 text-foreground"
              >
                E-mail
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="example@gmail.com"
                className="w-full px-3.5 py-2.5 bg-input-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                autoComplete="email"
                required
                disabled={loading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-normal mb-1.5 text-foreground"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="••••••"
                  className="w-full px-3.5 py-2.5 bg-input-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                  autoComplete="new-password"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-normal mb-1.5 text-foreground"
              >
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                placeholder="••••••"
                className="w-full px-3.5 py-2.5 bg-input-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                autoComplete="new-password"
                required
                disabled={loading}
              />
            </div>

            {/* Terms & Conditions */}
            <div>
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.agreedToTerms}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      agreedToTerms: e.target.checked,
                    })
                  }
                  className="w-4 h-4 mt-0.5 rounded border-border focus:ring-2 focus:ring-ring"
                  style={{ accentColor: "#047857" }}
                  required
                  disabled={loading}
                />
                <span className="text-sm text-foreground font-normal">
                  I agree to the{" "}
                  <button
                    type="button"
                    className="hover:opacity-80 transition-opacity"
                    style={{ color: "#047857" }}
                  >
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    className="hover:opacity-80 transition-opacity"
                    style={{ color: "#047857" }}
                  >
                    Privacy Policy
                  </button>
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white py-2.5 rounded-lg hover:opacity-90 transition-opacity text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#047857" }}
            >
              {loading ? "Creating account..." : "Create account"}
            </button>

            {/* Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div
                  className="w-full border-t"
                  style={{ borderColor: "#D1D5DB" }}
                />
              </div>
              <div className="relative flex justify-center">
                <span
                  className="px-4 text-xs font-normal"
                  style={{
                    backgroundColor: "#FFFFFF",
                    color: "#9CA3AF",
                  }}
                >
                  OR
                </span>
              </div>
            </div>

            {/* Social Sign Up */}
            <div className="space-y-2.5">
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2.5 py-2.5 border border-border rounded-lg hover:bg-accent transition-colors text-sm font-normal"
                disabled={loading}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-foreground">Continue with Google</span>
              </button>

              <button
                type="button"
                className="w-full flex items-center justify-center gap-2.5 py-2.5 border border-border rounded-lg hover:bg-accent transition-colors text-sm font-normal"
                disabled={loading}
              >
                <svg className="w-4 h-4" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="text-foreground">Continue with Facebook</span>
              </button>
            </div>
          </form>
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
            <h3 className="text-2xl font-medium text-white mb-4">
              Join a transparent hiring platform
            </h3>
            <p className="text-white/80 mb-6 leading-relaxed">
              Whether you're seeking your next opportunity or building your
              team, experience hiring with complete accountability and
              structure.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <span className="text-white/90 text-sm">
                  Smart resume management
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <span className="text-white/90 text-sm">
                  Focused job discovery
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <span className="text-white/90 text-sm">
                  Auditability by design
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
