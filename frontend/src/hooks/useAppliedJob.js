import { useState, useEffect } from "react";
import jobsApiService from "../api/applicationConfig";

const useAppliedJobs = () => {
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

  const fetchAppliedJobs = async (currentPage = pagination.page) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: currentPage,
        limit: pagination.limit,
      };

      const response = await jobsApiService.getAppliedJobs(params);

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
      console.error("Error fetching applied jobs:", err);
      setError(err.message || "Failed to load applied jobs");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppliedJobs();
  }, []);

  const goToPage = (page) => {
    setPagination((prev) => ({ ...prev, page }));
    fetchAppliedJobs(page);
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

  return {
    jobs,
    loading,
    error,
    pagination,
    goToPage,
    nextPage,
    prevPage,
    refetch: fetchAppliedJobs,
  };
};

export default useAppliedJobs;
