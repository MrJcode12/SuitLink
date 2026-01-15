import { useState } from "react";
import { X } from "lucide-react";

const SkillsInput = ({ skills, onSkillsChange }) => {
  const [skillInput, setSkillInput] = useState("");

  const addSkill = () => {
    const trimmedSkill = skillInput.trim();
    if (trimmedSkill && !skills.includes(trimmedSkill)) {
      onSkillsChange([...skills, trimmedSkill]);
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove) => {
    onSkillsChange(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div>
      <label htmlFor="skills" className="block text-sm text-gray-700 mb-2">
        Required Skills
      </label>
      <div className="flex gap-2 mb-3">
        <input
          id="skills"
          type="text"
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a skill and press Enter"
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
        />
        <button
          type="button"
          onClick={addSkill}
          className="px-6 py-3 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-color"
        >
          Add
        </button>
      </div>

      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="iinline-flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-sm"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="hover:text-emerald-900"
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default SkillsInput;
