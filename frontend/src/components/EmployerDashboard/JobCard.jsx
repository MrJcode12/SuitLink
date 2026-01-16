import {
  MapPin,
  DollarSign,
  Clock,
  Users,
  Eye,
  MoreVertical,
} from "lucide-react";

const JobCard = ({ job, onEdit, onViewApplicants }) => {
  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg text-gray-900">{job.title}</h3>
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                job.status === "active"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {job.status}
            </span>
            {job.newApplicants > 0 && (
              <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                {job.newApplicants} new
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <MapPin className="size-4" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="size-4" />
              <span>{job.salary}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="size-4" />
              <span>{job.type}</span>
            </div>
            <span>Posted {job.posted}</span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Users className="size-4 text-gray-500" />
              <span className="text-gray-900">{job.applicants}</span>
              <span className="text-gray-600">applicants</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="size-4 text-gray-500" />
              <span className="text-gray-900">{job.viewed}</span>
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
          <button
            onClick={() => onViewApplicants(job)}
            className="px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 text-sm"
          >
            View Applicants
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <MoreVertical className="size-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
