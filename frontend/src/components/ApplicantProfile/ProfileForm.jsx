import { useState, useEffect } from "react";
import { Edit2, Save, X, User, Mail, Phone, MapPin } from "lucide-react";

const ProfileForm = ({ profile, onSave, updating }) => {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.user?.email || profile.email || "",
        phone: profile.phone || "",
        location: profile.location || "",
      });
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
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    const result = await onSave(formData);
    if (result?.success) {
      setEditing(false);
    } else if (result?.error) {
      // Handle backend validation errors
      if (result.error.includes("email")) {
        setErrors({ email: result.error });
      } else {
        setErrors({ general: result.error });
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: profile?.firstName || "",
      lastName: profile?.lastName || "",
      email: profile?.user?.email || profile?.email || "",
      phone: profile?.phone || "",
      location: profile?.location || "",
    });
    setErrors({});
    setEditing(false);
  };

  return (
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

        {/* Email - Now Editable */}
        <div>
          <label className="block text-sm text-foreground mb-2">
            Email <span className="text-destructive">*</span>
          </label>
          {editing ? (
            <>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-chart-1 focus:ring-1 focus:ring-chart-1 bg-input-background text-foreground"
                disabled={updating}
              />
              {errors.email && (
                <p className="text-sm text-destructive mt-1">{errors.email}</p>
              )}
            </>
          ) : (
            <div className="flex items-center gap-2 text-foreground">
              <Mail className="w-4 h-4 text-muted-foreground" />
              {profile?.user?.email || profile?.email || "Not provided"}
            </div>
          )}
        </div>

        {/* Phone - Now Saves */}
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

        {/* Location - Now Saves */}
        <div>
          <label className="block text-sm text-foreground mb-2">Location</label>
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
            onClick={handleSave}
            disabled={updating}
            className="px-6 py-3 bg-chart-1 text-white rounded-lg hover:opacity-90 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4 inline mr-2" />
            {updating ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileForm;
