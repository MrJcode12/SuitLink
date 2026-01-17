import { useNavigate } from "react-router-dom";
import PostJobHeader from "../../components/PostJobPage/PostJobHeader";
import BasicInfoSection from "../../components/PostJobPage/BasicInfoSection";
import JobDescriptionSection from "../../components/PostJobPage/JobDescriptionSection";
import SkillsSection from "../../components/PostJobPage/SkillsSection";
import FormActions from "../../components/PostJobPage/FormActions";
import useJobForm from "../../hooks/useJobForm";

const PostJobPage = () => {
  const navigate = useNavigate();
  const {
    formData,
    errors,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    handleSkillsChange,
    validateForm,
    resetForm,
  } = useJobForm();

  const handleBack = () => {
    navigate("/dashboard");
  };

  const handlePreview = () => {
    // TODO: Implement preview functionality
    console.log("Preview job posting:", formData);
  };

  const handleSaveDraft = async () => {
    try {
      setIsSubmitting(true);
      // TODO: Call API to save draft
      // await jobService.saveDraft(formData);
      console.log("Saving draft:", formData);

      // Show success message
      alert("Draft saved successfully!");
    } catch (error) {
      console.error("Error saving draft:", error);
      alert("Failed to save draft. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to first error
      const firstError = document.querySelector('[class*="text-destructive"]');
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    try {
      setIsSubmitting(true);

      // TODO: Call API to publish job
      // await jobService.createJob(formData);
      console.log("Publishing job:", formData);

      // Show success message and redirect
      alert("Job posted successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error publishing job:", error);
      alert("Failed to publish job. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublish = () => {
    // Trigger form submission
    document.getElementById("post-job-form").requestSubmit();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PostJobHeader
        onBack={handleBack}
        onPreview={handlePreview}
        onPublish={handlePublish}
        isSubmitting={isSubmitting}
      />

      <div className="max-w-4xl mx-auto p-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl text-gray-900 mb-2">Post a New Job</h1>
          <p className="text-gray-600">
            Fill in the details below to create a new job posting.
          </p>
        </div>

        {/* Form */}
        <form
          id="post-job-form"
          onSubmit={handleSubmit}
          className="space-y-6 bg-white "
        >
          <BasicInfoSection
            formData={formData}
            onChange={handleChange}
            errors={errors}
          />

          <JobDescriptionSection
            formData={formData}
            onChange={handleChange}
            errors={errors}
          />

          <SkillsSection
            skills={formData.skills}
            onSkillsChange={handleSkillsChange}
          />

          <FormActions
            onCancel={handleBack}
            onSaveDraft={handleSaveDraft}
            onPublish={handlePublish}
            isSubmitting={isSubmitting}
          />
        </form>
      </div>
    </div>
  );
};

export default PostJobPage;
