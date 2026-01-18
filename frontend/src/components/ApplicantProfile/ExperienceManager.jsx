import { useState } from "react";
import { Plus, Edit2, Trash2, Briefcase, X, Save } from "lucide-react";
import applicantProfileService from "../../services/applicantProfileService";

const ExperienceManager = ({ profile, onUpdate }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    company: "",
    position: "",
    description: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
  });

  const resetForm = () => {
    setFormData({
      company: "",
      position: "",
      description: "",
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
      const response = await applicantProfileService.addExperience(formData);
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

  const handleEdit = (experience) => {
    setFormData({
      company: experience.company || "",
      position: experience.position || "",
      description: experience.description || "",
      startDate: experience.startDate ? experience.startDate.split("T")[0] : "",
      endDate: experience.endDate ? experience.endDate.split("T")[0] : "",
      isCurrent: experience.isCurrent || false,
    });
    setEditingId(experience._id);
    setIsAdding(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await applicantProfileService.updateExperience(
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

  const handleDelete = async (experienceId) => {
    if (!confirm("Are you sure you want to delete this experience?")) return;

    setLoading(true);
    try {
      const response = await applicantProfileService.deleteExperience(
        experienceId
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

  const experience = profile?.experience || [];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg text-gray-900 font-medium">Experience</h2>
        {!isAdding && !editingId && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Experience
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {(isAdding || editingId) && (
        <form
          onSubmit={editingId ? handleUpdate : handleAdd}
          className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Company <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Position <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) =>
                    setFormData({ ...formData, position: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600 resize-none"
                disabled={loading}
              />
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
                id="isCurrentExp"
                checked={formData.isCurrent}
                onChange={(e) =>
                  setFormData({ ...formData, isCurrent: e.target.checked })
                }
                className="w-4 h-4 text-emerald-600 rounded"
                disabled={loading}
              />
              <label htmlFor="isCurrentExp" className="text-sm text-gray-700">
                I currently work here
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

      {experience.length === 0 && !isAdding && !editingId ? (
        <div className="text-center py-8">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-gray-600">No experience added yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {experience.map((exp) => (
            <div
              key={exp._id}
              className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{exp.position}</h3>
                  <p className="text-sm text-gray-700 mt-1">{exp.company}</p>
                  {exp.description && (
                    <p className="text-sm text-gray-600 mt-2 whitespace-pre-line">
                      {exp.description}
                    </p>
                  )}
                  {(exp.startDate || exp.endDate) && (
                    <p className="text-sm text-gray-500 mt-2">
                      {exp.startDate &&
                        new Date(exp.startDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                        })}{" "}
                      -{" "}
                      {exp.isCurrent
                        ? "Present"
                        : exp.endDate
                        ? new Date(exp.endDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                          })
                        : "N/A"}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(exp)}
                    disabled={loading || isAdding || editingId}
                    className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                  >
                    <Edit2 className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(exp._id)}
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

export default ExperienceManager;
