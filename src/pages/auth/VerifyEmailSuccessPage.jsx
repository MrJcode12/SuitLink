import { useNavigate, useLocation } from "react-router-dom";
import { Briefcase, CheckCircle, ArrowRight } from "lucide-react";

const VerifyEmailSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "user@example.com";

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background">
      {/* Left Side - Success Message */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 min-h-screen lg:min-h-0">
        <div className="w-full max-w-md text-center">
          {/* Logo */}
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 mb-12 text-foreground hover:opacity-80 transition-opacity"
          >
            <Briefcase className="w-5 h-5" style={{ color: "#047857" }} />
            <span className="text-base font-normal">SuitLink</span>
          </button>

          {/* Success Icon with Animation */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center animate-scale-in"
                style={{ backgroundColor: "#d1fae5" }}
              >
                <CheckCircle
                  className="w-12 h-12"
                  style={{ color: "#047857" }}
                />
              </div>
              <div
                className="absolute inset-0 rounded-full animate-ping"
                style={{ backgroundColor: "rgba(16, 185, 129, 0.2)" }}
              />
            </div>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl mb-3 font-normal text-foreground">
              Email verified!
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your email address{" "}
              <span className="text-foreground font-medium">{email}</span> has
              been successfully verified. You can now access all features of
              your SuitLink account.
            </p>
          </div>

          {/* Continue Button */}
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full text-white py-2.5 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 group mb-6 text-sm font-medium"
            style={{ backgroundColor: "#047857" }}
          >
            <span>Continue to dashboard</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Feature List */}
          <div
            className="mt-12 p-6 rounded-xl border border-border text-left"
            style={{ backgroundColor: "#f9fafb" }}
          >
            <h3 className="text-sm text-foreground mb-4 font-medium">
              What's next?
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: "#d1fae5" }}
                >
                  <CheckCircle
                    className="w-3.5 h-3.5"
                    style={{ color: "#047857" }}
                  />
                </div>
                <div>
                  <div className="text-sm text-foreground font-medium">
                    Complete your profile
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Add your skills and experience
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: "#d1fae5" }}
                >
                  <CheckCircle
                    className="w-3.5 h-3.5"
                    style={{ color: "#047857" }}
                  />
                </div>
                <div>
                  <div className="text-sm text-foreground font-medium">
                    Browse job listings
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Discover opportunities that match your skills
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: "#d1fae5" }}
                >
                  <CheckCircle
                    className="w-3.5 h-3.5"
                    style={{ color: "#047857" }}
                  />
                </div>
                <div>
                  <div className="text-sm text-foreground font-medium">
                    Track applications
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Monitor your application status in real-time
                  </div>
                </div>
              </div>
            </div>
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
              Welcome to transparent hiring
            </h3>
            <p className="text-white/80 mb-6 leading-relaxed">
              You're now part of a platform that values fairness,
              accountability, and meaningful connections between job seekers and
              employers.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <span className="text-white/90 text-sm">
                  Your data is protected
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <span className="text-white/90 text-sm">
                  Full application visibility
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <span className="text-white/90 text-sm">
                  Skill-based matching
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes scale-in {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default VerifyEmailSuccessPage;
