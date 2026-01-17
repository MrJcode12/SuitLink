import { Edit2, X, Upload, Building2, MapPin } from "lucide-react";

const ProfileHeader = ({
  profile,
  isEditing,
  onEditToggle,
  onLogoUpload,
  uploadingLogo,
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 mb-6">
      <div className="h-32 bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-t-xl" />

      <div className="px-8 pb-8">
        <div className="flex items-end justify-between -mt-16 mb-6">
          <div className="flex items-end gap-4">
            {/* Logo with upload */}
            <div className="relative">
              <div className="w-32 h-32 rounded-xl bg-white border-4 border-white shadow-lg flex items-center justify-center text-4xl overflow-hidden">
                {profile.logo?.url ? (
                  <img
                    src={profile.logo.url}
                    alt={profile.companyName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-emerald-600">🏢</span>
                )}
              </div>
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-emerald-600 text-white p-2 rounded-lg cursor-pointer hover:bg-emerald-700">
                  {uploadingLogo ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onLogoUpload}
                    className="hidden"
                    disabled={uploadingLogo}
                  />
                </label>
              )}
            </div>

            {/* Company Info */}
            <div className="pb-2">
              <h1 className="text-2xl text-gray-900 mb-1">
                {profile.companyName}
              </h1>

              <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                {profile.industry && (
                  <div className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    <span>{profile.industry}</span>
                  </div>
                )}
                {profile.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{profile.location}</span>
                  </div>
                )}
              </div>

              {/* Credibility Badge */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Credibility Score:
                </span>
                <span
                  className={`px-2 py-1 text-sm rounded ${
                    profile.credibilityScore >= 7
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {profile.credibilityScore}/10
                </span>
                {profile.credibilityScore >= 7 && (
                  <span className="text-emerald-600 text-sm">✓ Verified</span>
                )}
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <button
            onClick={onEditToggle}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            {isEditing ? (
              <X className="w-4 h-4" />
            ) : (
              <Edit2 className="w-4 h-4" />
            )}
            <span className="text-sm">
              {isEditing ? "Cancel" : "Edit Profile"}
            </span>
          </button>
        </div>

        {/* Company Metrics */}
        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
          <div>
            <div className="text-2xl text-gray-900 mb-1">
              {profile.metrics?.activeJobsCount || 0}
            </div>
            <div className="text-sm text-gray-600">Active Jobs</div>
          </div>
          <div>
            <div className="text-2xl text-gray-900 mb-1">
              {profile.metrics?.totalApplicants || 0}
            </div>
            <div className="text-sm text-gray-600">Total Applicants</div>
          </div>
          <div>
            <div className="text-2xl text-gray-900 mb-1">
              {profile.metrics?.jobPostsCount || 0}
            </div>
            <div className="text-sm text-gray-600">Total Job Posts</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
