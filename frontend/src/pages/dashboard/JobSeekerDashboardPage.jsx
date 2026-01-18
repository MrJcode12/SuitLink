import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, Briefcase, SlidersHorizontal, Bell, X } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import jobsApiService from "../../services/applicantJobsService";
import applicationsApiService from "../../services/applicationsService";
import applicantService from "../../services/applicantService";
import JobGrid from "../../components/ApplicantDashboard/JobGrid";
import JobModal from "../../components/ApplicantDashboard/JobModal";
import Pagination from "../../components/ApplicantDashboard/Pagination";
import ApplicantProfileSetupModal from "../../components/ApplicantProfile/ApplicantProfileSetupModal";

const JobSeekerDashboardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading, isApplicant } = useAuth();

  const [applicantProfile, setApplicantProfile] = useState(null);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [jobs, setJobs] = useState([]);
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

  const [showFilters, setShowFilters] = useState(false);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [searchInput, setSearchInput] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    employmentType: "",
    remote: "",
    salaryMin: "",
    salaryMax: "",
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

  // Fetch applied jobs when profile exists
  useEffect(() => {
    if (applicantProfile) {
      fetchAppliedJobs();
    }
  }, [applicantProfile]);

  // Fetch jobs when filters or pagination change
  useEffect(() => {
    fetchJobs();
  }, [pagination.page, filters]);

  // Debounced search - update filters when search input changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        setFilters((prev) => ({ ...prev, search: searchInput }));
        setPagination((prev) => ({ ...prev, page: 1 }));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchApplicantProfile = async () => {
    try {
      setLoading(true);
      const response = await applicantService.getProfile();

      if (response.success) {
        // Profile data will be null if no profile exists
        if (!response.data || response.data === null) {
          setShowSetupModal(true);
          setApplicantProfile(null);
        } else {
          setApplicantProfile(response.data);
          setShowSetupModal(false);
        }
      }
    } catch (err) {
      console.error("Failed to fetch applicant profile:", err);
      // On any error, show setup modal
      setShowSetupModal(true);
      setApplicantProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchAppliedJobs = async () => {
    try {
      const response = await applicationsApiService.getMyApplications({
        page: 1,
        limit: 1000,
      });

      if (response.success && response.data) {
        // Handle both array and applications object structure
        const applications = Array.isArray(response.data)
          ? response.data
          : response.data.applications || [];

        const appliedIds = new Set(
          applications
            .map((app) => app.jobPosting?._id || app.jobPosting)
            .filter(Boolean) // Filter out any undefined/null values
        );
        setAppliedJobIds(appliedIds);
      }
    } catch (err) {
      console.error("Error fetching applied jobs:", err);
      // Set empty set on error
      setAppliedJobIds(new Set());
    }
  };

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      };

      const response = await jobsApiService.getJobs(params);

      if (response.success) {
        setJobs(response.data.jobs || []);
        setPagination(
          response.data.pagination || {
            page: 1,
            limit: 10,
            totalItems: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: false,
          }
        );
      }
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError(err.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, search: searchInput }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleJobClick = (jobId) => {
    const job = jobs.find((j) => j._id === jobId);
    if (job) {
      setSelectedJob(job);
    }
  };

  const handleApplySuccess = (jobId) => {
    setAppliedJobIds((prev) => new Set([...prev, jobId]));
    fetchAppliedJobs(); // Refresh applied jobs
  };

  const closeModal = () => {
    setSelectedJob(null);
  };

  const goToPage = (page) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const nextPage = () => {
    if (pagination.hasNextPage) {
      setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const prevPage = () => {
    if (pagination.hasPrevPage) {
      setPagination((prev) => ({ ...prev, page: prev.page - 1 }));
    }
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const handleSetupSuccess = async () => {
    setShowSetupModal(false);
    await fetchApplicantProfile();
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-chart-1 mx-auto"></div>
          <p className="text-muted-foreground mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {(showSetupModal || !applicantProfile) && (
        <ApplicantProfileSetupModal onSuccess={handleSetupSuccess} />
      )}

      {selectedJob && (
        <JobModal
          job={selectedJob}
          onClose={closeModal}
          isApplied={appliedJobIds.has(selectedJob._id)}
          onApplySuccess={handleApplySuccess}
        />
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

        <main className="p-6">
          {/* Search and Filters */}
          <div className="mb-6 flex gap-3">
            <form onSubmit={handleSearchSubmit} className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by job title or company name..."
                className="w-full pl-12 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:border-chart-1 focus:ring-1 focus:ring-chart-1 bg-card text-foreground"
              />
            </form>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden bg-chart-1 text-white px-4 py-3 rounded-lg hover:opacity-90"
            >
              <SlidersHorizontal className="size-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <div
              className={`lg:col-span-1 ${
                showFilters ? "block" : "hidden lg:block"
              }`}
            >
              <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg text-foreground">Filters</h3>
                  {showFilters && (
                    <button
                      onClick={() => setShowFilters(false)}
                      className="lg:hidden p-1 hover:bg-accent rounded"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {/* Employment Type */}
                  <div>
                    <label className="block text-sm text-foreground mb-2">
                      Employment Type
                    </label>
                    <select
                      value={filters.employmentType}
                      onChange={(e) =>
                        handleFilterChange("employmentType", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-chart-1 bg-card text-foreground"
                    >
                      <option value="">All Types</option>
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="contract">Contract</option>
                      <option value="internship">Internship</option>
                    </select>
                  </div>

                  {/* Remote */}
                  <div>
                    <label className="block text-sm text-foreground mb-2">
                      Work Type
                    </label>
                    <select
                      value={filters.remote}
                      onChange={(e) =>
                        handleFilterChange("remote", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-chart-1 bg-card text-foreground"
                    >
                      <option value="">All</option>
                      <option value="true">Remote</option>
                      <option value="false">On-site</option>
                    </select>
                  </div>

                  {/* Salary Range */}
                  <div>
                    <label className="block text-sm text-foreground mb-2">
                      Minimum Salary
                    </label>
                    <input
                      type="number"
                      value={filters.salaryMin}
                      onChange={(e) =>
                        handleFilterChange("salaryMin", e.target.value)
                      }
                      placeholder="e.g., 30000"
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-chart-1 bg-card text-foreground"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-foreground mb-2">
                      Maximum Salary
                    </label>
                    <input
                      type="number"
                      value={filters.salaryMax}
                      onChange={(e) =>
                        handleFilterChange("salaryMax", e.target.value)
                      }
                      placeholder="e.g., 80000"
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-chart-1 bg-card text-foreground"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Job Listings */}
            <div className="lg:col-span-3 space-y-6">
              <JobGrid
                jobs={jobs}
                loading={loading}
                error={error}
                appliedJobIds={appliedJobIds}
                onJobClick={handleJobClick}
              />

              {!loading && !error && jobs.length > 0 && (
                <Pagination
                  pagination={pagination}
                  onPageChange={goToPage}
                  onNext={nextPage}
                  onPrev={prevPage}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default JobSeekerDashboardPage;
