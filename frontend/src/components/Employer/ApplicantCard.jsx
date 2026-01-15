const ApplicantCard = ({ applicant, onViewProfile }) => {
  return (
    <div className="p-6 hover:bg-accent/50 transition-colors border-b border-border last:border-b-0">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground flex-shrink-0 font-medium">
            {applicant.avatar}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-foreground">{applicant.name}</h3>
              {applicant.status === "new" && (
                <span className="px-2 py-0.5 bg-chart-1/10 text-chart-1 text-xs rounded-full font-medium">
                  New
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              Applied for {applicant.position}
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
              <span>{applicant.experience} experience</span>
              <span>•</span>
              <span>{applicant.appliedDate}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {applicant.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 ml-4">
          <div className="text-right">
            <div className="text-sm text-muted-foreground mb-1">
              Match Score
            </div>
            <div className="text-lg font-medium text-chart-1">
              {applicant.matchScore}%
            </div>
          </div>
          <button
            onClick={() => onViewProfile(applicant)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity text-sm whitespace-nowrap font-medium"
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicantCard;
