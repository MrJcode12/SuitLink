import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, Users, ChevronRight } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import useApplicantCounts from "../../hooks/useApplicantCounts";
import jobService from "../../services/jobService";
import EmployerNavbar from "../../components/EmployerDashboard/EmployerNavBar";
import NotificationsBell from "../../components/Notifications/NotificationsBell";
import companyService from "../../services/companyService";

const EmployerApplicantsPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, isEmployer } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [companyProfile, setCompanyProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch applicant counts for all jobs
  const { counts: applicantCounts, loading: countsLoading } = useApplicantCounts(
    jobs
  );

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate("/login");
      } else if (!isEmployer) {
        navigate("/applicant-dashboard");
      }
    }
  }, [user, authLoading, isEmployer, navigate]);

  useEffect(() => {
    if (user && isEmployer) {
      fetchCompanyProfile();
      fetchJobs();
    }
  }, [user, isEmployer]);

  const fetchCompanyProfile = async () => {
    try {
      const response = await companyService.getProfile();
      if (response.success) {
        setCompanyProfile(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch company profile:", err);
    }
  };

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await jobService.getMyJobs();

      if (response.success) {
        setJobs(response.data || []);
      }
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError(err.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleViewApplicants = (jobId) => {
    navigate(`/employer/jobs/${jobId}/applicants`);
  };

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
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-40">
        <EmployerNavbar
          companyProfile={companyProfile}
          bellSlot={<NotificationsBell />}
        />
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl text-gray-900 mb-2">Applicants</h1>
          <p className="text-gray-600">
            Review and manage applicants for your job postings
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {jobs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
            <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg text-gray-900 mb-2">No jobs posted yet</h3>
            <p className="text-gray-600 mb-6">
              Post a job to start receiving applications
            </p>
            <button
              onClick={() => navigate("/employer/post-job")}
              className="px-6 py-3 bg-chart-1 text-white rounded-lg hover:opacity-90 transition"
            >
              Post Your First Job
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg text-gray-900 truncate">
                        {job.title}
                      </h3>
                      <span
                        className={`px-3 py-1 text-xs rounded-full ${
                          job.status === "open"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {job.status === "open" ? "Open" : "Closed"}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>
                          {countsLoading
                            ? "..."
                            : applicantCounts[job._id] !== undefined
                            ? `${applicantCounts[job._id]} ${
                                applicantCounts[job._id] === 1
                                  ? "applicant"
                                  : "applicants"
                              }`
                            : "0 applicants"}
                        </span>
                      </div>
                      <span>•</span>
                      <span>
                        Posted{" "}
                        {new Date(job.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleViewApplicants(job._id)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-chart-1 text-white rounded-lg hover:opacity-90 transition"
                  >
                    View Applicants
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default EmployerApplicantsPage;
