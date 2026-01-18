import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Bell,
  Users,
  Eye,
  MessageSquare,
  Briefcase as BriefcaseIcon,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import companyService from "../../services/companyService";
import jobService from "../../services/jobService";
import CompanySetupModal from "../../components/EmployerDashboard/CompanySetupModal";
import JobCard from "../../components/EmployerDashboard/JobCard";
import StatsCard from "../../components/EmployerDashboard/StatsCard";
import EditJobModal from "../../components/EmployerDashboard/EditJobModal";
import Logo from "../../components/Auth/Shared/Logo";

const EmployerDashboardPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, isEmployer, logout } = useAuth();

  const [companyProfile, setCompanyProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

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

  // Fetch jobs when profile exists
  useEffect(() => {
    if (companyProfile) {
      fetchJobs();
    }
  }, [companyProfile]);

  const fetchCompanyProfile = async () => {
    try {
      setLoading(true);
      const response = await companyService.getProfile();

      if (response.success) {
        if (response.needsSetup || !response.data) {
          setShowSetupModal(true);
          setCompanyProfile(null);
        } else {
          setCompanyProfile(response.data);
        }
      }
    } catch (err) {
      console.error("Failed to fetch company profile:", err);
      setShowSetupModal(true);
      setCompanyProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await jobService.getMyJobs();

      if (response.success) {
        setJobs(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    }
  };

  const handleSetupSuccess = async () => {
    setShowSetupModal(false);
    await fetchCompanyProfile();
  };

  const handlePostJob = () => {
    if (!companyProfile) {
      alert("Please complete your company profile first");
      setShowSetupModal(true);
      return;
    }
    navigate("/employer/post-job");
  };

  const handleViewProfile = () => {
    if (!companyProfile) {
      alert("Please complete your company profile first");
      setShowSetupModal(true);
      return;
    }
    navigate("/employer-profile");
  };

  const handleEditJob = (job) => {
    setSelectedJob(job);
    setShowEditModal(true);
  };

  const handleCloseJob = async (job) => {
    if (!confirm(`Are you sure you want to close "${job.title}"?`)) {
      return;
    }

    try {
      const response = await jobService.closeJob(job._id);

      if (response.success) {
        alert("Job closed successfully!");
        await fetchJobs();
        await fetchCompanyProfile(); // Refresh metrics
      }
    } catch (error) {
      console.error("Error closing job:", error);
      alert(error.message || "Failed to close job. Please try again.");
    }
  };

  const handleReopenJob = async (job) => {
    if (!confirm(`Are you sure you want to reopen "${job.title}"?`)) {
      return;
    }

    try {
      const response = await jobService.reopenJob(job._id);

      if (response.success) {
        alert("Job reopened successfully!");
        await fetchJobs();
        await fetchCompanyProfile(); // Refresh metrics
      }
    } catch (error) {
      console.error("Error reopening job:", error);
      alert(error.message || "Failed to reopen job. Please try again.");
    }
  };

  const handleViewApplicants = (job) => {
    navigate(`/employer/jobs/${job._id}/applicants`);
  };

  const handleEditSuccess = async () => {
    await fetchJobs();
    await fetchCompanyProfile();
  };

  // Calculate stats from jobs and profile metrics
  const activeJobs = companyProfile?.metrics?.activeJobsCount || 0;
  const totalJobs = companyProfile?.metrics?.jobPostsCount || 0;
  const totalApplicants = companyProfile?.metrics?.totalApplicants || 0;
  const hasCredibilityBadge = companyProfile?.credibilityScore >= 6;

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-chart-1 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {(showSetupModal || !companyProfile) && (
        <CompanySetupModal onSuccess={handleSetupSuccess} />
      )}

      {showEditModal && selectedJob && (
        <EditJobModal
          job={selectedJob}
          onClose={() => {
            setShowEditModal(false);
            setSelectedJob(null);
          }}
          onSuccess={handleEditSuccess}
        />
      )}

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <Logo />

              {/* Desktop Navigation */}
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
                  onClick={() => navigate("/jobs")}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 py-1"
                >
                  Browse Jobs
                </button>
              </nav>

              {/* Right Actions */}
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
                </button>
                <button
                  onClick={handleViewProfile}
                  className="w-9 h-9 rounded-full bg-chart-1 flex items-center justify-center text-white text-sm"
                >
                  {companyProfile?.companyName?.[0] || "C"}
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatsCard
              icon={BriefcaseIcon}
              value={activeJobs.toString()}
              label="Active Jobs"
              trend={true}
            />
            <StatsCard
              icon={BriefcaseIcon}
              value={totalJobs.toString()}
              label="Total Jobs Posted"
            />
            <StatsCard
              icon={Users}
              value={totalApplicants.toString()}
              label="Total Applicants"
              trend={true}
            />
            <StatsCard
              icon={Eye}
              value={companyProfile?.metrics?.totalViews || "0"}
              label="Profile Views"
            />
          </div>

          {/* Credibility Score Display */}
          {companyProfile && (
            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm text-gray-600">
                    Company Credibility Score
                  </h3>
                  <p className="text-2xl font-medium text-gray-900 mt-1">
                    {companyProfile.credibilityScore} / 10
                  </p>
                </div>
                {hasCredibilityBadge && (
                  <div className="px-4 py-2 bg-chart-1/10 text-chart-1 rounded-lg">
                    <p className="text-sm font-medium">Verified Company</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Jobs Section */}
          {activeTab === "jobs" && (
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg text-gray-900">Posted Jobs</h2>
                  <button
                    onClick={handlePostJob}
                    className="flex items-center gap-2 px-4 py-2 bg-chart-1 text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <Plus className="size-4" />
                    <span className="text-sm">Post New Job</span>
                  </button>
                </div>
              </div>

              <div>
                {jobs.length === 0 ? (
                  <div className="p-12 text-center">
                    <BriefcaseIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg text-gray-900 mb-2">
                      No jobs posted yet
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Start posting jobs to attract qualified candidates
                    </p>
                    <button
                      onClick={handlePostJob}
                      className="px-6 py-3 bg-chart-1 text-white rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Post Your First Job
                    </button>
                  </div>
                ) : (
                  jobs.map((job) => (
                    <JobCard
                      key={job._id}
                      job={job}
                      onEdit={handleEditJob}
                      onClose={handleCloseJob}
                      onReopen={handleReopenJob}
                      onViewApplicants={handleViewApplicants}
                    />
                  ))
                )}
              </div>
            </div>
          )}

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg text-gray-900 mb-4">Recent Activity</h2>
                <p className="text-gray-600">No recent activity</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EmployerDashboardPage;
