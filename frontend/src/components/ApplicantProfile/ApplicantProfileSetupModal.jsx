import { useState } from "react";
import { User, AlertCircle, CheckCircle2 } from "lucide-react";
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
        onSuccess();
      }
    } catch (err) {
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="w-full max-w-2xl max-h-[92vh] overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-2xl ring-1 ring-black/5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-gray-200 p-6">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-emerald-700" />
            </div>

            <div className="min-w-0">
              <h2 className="text-xl text-gray-900 font-medium">
                Complete Your Profile
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Set up your applicant profile to start applying for jobs.
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(92vh-6.5rem)]">
          <form onSubmit={handleSubmit} className="p-6">
            {errors.general && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-700 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-800">{errors.general}</p>
              </div>
            )}

            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm text-gray-900 font-medium mb-2"
                  >
                    First Name <span className="text-red-600">*</span>
                  </label>

                  <input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 disabled:bg-gray-50 disabled:text-gray-500"
                    required
                    disabled={loading}
                    placeholder="Enter your first name"
                  />

                  {errors.firstName && (
                    <p className="text-sm text-red-700 mt-2">
                      {errors.firstName[0]}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm text-gray-900 font-medium mb-2"
                  >
                    Last Name <span className="text-red-600">*</span>
                  </label>

                  <input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 disabled:bg-gray-50 disabled:text-gray-500"
                    required
                    disabled={loading}
                    placeholder="Enter your last name"
                  />

                  {errors.lastName && (
                    <p className="text-sm text-red-700 mt-2">
                      {errors.lastName[0]}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-600 leading-relaxed">
                    <span className="text-gray-900 font-medium">
                      Next steps:
                    </span>{" "}
                    After creating your profile, add education, work experience,
                    skills, and upload your resume to strengthen your
                    applications.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-emerald-600 text-white font-medium shadow-sm transition hover:bg-emerald-700 active:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating Profile..." : "Create Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplicantProfileSetupModal;
