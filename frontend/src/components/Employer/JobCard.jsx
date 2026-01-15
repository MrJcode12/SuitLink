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
    <div className="p-6 hover:bg-accent/50 transition-colors border-b border-border last:border-b-0">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-medium text-foreground">{job.title}</h3>
            <span
              className={`px-2 py-1 text-xs rounded-full font-medium ${
                job.status === "active"
                  ? "bg-chart-1/10 text-chart-1"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {job.status}
            </span>
            {job.newApplicants > 0 && (
              <span className="px-2 py-1 bg-chart-4/10 text-chart-4 text-xs rounded-full font-medium">
                {job.newApplicants} new
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              <span>{job.salary}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{job.type}</span>
            </div>
            <span>Posted {job.posted}</span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground font-medium">
                {job.applicants}
              </span>
              <span className="text-muted-foreground">applicants</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground font-medium">{job.viewed}</span>
              <span className="text-muted-foreground">views</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(job)}
            className="px-4 py-2 border border-border rounded-lg hover:bg-accent text-sm font-medium"
          >
            Edit
          </button>
          <button
            onClick={() => onViewApplicants(job)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 text-sm font-medium"
          >
            View Applicants
          </button>
          <button className="p-2 hover:bg-accent rounded-lg">
            <MoreVertical className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
