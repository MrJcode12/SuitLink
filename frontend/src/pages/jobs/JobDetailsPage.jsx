import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  Clock,
  Briefcase,
  Building,
  Users,
  CheckCircle,
} from "lucide-react";
import jobService from "../../services/jobService";
import useAuth from "../../hooks/useAuth";
import Logo from "../../components/Auth/Shared/Logo";

const JobDetailsPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user, isEmployer } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJobDetails();
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const response = await jobService.getJobById(jobId);

      if (response.success) {
        setJob(response.data);
      }
    } catch (err) {
      console.error("Error fetching job details:", err);
      setError(err.message || "Failed to load job details");
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-chart-1 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl text-gray-900 mb-2">Job Not Found</h2>
          <p className="text-gray-600 mb-6">
            {error || "This job does not exist"}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-chart-1 text-white rounded-lg hover:opacity-90"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const isOwner = isEmployer && user?._id === job.employer;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <Logo />
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">Back</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl text-gray-900 mb-2">{job.title}</h1>
                  <p className="text-lg text-gray-600">
                    {job.company?.companyName}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 text-sm rounded-full ${
                    job.status === "open"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {job.status === "open" ? "Open" : "Closed"}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{job.location}</span>
                  {job.remote && (
                    <span className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                      Remote
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  <span>{formatSalary(job.salaryRange)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{employmentTypeLabels[job.employmentType]}</span>
                </div>
              </div>

              {isOwner && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => navigate(`/employer/edit-job/${job._id}`)}
                    className="px-4 py-2 bg-chart-1 text-white rounded-lg hover:opacity-90 text-sm"
                  >
                    Edit Job
                  </button>
                </div>
              )}
            </div>

            {/* Job Description */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg text-gray-900 mb-4">Job Description</h2>
              <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                {job.description}
              </div>
            </div>

            {/* Requirements */}
            {job.requirements && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg text-gray-900 mb-4">Requirements</h2>

                {job.requirements.skills &&
                  job.requirements.skills.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-sm text-gray-700 mb-2 font-medium">
                        Required Skills
                      </h3>
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
                    <h3 className="text-sm text-gray-700 mb-1 font-medium">
                      Experience
                    </h3>
                    <p className="text-gray-600">
                      {job.requirements.experienceYears} years
                    </p>
                  </div>
                )}

                {job.requirements.educationLevel && (
                  <div>
                    <h3 className="text-sm text-gray-700 mb-1 font-medium">
                      Education
                    </h3>
                    <p className="text-gray-600">
                      {job.requirements.educationLevel}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Applicants Section - Placeholder */}
            {isOwner && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg text-gray-900">Applicants</h2>
                  <span className="text-sm text-gray-600">0 applications</span>
                </div>

                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No applications yet</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Applicants will appear here once they apply for this
                    position
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Company Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg text-gray-900 mb-4">About the Company</h2>

              {job.company?.logo && (
                <img
                  src={job.company.logo.url}
                  alt={job.company.companyName}
                  className="w-16 h-16 rounded-lg mb-4"
                />
              )}

              <h3 className="text-base text-gray-900 mb-2">
                {job.company?.companyName}
              </h3>

              {job.company?.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {job.company.description}
                </p>
              )}

              <div className="space-y-2 text-sm">
                {job.company?.industry && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Briefcase className="w-4 h-4" />
                    <span>{job.company.industry}</span>
                  </div>
                )}
                {job.company?.location && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Building className="w-4 h-4" />
                    <span>{job.company.location}</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => navigate(`/company/${job.company._id}`)}
                className="w-full mt-4 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
              >
                View Company Profile
              </button>
            </div>

            {/* Apply Section - For Applicants */}
            {!isOwner && job.status === "open" && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <button className="w-full px-6 py-3 bg-chart-1 text-white rounded-lg hover:opacity-90 font-medium">
                  Apply Now
                </button>
                <p className="text-xs text-gray-500 text-center mt-3">
                  Application feature coming soon
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;
