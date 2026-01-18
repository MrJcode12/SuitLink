import { useState, useEffect } from "react";
import {
  X,
  MapPin,
  Briefcase,
  Clock,
  Building,
  DollarSign,
  CheckCircle,
} from "lucide-react";
import applicationsApiService from "../../services/applicationsService";

const JobModal = ({ job, onClose, isApplied = false, onApplySuccess }) => {
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(isApplied);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // Disable body scroll when modal is open
    document.body.style.overflow = "hidden";

    // Handle ESC key
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEsc);

    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  useEffect(() => {
    setApplied(isApplied);
  }, [isApplied]);

  const handleApply = async () => {
    if (applied || applying) return;

    setApplying(true);
    setError("");
    setSuccess("");

    try {
      // For now, we'll use a default resume ID
      // In production, you'd fetch the user's resumes and let them select one
      const response = await applicationsApiService.applyToJob(
        job._id,
        "default-resume-id", // This needs to be replaced with actual resume selection
        "" // Optional cover letter
      );

      if (response.success) {
        setApplied(true);
        setSuccess("Application submitted successfully!");
        if (onApplySuccess) {
          onApplySuccess(job._id);
        }

        // Close modal after 2 seconds
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (err) {
      console.error("Error applying to job:", err);
      setError(
        err.message || "Failed to submit application. Please try again."
      );
    } finally {
      setApplying(false);
    }
  };

  const formatSalary = (salaryRange) => {
    if (!salaryRange || (!salaryRange.min && !salaryRange.max)) {
      return "Negotiable";
    }

    const currency = salaryRange.currency || "PHP";
    const min = salaryRange.min ? `${salaryRange.min.toLocaleString()}` : "";
    const max = salaryRange.max ? `${salaryRange.max.toLocaleString()}` : "";

    if (min && max) return `${currency} ${min} - ${max}`;
    if (min) return `${currency} ${min}+`;
    if (max) return `Up to ${currency} ${max}`;
    return "Negotiable";
  };

  const employmentTypeLabels = {
    "full-time": "Full-time",
    "part-time": "Part-time",
    contract: "Contract",
    internship: "Internship",
  };

  if (!job) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl max-w-3xl w-full my-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-start justify-between">
          <div className="flex-1 pr-4">
            <h2 className="text-2xl text-gray-900 mb-2">{job.title}</h2>
            <div className="flex items-center gap-3 text-gray-600">
              {job.company?.logo?.url ? (
                <img
                  src={job.company.logo.url}
                  alt={job.company.companyName}
                  className="w-8 h-8 rounded object-cover"
                />
              ) : (
                <Building className="w-5 h-5" />
              )}
              <span className="text-lg">
                {job.company?.companyName || "Company"}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Success Message */}
          {success && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <p className="text-sm text-emerald-700">{success}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Job Details */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-5 h-5" />
              <span>{job.location}</span>
              {job.remote && (
                <span className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                  Remote
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <DollarSign className="w-5 h-5" />
              <span>{formatSalary(job.salaryRange)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-5 h-5" />
              <span>
                {employmentTypeLabels[job.employmentType] || job.employmentType}
              </span>
            </div>
          </div>

          {/* Application Status */}
          {applied && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <p className="text-sm text-emerald-700 font-medium">
                ✓ You have already applied to this position
              </p>
            </div>
          )}

          {/* Job Description */}
          <div>
            <h3 className="text-lg text-gray-900 mb-3">Job Description</h3>
            <div className="text-gray-700 whitespace-pre-line leading-relaxed">
              {job.description}
            </div>
          </div>

          {/* Requirements */}
          {job.requirements && (
            <div>
              <h3 className="text-lg text-gray-900 mb-3">Requirements</h3>

              {job.requirements.skills &&
                job.requirements.skills.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm text-gray-700 mb-2 font-medium">
                      Required Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {job.requirements.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {job.requirements.experienceYears && (
                <div className="mb-4">
                  <h4 className="text-sm text-gray-700 mb-1 font-medium">
                    Experience
                  </h4>
                  <p className="text-gray-600">
                    {job.requirements.experienceYears} years
                  </p>
                </div>
              )}

              {job.requirements.educationLevel && (
                <div>
                  <h4 className="text-sm text-gray-700 mb-1 font-medium">
                    Education
                  </h4>
                  <p className="text-gray-600">
                    {job.requirements.educationLevel}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Company Info */}
          {job.company?.description && (
            <div>
              <h3 className="text-lg text-gray-900 mb-3">About the Company</h3>
              <p className="text-gray-700 leading-relaxed">
                {job.company.description}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Close
          </button>
          {!applied && (
            <button
              onClick={handleApply}
              disabled={applying}
              className="px-6 py-3 bg-chart-1 text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {applying ? "Submitting..." : "Apply Now"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobModal;
