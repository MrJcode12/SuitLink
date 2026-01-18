import { X } from "lucide-react";
import useJobForm from "../../hooks/useJobForm";
import jobService from "../../services/jobService";
import BasicInfoSection from "../../components/JobForm/BasicInfoSection";
import DescriptionSection from "../../components/JobForm/DescriptionSection";
import RequirementsSection from "../../components/JobForm/RequirementsSection";

const EditJobModal = ({ job, onClose, onSuccess }) => {
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
  } = useJobForm(job);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      const submitData = getSubmitData();
      const response = await jobService.updateJob(job._id, submitData);

      if (response.success) {
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Error updating job:", error);
      alert(error.message || "Failed to update job. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl max-w-4xl w-full my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white rounded-t-xl">
          <div>
            <h2 className="text-xl text-gray-900">Edit Job</h2>
            <p className="text-sm text-gray-600 mt-1">
              Update job posting details
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-6 max-h-[70vh] overflow-y-auto"
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

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3 sticky bottom-0 bg-white rounded-b-xl">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-3 bg-chart-1 text-white rounded-lg hover:opacity-90 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditJobModal;
