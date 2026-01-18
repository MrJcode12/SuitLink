// src/pages/JobSeekerDashboard.jsx
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, Briefcase, SlidersHorizontal, Bell, X } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import useJob from "../../hooks/useJob";
import JobGrid from "../../components/ApplicantDashboard/JobGrid";
import JobModal from "../../components/ApplicantDashboard/JobModal";
import Pagination from "../../components/ApplicantDashboard/Pagination";

const JobSeekerDashboardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const {
    jobs,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    nextPage,
    prevPage,
    goToPage,
  } = useJob();

  const [showFilters, setShowFilters] = useState(false);
  const [savedJobs, setSavedJobs] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        updateFilters({ search: searchInput });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateFilters({ search: searchInput });
  };

  const handleFilterChange = (key, value) => {
    updateFilters({ [key]: value });
  };

  const toggleSaveJob = (jobId) => {
    setSavedJobs((prev) =>
      prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId]
    );
  };

  const handleJobClick = (jobId) => {
    const job = jobs.find((j) => j._id === jobId);
    if (job) {
      setSelectedJob(job);
    }
  };

  const closeModal = () => {
    setSelectedJob(null);
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {selectedJob && <JobModal job={selectedJob} onClose={closeModal} />}

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="size-7 text-emerald-600" />
                <span className="text-xl text-gray-900">SuitLink</span>
              </div>

              <nav className="hidden md:flex items-center gap-6">
                <button
                  onClick={() => navigate("/jobs")}
                  className={`text-sm font-medium pb-1 ${
                    isActiveRoute("/jobs")
                      ? "text-chart-1 border-b-2 border-chart-1"
                      : "text-gray-600 hover:text-gray-900"
                  } py-1`}
                >
                  Find Jobs
                </button>
                <button
                  onClick={() => navigate("/applications")}
                  className={`text-sm font-medium pb-1 ${
                    isActiveRoute("/applications")
                      ? "text-chart-1 border-b-2 border-chart-1"
                      : "text-gray-600 hover:text-gray-900"
                  } py-1`}
                >
                  Applications
                </button>
                <button
                  onClick={() => navigate("/applied-jobs")}
                  className={`text-sm font-medium pb-1 ${
                    isActiveRoute("/applied-jobs")
                      ? "text-chart-1 border-b-2 border-chart-1"
                      : "text-gray-600 hover:text-gray-900"
                  } py-1`}
                >
                  Applied Jobs
                </button>
              </nav>

              <div className="flex items-center gap-4">
                <button className="relative">
                  <Bell className="size-5 text-gray-600 hover:text-gray-900" />
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
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search for jobs, companies..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-chart-1 focus:ring-1 focus:ring-chart-1"
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
              <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg text-gray-900">Filters</h3>
                  {showFilters && (
                    <button
                      onClick={() => setShowFilters(false)}
                      className="lg:hidden p-1 hover:bg-gray-100 rounded"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {/* Employment Type */}
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Employment Type
                    </label>
                    <select
                      value={filters.employmentType}
                      onChange={(e) =>
                        handleFilterChange("employmentType", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-chart-1"
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
                    <label className="block text-sm text-gray-700 mb-2">
                      Work Type
                    </label>
                    <select
                      value={filters.remote}
                      onChange={(e) =>
                        handleFilterChange("remote", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-chart-1"
                    >
                      <option value="">All</option>
                      <option value="true">Remote</option>
                      <option value="false">On-site</option>
                    </select>
                  </div>

                  {/* Salary Range */}
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Minimum Salary
                    </label>
                    <input
                      type="number"
                      value={filters.salaryMin}
                      onChange={(e) =>
                        handleFilterChange("salaryMin", e.target.value)
                      }
                      placeholder="e.g., 30000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-chart-1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Maximum Salary
                    </label>
                    <input
                      type="number"
                      value={filters.salaryMax}
                      onChange={(e) =>
                        handleFilterChange("salaryMax", e.target.value)
                      }
                      placeholder="e.g., 80000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-chart-1"
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
                savedJobs={savedJobs}
                onSaveToggle={toggleSaveJob}
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
