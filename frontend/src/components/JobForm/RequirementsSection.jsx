import { useState } from "react";
import { X } from "lucide-react";

const RequirementsSection = ({
  formData,
  onSkillsChange,
  onNestedChange,
  errors,
}) => {
  const [skillInput, setSkillInput] = useState("");

  const handleAddSkill = () => {
    if (
      skillInput.trim() &&
      !formData.requirements.skills.includes(skillInput.trim())
    ) {
      onSkillsChange([...formData.requirements.skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    onSkillsChange(
      formData.requirements.skills.filter((skill) => skill !== skillToRemove)
    );
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg text-gray-900 mb-4">Requirements</h3>

      <div className="space-y-4">
        {/* Skills */}
        <div>
          <label htmlFor="skills" className="block text-sm text-gray-700 mb-2">
            Required Skills
          </label>
          <div className="flex gap-2 mb-2">
            <input
              id="skills"
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a skill and press Enter"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-chart-1 focus:ring-1 focus:ring-chart-1"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-4 py-2 bg-chart-1 text-white rounded-lg hover:opacity-90"
            >
              Add
            </button>
          </div>

          {formData.requirements.skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.requirements.skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Experience Years */}
        <div>
          <label
            htmlFor="experienceYears"
            className="block text-sm text-gray-700 mb-2"
          >
            Years of Experience Required
          </label>
          <input
            id="experienceYears"
            type="number"
            value={formData.requirements.experienceYears}
            onChange={(e) =>
              onNestedChange("requirements", "experienceYears", e.target.value)
            }
            placeholder="e.g., 3"
            min="0"
            max="50"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-chart-1 focus:ring-1 focus:ring-chart-1"
          />
        </div>

        {/* Education Level */}
        <div>
          <label
            htmlFor="educationLevel"
            className="block text-sm text-gray-700 mb-2"
          >
            Education Level
          </label>
          <input
            id="educationLevel"
            type="text"
            value={formData.requirements.educationLevel}
            onChange={(e) =>
              onNestedChange("requirements", "educationLevel", e.target.value)
            }
            placeholder="e.g., Bachelor's Degree in Computer Science"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-chart-1 focus:ring-1 focus:ring-chart-1"
          />
        </div>
      </div>
    </div>
  );
};

export default RequirementsSection;
