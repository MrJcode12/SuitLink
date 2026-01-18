import {
  MapPin,
  Briefcase,
  Clock,
  Building,
  CheckCircle,
  Bookmark,
  BadgeCheck,
} from "lucide-react";

const JobCard = ({
  job,
  isApplied = false,
  onClick,
  onBookmarkToggle,
  isBookmarked = false,
}) => {
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  // Check if company is verified (credibilityScore >= 6)
  const isCompanyVerified = job.company?.credibilityScore >= 6;

  return (
    <div
      onClick={() => onClick?.(job._id)}
      className="relative bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer group"
    >
      {/* Bookmark Icon */}
      {onBookmarkToggle && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onBookmarkToggle(job._id);
          }}
          className={`absolute top-4 right-4 p-1.5 rounded-full transition-colors ${
            isBookmarked
              ? "bg-emerald-600 text-white hover:bg-emerald-700"
              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          }`}
          aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
        >
          <Bookmark className="w-5 h-5" />
        </button>
      )}

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1 mr-12">
          {job.company?.logo?.url ? (
            <img
              src={job.company.logo.url}
              alt={job.company.companyName}
              className="w-12 h-12 rounded-lg object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Building className="w-6 h-6 text-emerald-600" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-medium text-gray-900 group-hover:text-emerald-600 transition-colors mb-1 line-clamp-1">
              {job.title}
            </h3>
            <div className="flex items-center gap-1.5">
              <p className="text-sm text-gray-600 truncate">
                {job.company?.companyName || "Company"}
              </p>
              {isCompanyVerified && (
                <BadgeCheck
                  className="w-4 h-4 text-emerald-600 flex-shrink-0"
                  aria-label="Verified company"
                  title="Verified company"
                />
              )}
            </div>
          </div>
        </div>

        {/* Applied Status Badge */}
        {isApplied && (
          <div className="absolute top-4 right-14 flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-medium">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Applied</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-3">
        <div className="flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center gap-1">
          <Briefcase className="w-4 h-4" />
          <span>{formatSalary(job.salaryRange)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>
            {employmentTypeLabels[job.employmentType] || job.employmentType}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {job.remote && (
          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
            Remote
          </span>
        )}
        {job.requirements?.skills?.slice(0, 3).map((skill, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
          >
            {skill}
          </span>
        ))}
        {job.requirements?.skills?.length > 3 && (
          <span className="text-xs text-gray-500">
            +{job.requirements.skills.length - 3} more
          </span>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <span>{formatDate(job.createdAt)}</span>
        {job.status === "open" && !isApplied && (
          <span className="text-emerald-600 font-medium">Actively hiring</span>
        )}
      </div>
    </div>
  );
};

export default JobCard;
