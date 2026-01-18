import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Users, Calendar, FileText } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import applicationsApiService from "../../services/applicationsService";
import jobService from "../../services/jobService";
import Logo from "../../components/Auth/Shared/Logo";

const JobApplicantsPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 0,
  });
  const [filterStatus, setFilterStatus] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState({});

  useEffect(() => {
    fetchJobDetails();
    fetchApplicants();
  }, [jobId, pagination.page, filterStatus]);

  const fetchJobDetails = async () => {
    try {
      const response = await jobService.getJobById(jobId);
      if (response.success) {
        setJob(response.data);
      }
    } catch (err) {
      console.error("Error fetching job details:", err);
    }
  };

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await applicationsApiService.getJobApplicants(jobId, {
        page: pagination.page,
        limit: pagination.limit,
        status: filterStatus,
      });

      if (response.success) {
        setApplications(response.data.applications || response.data || []);
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        }
      }
    } catch (err) {
      console.error("Error fetching applicants:", err);
      setError(err.message || "Failed to load applicants");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      setUpdatingStatus((prev) => ({ ...prev, [applicationId]: true }));

      const response = await applicationsApiService.updateApplicationStatus(
        applicationId,
        newStatus
      );

      if (response.success) {
        // Update local state
        setApplications((prev) =>
          prev.map((app) =>
            app._id === applicationId ? { ...app, status: newStatus } : app
          )
        );
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert(err.message || "Failed to update status");
    } finally {
      setUpdatingStatus((prev) => ({ ...prev, [applicationId]: false }));
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-blue-100 text-blue-700";
      case "reviewed":
        return "bg-purple-100 text-purple-700";
      case "accepted":
        return "bg-emerald-100 text-emerald-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <Logo />
            <button
              onClick={() => navigate("/employer-dashboard")}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">Back to Dashboard</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        {/* Job Info Header */}
        {job && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h1 className="text-2xl text-gray-900 mb-2">{job.title}</h1>
            <p className="text-gray-600">
              {job.company?.companyName} • {applications.length} applicants
            </p>
          </div>
        )}

        {/* Filter Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex items-center gap-4">
            <label className="text-sm text-gray-700">Filter by status:</label>
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-chart-1"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-chart-1 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading applicants...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchApplicants}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && applications.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg text-gray-900 mb-2">No applicants yet</h3>
            <p className="text-gray-600">
              Applicants will appear here once they apply for this position
            </p>
          </div>
        )}

        {/* Applicants List */}
        {!loading && !error && applications.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="divide-y divide-gray-200">
              {applications.map((application) => (
                <div
                  key={application._id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-chart-1 flex items-center justify-center text-white">
                          {application.applicant?.name?.[0]?.toUpperCase() ||
                            "A"}
                        </div>
                        <div>
                          <h3 className="text-base text-gray-900">
                            {application.applicant?.name || "Applicant"}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {application.applicant?.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3 ml-13">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Applied {formatDate(application.createdAt)}
                          </span>
                        </div>
                        {application.resume && (
                          <div className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            <a
                              href={application.resume.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-chart-1 hover:underline"
                            >
                              View Resume
                            </a>
                          </div>
                        )}
                      </div>

                      {application.coverLetter && (
                        <p className="text-sm text-gray-600 ml-13 mb-3">
                          {application.coverLetter}
                        </p>
                      )}

                      <div className="ml-13">
                        <span
                          className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(
                            application.status
                          )}`}
                        >
                          {application.status.charAt(0).toUpperCase() +
                            application.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="ml-4">
                      <select
                        value={application.status}
                        onChange={(e) =>
                          handleStatusUpdate(application._id, e.target.value)
                        }
                        disabled={updatingStatus[application._id]}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-chart-1 disabled:opacity-50 text-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="accepted">Accept</option>
                        <option value="rejected">Reject</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="p-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.totalItems
                  )}{" "}
                  of {pagination.totalItems} applicants
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        page: prev.page - 1,
                      }))
                    }
                    disabled={!pagination.hasPrevPage}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    Previous
                  </button>

                  <span className="px-4 py-2 text-sm text-gray-700">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>

                  <button
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        page: prev.page + 1,
                      }))
                    }
                    disabled={!pagination.hasNextPage}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default JobApplicantsPage;
