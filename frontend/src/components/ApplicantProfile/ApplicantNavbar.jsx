import { useEffect, useRef, useState } from "react";
import { Bell, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useProfile } from "../../context/ProfileContext";
import useAuth from "../../hooks/useAuth";
import Logo from "../../components/Auth/Shared/Logo";
import { authService } from "../../services/authService"

const ApplicantNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { profile, refreshProfile } = useProfile();

  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (user) refreshProfile();
  }, [user?._id]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setShowAvatarMenu(false);
    };

    const handleEsc = (e) => {
      if (e.key === "Escape") setShowAvatarMenu(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const isActiveRoute = (path) => location.pathname === path;

  const navItemClass = (path) =>
    `text-sm py-1 pb-1 border-b-2 transition-colors duration-200 ${
      isActiveRoute(path)
        ? "text-emerald-600 border-emerald-600"
        : "text-gray-500 border-transparent hover:text-emerald-600 hover:border-emerald-600"
    }`;

  const getAvatarDisplay = () => {
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

    const initials =
      `${profile?.firstName?.[0] || ""}${profile?.lastName?.[0] || ""}`.toUpperCase() ||
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

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setShowAvatarMenu(false);
      navigate("/login");
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <Logo />

          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => navigate("/applicant-dashboard")}
              className={navItemClass("/applicant-dashboard")}
              type="button"
            >
              Find Jobs
            </button>

            <button
              onClick={() => navigate("/applications")}
              className={navItemClass("/applications")}
              type="button"
            >
              Applications
            </button>

            <button
              onClick={() => navigate("/applicant-profile")}
              className={navItemClass("/applicant-profile")}
              type="button"
            >
              Profile
            </button>
          </nav>

          <div className="flex items-center gap-4">
            <button type="button" className="relative">
              <Bell className="size-5 text-gray-500 hover:text-gray-900 transition-colors" />
            </button>

            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowAvatarMenu((v) => !v)}
                key={`avatar-button-${user?._id}`}
                type="button"
                aria-haspopup="menu"
                aria-expanded={showAvatarMenu}
                className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center overflow-hidden hover:opacity-90 transition-opacity"
              >
                {getAvatarDisplay()}
              </button>

              {showAvatarMenu && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-lg ring-1 ring-black/5 overflow-hidden"
                >
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user?.name || "Account"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.email || ""}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full px-3 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    role="menuitem"
                  >
                    <LogOut className="w-4 h-4 text-gray-500" />
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ApplicantNavbar;
