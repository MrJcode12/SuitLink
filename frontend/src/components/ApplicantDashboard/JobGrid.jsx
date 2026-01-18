import JobCard from "./JobCard";
import JobCardSkeleton from "../ApplicantProfile/JobCardSkeleton";

const JobGrid = ({ jobs, loading, error, appliedJobIds, onJobClick }) => {
  if (error) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 text-center text-gray-600">
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {loading
        ? // Render 6 skeleton cards to mimic the grid
          Array.from({ length: 6 }).map((_, i) => <JobCardSkeleton key={i} />)
        : jobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              onEdit={() => {}}
              onViewApplicants={() => {}}
              onClick={() => onJobClick(job._id)}
            />
          ))}
    </div>
  );
};

export default JobGrid;
