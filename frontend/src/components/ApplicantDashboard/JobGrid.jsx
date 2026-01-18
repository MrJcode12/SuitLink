import { Briefcase } from "lucide-react";
import JobCard from "./JobCard";

const JobGrid = ({
  jobs,
  loading,
  error,
  appliedJobIds, // This will be a Set
  onJobClick,
}) => {
  // Safely convert to Set if not already
  const safeAppliedJobIds =
    appliedJobIds instanceof Set ? appliedJobIds : new Set(appliedJobIds || []);
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-chart-1 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading jobs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-6 text-center">
        <p className="text-destructive mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90"
        >
          Retry
        </button>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border p-12 text-center">
        <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg text-foreground mb-2">No jobs found</h3>
        <p className="text-muted-foreground">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {jobs.map((job) => (
        <JobCard
          key={job._id}
          job={job}
          isApplied={safeAppliedJobIds.has(job._id)}
          onClick={onJobClick}
        />
      ))}
    </div>
  );
};

export default JobGrid;
