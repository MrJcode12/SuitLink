import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, SlidersHorizontal, X } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import jobsApiService from "../../services/applicantJobsService";
import applicationsApiService from "../../services/applicationsService";
import applicantService from "../../services/applicantService";
import JobGrid from "../../components/ApplicantDashboard/JobGrid";
import JobModal from "../../components/ApplicantDashboard/JobModal";
import Pagination from "../../components/ApplicantDashboard/Pagination";
import ApplicantProfileSetupModal from "../../components/ApplicantProfile/ApplicantProfileSetupModal";
import ApplicantNavbar from "../../components/ApplicantProfile/ApplicantNavbar";

const JobSeekerDashboardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading, isApplicant } = useAuth();

  const [bookmarkedJobIds, setBookmarkedJobIds] = useState(new Set());

  // Profile state with explicit loading flags
  const [applicantProfile, setApplicantProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [showSetupModal, setShowSetupModal] = useState(false);

  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [error, setError] = useState("");
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [searchInput, setSearchInput] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [filters, setFilters] = useState({
    search: "",
    employmentType: "",
    remote: "",
    salaryMin: "",
    salaryMax: "",
  });
  const abortControllerRef = useRef(null);

  useEffect(() => {
    if (!authLoading) {
      if (!user) navigate("/login");
      else if (!isApplicant) navigate("/employer-dashboard");
    }
  }, [user, authLoading, isApplicant, navigate]);

  // Fetch applicant profile ONCE on mount
  useEffect(() => {
    if (user && isApplicant && !profileLoaded) {
      fetchApplicantProfile();
    }
  }, [user, isApplicant, profileLoaded]);

  // Fetch applied jobs when profile exists
  useEffect(() => {
    if (applicantProfile && profileLoaded) {
      fetchAppliedJobs();
    }
  }, [applicantProfile, profileLoaded]);

  // Fetch jobs when filters change or profile is loaded
  useEffect(() => {
    if (profileLoaded) {
      fetchJobs();
    }
  }, [pagination.page, filters, profileLoaded]);

  const fetchApplicantProfile = async () => {
    try {
      setProfileLoading(true);
      const response = await applicantService.getProfile();

      if (response.success) {
        if (!response.data) {
          // No profile exists - show setup modal
          setShowSetupModal(true);
          setApplicantProfile(null);
        } else {
          // Profile exists
          setApplicantProfile(response.data);
          setShowSetupModal(false);
        }
      }
    } catch (err) {
      console.error("Failed to fetch applicant profile:", err);
      // Only show setup modal on actual "not found" errors
      if (err.message?.includes("not found") || err.message?.includes("does not exist")) {
        setShowSetupModal(true);
        setApplicantProfile(null);
      }
    } finally {
      setProfileLoading(false);
      setProfileLoaded(true);
    }
  };

  const fetchAppliedJobs = async () => {
    try {
      const response = await applicationsApiService.getMyApplications({
        page: 1,
        limit: 1000,
      });
      if (response.success && response.data) {
        const applications = Array.isArray(response.data)
          ? response.data
          : response.data.applications || [];
        const appliedIds = new Set(
          applications
            .map((app) => app.jobPosting?._id || app.jobPosting)
            .filter(Boolean)
        );
        setAppliedJobIds(appliedIds);
      }
    } catch (err) {
      console.error("Error fetching applied jobs:", err);
      setAppliedJobIds(new Set());
    }
  };

  const fetchJobs = async () => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    try {
      setJobsLoading(true);
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
      if (err.name !== "AbortError") {
        console.error("Error fetching jobs:", err);
        setError(err.message || "Failed to load jobs");
      }
    } finally {
      setJobsLoading(false);
    }
  };

  const handleSearch = () => {
    setFilters((prev) => ({ ...prev, search: searchInput.trim() }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setFilters((prev) => ({ ...prev, search: "" }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleJobClick = (jobId) => {
    const job = jobs.find((j) => j._id === jobId);
    if (job) setSelectedJob(job);
  };

  const handleApplySuccess = (jobId) => {
    setAppliedJobIds((prev) => new Set([...prev, jobId]));
    fetchAppliedJobs();
  };

  const closeModal = () => setSelectedJob(null);

  const goToPage = (page) => setPagination((prev) => ({ ...prev, page }));

  const nextPage = () => {
    if (pagination.hasNextPage)
      setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
  };

  const prevPage = () => {
    if (pagination.hasPrevPage)
      setPagination((prev) => ({ ...prev, page: prev.page - 1 }));
  };

  const handleSetupSuccess = async () => {
    setShowSetupModal(false);
    setProfileLoaded(false); // Force refetch
    await fetchApplicantProfile();
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      employmentType: "",
      remote: "",
      salaryMin: "",
      salaryMax: "",
    });
    setSearchInput("");
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleBookmarkToggle = (jobId) => {
    setBookmarkedJobIds((prev) => {
      const next = new Set(prev);
      if (next.has(jobId)) {
        next.delete(jobId);
      } else {
        next.add(jobId);
      }
      return next;
    });
  };

  // Show loading only while auth or profile is initially loading
  if (authLoading || (profileLoading && !profileLoaded)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  // Only show setup modal if profile is confirmed to not exist
  const shouldShowSetupModal = profileLoaded && showSetupModal && !applicantProfile;

  return (
    <>
      {shouldShowSetupModal && (
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

      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <ApplicantNavbar />
        </header>

        <div className="flex w-full">
          {/* Sidebar */}
          <aside className="hidden lg:flex flex-col w-72 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 p-6 sticky top-16 overflow-y-auto">
            <h3 className="text-lg text-gray-900 font-medium mb-4">Filters</h3>
            <div className="space-y-4 flex-1">
              {/* Employment Type */}
              <div>
                <label className="block text-sm text-gray-900 mb-2">
                  Employment Type
                </label>
                <select
                  value={filters.employmentType}
                  onChange={(e) =>
                    handleFilterChange("employmentType", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 bg-white text-gray-900 placeholder-gray-400"
                >
                  <option value="">All Types</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>

              {/* Work Type */}
              <div>
                <label className="block text-sm text-gray-900 mb-2">
                  Work Type
                </label>
                <select
                  value={filters.remote}
                  onChange={(e) => handleFilterChange("remote", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 bg-white text-gray-900 placeholder-gray-400"
                >
                  <option value="">All</option>
                  <option value="true">Remote</option>
                  <option value="false">On-site</option>
                </select>
              </div>

              {/* Salary Min */}
              <div>
                <label className="block text-sm text-gray-900 mb-2">
                  Minimum Salary
                </label>
                <input
                  type="number"
                  value={filters.salaryMin}
                  onChange={(e) =>
                    handleFilterChange("salaryMin", e.target.value)
                  }
                  placeholder="e.g., 30000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 bg-white text-gray-900 placeholder-gray-400"
                />
              </div>

              {/* Salary Max */}
              <div>
                <label className="block text-sm text-gray-900 mb-2">
                  Maximum Salary
                </label>
                <input
                  type="number"
                  value={filters.salaryMax}
                  onChange={(e) =>
                    handleFilterChange("salaryMax", e.target.value)
                  }
                  placeholder="e.g., 80000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 bg-white text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetFilters}
              className="w-full text-sm font-medium text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg transition hover:bg-emerald-100 hover:text-emerald-800 active:bg-emerald-200"
            >
              Reset all filters
            </button>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-6">
            {/* Search Row */}
            <div className="mb-4 flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  placeholder="Search by job title or company name..."
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 bg-white text-gray-900 placeholder-gray-400"
                />
                {searchInput && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 p-1.5 rounded"
                  >
                    <X className="size-5" />
                  </button>
                )}
              </div>

              {/* Mobile Filter Toggle */}
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden bg-emerald-600 text-white px-4 py-3 rounded-lg hover:bg-emerald-700"
              >
                <SlidersHorizontal className="size-5" />
              </button>

              <button
                onClick={handleSearch}
                className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition font-medium"
              >
                Search
              </button>
            </div>

            {/* Meta Row */}
            <div className="mb-4 text-gray-600 text-sm">
              Showing {jobs.length} jobs
            </div>

            {/* Job Cards Grid */}
            <JobGrid
              jobs={jobs}
              loading={jobsLoading}
              error={error}
              appliedJobIds={appliedJobIds}
              onJobClick={handleJobClick}
              bookmarkedJobIds={bookmarkedJobIds}
              onBookmarkToggle={handleBookmarkToggle}
            />

            {!jobsLoading && !error && jobs.length > 0 && (
              <div className="mt-6">
                <Pagination
                  pagination={pagination}
                  onPageChange={goToPage}
                  onNext={nextPage}
                  onPrev={prevPage}
                />
              </div>
            )}

            {/* Footer / Dynamic Info Section */}
            <div className="mt-8 bg-emerald-700 text-white rounded-xl p-6">
              <h3 className="text-lg font-medium">
                {user?.name
                  ? `Hey ${user.name}, discover your next opportunity!`
                  : "Discover Your Next Opportunity with SuitLink"}
              </h3>
              <p className="text-sm text-emerald-100 mt-2">
                {jobs.length > 0
                  ? `You're currently viewing ${jobs.length} job${
                      jobs.length > 1 ? "s" : ""
                    }. SuitLink helps you find the best matches for your skills and experience.`
                  : "SuitLink helps you find the best jobs that match your skills and experience. Stay updated with new opportunities and get personalized recommendations directly in your dashboard."}
              </p>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default JobSeekerDashboardPage;
