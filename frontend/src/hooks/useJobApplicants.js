import { useState, useEffect, useCallback } from "react";
import employerApplicationsService from "../services/applicationEmployerSevice";

const useJobApplicants = (jobId) => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(null); // Track which application is being updated

  const fetchApplicants = useCallback(async () => {
    if (!jobId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await employerApplicationsService.getApplicantsByJob(
        jobId
      );

      if (response.success) {
        setApplicants(response.data || []);
      }
    } catch (err) {
      console.error("Error fetching applicants:", err);
      setError(err.message || "Failed to load applicants");
      setApplicants([]);
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchApplicants();
  }, [fetchApplicants]);

  const updateStatus = async (applicationId, newStatus) => {
    try {
      setUpdating(applicationId);
      setError(null);

      const response = await employerApplicationsService.updateApplicationStatus(
        applicationId,
        newStatus
      );

      if (response.success) {
        // Optimistically update local state
        setApplicants((prev) =>
          prev.map((app) =>
            app._id === applicationId ? { ...app, status: newStatus } : app
          )
        );

        return { success: true };
      }
    } catch (err) {
      console.error("Error updating status:", err);
      setError(err.message || "Failed to update status");
      return { success: false, error: err.message };
    } finally {
      setUpdating(null);
    }
  };

  return {
    applicants,
    loading,
    error,
    updating,
    updateStatus,
    refetch: fetchApplicants,
  };
};

export default useJobApplicants;
