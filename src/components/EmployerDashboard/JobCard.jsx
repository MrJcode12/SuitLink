import {
  MapPin,
  DollarSign,
  Clock,
  Users,
  Eye,
  MoreVertical,
  CheckCircle,
  XCircle,
} from "lucide-react";

const JobCard = ({ job, onEdit, onClose, onReopen, onViewApplicants }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 30) return `${diffDays} days ago`;
    if (diffDays < 60) return "1 month ago";
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const formatSalary = (salaryRange) => {
    if (!salaryRange || (!salaryRange.min && !salaryRange.max)) {
      return "Negotiable";
    }

    const currency = salaryRange.currency || "PHP";
    const min = salaryRange.min ? `${salaryRange.min.toLocaleString()}` : "";
    const max = salaryRange.max ? `${salaryRange.max.toLocaleString()}` : "";

    if (min && max) {
      return `${currency} ${min} - ${max}`;
    }
    if (min) {
      return `${currency} ${min}+`;
    }
    if (max) {
      return `Up to ${currency} ${max}`;
    }

    return "Negotiable";
  };

  const employmentTypeLabels = {
    "full-time": "Full-time",
    "part-time": "Part-time",
    contract: "Contract",
    internship: "Internship",
  };

  return (
    <div className="p-6 hover:bg-gray-50 transition-colors border-b border-gray-200 last:border-b-0">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg text-gray-900">{job.title}</h3>
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                job.status === "open"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {job.status === "open" ? (
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Open
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <XCircle className="w-3 h-3" />
                  Closed
                </span>
              )}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <MapPin className="size-4" />
              <span>{job.location}</span>
              {job.remote && (
                <span className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                  Remote
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="size-4" />
              <span>{formatSalary(job.salaryRange)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="size-4" />
              <span>
                {employmentTypeLabels[job.employmentType] || job.employmentType}
              </span>
            </div>
            <span>Posted {formatDate(job.createdAt)}</span>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Users className="size-4 text-gray-500" />
              <span className="text-gray-900">{job.applicantsCount || 0}</span>
              <span className="text-gray-600">applicants</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="size-4 text-gray-500" />
              <span className="text-gray-900">{job.viewsCount || 0}</span>
              <span className="text-gray-600">views</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(job)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
          >
            Edit
          </button>

          {job.status === "open" ? (
            <button
              onClick={() => onClose(job)}
              className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 text-sm"
            >
              Close
            </button>
          ) : (
            <button
              onClick={() => onReopen(job)}
              className="px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 text-sm"
            >
              Reopen
            </button>
          )}

          <button
            onClick={() => onViewApplicants(job)}
            className="px-4 py-2 bg-chart-1 text-white rounded-lg hover:opacity-90 text-sm"
          >
            View Applicants
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
