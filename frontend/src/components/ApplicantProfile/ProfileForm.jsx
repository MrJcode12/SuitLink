import { useState, useEffect } from "react";
import {
  Edit2,
  Save,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
} from "lucide-react";
import { useProfile } from "../../context/ProfileContext";
import { authService } from "../../services/authService";

const ProfileForm = ({ profile, onSave, updating }) => {
  const { user, refreshProfile } = useProfile();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [savingEmail, setSavingEmail] = useState(false);

  useEffect(() => {
    if (profile && user) {
      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: user.email || "",
        phone: profile.phone || "",
        location: profile.location || "",
      });
    }
  }, [profile, user]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSavePersonalInfo = async () => {
    if (!validate()) return;

    setErrors({});
    setSuccess("");

    try {
      const emailChanged = formData.email !== user.email;

      const profileData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        location: formData.location,
      };

      const profileResult = await onSave(profileData);

      if (emailChanged) {
        setSavingEmail(true);
        const emailResult = await authService.updateEmail(formData.email);
        setSavingEmail(false);

        if (!emailResult.success) {
          setErrors({ email: emailResult.message || "Failed to update email" });
          return;
        }
      }

      if (profileResult?.success) {
        await refreshProfile();
        setEditing(false);
        setSuccess("Personal information updated successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } else if (profileResult?.error) {
        setErrors({ general: profileResult.error });
      }
    } catch (error) {
      setErrors({ general: error.message || "Failed to save changes" });
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: profile?.firstName || "",
      lastName: profile?.lastName || "",
      email: user?.email || "",
      phone: profile?.phone || "",
      location: profile?.location || "",
    });
    setErrors({});
    setEditing(false);
  };

  const FieldRow = ({ icon: Icon, value }) => (
    <div className="flex items-center gap-2 text-gray-800">
      <Icon className="w-4 h-4 text-gray-500" />
      <span className="text-sm">{value}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      {success && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-700 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-emerald-800">{success}</p>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg text-gray-900 font-medium">
              Personal Information
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Keep your information accurate to help employers contact you.
            </p>
          </div>

          {!editing && (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition text-sm"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
          )}
        </div>

        {errors.general && (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-800">{errors.general}</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-900 font-medium mb-2">
              First Name <span className="text-red-600">*</span>
            </label>
            {editing ? (
              <>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 bg-white"
                  disabled={updating || savingEmail}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-600 mt-1">{errors.firstName}</p>
                )}
              </>
            ) : (
              <FieldRow icon={User} value={profile?.firstName || "Not provided"} />
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-900 font-medium mb-2">
              Last Name <span className="text-red-600">*</span>
            </label>
            {editing ? (
              <>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 bg-white"
                  disabled={updating || savingEmail}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-600 mt-1">{errors.lastName}</p>
                )}
              </>
            ) : (
              <FieldRow icon={User} value={profile?.lastName || "Not provided"} />
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-900 font-medium mb-2">
              Email <span className="text-red-600">*</span>
            </label>
            {editing ? (
              <>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 bg-white"
                  disabled={updating || savingEmail}
                />
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                )}
              </>
            ) : (
              <FieldRow icon={Mail} value={user?.email || "Not provided"} />
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-900 font-medium mb-2">
              Phone
            </label>
            {editing ? (
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="+1 234 567 8900"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 bg-white"
                disabled={updating || savingEmail}
              />
            ) : (
              <FieldRow icon={Phone} value={profile?.phone || "Not provided"} />
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-900 font-medium mb-2">
              Location
            </label>
            {editing ? (
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                placeholder="San Francisco, CA"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 bg-white"
                disabled={updating || savingEmail}
              />
            ) : (
              <FieldRow icon={MapPin} value={profile?.location || "Not provided"} />
            )}
          </div>
        </div>

        {editing && (
          <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              disabled={updating || savingEmail}
              className="px-6 py-3 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
            >
              <X className="w-4 h-4 inline mr-2" />
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSavePersonalInfo}
              disabled={updating || savingEmail}
              className="px-6 py-3 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition disabled:opacity-50"
            >
              <Save className="w-4 h-4 inline mr-2" />
              {updating || savingEmail ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileForm;
