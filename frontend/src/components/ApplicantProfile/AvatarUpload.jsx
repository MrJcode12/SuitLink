import { useState, useRef } from "react";
import { Upload, User, CheckCircle, AlertCircle } from "lucide-react";
import { useProfile } from "../../context/ProfileContext";

const AvatarUpload = ({ profile, onUpload, uploading }) => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef(null);
  const { refreshProfile } = useProfile();

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setSuccess("");

    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    const result = await onUpload(file);

    if (result?.success) {
      setSuccess("Profile photo updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
      await refreshProfile();
    } else {
      setError(result?.error || "Failed to upload photo");
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const profileImageUrl = profile?.profileImage?.url;
  const initials = `${profile?.firstName?.[0] || ""}${
    profile?.lastName?.[0] || ""
  }`.toUpperCase();

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg text-gray-900 font-medium">Profile Photo</h2>
          <p className="text-sm text-gray-600 mt-1">
            Upload a professional photo to help employers recognize you.
          </p>
        </div>
      </div>

      {success && (
        <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-700 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-emerald-800">{success}</p>
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-700 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center gap-5">
        <div className="w-24 h-24 rounded-2xl overflow-hidden bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
          {profileImageUrl ? (
            <img
              src={profileImageUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : initials ? (
            <span className="text-2xl font-semibold text-emerald-700">
              {initials}
            </span>
          ) : (
            <User className="w-10 h-10 text-emerald-700" />
          )}
        </div>

        <div className="flex-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
            >
              <Upload className="w-4 h-4" />
              {uploading
                ? "Uploading..."
                : profileImageUrl
                ? "Change Photo"
                : "Upload Photo"}
            </button>

            <p className="text-xs text-gray-500">JPG, PNG, or GIF (max 5MB)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarUpload;
