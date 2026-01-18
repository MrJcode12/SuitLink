import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import jobService from "../../services/jobService";
import Logo from "../../components/Auth/Shared/Logo";

const JobListingsPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Filter state
  const [filters, setFilters] = useState({
    employmentType: searchParams.get("employmentType") || "",
    remote: searchParams.get("remote") || "",
    salaryMin: searchParams.get("salaryMin") || "",
    salaryMax: searchParams.get("salaryMax") || "",
  });

  useEffect(() => {
    const page = parseInt(searchParams.get("page")) || 1;
    fetchJobs(page);
  }, [searchParams]);

  const fetchJobs = async (page = 1) => {
    try {
      setLoading(true);

      const params = {
        page,
        limit: 10,
        ...(filters.employmentType && {
          employmentType: filters.employmentType,
        }),
        ...(filters.remote && { remote: filters.remote }),
        ...(filters.salaryMin && { salaryMin: filters.salaryMin }),
        ...(filters.salaryMax && { salaryMax: filters.salaryMax }),
      };

      const response = await jobService.getJobs(params);

      if (response.success) {
        setJobs(response.data.jobs);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    params.set("page", "1");

    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });

    setSearchParams(params);
  };

  const resetFilters = () => {
    setFilters({
      employmentType: "",
      remote: "",
      salaryMin: "",
      salaryMax: "",
    });
    setSearchParams({ page: "1" });
  };

  const goToPage = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    setSearchParams(params);
  };

  const handleJobClick = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  const formatSalary = (salaryRange) => {
    if (!salaryRange || (!salaryRange.min && !salaryRange.max)) {
      return "Negotiable";
    }

    const currency = salaryRange.currency || "PHP";
    const min = salaryRange.min ? `${salaryRange.min.toLocaleString()}` : "";
    const max = salaryRange.max ? `${salaryRange.max.toLocaleString()}` : "";

    if (min && max) return `${currency} ${min} - ${max}`;
    if (min) return `${currency} ${min}+`;
    if (max) return `Up to ${currency} ${max}`;

    return "Negotiable";
  };

  const employmentTypeLabels = {
    "full-time": "Full-time",
    "part-time": "Part-time",
    contract: "Contract",
    internship: "Internship",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <Logo />
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl text-gray-900 mb-2">Browse Jobs</h1>
          <p className="text-gray-600">
            Find your next opportunity from {pagination.totalItems} available
            positions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg text-gray-900">Filters</h3>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                >
                  <Filter className="w-5 h-5" />
                </button>
              </div>

              <div
                className={`space-y-4 ${
                  showFilters ? "block" : "hidden lg:block"
                }`}
              >
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

                {/* Action Buttons */}
                <div className="space-y-2 pt-4">
                  <button
                    onClick={applyFilters}
                    className="w-full px-4 py-2 bg-chart-1 text-white rounded-lg hover:opacity-90"
                  >
                    Apply Filters
                  </button>
                  <button
                    onClick={resetFilters}
                    className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Job Listings */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-chart-1"></div>
              </div>
            ) : jobs.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg text-gray-900 mb-2">No jobs found</h3>
                <p className="text-gray-600">Try adjusting your filters</p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <div
                      key={job._id}
                      onClick={() => handleJobClick(job._id)}
                      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg text-gray-900 mb-1">
                            {job.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {job.company?.companyName || "Company"}
                          </p>
                        </div>
                        {job.remote && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            Remote
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          <span>{formatSalary(job.salaryRange)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>
                            {employmentTypeLabels[job.employmentType]}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="mt-6 flex items-center justify-between bg-white rounded-xl border border-gray-200 p-4">
                  <div className="text-sm text-gray-600">
                    Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.totalItems
                    )}{" "}
                    of {pagination.totalItems} jobs
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => goToPage(pagination.page - 1)}
                      disabled={!pagination.hasPrevPage}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <span className="px-4 py-2 text-sm text-gray-700">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>

                    <button
                      onClick={() => goToPage(pagination.page + 1)}
                      disabled={!pagination.hasNextPage}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobListingsPage;
