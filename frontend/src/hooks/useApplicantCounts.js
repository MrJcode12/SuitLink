import { useState, useEffect, useCallback } from "react";
import employerApplicationsService from "../services/applicationEmployerSevice";

/**
 * Custom hook to fetch applicant counts for multiple jobs
 * Fetches counts in parallel with graceful error handling
 */
const useApplicantCounts = (jobs = []) => {
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCounts = useCallback(async () => {
    if (!jobs || jobs.length === 0) {
      setCounts({});
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch applicant counts for all jobs in parallel
      const countPromises = jobs.map(async (job) => {
        try {
          // ✅ FIXED: Use the correct service method
          const response = await employerApplicationsService.getApplicantsByJob(
            job._id
          );
          return {
            jobId: job._id,
            count: response.success ? (response.data?.length || 0) : 0,
          };
        } catch (err) {
          // If fetch fails for a job, return 0 (graceful degradation)
          console.error(`Failed to fetch count for job ${job._id}:`, err);
          return { jobId: job._id, count: 0 };
        }
      });

      const results = await Promise.all(countPromises);

      // Build counts map
      const countsMap = results.reduce((acc, { jobId, count }) => {
        acc[jobId] = count;
        return acc;
      }, {});

      setCounts(countsMap);
    } catch (err) {
      console.error("Error fetching applicant counts:", err);
      setError(err.message || "Failed to load applicant counts");
    } finally {
      setLoading(false);
    }
  }, [jobs]);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  return {
    counts,
    loading,
    error,
    refetch: fetchCounts,
  };
};

export default useApplicantCounts;
