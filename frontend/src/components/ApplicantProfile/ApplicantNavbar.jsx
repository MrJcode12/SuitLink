import { Bell } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useProfile } from "../../context/ProfileContext";
import useAuth from "../../hooks/useAuth";
import { useEffect } from "react";
import Logo from "../../components/Auth/Shared/Logo";

const ApplicantNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { profile, refreshProfile } = useProfile();

  // Refresh profile when user changes
  useEffect(() => {
    if (user) {
      refreshProfile();
    }
  }, [user?._id]);

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  // Get profile image or fallback to initials
  const getAvatarDisplay = () => {
    // If there's a profile image URL, use it
    if (profile?.profileImage?.url) {
      return (
        <img
          key={`avatar-${user?._id}-${profile.profileImage.url}`}
          src={profile.profileImage.url}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      );
    }

    // Fallback to initials from profile or user
    const initials =
      `${profile?.firstName?.[0] || ""}${
        profile?.lastName?.[0] || ""
      }`.toUpperCase() ||
      user?.name?.[0]?.toUpperCase() ||
      "A";

    return (
      <span
        key={`initials-${user?._id}`}
        className="text-sm font-medium text-white"
      >
        {initials}
      </span>
    );
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => navigate("/applicant-dashboard")}
              className={`text-sm py-1 pb-1 transition-colors duration-200 ${
                isActiveRoute("/applicant-dashboard")
                  ? "text-emerald-600 border-b-2 border-emerald-600"
                  : "text-muted-foreground hover:text-emerald-600 hover:border-b-2 hover:border-emerald-600"
              }`}
            >
              Find Jobs
            </button>
            <button
              onClick={() => navigate("/applications")}
              className={`text-sm py-1 pb-1 border-b-2 border-transparent transition-colors duration-200 ${
                isActiveRoute("/applications")
                  ? "text-emerald-600 border-emerald-600"
                  : "text-muted-foreground hover:text-emerald-600 hover:border-emerald-600"
              }`}
            >
              Applications
            </button>
            <button
              onClick={() => navigate("/applicant-profile")}
              className={`text-sm py-1 pb-1 border-b-2 border-transparent transition-colors duration-200 ${
                isActiveRoute("/applicant-profile")
                  ? "text-emerald-600 border-emerald-600"
                  : "text-muted-foreground hover:text-emerald-600 hover:border-emerald-600"
              }`}
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
              key={`avatar-button-${user?._id}`} // Force button re-render on user change
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
