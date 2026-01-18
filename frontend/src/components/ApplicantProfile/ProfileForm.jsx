// frontend/src/components/ApplicantProfile/ProfileForm.jsx
import { useState, useEffect } from "react";
import { Edit2, Save, X, User, Mail, Phone, MapPin } from "lucide-react";

const ProfileForm = ({ profile, onSave, updating }) => {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    location: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
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
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    const result = await onSave(formData);
    if (result?.success) {
      setEditing(false);
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

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg text-gray-900 font-medium">
          Personal Information
        </h2>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* First Name */}
        <div>
          <label className="block text-sm text-gray-700 mb-2">
            First Name <span className="text-red-600">*</span>
          </label>
          {editing ? (
            <>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                disabled={updating}
              />
              {errors.firstName && (
                <p className="text-sm text-red-600 mt-1">{errors.firstName}</p>
              )}
            </>
          ) : (
            <div className="flex items-center gap-2 text-gray-900">
              <User className="w-4 h-4 text-gray-400" />
              {profile?.firstName || "Not provided"}
            </div>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm text-gray-700 mb-2">
            Last Name <span className="text-red-600">*</span>
          </label>
          {editing ? (
            <>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                disabled={updating}
              />
              {errors.lastName && (
                <p className="text-sm text-red-600 mt-1">{errors.lastName}</p>
              )}
            </>
          ) : (
            <div className="flex items-center gap-2 text-gray-900">
              <User className="w-4 h-4 text-gray-400" />
              {profile?.lastName || "Not provided"}
            </div>
          )}
        </div>

        {/* Email (Read-only) */}
        <div>
          <label className="block text-sm text-gray-700 mb-2">Email</label>
          <div className="flex items-center gap-2 text-gray-600">
            <Mail className="w-4 h-4 text-gray-400" />
            {profile?.user?.email || profile?.email || "Not provided"}
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm text-gray-700 mb-2">Phone</label>
          {editing ? (
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+1 234 567 8900"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              disabled={updating}
            />
          ) : (
            <div className="flex items-center gap-2 text-gray-900">
              <Phone className="w-4 h-4 text-gray-400" />
              {profile?.phone || "Not provided"}
            </div>
          )}
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm text-gray-700 mb-2">Location</label>
          {editing ? (
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              placeholder="San Francisco, CA"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              disabled={updating}
            />
          ) : (
            <div className="flex items-center gap-2 text-gray-900">
              <MapPin className="w-4 h-4 text-gray-400" />
              {profile?.location || "Not provided"}
            </div>
          )}
        </div>
      </div>

      {editing && (
        <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={handleCancel}
            disabled={updating}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4 inline mr-2" />
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={updating}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
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
