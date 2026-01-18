import { useEffect, useRef, useState } from "react";
import { Bell, LogOut, Plus } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../Auth/Shared/Logo";
import { authService } from "../../services/authService";

const EmployerNavbar = ({
  companyProfile,
  onPostJob,
  bellSlot = null,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

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
        ? "text-emerald-600 border-emerald-600"
        : "text-gray-500 border-transparent hover:text-emerald-600 hover:border-emerald-600"
    }`;

  const companyInitial =
    (companyProfile?.companyName || companyProfile?.name || "C")
      ?.trim()
      ?.charAt(0)
      ?.toUpperCase() || "C";

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
          <Logo to="/employer-dashboard"/>

          <nav className="hidden md:flex items-center gap-6">
  <button
    type="button"
    onClick={() => navigate("/employer-dashboard")}
    className={navItemClass("/employer-dashboard")}
  >
    Overview
  </button>

  <button
    type="button"
    onClick={() => navigate("/employer/my-jobs")}
    className={navItemClass("/employer/my-jobs")}
  >
    My Jobs
  </button>

  <button
    type="button"
    onClick={() => navigate("/employer/applicants")}
    className={navItemClass("/employer/applicants")}
  >
    Applicants
  </button>
</nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/employer/post-job")}
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Post Job</span>
            </button>

            {bellSlot ? (
              bellSlot
            ) : (
              <button type="button" className="relative">
                <Bell className="size-5 text-gray-500 hover:text-gray-900 transition-colors" />
              </button>
            )}

            <div className="relative" ref={menuRef}>
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={showAvatarMenu}
                onClick={() => setShowAvatarMenu((v) => !v)}
                className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center overflow-hidden hover:opacity-90 transition-opacity text-white text-sm font-medium"
              >
                {companyProfile?.logo?.url ? (
                  <img
                    src={companyProfile.logo.url}
                    alt="Company"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  companyInitial
                )}
              </button>

              {showAvatarMenu && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg ring-1 ring-black/5 overflow-hidden"
                >
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {companyProfile?.companyName || "Company"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {companyProfile?.industry || ""}
                    </p>
                  </div>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setShowAvatarMenu(false);
                      navigate("/employer-profile");
                    }}
                    className="w-full px-3 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Company Profile
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    className="w-full px-3 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
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

export default EmployerNavbar;
