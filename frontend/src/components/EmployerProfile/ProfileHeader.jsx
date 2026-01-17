import { Edit2 } from "lucide-react";

const ProfileHeader = ({ companyProfile, onEdit }) => {
  // Calculate stats from company profile
  const activeJobs = companyProfile?.metrics?.activeJobsCount || 0;
  const totalApplicants = companyProfile?.metrics?.totalApplicants || 0;
  const credibilityScore = companyProfile?.credibilityScore || 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 mb-6">
      <div className="h-32 bg-gradient-to-r from-chart-1 to-emerald-800 rounded-t-xl" />

      <div className="px-8 pb-8">
        <div className="flex items-end justify-between -mt-16 mb-6">
          <div className="flex items-end gap-4">
            {/* Company Logo or Icon */}
            <div className="w-32 h-32 rounded-xl bg-white border-4 border-white shadow-lg flex items-center justify-center text-4xl overflow-hidden">
              {companyProfile?.logo?.url ? (
                <img
                  src={companyProfile.logo.url}
                  alt={companyProfile.companyName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-chart-1">
                  {companyProfile?.companyName?.[0] || "🏢"}
                </span>
              )}
            </div>
            <div className="pb-2">
              <h1 className="text-2xl text-gray-900 mb-1">
                {companyProfile?.companyName || "Company Name"}
              </h1>
              <p className="text-gray-600 mb-2">
                {companyProfile?.industry || "Industry"} •{" "}
                {companyProfile?.companySize || "Company Size"}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <svg
                    className="size-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>{companyProfile?.location || "Location"}</span>
                </div>
                {companyProfile?.website && (
                  <div className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                      />
                    </svg>
                    <span>{companyProfile.website}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onEdit}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Edit2 className="w-4 h-4" />
            <span className="text-sm">Edit Profile</span>
          </button>
        </div>

        {/* Company Stats */}
        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
          <div>
            <div className="text-2xl text-gray-900 mb-1">{activeJobs}</div>
            <div className="text-sm text-gray-600">Active Jobs</div>
          </div>
          <div>
            <div className="text-2xl text-gray-900 mb-1">{totalApplicants}</div>
            <div className="text-sm text-gray-600">Total Applicants</div>
          </div>
          <div>
            <div className="text-2xl text-gray-900 mb-1">
              {credibilityScore.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">Credibility Score</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
