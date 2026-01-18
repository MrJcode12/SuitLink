import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, Bell } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import companyService from "../../services/companyService";
import ProfileHeader from "../../components/EmployerProfile/ProfileHeader";
import AboutCompany from "../../components/EmployerProfile/AboutCompany";
import BenefitsPerks from "../../components/EmployerProfile/BenefitsPerks";
import ContactInfo from "../../components/EmployerProfile/ContactInfo";
import IndustryInfo from "../../components/EmployerProfile/IndustryInfo";
import CompanySize from "../../components/EmployerProfile/CompanySize";
import EditCompanyProfileModal from "../../components/EmployerProfile/EditCompanyProfileModal";
import Logo from "../../components/Auth/Shared/Logo";

const EmployerProfile = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, isEmployer } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const [companyProfile, setCompanyProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check auth and role
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate("/login");
      } else if (!isEmployer) {
        navigate("/applicant-dashboard");
      }
    }
  }, [user, authLoading, isEmployer, navigate]);

  // Fetch company profile
  useEffect(() => {
    if (user && isEmployer) {
      fetchCompanyProfile();
    }
  }, [user, isEmployer]);

  const fetchCompanyProfile = async () => {
    try {
      setLoading(true);
      const response = await companyService.getProfile();

      if (response.success && response.data) {
        setCompanyProfile(response.data);
      } else {
        // No profile exists - redirect to dashboard to complete setup
        navigate("/employer-dashboard");
      }
    } catch (err) {
      console.error("Failed to fetch company profile:", err);
      // On error, redirect to dashboard
      navigate("/employer-dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleEditSuccess = (updatedProfile) => {
    // Update local state with the updated profile
    setCompanyProfile(updatedProfile);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-chart-1 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!companyProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">
            No company profile found. Redirecting...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {showEditModal && (
        <EditCompanyProfileModal
          companyProfile={companyProfile}
          onClose={() => setShowEditModal(false)}
          onSuccess={handleEditSuccess}
        />
      )}

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <Logo />

              {/* Navigation */}
              <nav className="hidden md:flex items-center gap-6">
                <button
                  onClick={() => navigate("/employer-dashboard")}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 py-1"
                >
                  Dashboard
                </button>
                <button className="text-sm font-medium text-chart-1 border-b-2 border-chart-1 py-1">
                  Profile
                </button>
              </nav>

              <div className="flex items-center gap-4">
                <button className="relative">
                  <Bell className="size-5 text-gray-600 hover:text-gray-900" />
                </button>
                <div className="w-9 h-9 rounded-full bg-chart-1 flex items-center justify-center text-white text-sm">
                  {companyProfile.companyName?.[0] || "C"}
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-5xl mx-auto p-6">
          {/* Profile Header with Edit Button */}
          <ProfileHeader
            companyProfile={companyProfile}
            onEdit={() => setShowEditModal(true)}
          />

          {/* Company Info */}
          <div className="grid grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="col-span-2 space-y-6">
              <AboutCompany companyProfile={companyProfile} />
              <BenefitsPerks />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <ContactInfo companyProfile={companyProfile} />
              <IndustryInfo companyProfile={companyProfile} />
              <CompanySize companyProfile={companyProfile} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployerProfile;
