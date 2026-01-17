const ApplicantCard = ({ applicant, onViewProfile }) => {
  return (
    <div className="p-6 border-b border-gray-200">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center text-white flex-shrink-0">
            {applicant.avatar}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-gray-900">{applicant.name}</h3>
              {applicant.status === "new" && (
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                  New
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Applied for {applicant.position}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
              <span>{applicant.experience} experience</span>
              <span>•</span>
              <span>{applicant.appliedDate}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {applicant.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 ml-4">
          <div className="text-right">
            <div className="text-sm text-gray-600 mb-1">Match Score</div>
            <div className="text-lg text-emerald-600">
              {applicant.matchScore}%
            </div>
          </div>
          <button
            onClick={() => onViewProfile(applicant)}
            className="px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors text-sm whitespace-nowrap"
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicantCard;
