import { Briefcase } from "lucide-react";
import JobCard from "./JobCard";

const JobGrid = ({
  jobs,
  loading,
  error,
  savedJobs,
  onSaveToggle,
  onJobClick,
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-chart-1 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading jobs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg text-gray-900 mb-2">No jobs found</h3>
        <p className="text-gray-600">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {jobs.map((job) => (
        <JobCard
          key={job._id}
          job={job}
          isSaved={savedJobs.includes(job._id)}
          onSaveToggle={onSaveToggle}
          onClick={onJobClick}
        />
      ))}
    </div>
  );
};

export default JobGrid;
