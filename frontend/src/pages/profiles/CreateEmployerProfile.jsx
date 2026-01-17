import { useState } from "react";
import { Briefcase, Building2, Loader2 } from "lucide-react";
import { companyProfileService } from "../../services/companyProfileService";

const CreateCompanyProfile = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    companyName: "",
    description: "",
    industry: "",
    location: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      // Replace with: await companyProfileService.createProfile(formData);
      // Then: navigate("/employer-profile");
      console.log("Creating profile with:", formData);
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Demo delay
      alert(
        "Profile created! In production, this would redirect to /employer-profile"
      );
    } catch (err) {
      if (err.validationErrors) {
        setErrors(err.validationErrors);
      } else {
        setErrors({ general: err.message });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-emerald-600" />
            <span className="text-xl font-semibold">SuitLink</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-medium text-gray-900 mb-2">
            Create Your Company Profile
          </h1>
          <p className="text-gray-600">
            Set up your company profile to start posting jobs and attracting top
            talent
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Company Name */}
            <div>
              <label
                htmlFor="companyName"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="e.g., TechCorp Inc."
                required
              />
              {errors.companyName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.companyName[0]}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Company Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                placeholder="Tell us about your company, culture, and what makes you unique..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description[0]}
                </p>
              )}
              <p className="mt-2 text-sm text-gray-500">
                Adding a description increases your credibility score (+2
                points)
              </p>
            </div>

            {/* Industry & Location */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="industry"
                  className="block text-sm font-medium text-gray-900 mb-2"
                >
                  Industry
                </label>
                <input
                  type="text"
                  id="industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="e.g., Technology"
                />
                {errors.industry && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.industry[0]}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-900 mb-2"
                >
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="e.g., Makati, Philippines"
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.location[0]}
                  </p>
                )}
              </div>
            </div>

            {/* Credibility Score Info */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-emerald-900 mb-2">
                📊 Credibility Score Preview
              </h3>
              <div className="space-y-1 text-sm text-emerald-700">
                <div className="flex items-center justify-between">
                  <span>Company Name (required)</span>
                  <span className="font-medium">+3 points</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Description {formData.description ? "✓" : ""}</span>
                  <span className="font-medium">+2 points</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Industry {formData.industry ? "✓" : ""}</span>
                  <span className="font-medium">+2 points</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Location {formData.location ? "✓" : ""}</span>
                  <span className="font-medium">+2 points</span>
                </div>
                <div className="flex items-center justify-between border-t border-emerald-300 pt-2 mt-2">
                  <span className="font-medium">Initial Score</span>
                  <span className="font-bold">
                    {3 +
                      (formData.description ? 2 : 0) +
                      (formData.industry ? 2 : 0) +
                      (formData.location ? 2 : 0)}
                    /10
                  </span>
                </div>
              </div>
              <p className="text-xs text-emerald-600 mt-2">
                💡 Aim for 7+ points to be considered a credible employer
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => alert("Would navigate to /dashboard")}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  "Create Company Profile"
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center text-sm text-gray-600">
          You can add your company logo after creating the profile
        </div>
      </div>
    </div>
  );
};

export default CreateCompanyProfile;
