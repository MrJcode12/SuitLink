const ApplicantTableRow = ({ applicant, onViewProfile }) => {
  return (
    <tr className="hover:bg-accent/50">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
            {applicant.avatar}
          </div>
          <div>
            <div className="text-sm font-medium text-foreground">
              {applicant.name}
            </div>
            <div className="text-xs text-muted-foreground">
              {applicant.experience} exp
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-foreground">
        {applicant.position}
      </td>
      <td className="px-6 py-4 text-sm text-muted-foreground">
        {applicant.appliedDate}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden max-w-[80px]">
            <div
              className="h-full bg-chart-1 rounded-full"
              style={{ width: `${applicant.matchScore}%` }}
            />
          </div>
          <span className="text-sm font-medium text-foreground">
            {applicant.matchScore}%
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <span
          className={`px-2 py-1 text-xs rounded-full font-medium ${
            applicant.status === "new"
              ? "bg-chart-1/10 text-chart-1"
              : "bg-chart-2/10 text-chart-2"
          }`}
        >
          {applicant.status}
        </span>
      </td>
      <td className="px-6 py-4">
        <button
          onClick={() => onViewProfile(applicant)}
          className="text-sm text-primary hover:opacity-80 font-medium"
        >
          View Profile
        </button>
      </td>
    </tr>
  );
};

export default ApplicantTableRow;
