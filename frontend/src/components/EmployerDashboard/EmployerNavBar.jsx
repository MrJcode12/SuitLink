import { useEffect, useRef, useState } from "react";
import { LogOut, Plus } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Logo from "../Auth/Shared/Logo";
import { authService } from "../../services/authService";

const EmployerNavbar = ({ companyProfile, onPostJob, bellSlot }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const menuRef = useRef(null);

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
        ? "text-chart-1 border-chart-1"
        : "text-gray-500 border-transparent hover:text-chart-1 hover:border-chart-1"
    }`;

  const getAvatarDisplay = () => {
    if (companyProfile?.logo?.url) {
      return (
        <img
          src={companyProfile.logo.url}
          alt="Company"
          className="w-full h-full object-cover"
        />
      );
    }

    const initials =
      companyProfile?.companyName?.[0]?.toUpperCase() ||
      user?.name?.[0]?.toUpperCase() ||
      "C";

    return <span className="text-sm font-medium text-white">{initials}</span>;
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
    <div className="bg-white border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <Logo to="/employer-dashboard" />

          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => navigate("/employer-dashboard")}
              className={navItemClass("/employer-dashboard")}
              type="button"
            >
              Dashboard
            </button>

            <button
              onClick={() => navigate("/employer/my-jobs")}
              className={navItemClass("/employer/my-jobs")}
              type="button"
            >
              My Jobs
            </button>

            <button
              onClick={() => navigate("/employer/applicants")}
              className={navItemClass("/employer/applicants")}
              type="button"
            >
              Applicants
            </button>

            <button
              onClick={() => navigate("/employer-profile")}
              className={navItemClass("/employer-profile")}
              type="button"
            >
              Profile
            </button>
          </nav>

          <div className="flex items-center gap-4">
            {onPostJob && (
              <button
                onClick={onPostJob}
                className="inline-flex items-center gap-2 px-4 py-2 bg-chart-1 text-white rounded-lg hover:opacity-90 transition"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">Post Job</span>
              </button>
            )}

            {bellSlot}

            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowAvatarMenu((v) => !v)}
                type="button"
                aria-haspopup="menu"
                aria-expanded={showAvatarMenu}
                className="w-9 h-9 rounded-full bg-chart-1 flex items-center justify-center overflow-hidden hover:opacity-90 transition-opacity"
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
                      {companyProfile?.companyName || user?.name || "Account"}
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
    </div>
  );
};

export default EmployerNavbar;
