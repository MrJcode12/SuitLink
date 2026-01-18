import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  Mail,
  MapPin,
  Calendar,
  Award,
  FileText,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import useJobApplicants from "../../hooks/useJobApplicants";
import jobService from "../../services/jobService";
import EmployerNavbar from "../../components/EmployerDashboard/EmployerNavBar";
import NotificationsBell from "../../components/Notifications/NotificationsBell";
import companyService from "../../services/companyService";

const JobApplicantsPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading, isEmployer } = useAuth();

  const {
    applicants,
    loading,
    error,
    updating,
    updateStatus,
    refetch,
  } = useJobApplicants(jobId);

  const [job, setJob] = useState(null);
  const [companyProfile, setCompanyProfile] = useState(null);
  const [jobLoading, setJobLoading] = useState(true);
  const [statusUpdateSuccess, setStatusUpdateSuccess] = useState(null);

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
      fetchJobDetails();
    }
  }, [user, isEmployer, jobId]);

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

  const fetchJobDetails = async () => {
    try {
      setJobLoading(true);
      const response = await jobService.getJobById(jobId);

      if (response.success) {
        setJob(response.data);
      }
    } catch (err) {
      console.error("Error fetching job details:", err);
    } finally {
      setJobLoading(false);
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    const result = await updateStatus(applicationId, newStatus);

    if (result.success) {
      setStatusUpdateSuccess(applicationId);
      setTimeout(() => setStatusUpdateSuccess(null), 3000);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-blue-50 text-blue-700 ring-1 ring-blue-200";
      case "reviewed":
        return "bg-purple-50 text-purple-700 ring-1 ring-purple-200";
      case "accepted":
        return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
      case "rejected":
        return "bg-red-50 text-red-700 ring-1 ring-red-200";
      default:
        return "bg-gray-50 text-gray-700 ring-1 ring-gray-200";
    }
  };

  const getStatusLabel = (status) => {
    return status?.charAt(0).toUpperCase() + status?.slice(1);
  };

  const getAvailableStatusTransitions = (currentStatus) => {
    switch (currentStatus) {
      case "pending":
        return [
          { value: "reviewed", label: "Mark as Reviewed" },
          { value: "accepted", label: "Accept" },
          { value: "rejected", label: "Reject" },
        ];
      case "reviewed":
        return [
          { value: "accepted", label: "Accept" },
          { value: "rejected", label: "Reject" },
        ];
      case "accepted":
      case "rejected":
        return [];
      default:
        return [];
    }
  };

  if (authLoading || jobLoading) {
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
        {/* Back button and header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/employer/applicants")}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Back to All Jobs</span>
          </button>

          <h1 className="text-2xl text-gray-900 mb-2">
            {job?.title || "Job"} - Applicants
          </h1>
          <p className="text-gray-600">
            Review and manage applicants for this position
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <p className="text-xs text-gray-500">Total Applicants</p>
            <p className="text-2xl text-gray-900 font-medium mt-1">
              {applicants.length}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <p className="text-xs text-gray-500">Pending</p>
            <p className="text-2xl text-gray-900 font-medium mt-1">
              {applicants.filter((a) => a.status === "pending").length}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <p className="text-xs text-gray-500">Reviewed</p>
            <p className="text-2xl text-gray-900 font-medium mt-1">
              {applicants.filter((a) => a.status === "reviewed").length}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <p className="text-xs text-gray-500">Accepted</p>
            <p className="text-2xl text-gray-900 font-medium mt-1">
              {applicants.filter((a) => a.status === "accepted").length}
            </p>
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-700 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-red-800">{error}</p>
              <button
                onClick={refetch}
                className="text-sm text-red-700 underline mt-2"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Loading state */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-chart-1 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading applicants...</p>
          </div>
        ) : applicants.length === 0 ? (
          /* Empty state */
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg text-gray-900 mb-2">No applicants yet</h3>
            <p className="text-gray-600">
              Applications will appear here when candidates apply for this
              position
            </p>
          </div>
        ) : (
          /* Applicants list */
          <div className="space-y-4">
            {applicants.map((application) => {
              const applicant = application.applicant || {};
              const transitions = getAvailableStatusTransitions(
                application.status
              );
              const isUpdating = updating === application._id;
              const showSuccess = statusUpdateSuccess === application._id;

              return (
                <div
                  key={application._id}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    {/* Applicant info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full bg-chart-1 flex items-center justify-center text-white font-medium">
                          {applicant.firstName?.[0]}
                          {applicant.lastName?.[0]}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-lg text-gray-900 truncate">
                            {applicant.firstName} {applicant.lastName}
                          </h3>
                          <span
                            className={`inline-block px-2.5 py-1 text-xs rounded-full ${getStatusColor(
                              application.status
                            )}`}
                          >
                            {getStatusLabel(application.status)}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                        {applicant.location && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span>{applicant.location}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>
                            Applied{" "}
                            {new Date(application.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Skills */}
                      {applicant.skills && applicant.skills.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-700 mb-2 font-medium">
                            Skills
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {applicant.skills.slice(0, 5).map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                              >
                                {skill}
                              </span>
                            ))}
                            {applicant.skills.length > 5 && (
                              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                                +{applicant.skills.length - 5} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Resume analysis */}
                      {applicant.resumeAnalysis?.score && (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Award className="w-4 h-4 text-chart-1" />
                          <span>Resume Score: {applicant.resumeAnalysis.score}/100</span>
                          {applicant.resumeAnalysis.seniority && (
                            <>
                              <span>•</span>
                              <span>{applicant.resumeAnalysis.seniority} Level</span>
                            </>
                          )}
                        </div>
                      )}

                      {/* Cover letter */}
                      {application.coverLetter && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="w-4 h-4 text-gray-500" />
                            <p className="text-sm text-gray-700 font-medium">
                              Cover Letter
                            </p>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-3">
                            {application.coverLetter}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Status update actions */}
                    <div className="lg:w-64 flex-shrink-0">
                      {showSuccess && (
                        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-700" />
                          <p className="text-sm text-emerald-700">
                            Status updated
                          </p>
                        </div>
                      )}

                      {transitions.length > 0 ? (
                        <div className="space-y-2">
                          <p className="text-sm text-gray-700 font-medium mb-3">
                            Update Status
                          </p>
                          {transitions.map((transition) => (
                            <button
                              key={transition.value}
                              onClick={() =>
                                handleStatusChange(
                                  application._id,
                                  transition.value
                                )
                              }
                              disabled={isUpdating}
                              className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed ${
                                transition.value === "accepted"
                                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                  : transition.value === "rejected"
                                  ? "bg-red-600 text-white hover:bg-red-700"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                            >
                              {isUpdating ? "Updating..." : transition.label}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600 text-center">
                            No further actions available
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default JobApplicantsPage;
