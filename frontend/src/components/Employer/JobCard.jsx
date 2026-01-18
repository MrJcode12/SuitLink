import { MapPin, DollarSign, Clock, Users, MoreVertical } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const JobCard = ({
  job,
  applicantCount,
  countsLoading,
  onEdit,
  onClose,
  onReopen,
  onViewApplicants,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg text-gray-900 truncate">{job.title}</h3>
            <span
              className={`px-3 py-1 text-xs rounded-full ${
                job.status === "open"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {job.status === "open" ? "Open" : "Closed"}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{job.location}</span>
              {job.remote && (
                <span className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                  Remote
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              <span>{formatSalary(job.salaryRange)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{employmentTypeLabels[job.employmentType]}</span>
            </div>
          </div>

          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {job.description}
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onViewApplicants?.(job)}
              className="inline-flex items-center gap-2 text-sm text-chart-1 hover:opacity-80"
            >
              <Users className="w-4 h-4" />
              <span>
                {countsLoading
                  ? "..."
                  : applicantCount !== undefined
                  ? `${applicantCount} ${
                      applicantCount === 1 ? "applicant" : "applicants"
                    }`
                  : "View Applicants"}
              </span>
            </button>
          </div>
        </div>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-10">
              <button
                onClick={() => {
                  onEdit(job);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
              >
                Edit Job
              </button>
              {job.status === "open" ? (
                <button
                  onClick={() => {
                    onClose(job);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  Close Job
                </button>
              ) : (
                <button
                  onClick={() => {
                    onReopen(job);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  Reopen Job
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCard;
