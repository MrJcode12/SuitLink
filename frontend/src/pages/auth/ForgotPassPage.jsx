import { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Briefcase, ArrowLeft, Shield, CheckCircle } from "lucide-react";
import { authService } from "../../services/authService";

const ForgotPassPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get initial state from navigation (if redirected back from reset page)
  const initialEmail = location.state?.email || "";
  const initialError = location.state?.error || "";

  const [step, setStep] = useState(initialEmail ? "verify" : "email");
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(initialError);
  const [resending, setResending] = useState(false);
  const inputRefsArray = useRef([]);

  // Email submission handler
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authService.forgotPassword(email);
      setStep("verify");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Code input handlers
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

  const handleVerifyCode = () => {
    const verificationCode = code.join("");
    if (verificationCode.length !== 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }

    setError("");
    // Navigate to reset password page with email and code
    navigate("/reset-password", {
      state: { email, code: verificationCode },
    });
  };

  const handleResendCode = async () => {
    setError("");
    setResending(true);

    try {
      await authService.resendResetPassword(email);
      setCode(["", "", "", "", "", ""]);
      const successMsg = document.createElement("div");
      successMsg.className =
        "fixed top-4 right-4 bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg z-50";
      successMsg.innerHTML = `<p class="text-sm text-green-600">Reset code resent successfully!</p>`;
      document.body.appendChild(successMsg);
      setTimeout(() => successMsg.remove(), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setResending(false);
    }
  };

  const isCodeComplete = code.every((digit) => digit !== "");

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

          {step === "email" ? (
            <>
              {/* Email Step - Header */}
              <div className="mb-6">
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="group inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground hover:underline mb-4 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  Back to sign in
                </button>
                <h1 className="text-2xl mb-2 font-normal text-foreground">
                  Reset password
                </h1>
                <p className="text-sm text-muted-foreground">
                  Enter your email address and we'll send you a verification
                  code to reset your password.
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Email Step - Form */}
              <form className="space-y-4" onSubmit={handleEmailSubmit}>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm mb-1.5 text-foreground font-normal"
                  >
                    E-mail
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full px-3.5 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm text-foreground placeholder:text-muted-foreground transition-shadow bg-input-background"
                    autoComplete="email"
                    required
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full text-white py-2.5 rounded-lg hover:opacity-90 transition-opacity text-sm font-medium disabled:opacity-50"
                  style={{ backgroundColor: "#047857" }}
                >
                  {loading ? "Sending..." : "Send verification code"}
                </button>
              </form>

              {/* Email Step - Security Info */}
              <div
                className="mt-6 p-4 rounded-lg border border-border"
                style={{ backgroundColor: "#f9fafb" }}
              >
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground font-medium">
                    Security tip:
                  </strong>{" "}
                  For your protection, we'll only send reset instructions to the
                  email address associated with your account.
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Verify Step - Header */}
              <div className="mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setStep("email");
                    setCode(["", "", "", "", "", ""]);
                    setError("");
                  }}
                  className="group inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground hover:underline mb-4 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  Change your email
                </button>
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: "#d1fae5" }}
                >
                  <Shield className="w-8 h-8" style={{ color: "#047857" }} />
                </div>
                <h1 className="text-2xl mb-2 font-normal text-foreground">
                  Enter verification code
                </h1>
                <p className="text-sm text-muted-foreground">
                  We've sent a 6-digit verification code to{" "}
                  <span className="text-foreground font-medium">{email}</span>
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Verify Step - Code Input */}
              <div className="space-y-6">
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

                <button
                  onClick={handleVerifyCode}
                  disabled={!isCodeComplete || loading}
                  className={`w-full py-2.5 rounded-lg transition-opacity text-sm font-medium ${
                    isCodeComplete && !loading
                      ? "text-white hover:opacity-90"
                      : "cursor-not-allowed opacity-50"
                  }`}
                  style={{ backgroundColor: "#047857" }}
                >
                  Continue
                </button>

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
              </div>

              {/* Verify Step - Security Info */}
              <div
                className="mt-6 p-4 rounded-lg border border-border"
                style={{ backgroundColor: "#f9fafb" }}
              >
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground font-medium">
                    Security tip:
                  </strong>{" "}
                  This code will expire in 15 minutes. Never share it with
                  anyone, even SuitLink support staff.
                </p>
              </div>
            </>
          )}
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
              Your account security matters
            </h3>
            <p className="text-white/80 mb-6 leading-relaxed">
              We take your security seriously. Our password reset process
              ensures only you can access your account and application data.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <span className="text-white/90 text-sm">
                  Secure password recovery
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <span className="text-white/90 text-sm">
                  Protected account data
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <span className="text-white/90 text-sm">
                  Email verification required
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassPage;
