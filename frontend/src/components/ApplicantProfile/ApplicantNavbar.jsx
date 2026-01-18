import { Bell } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useProfile } from "../../context/ProfileContext";
import useAuth from "../../hooks/useAuth";

const ApplicantNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { profile } = useProfile();

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  // Get profile image or fallback to initials
  const getAvatarDisplay = () => {
    if (profile?.profileImage?.url) {
      return (
        <img
          src={profile.profileImage.url}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      );
    }

    // Fallback to initials
    const initials =
      `${profile?.firstName?.[0] || ""}${
        profile?.lastName?.[0] || ""
      }`.toUpperCase() ||
      user?.name?.[0]?.toUpperCase() ||
      "A";

    return <span className="text-sm font-medium text-white">{initials}</span>;
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-40">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="size-7 text-chart-1">
              {/* Your Briefcase icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"
                />
              </svg>
            </div>
            <span className="text-xl text-foreground">SuitLink</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => navigate("/applicant-dashboard")}
              className={`text-sm pb-1 ${
                isActiveRoute("/applicant-dashboard")
                  ? "text-chart-1 border-b-2 border-chart-1"
                  : "text-muted-foreground hover:text-foreground"
              } py-1`}
            >
              Find Jobs
            </button>
            <button
              onClick={() => navigate("/applications")}
              className={`text-sm pb-1 ${
                isActiveRoute("/applications")
                  ? "text-chart-1 border-b-2 border-chart-1"
                  : "text-muted-foreground hover:text-foreground"
              } py-1`}
            >
              Applications
            </button>
            <button
              onClick={() => navigate("/applicant-profile")}
              className={`text-sm pb-1 ${
                isActiveRoute("/applicant-profile")
                  ? "text-chart-1 border-b-2 border-chart-1"
                  : "text-muted-foreground hover:text-foreground"
              } py-1`}
            >
              Profile
            </button>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button className="relative">
              <Bell className="size-5 text-muted-foreground hover:text-foreground" />
            </button>
            <button
              onClick={() => navigate("/applicant-profile")}
              className="w-9 h-9 rounded-full bg-chart-1 flex items-center justify-center overflow-hidden hover:opacity-90 transition-opacity"
            >
              {getAvatarDisplay()}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ApplicantNavbar;
