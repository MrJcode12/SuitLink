import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  Users,
  Eye,
  MessageSquare,
  Bell,
} from "lucide-react";
import StatsCard from "../../components/EmployerDashboard/StatsCard";
import ApplicantCard from "../../components/EmployerDashboard/ApplicantCard";
import JobCard from "../../components/EmployerDashboard/JobCard";
import ApplicantTableRow from "../../components/EmployerDashboard/ApplicantTableRow";
import Logo from "../../components/Auth/Shared/Logo";
// import CompanyProfileSetupModal from "../../components/Company/CompanyProfileSetupModal";
import { companyProfileService } from "../../services/companyProfileService";
import { authService } from "../../services/authService";

// Mock data
const postedJobs = [
  {
    id: 1,
    title: "Senior UX Designer",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$120,000/year",
    posted: "5 days ago",
    applicants: 45,
    viewed: 234,
    status: "active",
    newApplicants: 12,
  },
];

const recentApplicants = [
  {
    id: 1,
    name: "Sarah Johnson",
    position: "Senior UX Designer",
    avatar: "SJ",
    experience: "7 years",
    skills: ["UI/UX", "Figma", "Design Systems"],
    matchScore: 95,
    appliedDate: "2 hours ago",
    status: "new",
  },
];

const EmployerDashboardPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [jobFilter, setJobFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // User and company profile state
  const [currentUser, setCurrentUser] = useState(null);
  const [companyProfile, setCompanyProfile] = useState(null);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Check user role and company profile on mount
  useEffect(() => {
    checkUserAndProfile();
  }, []);

  const checkUserAndProfile = async () => {
    try {
      // First, get current user info
      const userResponse = await authService.getCurrentUser();
      const user = userResponse.data;
      setCurrentUser(user);

      // Check if user is employer
      if (user.role !== "employer") {
        // Redirect to appropriate dashboard based on role
        if (user.role === "applicant") {
          navigate("/applicant-dashboard");
          return;
        }
        setError("You don't have permission to access this page");
        setLoading(false);
        return;
      }

      // If employer, check for company profile
      try {
        const profileResponse = await companyService.getProfile();
        setCompanyProfile(profileResponse.data);
      } catch (profileError) {
        // Profile doesn't exist - show setup modal
        if (profileError.message.includes("not found")) {
          setShowSetupModal(true);
        }
      }

      setLoading(false);
    } catch (err) {
      console.error("Error checking user and profile:", err);
      setError(err.message);
      setLoading(false);

      // If unauthorized, redirect to login
      if (
        err.message.includes("Unauthorized") ||
        err.message.includes("token")
      ) {
        navigate("/login");
      }
    }
  };

  const handleProfileSetupSuccess = (profile) => {
    setCompanyProfile(profile);
    setShowSetupModal(false);
  };

  const handleViewProfile = (applicant) => {
    console.log("View applicant profile:", applicant);
  };

  const handleEditJob = (job) => {
    console.log("Edit job:", job);
  };

  const handleViewApplicants = (job) => {
    console.log("View applicants for job:", job);
  };

  const handlePostJob = () => {
    if (!companyProfile) {
      setShowSetupModal(true);
      return;
    }
    navigate("/employer/post-job");
  };

  const handleGoProfile = () => {
    if (!companyProfile) {
      setShowSetupModal(true);
      return;
    }
    navigate("/employer-profile");
  };

  const stats = [
    {
      icon: Briefcase,
      value: companyProfile?.metrics?.activeJobsCount || "0",
      label: "Active Jobs",
      trend: true,
    },
    {
      icon: Users,
      value: companyProfile?.metrics?.totalApplicants || "0",
      label: "Total Applicants",
      trend: true,
    },
    {
      icon: Eye,
      value: "1,002",
      label: "Profile Views",
      trend: true,
    },
    {
      icon: MessageSquare,
      value: "20",
      label: "New Applicants",
      trend: true,
    },
  ];

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-chart-1 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2.5 bg-chart-1 text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Company Profile Setup Modal */}
      {showSetupModal && (
        <CompanyProfileSetupModal
          onClose={() => setShowSetupModal(false)}
          onSuccess={handleProfileSetupSuccess}
        />
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Logo />
              <span className="px-2 py-1 bg-chart-1/10 text-chart-1 text-xs rounded-full ml-2 font-medium">
                Employer
              </span>
              {companyProfile && companyProfile.credibilityScore >= 7 && (
                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium flex items-center gap-1">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Verified
                </span>
              )}
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <button
                onClick={() => setActiveTab("overview")}
                className={`text-sm font-medium pb-1 ${
                  activeTab === "overview"
                    ? "text-chart-1 border-b-2 border-chart-1"
                    : "text-gray-600 hover:text-gray-900"
                } py-1`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("jobs")}
                className={`text-sm font-medium pb-1 ${
                  activeTab === "jobs"
                    ? "text-chart-1 border-b-2 border-chart-1"
                    : "text-gray-600 hover:text-gray-900"
                } py-1`}
              >
                My Jobs
              </button>
              <button
                onClick={() => setActiveTab("applicants")}
                className={`text-sm font-medium pb-1 ${
                  activeTab === "applicants"
                    ? "text-chart-1 border-b-2 border-chart-1"
                    : "text-gray-600 hover:text-gray-900"
                } py-1`}
              >
                Applicants
              </button>
            </nav>

            <div className="flex items-center gap-3">
              <button
                onClick={handlePostJob}
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-chart-1 text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm">Post Job</span>
              </button>
              <button className="relative">
                <Bell className="size-5 text-gray-600 hover:text-gray-900" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-chart-1 rounded-full" />
              </button>
              <button
                onClick={handleGoProfile}
                className="w-9 h-9 rounded-full bg-chart-1 flex items-center justify-center text-white text-sm"
              >
                {companyProfile?.companyName?.[0]?.toUpperCase() ||
                  currentUser?.name?.[0]?.toUpperCase() ||
                  "?"}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Incomplete profile banner */}
        {companyProfile && companyProfile.credibilityScore < 7 && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg
                  className="w-3 h-3 text-amber-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-amber-900">
                  Complete your company profile
                </h4>
                <p className="text-sm text-amber-700 mt-1">
                  Your profile is incomplete (Score:{" "}
                  {companyProfile.credibilityScore}/10). Add more details to
                  increase credibility.
                </p>
                <button
                  onClick={handleGoProfile}
                  className="mt-2 text-sm text-amber-900 font-medium hover:underline"
                >
                  Complete profile →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, index) => (
                <StatsCard key={index} {...stat} />
              ))}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 mb-8">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg text-gray-900">Recent Applicants</h2>
                  <button
                    onClick={() => setActiveTab("applicants")}
                    className="text-sm text-chart-1 hover:opacity-80"
                  >
                    View all
                  </button>
                </div>
              </div>
              <div>
                {recentApplicants.map((applicant) => (
                  <ApplicantCard
                    key={applicant.id}
                    applicant={applicant}
                    onViewProfile={handleViewProfile}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {/* Other tabs remain the same */}
      </div>
    </div>
  );
};

export default EmployerDashboardPage;
