import { MapPin, Briefcase, Clock, Building, CheckCircle } from "lucide-react";

const JobCard = ({ job, isApplied = false, onClick }) => {
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

  return (
    <div
      onClick={() => onClick?.(job._id)}
      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
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
            <h3 className="text-base font-medium text-gray-900 group-hover:text-chart-1 transition-colors mb-1">
              {job.title}
            </h3>
            <p className="text-sm text-gray-600">
              {job.company?.companyName || "Company"}
            </p>
          </div>
        </div>
        {isApplied && (
          <div className="flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
            <CheckCircle className="w-4 h-4" />
            Applied
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
          <span className="text-chart-1 font-medium">Actively hiring</span>
        )}
      </div>
    </div>
  );
};

export default JobCard;
