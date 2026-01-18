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

    const result = await onUpload(file);

    if (result?.success) {
      setSuccess("Profile photo updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
      // Refresh profile context to update navbar
      await refreshProfile();
    } else {
      setError(result?.error || "Failed to upload photo");
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const profileImageUrl = profile?.profileImage?.url;
  const initials = `${profile?.firstName?.[0] || ""}${
    profile?.lastName?.[0] || ""
  }`.toUpperCase();

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <h2 className="text-lg text-foreground mb-4">Profile Photo</h2>

      {/* Success Message */}
      {success && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <p className="text-sm text-emerald-700">{success}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <div className="flex items-center gap-6">
        {/* Avatar Display */}
        <div className="w-24 h-24 rounded-full overflow-hidden bg-chart-1/10 flex items-center justify-center flex-shrink-0 border-2 border-border">
          {profileImageUrl ? (
            <img
              src={profileImageUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-2xl font-medium text-chart-1">
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
            className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            {uploading
              ? "Uploading..."
              : profileImageUrl
              ? "Change Photo"
              : "Upload Photo"}
          </button>
          <p className="text-xs text-muted-foreground mt-2">
            JPG, PNG or GIF. Max size 5MB.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AvatarUpload;
