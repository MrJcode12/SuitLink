// frontend/src/components/ApplicantProfile/EducationManager.jsx
import { useState } from "react";
import { Plus, Edit2, Trash2, GraduationCap, X, Save } from "lucide-react";
import applicantProfileService from "../../services/applicantProfileService";

const EducationManager = ({ profile, onUpdate }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    school: "",
    degree: "",
    fieldOfStudy: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
  });

  const resetForm = () => {
    setFormData({
      school: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
    });
    setIsAdding(false);
    setEditingId(null);
    setError("");
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await applicantProfileService.addEducation(formData);
      if (response.success) {
        await onUpdate();
        resetForm();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (education) => {
    setFormData({
      school: education.school || "",
      degree: education.degree || "",
      fieldOfStudy: education.fieldOfStudy || "",
      startDate: education.startDate ? education.startDate.split("T")[0] : "",
      endDate: education.endDate ? education.endDate.split("T")[0] : "",
      isCurrent: education.isCurrent || false,
    });
    setEditingId(education._id);
    setIsAdding(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await applicantProfileService.updateEducation(
        editingId,
        formData
      );
      if (response.success) {
        await onUpdate();
        resetForm();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (educationId) => {
    if (!confirm("Are you sure you want to delete this education entry?"))
      return;

    setLoading(true);
    try {
      const response = await applicantProfileService.deleteEducation(
        educationId
      );
      if (response.success) {
        await onUpdate();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const education = profile?.education || [];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg text-gray-900 font-medium">Education</h2>
        {!isAdding && !editingId && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Education
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <form
          onSubmit={editingId ? handleUpdate : handleAdd}
          className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                School <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={formData.school}
                onChange={(e) =>
                  setFormData({ ...formData, school: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600"
                required
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Degree
                </label>
                <input
                  type="text"
                  value={formData.degree}
                  onChange={(e) =>
                    setFormData({ ...formData, degree: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Field of Study
                </label>
                <input
                  type="text"
                  value={formData.fieldOfStudy}
                  onChange={(e) =>
                    setFormData({ ...formData, fieldOfStudy: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600"
                  disabled={loading || formData.isCurrent}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isCurrent"
                checked={formData.isCurrent}
                onChange={(e) =>
                  setFormData({ ...formData, isCurrent: e.target.checked })
                }
                className="w-4 h-4 text-emerald-600 rounded"
                disabled={loading}
              />
              <label htmlFor="isCurrent" className="text-sm text-gray-700">
                I currently study here
              </label>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={resetForm}
                disabled={loading}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                <X className="w-4 h-4 inline mr-2" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
              >
                <Save className="w-4 h-4 inline mr-2" />
                {loading ? "Saving..." : editingId ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Education List */}
      {education.length === 0 && !isAdding && !editingId ? (
        <div className="text-center py-8">
          <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-gray-600">No education added yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {education.map((edu) => (
            <div
              key={edu._id}
              className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{edu.school}</h3>
                  {edu.degree && (
                    <p className="text-sm text-gray-700 mt-1">{edu.degree}</p>
                  )}
                  {edu.fieldOfStudy && (
                    <p className="text-sm text-gray-600 mt-1">
                      {edu.fieldOfStudy}
                    </p>
                  )}
                  {(edu.startDate || edu.endDate) && (
                    <p className="text-sm text-gray-500 mt-2">
                      {edu.startDate &&
                        new Date(edu.startDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                        })}{" "}
                      -{" "}
                      {edu.isCurrent
                        ? "Present"
                        : edu.endDate
                        ? new Date(edu.endDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                          })
                        : "N/A"}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(edu)}
                    disabled={loading || isAdding || editingId}
                    className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                  >
                    <Edit2 className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(edu._id)}
                    disabled={loading || isAdding || editingId}
                    className="p-2 hover:bg-red-100 rounded-lg disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EducationManager;
