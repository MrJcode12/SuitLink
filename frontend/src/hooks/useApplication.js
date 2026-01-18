import { useState, useEffect } from "react";
import applicationsApiService from "../services/applicationsService";

const useApplications = () => {
  const [applications, setApplications] = useState([]);
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

  const fetchApplications = async (currentPage = pagination.page) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: currentPage,
        limit: pagination.limit,
      };

      const response = await applicationsApiService.getMyApplications(params);

      if (response.success) {
        setApplications(response.data.applications || []);
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
      console.error("Error fetching applications:", err);
      setError(err.message || "Failed to load applications");
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const goToPage = (page) => {
    setPagination((prev) => ({ ...prev, page }));
    fetchApplications(page);
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
    applications,
    loading,
    error,
    pagination,
    goToPage,
    nextPage,
    prevPage,
    refetch: fetchApplications,
  };
};

export default useApplications;
