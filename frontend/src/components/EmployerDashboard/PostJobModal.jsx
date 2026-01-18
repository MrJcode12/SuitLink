import { useEffect } from "react";
import { X } from "lucide-react";
import useJobForm from "../../hooks/useJobForm";
import jobService from "../../services/jobService";
import BasicInfoSection from "../JobForm/BasicInfoSection";
import DescriptionSection from "../JobForm/DescriptionSection";
import RequirementsSection from "../JobForm/RequirementsSection";

const PostJobModal = ({ open, onClose, onSuccess }) => {
  const {
    formData,
    errors,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    handleNestedChange,
    handleSkillsChange,
    validateForm,
    getSubmitData,
  } = useJobForm();

  useEffect(() => {
    if (!open) return;

    const handleEsc = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      const firstError = document.querySelector('[class*="text-red"]');
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    try {
      setIsSubmitting(true);

      const submitData = getSubmitData();
      const response = await jobService.createJob(submitData);

      if (response?.success) {
        await onSuccess?.();
        onClose?.();
      }
    } catch (error) {
      console.error("Error publishing job:", error);
      alert(error.message || "Failed to publish job. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 p-4 flex items-center justify-center"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white w-full max-w-4xl rounded-2xl border border-gray-200 shadow-lg max-h-[90vh] overflow-hidden"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Sticky Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                Post a New Job
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Fill in the details below to publish a job posting.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                form="post-job-form"
                disabled={isSubmitting}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition text-sm disabled:opacity-50"
              >
                {isSubmitting ? "Publishing..." : "Publish Job"}
              </button>

              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="ml-1 p-2 rounded-lg hover:bg-gray-100 text-gray-600 disabled:opacity-50"
                aria-label="Close"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-76px)]">
          <form
            id="post-job-form"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <BasicInfoSection
              formData={formData}
              onChange={handleChange}
              errors={errors}
            />

            <DescriptionSection
              formData={formData}
              onChange={handleChange}
              errors={errors}
            />

            <RequirementsSection
              formData={formData}
              onSkillsChange={handleSkillsChange}
              onNestedChange={handleNestedChange}
              errors={errors}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJobModal;
