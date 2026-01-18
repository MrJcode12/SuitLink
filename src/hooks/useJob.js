import { useState, useEffect } from "react";
import jobsApiService from "../services/applicationsService";

const useJob = (initialFilters = {}) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    ...initialFilters,
  });

  const fetchJobs = async (
    currentFilters = filters,
    currentPage = pagination.page,
    skipLoading = false
  ) => {
    try {
      if (!skipLoading) {
        setLoading(true);
      }
      setError(null);

      const params = {
        ...currentFilters,
        page: currentPage,
        limit: pagination.limit,
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
      setJobs([]);
    } finally {
      if (!skipLoading) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchJobs({ ...filters, ...newFilters }, 1);
  };

  const goToPage = (page) => {
    setPagination((prev) => ({ ...prev, page }));
    fetchJobs(filters, page);
  };

  const nextPage = () => {
    if (pagination.hasNextPage) {
      goToPage(pagination.page + 1);
    }
  };

  const prevPage = () => {
    if (pagination.hasPrevPage) {
      goToPage(pagination.page - 1);
    }
  };

  const applyFilters = () => {
    fetchJobs(filters, 1);
  };

  const resetFilters = () => {
    const defaultFilters = {
      search: "",
      employmentType: "",
      remote: "",
      salaryMin: "",
      salaryMax: "",
    };
    setFilters(defaultFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchJobs(defaultFilters, 1);
  };

  return {
    jobs,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    applyFilters,
    resetFilters,
    goToPage,
    nextPage,
    prevPage,
    refetch: fetchJobs,
  };
};

export default useJob;
