const JobCardSkeleton = () => (
  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm animate-pulse">
    <div className="flex items-start justify-between mb-4">
      <div className="w-12 h-12 rounded-lg bg-gray-200 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer" />
      </div>
      <div className="w-5 h-5 bg-gray-200 rounded relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer" />
      </div>
    </div>

    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer" />
    </div>
    <div className="h-3 bg-gray-200 rounded w-1/2 mb-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer" />
    </div>

    <div className="h-3 bg-gray-200 rounded w-2/3 mb-2 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer" />
    </div>
    <div className="h-3 bg-gray-200 rounded w-1/3 mb-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer" />
    </div>

    <div className="h-6 bg-gray-200 rounded-full w-32 mb-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer" />
    </div>

    <div className="space-y-2 mb-4">
      <div className="h-3 bg-gray-200 rounded w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer" />
      </div>
      <div className="h-3 bg-gray-200 rounded w-5/6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer" />
      </div>
      <div className="h-3 bg-gray-200 rounded w-4/6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer" />
      </div>
    </div>

    <div className="flex gap-2 mb-4">
      <div className="h-5 w-16 bg-gray-200 rounded-full relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer" />
      </div>
      <div className="h-5 w-12 bg-gray-200 rounded-full relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer" />
      </div>
      <div className="h-5 w-14 bg-gray-200 rounded-full relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer" />
      </div>
    </div>

    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
      <div className="h-3 w-20 bg-gray-200 rounded relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer" />
      </div>
      <div className="h-5 w-5 bg-gray-200 rounded relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer" />
      </div>
    </div>
  </div>
);

export default JobCardSkeleton;
