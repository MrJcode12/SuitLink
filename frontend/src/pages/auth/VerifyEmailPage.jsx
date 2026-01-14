import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Briefcase, Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { authService } from "../../services/authService";

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const fromLogin = location.state?.fromLogin || false;
  const initialMessage = location.state?.message || "";
  const initialError = location.state?.error || "";

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(initialError);
  const [success, setSuccess] = useState(initialMessage);
  const [resending, setResending] = useState(false);
  const inputRefsArray = useRef([]);

  // Clear success message after a few seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefsArray.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefsArray.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const digits = pastedData.split("").filter((char) => /^\d$/.test(char));

    const newCode = [...code];
    digits.forEach((digit, index) => {
      if (index < 6) {
        newCode[index] = digit;
      }
    });
    setCode(newCode);

    const nextEmptyIndex = newCode.findIndex((val) => !val);
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    inputRefsArray.current[focusIndex]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = code.join("");

    if (verificationCode.length !== 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await authService.verifyEmail(email, verificationCode);
      // Verification successful - redirect to success page
      navigate("/verify-email-success", { state: { email } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError("");
    setSuccess("");
    setResending(true);

    try {
      await authService.resendVerification(email);
      setCode(["", "", "", "", "", ""]);
      setSuccess("Verification code resent successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setResending(false);
    }
  };

  const isCodeComplete = code.every((digit) => digit !== "");

  // Redirect if no email provided
  if (!email) {
    navigate("/signup");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background">
      {/* Left Side - Verification Form */}
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
            <button
              type="button"
              onClick={() => navigate(fromLogin ? "/login" : "/signup")}
              className="group inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground hover:underline mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              {fromLogin ? "Back to sign in" : "Back to sign up"}
            </button>
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: "#d1fae5" }}
            >
              <Mail className="w-8 h-8" style={{ color: "#047857" }} />
            </div>
            <h1 className="text-2xl font-normal mb-2 text-foreground">
              Verify your email
            </h1>
            <p className="text-sm text-muted-foreground">
              We've sent a 6-digit verification code to{" "}
              <span className="text-foreground font-medium">{email}</span>
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-600">{success}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Verification Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* 6-Digit Code Input */}
            <div>
              <label className="block text-sm mb-2 text-foreground font-normal">
                Enter verification code
              </label>
              <div className="flex gap-2 justify-between">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefsArray.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    disabled={loading}
                    className="w-full aspect-square text-center text-2xl font-medium border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground transition-shadow bg-input-background"
                  />
                ))}
              </div>
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={!isCodeComplete || loading}
              className={`w-full py-2.5 rounded-lg transition-opacity text-sm font-medium ${
                isCodeComplete && !loading
                  ? "text-white hover:opacity-90"
                  : "cursor-not-allowed opacity-50"
              }`}
              style={{ backgroundColor: "#047857" }}
            >
              {loading ? "Verifying..." : "Verify Email"}
            </button>

            {/* Resend Code */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Didn't receive the code?{" "}
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={resending || loading}
                  className="hover:opacity-80 transition-opacity font-normal disabled:opacity-50"
                  style={{ color: "#047857" }}
                >
                  {resending ? "Resending..." : "Resend"}
                </button>
              </p>
            </div>
          </form>

          {/* Info Box */}
          <div
            className="mt-6 p-4 rounded-lg border border-border"
            style={{ backgroundColor: "#f9fafb" }}
          >
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground font-medium">
                Security tip:
              </strong>{" "}
              Never share your verification code with anyone. Our team will
              never ask for this code.
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
            <h3 className="text-2xl font-medium text-white mb-4">
              Secure your account
            </h3>
            <p className="text-white/80 mb-6 leading-relaxed">
              Email verification helps us ensure your account security and
              allows us to send you important updates about your job
              applications.
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-white font-medium mb-1">
                    Protected account
                  </div>
                  <div className="text-white/80 text-sm">
                    Your data is encrypted and secure
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-white font-medium mb-1">
                    Stay informed
                  </div>
                  <div className="text-white/80 text-sm">
                    Get real-time application updates
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

export default VerifyEmailPage;
