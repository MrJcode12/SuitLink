import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FileText,
  Calendar,
  Building,
  MapPin,
  Search,
  SlidersHorizontal,
  RefreshCcw,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import applicationsApiService from "../../services/applicationsService";
import applicantService from "../../services/applicantService";
import ApplicantProfileSetupModal from "../../components/ApplicantProfile/ApplicantProfileSetupModal";
import ApplicantNavbar from "../../components/ApplicantProfile/ApplicantNavbar";
import ApplicationJobModal from "../../components/ApplicantApplications/ApplicationModal";

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

  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  const [selectedApplication, setSelectedApplication] = useState(null);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate("/login");
      } else if (!isApplicant) {
        navigate("/employer-dashboard");
      }
    }
  }, [user, authLoading, isApplicant, navigate]);

  useEffect(() => {
    if (user && isApplicant) {
      fetchApplicantProfile();
    }
  }, [user, isApplicant]);

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
        setApplications(response.data || []);
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

  const clearFilters = () => {
    setSearchInput("");
    setStatusFilter("");
    setSortBy("newest");
  };

  const stats = useMemo(() => {
    const counts = { pending: 0, reviewed: 0, accepted: 0, rejected: 0 };
    for (const a of applications) {
      if (a?.status && counts[a.status] !== undefined) counts[a.status] += 1;
    }
    return {
      totalLoaded: applications.length,
      ...counts,
    };
  }, [applications]);

  const filteredApplications = useMemo(() => {
    const q = searchInput.trim().toLowerCase();

    const list = (applications || [])
      .filter((app) => {
        if (!statusFilter) return true;
        return app.status === statusFilter;
      })
      .filter((app) => {
        if (!q) return true;
        const title = (app.jobPosting?.title || "").toLowerCase();
        const company = (
          app.jobPosting?.company?.companyName ||
          app.company?.companyName ||
          ""
        ).toLowerCase();
        const locationText = (app.jobPosting?.location || "").toLowerCase();
        return (
          title.includes(q) || company.includes(q) || locationText.includes(q)
        );
      });

    list.sort((a, b) => {
      const at = new Date(a?.createdAt || 0).getTime();
      const bt = new Date(b?.createdAt || 0).getTime();
      if (sortBy === "oldest") return at - bt;
      return bt - at;
    });

    return list;
  }, [applications, searchInput, statusFilter, sortBy]);

  const openApplicationModal = (application) => {
    setSelectedApplication(application);
  };

  const closeApplicationModal = () => {
    setSelectedApplication(null);
  };

  if (authLoading || (loading && !applicantProfile)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {(showSetupModal || !applicantProfile) && (
        <ApplicantProfileSetupModal onSuccess={handleSetupSuccess} />
      )}

      {selectedApplication && (
        <ApplicationJobModal
          application={selectedApplication}
          onClose={closeApplicationModal}
          formatDate={formatDate}
          getStatusColor={getStatusColor}
          getStatusLabel={getStatusLabel}
        />
      )}

      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <ApplicantNavbar />
        </header>

        <main className="max-w-6xl mx-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl text-gray-900 font-medium mb-2">
              My Applications
            </h1>
            <p className="text-gray-600">
              Track application progress and review details in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4">
              <p className="text-xs text-gray-500">Loaded</p>
              <p className="text-xl text-gray-900 font-medium mt-1">
                {stats.totalLoaded}
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4">
              <p className="text-xs text-gray-500">Pending</p>
              <p className="text-xl text-gray-900 font-medium mt-1">
                {stats.pending}
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4">
              <p className="text-xs text-gray-500">Reviewed</p>
              <p className="text-xl text-gray-900 font-medium mt-1">
                {stats.reviewed}
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4">
              <p className="text-xs text-gray-500">Accepted</p>
              <p className="text-xl text-gray-900 font-medium mt-1">
                {stats.accepted}
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4">
              <p className="text-xs text-gray-500">Rejected</p>
              <p className="text-xl text-gray-900 font-medium mt-1">
                {stats.rejected}
              </p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search by job title, company, or location..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 bg-white text-gray-900 placeholder-gray-400"
                />
              </div>

              <button
                type="button"
                onClick={() => setShowFilters((v) => !v)}
                className="lg:hidden inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                <SlidersHorizontal className="size-5" />
                Filters
              </button>

              <div
                className={`grid grid-cols-1 sm:grid-cols-3 gap-3 ${
                  showFilters ? "block" : "hidden lg:block"
                } lg:flex lg:items-center lg:gap-3`}
              >
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full lg:w-48 px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 bg-white text-gray-900"
                >
                  <option value="">All statuses</option>
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full lg:w-44 px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 bg-white text-gray-900"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                </select>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="w-full lg:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-medium"
                >
                  <RefreshCcw className="size-4" />
                  Reset
                </button>
              </div>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <p className="text-sm text-gray-600">
                Showing{" "}
                <span className="text-gray-900 font-medium">
                  {filteredApplications.length}
                </span>{" "}
                of{" "}
                <span className="text-gray-900 font-medium">
                  {applications.length}
                </span>{" "}
                loaded applications
              </p>
            </div>
          </div>

          {loading && (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-10 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading applications...</p>
            </div>
          )}

          {error && !loading && (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 text-center">
              <p className="text-red-700 mb-4">{error}</p>
              <button
                onClick={fetchApplications}
                className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && applications.length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg text-gray-900 font-medium mb-2">
                No applications yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start applying to jobs to see them here.
              </p>
              <button
                onClick={() => navigate("/applicant-dashboard")}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium"
              >
                Browse Jobs
              </button>
            </div>
          )}

          {!loading && !error && applications.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-100">
                {filteredApplications.map((application) => (
                  <div
                    key={application._id}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="text-lg text-gray-900 font-medium truncate">
                            {application.jobPosting?.title || "Job Title"}
                          </h3>
                          <span
                            className={`px-2.5 py-1 text-xs rounded-full ${getStatusColor(
                              application.status
                            )}`}
                          >
                            {getStatusLabel(application.status)}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <Building className="w-4 h-4 text-gray-400" />
                            <span className="truncate">
                              {application.jobPosting?.company?.companyName ||
                                application.company?.companyName ||
                                "Company"}
                            </span>
                          </div>

                          {application.jobPosting?.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span className="truncate">
                                {application.jobPosting.location}
                              </span>
                            </div>
                          )}

                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span>
                              Applied {formatDate(application.createdAt)}
                            </span>
                          </div>
                        </div>

                        {application.coverLetter && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {application.coverLetter}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openApplicationModal(application)}
                          className="px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm text-gray-700"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {pagination.totalPages > 1 && (
                <div className="p-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="text-sm text-gray-600">
                    Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.totalItems
                    )}{" "}
                    of{" "}
                    <span className="text-gray-900 font-medium">
                      {pagination.totalItems}
                    </span>{" "}
                    applications
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
                      className="px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm text-gray-700"
                    >
                      Previous
                    </button>

                    <span className="px-4 py-2 text-sm text-gray-700">
                      Page{" "}
                      <span className="text-gray-900 font-medium">
                        {pagination.page}
                      </span>{" "}
                      of{" "}
                      <span className="text-gray-900 font-medium">
                        {pagination.totalPages}
                      </span>
                    </span>

                    <button
                      onClick={() =>
                        setPagination((prev) => ({
                          ...prev,
                          page: prev.page + 1,
                        }))
                      }
                      disabled={!pagination.hasNextPage}
                      className="px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm text-gray-700"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 bg-emerald-700 text-white rounded-2xl p-6 flex items-center justify-between gap-6">
            <div className="max-w-2xl">
              <h3 className="text-lg font-medium">
                {user?.name
                  ? `Hey ${user.name}, keep your momentum going.`
                  : "Stay on track with SuitLink"}
              </h3>
              <p className="text-sm text-emerald-100 mt-2">
                Review your application statuses regularly and refine your
                profile to improve matching accuracy across new opportunities.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/applicant-dashboard")}
              className="
                inline-flex
                items-center
                justify-center
                px-6
                py-2.5
                rounded-lg
                bg-white
                text-emerald-700
                font-medium
                shadow-sm
                transition
                hover:bg-emerald-50
                hover:text-emerald-800
                active:bg-emerald-100
                focus:outline-none
                focus:ring-2
                focus:ring-white
                focus:ring-offset-2
                focus:ring-offset-emerald-700
                whitespace-nowrap
              "
            >
              Browse More Jobs
            </button>
          </div>
        </main>
      </div>
    </>
  );
};

export default ApplicationsPage;
