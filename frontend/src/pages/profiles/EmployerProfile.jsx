import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, Bell, Loader2, Save } from "lucide-react";
import employerProfileService from "../../services/companyProfileService";
import ProfileHeader from "../../components/Profiles/EmployerProfile/ProfileHeader";
import AboutCompany from "../../components/Profiles/EmployerProfile/AboutCompany";
import IndustryInfo from "../../components/Profiles/EmployerProfile/IndustryInfo";
import LocationInfo from "../../components/Profiles/EmployerProfile/LocationInfo";
import Logo from "../../components/Auth/Shared/Logo";

const EmployerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("Profile");
  const navigate = useNavigate();

  // Edit form state
  const [editForm, setEditForm] = useState({
    companyName: "",
    description: "",
    industry: "",
    location: "",
  });

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      // Replace with actual API call:
      const response = await employerProfileService.getProfile();
      setProfile(response.data);

      // Demo data:
      const demoProfile = {
        companyName: "TechCorp",
        description:
          "We build innovative software solutions for modern businesses.",
        industry: "Technology",
        location: "Makati City, Philippines",
        logo: null,
        credibilityScore: 7,
        metrics: {
          activeJobsCount: 8,
          totalApplicants: 456,
          jobPostsCount: 12,
        },
      };

      setProfile(demoProfile);
      setEditForm({
        companyName: demoProfile.companyName || "",
        description: demoProfile.description || "",
        industry: demoProfile.industry || "",
        location: demoProfile.location || "",
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      alert("Failed to load profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);

      const response = await companyProfileService.updateProfile(editForm);
      setProfile(response.data);

      // Demo:
      setProfile((prev) => ({
        ...prev,
        ...editForm,
        credibilityScore:
          3 +
          (editForm.description ? 2 : 0) +
          (editForm.industry ? 2 : 0) +
          (editForm.location ? 2 : 0) +
          (prev.logo ? 1 : 0),
      }));

      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    try {
      setUploadingLogo(true);

      // Replace with actual API call:
      // const response = await companyProfileService.uploadLogo(file);
      // setProfile(response.data);

      // Demo: Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setProfile((prev) => ({
        ...prev,
        logo: { url: previewUrl },
        credibilityScore:
          prev.credibilityScore < 10 ? prev.credibilityScore + 1 : 10,
      }));

      alert("Logo uploaded successfully!");
    } catch (error) {
      console.error("Error uploading logo:", error);
      alert("Failed to upload logo. Please try again.");
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - reset form
      setEditForm({
        companyName: profile.companyName || "",
        description: profile.description || "",
        industry: profile.industry || "",
        location: profile.location || "",
      });
    }
    setIsEditing(!isEditing);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-2xl font-medium text-gray-900 mb-2">
            No Profile Found
          </h2>
          <p className="text-gray-600 mb-6">
            Create your company profile to get started.
          </p>
          <button
            onClick={() => alert("Would navigate to /create-company-profile")}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Create Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <ProfileHeader />

      <div className="max-w-5xl mx-auto p-6">
        {/* Profile Header Component */}
        <div className="bg-white rounded-xl border border-gray-200 mb-6">
          <div className="h-32 bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-t-xl" />
          <div className="px-8 pb-8">
            <div className="flex items-end justify-between -mt-16 mb-6">
              <div className="flex items-end gap-4">
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
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <span>📷</span>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                        disabled={uploadingLogo}
                      />
                    </label>
                  )}
                </div>
                <div className="pb-2">
                  <h1 className="text-2xl text-gray-900 mb-1">
                    {profile.companyName}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    {profile.industry && <span>🏭 {profile.industry}</span>}
                    {profile.location && <span>📍 {profile.location}</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Credibility:</span>
                    <span
                      className={`px-2 py-1 text-sm rounded ${
                        profile.credibilityScore >= 7
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {profile.credibilityScore}/10
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {isEditing && (
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2 disabled:opacity-50"
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span className="text-sm">Save</span>
                  </button>
                )}
                <button
                  onClick={handleEditToggle}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <span className="text-sm">
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </span>
                </button>
              </div>
            </div>
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
                <div className="text-sm text-gray-600">Total Posts</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-3 gap-6">
          {/* About Company */}
          <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg text-gray-900 mb-4">About Company</h2>
            {isEditing ? (
              <textarea
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                rows={6}
                placeholder="Describe your company..."
              />
            ) : (
              <p className="text-gray-700 leading-relaxed">
                {profile.description || "No description yet."}
              </p>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Industry */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg text-gray-900 mb-4">Industry</h2>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.industry}
                  onChange={(e) =>
                    setEditForm({ ...editForm, industry: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  placeholder="e.g., Technology"
                />
              ) : (
                <span className="inline-block px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm">
                  {profile.industry || "Not specified"}
                </span>
              )}
            </div>

            {/* Location */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg text-gray-900 mb-4">Location</h2>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.location}
                  onChange={(e) =>
                    setEditForm({ ...editForm, location: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  placeholder="e.g., Makati City"
                />
              ) : (
                <p className="text-gray-700">
                  {profile.location || "Not specified"}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerProfile;
