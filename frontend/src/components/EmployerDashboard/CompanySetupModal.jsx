import { useState } from "react";
import { X } from "lucide-react";
import companyService from "../../services/companyService";

const CompanySetupModal = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    companyName: "",
    description: "",
    industry: "",
    location: "",
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
      await companyService.createProfile(formData);
      // Success - call parent to refetch and close modal
      onSuccess();
    } catch (err) {
      // Handle validation errors from backend
      if (err.message.includes("errors")) {
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
          <div>
            <h2 className="text-xl text-gray-900">
              Complete Your Company Profile
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Set up your company profile to start posting jobs
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* Company Name */}
            <div>
              <label
                htmlFor="companyName"
                className="block text-sm text-gray-700 mb-2"
              >
                Company Name <span className="text-red-600">*</span>
              </label>
              <input
                id="companyName"
                type="text"
                value={formData.companyName}
                onChange={(e) => handleChange("companyName", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-chart-1 focus:ring-1 focus:ring-chart-1"
                required
                disabled={loading}
              />
              {errors.companyName && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.companyName[0]}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm text-gray-700 mb-2"
              >
                Company Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Tell us about your company..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-chart-1 focus:ring-1 focus:ring-chart-1 resize-none"
                disabled={loading}
              />
              {errors.description && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.description[0]}
                </p>
              )}
            </div>

            {/* Industry */}
            <div>
              <label
                htmlFor="industry"
                className="block text-sm text-gray-700 mb-2"
              >
                Industry
              </label>
              <input
                id="industry"
                type="text"
                value={formData.industry}
                onChange={(e) => handleChange("industry", e.target.value)}
                placeholder="e.g., Technology, Healthcare, Finance"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-chart-1 focus:ring-1 focus:ring-chart-1"
                disabled={loading}
              />
              {errors.industry && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.industry[0]}
                </p>
              )}
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="location"
                className="block text-sm text-gray-700 mb-2"
              >
                Location
              </label>
              <input
                id="location"
                type="text"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                placeholder="e.g., San Francisco, CA"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-chart-1 focus:ring-1 focus:ring-chart-1"
                disabled={loading}
              />
              {errors.location && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.location[0]}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-chart-1 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Profile..." : "Create Company Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanySetupModal;
