import { useState, useEffect } from "react";
import {
  X,
  MapPin,
  Clock,
  Building,
  CheckCircle,
  AlertCircle,
  FileText,
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
  const [coverLetterInput, setCoverLetterInput] = useState("");
  const [hasEditedCoverLetter, setHasEditedCoverLetter] = useState(false);

  // NEW: Track the submitted application data
  const [submittedApplication, setSubmittedApplication] = useState(null);
  const [loadingApplication, setLoadingApplication] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    fetchUserProfile();

    // NEW: If already applied, fetch the application data
    if (isApplied) {
      fetchApplicationData();
    }

    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose, isApplied]);

  useEffect(() => {
    setApplied(isApplied);
  }, [isApplied]);

  useEffect(() => {
    if (!job) return;

    // Reset state when job changes
    setHasEditedCoverLetter(false);
    setError("");
    setSuccess("");
    setSubmittedApplication(null);

    // Only reset cover letter if not already applied
    if (!isApplied) {
      setCoverLetterInput("");
    }
  }, [job, isApplied]);

  // NEW: Fetch application data if already applied
  const fetchApplicationData = async () => {
    if (!job?._id) return;

    try {
      setLoadingApplication(true);
      const response = await applicationsApiService.getMyApplications({
        page: 1,
        limit: 1000, // Get all to find this specific job
      });

      if (response.success) {
        const applications = Array.isArray(response.data)
          ? response.data
          : response.data.applications || [];

        // Find the application for this specific job
        const thisApplication = applications.find(
          (app) => (app.jobPosting?._id || app.jobPosting) === job._id
        );

        if (thisApplication) {
          setSubmittedApplication(thisApplication);
          // Set the cover letter from the actual application
          setCoverLetterInput(thisApplication.coverLetter || "");
        }
      }
    } catch (err) {
      console.error("Error fetching application data:", err);
    } finally {
      setLoadingApplication(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      setLoadingProfile(true);
      const response = await applicantProfileService.getProfile();

      if (response.success && response.data) {
        setUserProfile(response.data);

        // Only use profile cover letter as default for NEW applications
        if (!isApplied && !hasEditedCoverLetter) {
          setCoverLetterInput(response.data.coverLetter || "");
        }
      }
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
      const coverLetter = coverLetterInput || "";

      const response = await applicationsApiService.applyToJob(
        job._id,
        resumeId,
        coverLetter
      );

      if (response.success) {
        // CRITICAL: Store the backend response as the source of truth
        setSubmittedApplication(response.data);

        // Update cover letter from backend response
        setCoverLetterInput(response.data.coverLetter || "");

        setApplied(true);
        setSuccess("Application submitted successfully!");
        setHasEditedCoverLetter(false);

        if (onApplySuccess) onApplySuccess(job._id);

        setTimeout(() => onClose(), 2000);
      }
    } catch (err) {
      console.error("Error applying to job:", err);

      if (err.message.includes("already applied")) {
        setError("You have already applied to this position");
        setApplied(true);
        // Fetch the actual application data
        fetchApplicationData();
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
    !loadingApplication &&
    userProfile?.resumes?.length > 0;

  // Determine if we should show the cover letter in view mode (already applied)
  const isViewMode = applied && submittedApplication;
  const displayCoverLetter = isViewMode
    ? submittedApplication.coverLetter
    : coverLetterInput;

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-5xl w-full my-8 h-[92vh] flex flex-col shadow-2xl border border-gray-200 ring-1 ring-black/5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="shrink-0 bg-white/95 backdrop-blur border-b border-gray-200 p-6 flex items-start justify-between">
          <div className="flex-1 pr-4 min-w-0">
            <h2 className="text-2xl text-gray-900 font-medium mb-2 truncate">
              {job.title}
            </h2>

            <div className="flex items-center gap-3 text-gray-600">
              {job.company?.logo?.url ? (
                <img
                  src={job.company.logo.url}
                  alt={job.company.companyName}
                  className="w-9 h-9 rounded-lg object-cover border border-gray-200"
                />
              ) : (
                <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                  <Building className="w-5 h-5 text-emerald-700" />
                </div>
              )}
              <span className="text-base text-gray-900 font-medium truncate">
                {job.company?.companyName || "Company"}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition"
            type="button"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          {success && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-700 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-emerald-800 font-medium">
                  {success}
                </p>
                <p className="text-sm text-emerald-700 mt-1">
                  You can track this application in{" "}
                  <span className="font-medium">My Applications</span>.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-700 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-red-800 font-medium">{error}</p>
                <p className="text-sm text-red-700 mt-1">
                  Update your profile or resume to proceed.
                </p>
              </div>
            </div>
          )}

          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
            <div className="flex flex-wrap gap-3 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-500" />
                <span className="text-gray-900 font-medium">
                  {job.location}
                </span>
                {job.remote && (
                  <span className="ml-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 text-xs rounded-full">
                    Remote
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-gray-600">Salary:</span>
                <span className="text-gray-900 font-medium">
                  {formatSalary(job.salaryRange)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-500" />
                <span className="text-gray-900 font-medium">
                  {employmentTypeLabels[job.employmentType] ||
                    job.employmentType}
                </span>
              </div>
            </div>
          </div>

          {applied && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
              <p className="text-sm text-emerald-800 font-medium flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-700" />
                You have already applied to this position
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 flex-1 items-stretch min-h-[520px]">
            <div className="lg:col-span-3 space-y-6 min-h-0">
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Job Description
                </h3>
                <div className="text-gray-600 whitespace-pre-line leading-relaxed text-sm">
                  {job.description}
                </div>
              </div>

              {job.requirements && (
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Requirements
                  </h3>

                  {job.requirements.skills &&
                    job.requirements.skills.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                          Required Skills
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {job.requirements.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {job.requirements.experienceYears && (
                      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                        <p className="text-xs text-gray-500">Experience</p>
                        <p className="text-sm text-gray-900 font-medium mt-1">
                          {job.requirements.experienceYears} years
                        </p>
                      </div>
                    )}

                    {job.requirements.educationLevel && (
                      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                        <p className="text-xs text-gray-500">Education</p>
                        <p className="text-sm text-gray-900 font-medium mt-1">
                          {job.requirements.educationLevel}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="bg-emerald-700 text-white rounded-2xl p-5">
                <p className="text-sm text-emerald-100">
                  Tip: Tailor your cover letter to the role—mention specific
                  skills the job requires and how you've used them.
                </p>
              </div>

              {job.company?.description && (
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    About the Company
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {job.company.description}
                  </p>
                </div>
              )}
            </div>
            <div className="lg:col-span-2 min-h-0">
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 h-full flex flex-col min-h-0">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-5 h-5 text-emerald-700" />
                  <h3 className="text-lg font-medium text-gray-900">
                    Cover Letter {isViewMode && "(Submitted)"}
                  </h3>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  {isViewMode
                    ? "This is the cover letter you submitted with your application."
                    : "Write a brief message to the employer. This will be sent with your application."
                  }
                </p>

                {isViewMode ? (
                  // VIEW MODE: Show submitted cover letter (read-only)
                  <div className="flex-1 min-h-[260px] px-3 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 whitespace-pre-line overflow-y-auto">
                    {displayCoverLetter || <span className="text-gray-400">No cover letter provided</span>}
                  </div>
                ) : (
                  // EDIT MODE: Allow editing for new applications
                  <textarea
                    value={displayCoverLetter}
                    onChange={(e) => {
                      setHasEditedCoverLetter(true);
                      setCoverLetterInput(e.target.value);
                    }}
                    placeholder="Introduce yourself, highlight relevant experience, and explain why you're a good fit..."
                    className="w-full flex-1 min-h-[260px] px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 bg-white text-gray-900 placeholder-gray-400 resize-none"
                    disabled={applied || applying || loadingApplication}
                  />
                )}

                <p className="mt-3 text-xs text-gray-500 leading-relaxed">
                  Your primary resume from your profile will be automatically
                  attached and sent to the employer together with this
                  application.
                </p>

                <div className="mt-3 flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    {displayCoverLetter?.length || 0} characters
                  </p>

                  {!userProfile?.resumes?.length && !loadingProfile && (
                    <p className="text-xs text-red-700">
                      Upload a resume to enable Apply.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="h-6" />
        </div>

        <div className="shrink-0 bg-white/95 backdrop-blur border-t border-gray-200 p-5 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
            type="button"
          >
            Close
          </button>

          <div className="flex items-center gap-3">
            {applied ? (
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200 text-sm font-medium">
                <CheckCircle className="w-4 h-4 text-emerald-700" />
                Applied
              </span>
            ) : (
              <button
                onClick={handleApply}
                disabled={!canApply || applying || loadingApplication}
                className="px-6 py-3 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                type="button"
              >
                {loadingProfile || loadingApplication
                  ? "Loading..."
                  : applying
                  ? "Submitting..."
                  : "Apply Now"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobModal;
