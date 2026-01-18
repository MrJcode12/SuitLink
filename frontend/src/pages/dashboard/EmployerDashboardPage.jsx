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
import EmployerNavbar from "../../components/EmployerDashboard/EmployerNavBar";

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
        {/* Navbar */}
        <header className="sticky top-0 z-40">
          <EmployerNavbar
            companyProfile={companyProfile}
            onPostJob={handlePostJob}
          />
        </header>

        <main className="max-w-7xl mx-auto p-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl text-gray-900 font-medium mb-1">
              Employer Dashboard
            </h1>
            <p className="text-gray-600">
              Manage your job postings and track incoming applicants
            </p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <StatsCard
              icon={BriefcaseIcon}
              value={activeJobs.toString()}
              label="Active Jobs"
              trend
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
              trend
            />
          </div>

          {/* Main Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT: Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Posted Jobs */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">
                    Posted Jobs
                  </h2>
                  <button
                    onClick={handlePostJob}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm font-medium">Post Job</span>
                  </button>
                </div>

                {jobs.length === 0 ? (
                  <div className="p-12 text-center">
                    <BriefcaseIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg text-gray-900 mb-2">
                      No jobs posted yet
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Start posting jobs to receive applications
                    </p>
                    <button
                      onClick={handlePostJob}
                      className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                    >
                      Post Your First Job
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {jobs.map((job) => (
                      <JobCard
                        key={job._id}
                        job={job}
                        onEdit={handleEditJob}
                        onClose={handleCloseJob}
                        onReopen={handleReopenJob}
                        onViewApplicants={handleViewApplicants}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Credibility Score */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-sm text-gray-600 mb-1">
                  Company Credibility Score
                </h3>
                <p className="text-2xl font-medium text-gray-900">
                  {companyProfile.credibilityScore} / 10
                </p>

                {hasCredibilityBadge && (
                  <div className="mt-3 inline-flex px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium">
                    Verified Company
                  </div>
                )}
              </div>

              {/* Recent Applicants */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Recent Applicants
                </h3>

                {totalApplicants === 0 ? (
                  <p className="text-sm text-gray-600">
                    No applicants yet. New applications will appear here.
                  </p>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">
                      Applicants are coming in. View job-specific applicant lists
                      to take action.
                    </p>

                    <button
                      onClick={() => navigate("/employer/applicants")}
                      className="w-full mt-3 px-4 py-2.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition text-sm font-medium"
                    >
                      View All Applicants
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );


};

export default EmployerDashboardPage;
