import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import { z } from "zod";
import companyService from "../../services/companyService";

// Validation schema
const companyProfileSchema = z.object({
  companyName: z
    .string()
    .min(1, "Company name is required")
    .max(150, "Company name is too long"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description is too long")
    .optional()
    .or(z.literal("")),
  industry: z
    .string()
    .min(2, "Industry is too short")
    .max(100, "Industry is too long")
    .optional()
    .or(z.literal("")),
  location: z
    .string()
    .min(2, "Location is too short")
    .max(150, "Location is too long")
    .optional()
    .or(z.literal("")),
});

const EditCompanyProfileModal = ({ companyProfile, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(
    companyProfile?.logo?.url || null
  );
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    companyName: companyProfile?.companyName || "",
    description: companyProfile?.description || "",
    industry: companyProfile?.industry || "",
    location: companyProfile?.location || "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleLogoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        logo: "Only image files are allowed",
      }));
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        logo: "File size must be less than 5MB",
      }));
      return;
    }

    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.logo;
      return newErrors;
    });
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview(companyProfile?.logo?.url || null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      // Validate form data
      const validatedData = companyProfileSchema.parse(formData);

      // Prepare update payload (only send changed fields)
      const updatePayload = {};
      Object.keys(validatedData).forEach((key) => {
        if (validatedData[key] !== companyProfile?.[key]) {
          updatePayload[key] = validatedData[key];
        }
      });

      // Update profile details if any field changed
      let updatedProfile = companyProfile;
      if (Object.keys(updatePayload).length > 0) {
        const response = await companyService.updateProfile(updatePayload);
        if (response.success) {
          updatedProfile = response.data;
        }
      }

      // Upload new logo if selected
      if (logoFile) {
        const logoResponse = await companyService.uploadLogo(logoFile);
        if (logoResponse.success) {
          updatedProfile = logoResponse.data;
        }
      }

      // Success - notify parent and close modal
      onSuccess(updatedProfile);
      onClose();
    } catch (err) {
      console.error("Update error:", err);

      // Handle Zod validation errors
      if (err instanceof z.ZodError) {
        const fieldErrors = {};
        err.errors.forEach((error) => {
          fieldErrors[error.path[0]] = error.message;
        });
        setErrors(fieldErrors);
      }
      // Handle backend validation errors
      else if (err.message && err.message.includes("errors")) {
        try {
          const errorData = JSON.parse(err.message);
          const fieldErrors = {};
          Object.keys(errorData.errors || {}).forEach((key) => {
            fieldErrors[key] = errorData.errors[key][0];
          });
          setErrors(fieldErrors);
        } catch {
          setErrors({ general: err.message });
        }
      } else {
        setErrors({ general: err.message || "Failed to update profile" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
          <div>
            <h2 className="text-xl text-gray-900">Edit Company Profile</h2>
            <p className="text-sm text-gray-600 mt-1">
              Update your company information
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Company Logo */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Company Logo
              </label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-xl border-2 border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl text-gray-400">
                      {formData.companyName?.[0] || "🏢"}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoSelect}
                    className="hidden"
                    disabled={loading}
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                      disabled={loading}
                    >
                      <Upload className="w-4 h-4" />
                      <span className="text-sm">
                        {logoFile ? "Change Logo" : "Upload Logo"}
                      </span>
                    </button>
                    {logoFile && (
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                        disabled={loading}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Max size: 5MB. Formats: JPG, PNG, GIF
                  </p>
                  {errors.logo && (
                    <p className="text-sm text-red-600 mt-1">{errors.logo}</p>
                  )}
                </div>
              </div>
            </div>

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
                placeholder="Enter company name"
              />
              {errors.companyName && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.companyName}
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
                  {errors.description}
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
                <p className="text-sm text-red-600 mt-1">{errors.industry}</p>
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
                <p className="text-sm text-red-600 mt-1">{errors.location}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200 sticky bottom-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-chart-1 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCompanyProfileModal;
