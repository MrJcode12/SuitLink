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
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg text-gray-900 font-medium">Experience</h2>
          <p className="text-sm text-gray-600 mt-1">
            Add roles to highlight relevant work and projects.
          </p>
        </div>

        {!isAdding && !editingId && (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition text-sm"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {(isAdding || editingId) && (
        <form
          onSubmit={editingId ? handleUpdate : handleAdd}
          className="mb-6 rounded-2xl border border-gray-200 bg-gray-50 p-5"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-900 font-medium mb-2">
                  Company <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 bg-white"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-900 font-medium mb-2">
                  Position <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) =>
                    setFormData({ ...formData, position: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 bg-white"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-900 font-medium mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 bg-white resize-none"
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-900 font-medium mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 bg-white"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-900 font-medium mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 bg-white"
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
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-white transition disabled:opacity-50"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? "Saving..." : editingId ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </form>
      )}

      {experience.length === 0 && !isAdding && !editingId ? (
        <div className="text-center py-10">
          <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-7 h-7 text-gray-500" />
          </div>
          <p className="text-sm text-gray-600">No experience added yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {experience.map((exp) => (
            <div
              key={exp._id}
              className="rounded-2xl border border-gray-200 p-4 hover:bg-gray-50 transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="text-sm font-medium text-gray-900">
                    {exp.position}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{exp.company}</p>

                  {exp.description && (
                    <p className="text-sm text-gray-600 mt-2 whitespace-pre-line">
                      {exp.description}
                    </p>
                  )}

                  {(exp.startDate || exp.endDate) && (
                    <p className="text-xs text-gray-500 mt-2">
                      {exp.startDate &&
                        new Date(exp.startDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                        })}{" "}
                      –{" "}
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

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(exp)}
                    disabled={loading || isAdding || editingId}
                    className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4 text-gray-700" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(exp._id)}
                    disabled={loading || isAdding || editingId}
                    className="p-2 rounded-lg hover:bg-red-50 disabled:opacity-50"
                    title="Delete"
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
