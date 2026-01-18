import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Briefcase,
  Bell,
  FileText,
  Calendar,
  Building,
  MapPin,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import applicationsApiService from "../../services/applicationsService";
import applicantService from "../../services/applicantService";
import ApplicantProfileSetupModal from "../../components/ApplicantProfile/ApplicantProfileSetupModal";

const ApplicationsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading, isApplicant } = useAuth();

  const [applicantProfile, setApplicantProfile] = useState(null);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Check auth and role
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate("/login");
      } else if (!isApplicant) {
        navigate("/employer-dashboard");
      }
    }
  }, [user, authLoading, isApplicant, navigate]);

  // Fetch applicant profile
  useEffect(() => {
    if (user && isApplicant) {
      fetchApplicantProfile();
    }
  }, [user, isApplicant]);

  // Fetch applications when profile exists
  useEffect(() => {
    if (applicantProfile) {
      fetchApplications();
    }
  }, [applicantProfile, pagination.page]);

  const fetchApplicantProfile = async () => {
    try {
      const response = await applicantService.getProfile();

      if (response.success) {
        if (!response.data) {
          setShowSetupModal(true);
          setApplicantProfile(null);
        } else {
          setApplicantProfile(response.data);
        }
      }
    } catch (err) {
      console.error("Failed to fetch applicant profile:", err);
      setShowSetupModal(true);
      setApplicantProfile(null);
    }
  };

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await applicationsApiService.getMyApplications({
        page: pagination.page,
        limit: pagination.limit,
      });

      if (response.success) {
        // Backend returns data.applications array
        setApplications(response.data || []);

        // Update pagination if provided
        if (response.pagination) {
          setPagination((prev) => ({
            ...prev,
            ...response.pagination,
          }));
        }
      }
    } catch (err) {
      console.error("Error fetching applications:", err);
      setError(err.message || "Failed to load applications");
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSetupSuccess = async () => {
    setShowSetupModal(false);
    await fetchApplicantProfile();
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
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusLabel = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  if (authLoading || (loading && !applicantProfile)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-chart-1 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {(showSetupModal || !applicantProfile) && (
        <ApplicantProfileSetupModal onSuccess={handleSetupSuccess} />
      )}

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card border-b border-border sticky top-0 z-40">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="size-7 text-chart-1" />
                <span className="text-xl text-foreground">SuitLink</span>
              </div>

              <nav className="hidden md:flex items-center gap-6">
                <button
                  onClick={() => navigate("/applicant-dashboard")}
                  className={`text-sm font-medium pb-1 ${
                    isActiveRoute("/applicant-dashboard")
                      ? "text-chart-1 border-b-2 border-chart-1"
                      : "text-muted-foreground hover:text-foreground"
                  } py-1`}
                >
                  Find Jobs
                </button>
                <button
                  onClick={() => navigate("/applications")}
                  className={`text-sm font-medium pb-1 ${
                    isActiveRoute("/applications")
                      ? "text-chart-1 border-b-2 border-chart-1"
                      : "text-muted-foreground hover:text-foreground"
                  } py-1`}
                >
                  Applications
                </button>
              </nav>

              <div className="flex items-center gap-4">
                <button className="relative">
                  <Bell className="size-5 text-muted-foreground hover:text-foreground" />
                </button>
                <button
                  onClick={() => navigate("/profile")}
                  className="w-9 h-9 rounded-full bg-chart-1 flex items-center justify-center text-white text-sm"
                >
                  {user?.name?.[0]?.toUpperCase() || "A"}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl text-foreground mb-2">My Applications</h1>
            <p className="text-muted-foreground">
              Track the status of your job applications
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-chart-1 mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading applications...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-6 text-center">
              <p className="text-destructive mb-4">{error}</p>
              <button
                onClick={fetchApplications}
                className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90"
              >
                Retry
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && applications.length === 0 && (
            <div className="bg-card rounded-xl border border-border p-12 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg text-foreground mb-2">
                No applications yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Start applying to jobs to see them here
              </p>
              <button
                onClick={() => navigate("/applicant-dashboard")}
                className="px-6 py-3 bg-chart-1 text-white rounded-lg hover:opacity-90"
              >
                Browse Jobs
              </button>
            </div>
          )}

          {/* Applications List */}
          {!loading && !error && applications.length > 0 && (
            <div className="bg-card rounded-xl border border-border">
              <div className="divide-y divide-border">
                {applications.map((application) => (
                  <div
                    key={application._id}
                    className="p-6 hover:bg-accent transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg text-foreground">
                            {application.jobPosting?.title || "Job Title"}
                          </h3>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                              application.status
                            )}`}
                          >
                            {getStatusLabel(application.status)}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <Building className="w-4 h-4" />
                            <span>
                              {application.jobPosting?.company?.companyName ||
                                application.company?.companyName ||
                                "Company"}
                            </span>
                          </div>
                          {application.jobPosting?.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{application.jobPosting.location}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              Applied {formatDate(application.createdAt)}
                            </span>
                          </div>
                        </div>

                        {application.coverLetter && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {application.coverLetter}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() =>
                          navigate(`/jobs/${application.jobPosting?._id}`)
                        }
                        disabled={!application.jobPosting?._id}
                        className="ml-4 px-4 py-2 border border-border rounded-lg hover:bg-accent text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        View Job
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="p-4 border-t border-border flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.totalItems
                    )}{" "}
                    of {pagination.totalItems} applications
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
                      className="px-4 py-2 border border-border rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      Previous
                    </button>

                    <span className="px-4 py-2 text-sm text-foreground">
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
                      className="px-4 py-2 border border-border rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed text-sm"
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
    </>
  );
};

export default ApplicationsPage;
