import { useState, useEffect } from "react";
import {
  Edit2,
  Save,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  CheckCircle,
} from "lucide-react";

const ProfileForm = ({ profile, onSave, updating }) => {
  const [editing, setEditing] = useState(false);
  const [editingCoverLetter, setEditingCoverLetter] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    location: "",
  });
  const [coverLetter, setCoverLetter] = useState("");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        phone: profile.phone || "",
        location: profile.location || "",
      });
      setCoverLetter(profile.coverLetter || "");
    }
  }, [profile]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSavePersonalInfo = async () => {
    if (!validate()) return;

    const result = await onSave(formData);
    if (result?.success) {
      setEditing(false);
      setSuccess("Personal information updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } else if (result?.error) {
      setErrors({ general: result.error });
    }
  };

  const handleSaveCoverLetter = async () => {
    const result = await onSave({ coverLetter });
    if (result?.success) {
      setEditingCoverLetter(false);
      setSuccess("Cover letter updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } else if (result?.error) {
      setErrors({ coverLetter: result.error });
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: profile?.firstName || "",
      lastName: profile?.lastName || "",
      phone: profile?.phone || "",
      location: profile?.location || "",
    });
    setErrors({});
    setEditing(false);
  };

  const handleCancelCoverLetter = () => {
    setCoverLetter(profile?.coverLetter || "");
    setErrors({});
    setEditingCoverLetter(false);
  };

  const hasCoverLetter =
    profile?.coverLetter && profile.coverLetter.trim().length > 0;

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {success && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <p className="text-sm text-emerald-700">{success}</p>
        </div>
      )}

      {/* Personal Information Card */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg text-foreground">Personal Information</h2>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors text-sm"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
          )}
        </div>

        {errors.general && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">{errors.general}</p>
          </div>
        )}

        <div className="space-y-4">
          {/* First Name */}
          <div>
            <label className="block text-sm text-foreground mb-2">
              First Name <span className="text-destructive">*</span>
            </label>
            {editing ? (
              <>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-chart-1 focus:ring-1 focus:ring-chart-1 bg-input-background text-foreground"
                  disabled={updating}
                />
                {errors.firstName && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.firstName}
                  </p>
                )}
              </>
            ) : (
              <div className="flex items-center gap-2 text-foreground">
                <User className="w-4 h-4 text-muted-foreground" />
                {profile?.firstName || "Not provided"}
              </div>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm text-foreground mb-2">
              Last Name <span className="text-destructive">*</span>
            </label>
            {editing ? (
              <>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-chart-1 focus:ring-1 focus:ring-chart-1 bg-input-background text-foreground"
                  disabled={updating}
                />
                {errors.lastName && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.lastName}
                  </p>
                )}
              </>
            ) : (
              <div className="flex items-center gap-2 text-foreground">
                <User className="w-4 h-4 text-muted-foreground" />
                {profile?.lastName || "Not provided"}
              </div>
            )}
          </div>

          {/* Email - Display Only (from User model) */}
          <div>
            <label className="block text-sm text-foreground mb-2">Email</label>
            <div className="flex items-center gap-2 text-foreground">
              <Mail className="w-4 h-4 text-muted-foreground" />
              {profile?.user?.email || "Not provided"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Email cannot be changed from profile settings
            </p>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm text-foreground mb-2">Phone</label>
            {editing ? (
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="+1 234 567 8900"
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-chart-1 focus:ring-1 focus:ring-chart-1 bg-input-background text-foreground"
                disabled={updating}
              />
            ) : (
              <div className="flex items-center gap-2 text-foreground">
                <Phone className="w-4 h-4 text-muted-foreground" />
                {profile?.phone || "Not provided"}
              </div>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm text-foreground mb-2">
              Location
            </label>
            {editing ? (
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                placeholder="San Francisco, CA"
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-chart-1 focus:ring-1 focus:ring-chart-1 bg-input-background text-foreground"
                disabled={updating}
              />
            ) : (
              <div className="flex items-center gap-2 text-foreground">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                {profile?.location || "Not provided"}
              </div>
            )}
          </div>
        </div>

        {editing && (
          <div className="flex items-center gap-3 mt-6 pt-6 border-t border-border">
            <button
              onClick={handleCancel}
              disabled={updating}
              className="px-6 py-3 border border-border rounded-lg hover:bg-accent transition-colors disabled:opacity-50"
            >
              <X className="w-4 h-4 inline mr-2" />
              Cancel
            </button>
            <button
              onClick={handleSavePersonalInfo}
              disabled={updating}
              className="px-6 py-3 bg-chart-1 text-white rounded-lg hover:opacity-90 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4 inline mr-2" />
              {updating ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>

      {/* Cover Letter Card */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg text-foreground">Cover Letter</h2>
          {!editingCoverLetter && (
            <button
              onClick={() => setEditingCoverLetter(true)}
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors text-sm"
            >
              <Edit2 className="w-4 h-4" />
              {hasCoverLetter ? "Edit" : "Add"}
            </button>
          )}
        </div>

        {errors.coverLetter && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">{errors.coverLetter}</p>
          </div>
        )}

        {editingCoverLetter ? (
          <div>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Write a compelling cover letter that highlights your experience and why you're a great fit..."
              rows={12}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-chart-1 focus:ring-1 focus:ring-chart-1 resize-none bg-input-background text-foreground"
              disabled={updating}
            />
            <p className="text-xs text-muted-foreground mt-2">
              {coverLetter.length} characters
            </p>

            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={handleCancelCoverLetter}
                disabled={updating}
                className="px-6 py-3 border border-border rounded-lg hover:bg-accent transition-colors disabled:opacity-50"
              >
                <X className="w-4 h-4 inline mr-2" />
                Cancel
              </button>
              <button
                onClick={handleSaveCoverLetter}
                disabled={updating}
                className="px-6 py-3 bg-chart-1 text-white rounded-lg hover:opacity-90 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4 inline mr-2" />
                {updating ? "Saving..." : "Save Cover Letter"}
              </button>
            </div>
          </div>
        ) : hasCoverLetter ? (
          <div className="prose prose-sm max-w-none">
            <p className="text-foreground whitespace-pre-line leading-relaxed">
              {profile.coverLetter}
            </p>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-sm font-medium text-foreground mb-2">
              No cover letter added
            </h3>
            <p className="text-sm text-muted-foreground">
              Add a cover letter to strengthen your job applications
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileForm;
