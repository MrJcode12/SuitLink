import { useState } from "react";
import { Edit2, X } from "lucide-react";
import applicantProfileService from "../../services/applicantProfileService";

const SkillsManager = ({ profile, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const startEditing = () => {
    setSkills([...(profile?.skills || [])]);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setSkills([]);
    setSkillInput("");
    setIsEditing(false);
    setError("");
  };

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await applicantProfileService.updateProfile({ skills });
      if (response.success) {
        await onUpdate();
        setIsEditing(false);
        setSkills([]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const currentSkills = profile?.skills || [];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg text-gray-900 font-medium">Skills</h2>
          <p className="text-sm text-gray-600 mt-1">
            Add skills to improve matching and search visibility.
          </p>
        </div>

        {!isEditing && (
          <button
            type="button"
            onClick={startEditing}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition text-sm"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {isEditing ? (
        <div>
          <div className="flex flex-col sm:flex-row gap-2 mb-3">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkill();
                }
              }}
              placeholder="Type a skill and press Enter"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              disabled={loading}
            />
            <button
              type="button"
              onClick={addSkill}
              disabled={loading}
              className="px-5 py-3 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition disabled:opacity-50"
            >
              Add
            </button>
          </div>

          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 rounded-full text-sm"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="text-emerald-700 hover:text-emerald-900"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={cancelEditing}
              disabled={loading}
              className="px-5 py-2.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className="px-5 py-2.5 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Skills"}
            </button>
          </div>
        </div>
      ) : currentSkills.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-sm text-gray-600">No skills added yet.</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {currentSkills.map((skill, idx) => (
            <span
              key={idx}
              className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default SkillsManager;
