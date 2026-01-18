import { useState, useEffect } from "react";
import {
  X,
  MapPin,
  Clock,
  Building,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import applicationsApiService from "../../services/applicationsService";
import applicantProfileService from "../../services/applicantProfileService";

const JobModal = ({ job, onClose, isApplied = false, onApplySuccess }) => {
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(isApplied);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    fetchUserProfile();

    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
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

  const fetchUserProfile = async () => {
    try {
      setLoadingProfile(true);
      const response = await applicantProfileService.getProfile();
      if (response.success && response.data) setUserProfile(response.data);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Please complete your profile before applying");
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleApply = async () => {
    if (applied || applying) return;

    if (!userProfile) {
      setError("Please complete your profile before applying");
      return;
    }

    if (!userProfile.resumes || userProfile.resumes.length === 0) {
      setError("Please upload a resume before applying");
      return;
    }

    setApplying(true);
    setError("");
    setSuccess("");

    try {
      const resumeId = userProfile.resumes[0]._id;
      const coverLetter = userProfile.coverLetter || "";
      const response = await applicationsApiService.applyToJob(
        job._id,
        resumeId,
        coverLetter
      );

      if (response.success) {
        setApplied(true);
        setSuccess("Application submitted successfully!");
        if (onApplySuccess) onApplySuccess(job._id);
        setTimeout(() => onClose(), 2000);
      }
    } catch (err) {
      console.error("Error applying to job:", err);
      if (err.message.includes("already applied")) {
        setError("You have already applied to this position");
        setApplied(true);
      } else if (err.message.includes("profile")) {
        setError("Please complete your applicant profile first");
      } else if (err.message.includes("resume")) {
        setError("Please upload a resume before applying");
      } else {
        setError(
          err.message || "Failed to submit application. Please try again."
        );
      }
    } finally {
      setApplying(false);
    }
  };

  const formatSalary = (salaryRange) => {
    if (!salaryRange || (!salaryRange.min && !salaryRange.max))
      return "Negotiable";
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

  const canApply =
    !applied &&
    !applying &&
    !loadingProfile &&
    userProfile?.resumes?.length > 0;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 rounded-2xl max-w-3xl w-full my-8 max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-700 ring-1 ring-black/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gray-900/95 backdrop-blur border-b border-gray-700 p-6 flex items-start justify-between">
          <div className="flex-1 pr-4">
            <h2 className="text-2xl font-semibold text-white mb-2">
              {job.title}
            </h2>
            <div className="flex items-center gap-3 text-gray-400">
              {job.company?.logo?.url ? (
                <img
                  src={job.company.logo.url}
                  alt={job.company.companyName}
                  className="w-8 h-8 rounded object-cover"
                />
              ) : (
                <Building className="w-5 h-5 text-gray-400" />
              )}
              <span className="text-lg text-white">
                {job.company?.companyName || "Company"}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {success && (
            <div className="bg-emerald-700/20 border border-emerald-600 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <p className="text-sm text-emerald-200">{success}</p>
            </div>
          )}

          {error && (
            <div className="bg-red-700/20 border border-red-600 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}

          {/* Job Details */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gray-400" />
              <span>{job.location}</span>
              {job.remote && (
                <span className="ml-1 px-2 py-0.5 bg-emerald-700/20 text-emerald-200 text-xs rounded-full">
                  Remote
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span>{formatSalary(job.salaryRange)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-400" />
              <span>
                {employmentTypeLabels[job.employmentType] || job.employmentType}
              </span>
            </div>
          </div>

          {applied && (
            <div className="bg-emerald-700/20 border border-emerald-600 rounded-lg p-4">
              <p className="text-sm text-emerald-200 font-medium flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                You have already applied to this position
              </p>
            </div>
          )}

          {/* Job Description */}
          <div>
            <h3 className="text-lg font-medium text-white mb-3">
              Job Description
            </h3>
            <div className="text-gray-300 whitespace-pre-line leading-relaxed">
              {job.description}
            </div>
          </div>

          {/* Requirements */}
          {job.requirements && (
            <div>
              <h3 className="text-lg font-medium text-white mb-3">
                Requirements
              </h3>

              {job.requirements.skills &&
                job.requirements.skills.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-white mb-2">
                      Required Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {job.requirements.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-800 text-gray-300 rounded-lg text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {job.requirements.experienceYears && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-1">
                    Experience
                  </h4>
                  <p className="text-gray-300">
                    {job.requirements.experienceYears} years
                  </p>
                </div>
              )}

              {job.requirements.educationLevel && (
                <div>
                  <h4 className="text-sm font-medium text-white mb-1">
                    Education
                  </h4>
                  <p className="text-gray-300">
                    {job.requirements.educationLevel}
                  </p>
                </div>
              )}
            </div>
          )}

          {job.company?.description && (
            <div>
              <h3 className="text-lg font-medium text-white mb-3">
                About the Company
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {job.company.description}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-900/95 backdrop-blur border-t border-gray-700 p-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-lg border border-gray-700 text-white hover:bg-gray-800 transition-colors"
          >
            Close
          </button>

          {!applied && (
            <button
              onClick={handleApply}
              disabled={!canApply || applying}
              className="px-6 py-3 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingProfile
                ? "Loading..."
                : applying
                ? "Submitting..."
                : "Apply Now"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobModal;
