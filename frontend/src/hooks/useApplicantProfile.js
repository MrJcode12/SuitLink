import { useState, useEffect } from "react";
import applicantProfileService from "../services/applicantProfileService";

const useApplicantProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await applicantProfileService.getProfile();

      if (response.success) {
        setProfile(response.data);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError(err.message || "Failed to load profile");
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data) => {
    try {
      setUpdating(true);
      setError(null);
      const response = await applicantProfileService.updateProfile(data);

      if (response.success) {
        setProfile(response.data);
        return { success: true, data: response.data };
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.message || "Failed to update profile");
      return { success: false, error: err.message };
    } finally {
      setUpdating(false);
    }
  };

  const uploadAvatar = async (file) => {
    try {
      setUploadingAvatar(true);
      setError(null);
      const response = await applicantProfileService.uploadAvatar(file);

      if (response.success) {
        // Refresh profile to get updated avatar
        await fetchProfile();
        return { success: true, data: response.data };
      }
    } catch (err) {
      console.error("Error uploading avatar:", err);
      setError(err.message || "Failed to upload avatar");
      return { success: false, error: err.message };
    } finally {
      setUploadingAvatar(false);
    }
  };

  const uploadResume = async (file) => {
    try {
      setUploadingResume(true);
      setError(null);
      const response = await applicantProfileService.uploadResume(file);

      if (response.success) {
        // Refresh profile to get updated resume and analysis
        await fetchProfile();
        return { success: true, data: response.data };
      }
    } catch (err) {
      console.error("Error uploading resume:", err);
      setError(err.message || "Failed to upload resume");
      return { success: false, error: err.message };
    } finally {
      setUploadingResume(false);
    }
  };

  const deleteResume = async (resumeId) => {
    try {
      setUpdating(true);
      setError(null);
      const response = await applicantProfileService.deleteResume(resumeId);

      if (response.success) {
        await fetchProfile();
        return { success: true };
      }
    } catch (err) {
      console.error("Error deleting resume:", err);
      setError(err.message || "Failed to delete resume");
      return { success: false, error: err.message };
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    loading,
    error,
    updating,
    uploadingResume,
    uploadingAvatar,
    updateProfile,
    uploadAvatar,
    uploadResume,
    deleteResume,
    refetch: fetchProfile,
  };
};

export default useApplicantProfile;
