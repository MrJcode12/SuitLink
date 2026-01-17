import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, Bell } from "lucide-react";
import ProfileHeader from "../../components/EmployerProfile/ProfileHeader";
import AboutCompany from "../../components/EmployerProfile/AboutCompany";
import BenefitsPerks from "../../components/EmployerProfile/BenefitsPerks";
import ContactInfo from "../../components/EmployerProfile/ContactInfo";
import IndustryInfo from "../../components/EmployerProfile/IndustryInfo";
import CompanySize from "../../components/EmployerProfile/CompanySize";
import Logo from "../../components/Auth/Shared/Logo";

const EmployerProfile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("Profile");

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleViewDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <Logo />
            <nav className="hidden md:flex items-center gap-6">
              <button
                onClick={() => navigate("/dashboard")}
                className={`text-sm font-medium pb-1 ${
                  activeTab === "Dashboard"
                    ? "text-emerald-600 border-b-2 border-emerald-600"
                    : "text-gray-600 hover:text-gray-900"
                } py-1`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab("Profile")}
                className={`text-sm font-medium pb-1 ${
                  activeTab === "Profile"
                    ? "text-emerald-600 border-b-2 border-emerald-600"
                    : "text-gray-600 hover:text-gray-900"
                } py-1`}
              >
                Profile
              </button>
            </nav>

            <div className="flex items-center gap-4">
              <button className="relative">
                <Bell className="size-5 text-gray-600 hover:text-gray-900" />
              </button>
              <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white text-sm">
                TC
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-6">
        {/* Profile Header */}
        <ProfileHeader isEditing={isEditing} onEditToggle={handleEditToggle} />

        {/* Company Info */}
        <div className="grid grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="col-span-2 space-y-6">
            <AboutCompany isEditing={isEditing} />
            <BenefitsPerks isEditing={isEditing} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <ContactInfo />
            <IndustryInfo />
            <CompanySize />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerProfile;
