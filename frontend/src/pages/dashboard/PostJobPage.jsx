import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import useJobForm from "../../hooks/useJobForm";
import jobService from "../../services/jobService";
import BasicInfoSection from "../../components/JobForm/BasicInfoSection";
import DescriptionSection from "../../components/JobForm/DescriptionSection";
import RequirementsSection from "../../components/JobForm/RequirementsSection";

const PostJobPage = () => {
  const navigate = useNavigate();
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

  const handleBack = () => {
    navigate("/employer-dashboard");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to first error
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

      if (response.success) {
        navigate("/employer-dashboard");
      }
    } catch (error) {
      console.error("Error publishing job:", error);
      alert(error.message || "Failed to publish job. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">Back to Dashboard</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleBack}
                disabled={isSubmitting}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="post-job-form"
                disabled={isSubmitting}
                className="px-4 py-2 bg-chart-1 text-white rounded-lg hover:opacity-90 text-sm disabled:opacity-50"
              >
                {isSubmitting ? "Publishing..." : "Publish Job"}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl text-gray-900 mb-2">Post a New Job</h1>
          <p className="text-gray-600">
            Fill in the details below to create a new job posting.
          </p>
        </div>

        {/* Form */}
        <form id="post-job-form" onSubmit={handleSubmit} className="space-y-6">
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
  );
};

export default PostJobPage;
