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

  const [applicantProfile, setApplicantProfile] = useState(null);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    if (user && isApplicant) fetchApplicantProfile();
  }, [user, isApplicant]);
  useEffect(() => {
    if (applicantProfile) fetchAppliedJobs();
  }, [applicantProfile]);
  useEffect(() => {
    fetchJobs();
  }, [pagination.page, filters]);

  const fetchApplicantProfile = async () => {
    try {
      setLoading(true);
      const response = await applicantService.getProfile();
      if (response.success) {
        if (!response.data) {
          setShowSetupModal(true);
          setApplicantProfile(null);
        } else {
          setApplicantProfile(response.data);
          setShowSetupModal(false);
        }
      }
    } catch {
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
    } catch {
      setAppliedJobIds(new Set());
    }
  };

  const fetchJobs = async () => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();
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
      if (err.name !== "AbortError")
        setError(err.message || "Failed to load jobs");
    } finally {
      setLoading(false);
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
    await fetchApplicantProfile();
  };

  if (authLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading...</p>
        </div>
      </div>
    );

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

      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <ApplicantNavbar />
        </header>

        <main className="p-6">
          {/* Search */}
          <div className="mb-6 flex gap-3">
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

            <button
              onClick={handleSearch}
              className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition font-medium"
            >
              Search
            </button>

            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden bg-emerald-600 text-white px-4 py-3 rounded-lg hover:bg-emerald-700"
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
              <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg text-gray-900 font-medium">Filters</h3>
                  {showFilters && (
                    <button
                      onClick={() => setShowFilters(false)}
                      className="lg:hidden p-1.5 rounded hover:bg-gray-100"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  )}
                </div>

                <div className="space-y-4">
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

                  <div>
                    <label className="block text-sm text-gray-900 mb-2">
                      Work Type
                    </label>
                    <select
                      value={filters.remote}
                      onChange={(e) =>
                        handleFilterChange("remote", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 bg-white text-gray-900 placeholder-gray-400"
                    >
                      <option value="">All</option>
                      <option value="true">Remote</option>
                      <option value="false">On-site</option>
                    </select>
                  </div>

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
