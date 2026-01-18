import { useState } from "react";
import applicantService from "../../services/applicantService";

const ApplicantProfileSetupModal = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const response = await applicantService.createProfile(formData);

      if (response.success) {
        // Success - call parent to refetch and close modal
        onSuccess();
      }
    } catch (err) {
      // Handle validation errors from backend
      if (err.message && err.message.includes("errors")) {
        try {
          const errorData = JSON.parse(err.message);
          setErrors(errorData.errors || {});
        } catch {
          setErrors({ general: err.message });
        }
      } else {
        setErrors({ general: err.message });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        // Prevent closing modal by clicking outside
        e.stopPropagation();
      }}
    >
      <div
        className="bg-card rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card">
          <div>
            <h2 className="text-xl text-foreground">Complete Your Profile</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Set up your applicant profile to start applying for jobs
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {errors.general && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">{errors.general}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* First Name */}
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm text-foreground mb-2"
              >
                First Name <span className="text-destructive">*</span>
              </label>
              <input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-chart-1 focus:ring-1 focus:ring-chart-1 bg-input-background text-foreground"
                required
                disabled={loading}
                placeholder="Enter your first name"
              />
              {errors.firstName && (
                <p className="text-sm text-destructive mt-1">
                  {errors.firstName[0]}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm text-foreground mb-2"
              >
                Last Name <span className="text-destructive">*</span>
              </label>
              <input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-chart-1 focus:ring-1 focus:ring-chart-1 bg-input-background text-foreground"
                required
                disabled={loading}
                placeholder="Enter your last name"
              />
              {errors.lastName && (
                <p className="text-sm text-destructive mt-1">
                  {errors.lastName[0]}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-border">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-chart-1 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Profile..." : "Create Profile"}
            </button>
          </div>
        </form>

        {/* Info Box */}
        <div className="p-6 pt-0">
          <div className="p-4 bg-muted rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground font-medium">
                Next steps:
              </strong>{" "}
              After creating your profile, you can add your education, work
              experience, skills, and upload your resume to make your profile
              stand out to employers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantProfileSetupModal;
