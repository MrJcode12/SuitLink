import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";

// Shared Components (keep all existing imports)
import AuthContainer from "../../components/Auth/shared/AuthContainer";
import AuthFormContainer from "../../components/Auth/Shared/AuthFormContainer";
import AuthMarketingSection from "../../components/Auth/Shared/AuthMarketingSection";
import Logo from "../../components/Auth/Shared/Logo";
import ErrorMessage from "../../components/Auth/Shared/ErrorMessage";
import AuthDivider from "../../components/Auth/Shared/AuthDivider";
import SocialLoginButtons from "../../components/Auth/Shared/SocialLoginButtons";

// Page-specific Components
import LoginHeader from "../../components/Auth/LoginPage/LoginHeader";
import LoginForm from "../../components/Auth/LogInPage/LoginForm";

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async ({ email, password }) => {
    setError("");
    setLoading(true);

    try {
      const response = await authService.login(email, password);

      if (!response || !response.success) {
        setError("Login failed. Please try again.");
        setLoading(false);
        return;
      }

      navigate("/dashboard");
    } catch (err) {
      const errorMessage = err.message.toLowerCase();

      if (
        errorMessage.includes("not verified") ||
        errorMessage.includes("verify your email") ||
        errorMessage.includes("email verification")
      ) {
        try {
          await authService.resendVerification(email);
          navigate("/verify-email", {
            state: {
              email,
              fromLogin: true,
              message:
                "Please verify your email to continue. We've sent you a new verification code.",
            },
          });
        } catch (resendError) {
          navigate("/verify-email", {
            state: {
              email,
              fromLogin: true,
              error: "Failed to resend verification code. Please try again.",
            },
          });
        }
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const marketingContent = {
    title: "Find your perfect career match",
    description:
      "Track every application in real-time. Connect with employers through skill-based matching and experience transparent hiring designed for fairness.",
    features: [
      "Real-time application tracking",
      "Skill-based job matching",
      "Employer accountability metrics",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
  };

  return (
    <AuthContainer>
      <AuthFormContainer>
        <Logo to="/" />

        <div className="mt-8">
          <LoginHeader />
          <ErrorMessage message={error} />
          <LoginForm onSubmit={handleSubmit} loading={loading} />

          {/* Forgot Password */}
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-sm font-normal hover:opacity-80 transition-opacity text-[#047857]"
              disabled={loading}
            >
              Forgot password?
            </button>
          </div>

          <AuthDivider />
          <SocialLoginButtons disabled={loading} />
        </div>
      </AuthFormContainer>

      <AuthMarketingSection
        title={marketingContent.title}
        description={marketingContent.description}
        features={marketingContent.features}
        imageUrl={marketingContent.imageUrl}
      />
    </AuthContainer>
  );
};

export default LoginPage;
