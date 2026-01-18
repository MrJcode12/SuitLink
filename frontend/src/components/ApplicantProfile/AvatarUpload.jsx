import { useState, useRef } from "react";
import { Upload, User, CheckCircle, AlertCircle } from "lucide-react";
import applicantProfileService from "../../services/applicantProfileService";

const AvatarUpload = ({ profile, onUpdate }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setSuccess("");

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    setUploading(true);

    try {
      const response = await applicantProfileService.uploadAvatar(file);
      if (response.success) {
        setSuccess("Profile photo updated successfully!");
        setTimeout(() => setSuccess(""), 3000);
        await onUpdate();
      }
    } catch (err) {
      setError(err.message || "Failed to upload photo");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const profileImageUrl = profile?.profileImage?.url;
  const initials = `${profile?.firstName?.[0] || ""}${
    profile?.lastName?.[0] || ""
  }`.toUpperCase();

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg text-gray-900 font-medium mb-4">Profile Photo</h2>

      {/* Success Message */}
      {success && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <p className="text-sm text-emerald-700">{success}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="flex items-center gap-6">
        {/* Avatar Display */}
        <div className="w-24 h-24 rounded-full overflow-hidden bg-emerald-100 flex items-center justify-center flex-shrink-0">
          {profileImageUrl ? (
            <img
              src={profileImageUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-2xl font-medium text-emerald-600">
              {initials || <User className="w-10 h-10" />}
            </span>
          )}
        </div>

        {/* Upload Button */}
        <div className="flex-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            {uploading
              ? "Uploading..."
              : profileImageUrl
              ? "Change Photo"
              : "Upload Photo"}
          </button>
          <p className="text-xs text-gray-500 mt-2">
            JPG, PNG or GIF. Max size 5MB.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AvatarUpload;
