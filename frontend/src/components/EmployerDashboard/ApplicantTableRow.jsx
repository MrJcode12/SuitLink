const ApplicantTableRow = ({ applicant, onViewProfile }) => {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white text-sm">
            {applicant.avatar}
          </div>
          <div>
            <div className="text-sm text-gray-900">{applicant.name}</div>
            <div className="text-xs text-gray-600">
              {applicant.experience} exp
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">{applicant.position}</td>
      <td className="px-6 py-4 text-sm text-gray-600">
        {applicant.appliedDate}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden max-w-[80px]">
            <div
              className="h-full bg-emerald-600 rounded-full"
              style={{ width: `${applicant.matchScore}%` }}
            />
          </div>
          <span className="text-sm text-gray-900">{applicant.matchScore}%</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            applicant.status === "new"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {applicant.status}
        </span>
      </td>
      <td className="px-6 py-4">
        <button
          onClick={() => onViewProfile(applicant)}
          className="text-sm text-emerald-600 hover:text-emerald-700"
        >
          View Profile
        </button>
      </td>
    </tr>
  );
};

export default ApplicantTableRow;
