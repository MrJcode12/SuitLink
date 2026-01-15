import FormSection from "./FormSection";
import InputField from "./InputField";
import SelectField from "./SelectField";

const BasicInfoSection = ({ formData, onChange, errors }) => {
  const jobTypes = ["Full-time", "Part-time", "Contract", "Internship"];
  const workStyles = ["Office", "Remote", "Hybrid"];

  return (
    <FormSection title="Basic Information">
      <div className="space-y-4">
        <InputField
          id="jobTitle"
          label="Job Title"
          value={formData.jobTitle}
          onChange={(e) => onChange("jobTitle", e.target.value)}
          placeholder="e.g. Senior UX Designer"
          required
          error={errors.jobTitle}
        />

        <div className="grid grid-cols-2 gap-4">
          <SelectField
            id="jobType"
            label="Job Type"
            value={formData.jobType}
            onChange={(e) => onChange("jobType", e.target.value)}
            options={jobTypes}
            required
            error={errors.jobType}
          />

          <SelectField
            id="workStyle"
            label="Work Style"
            value={formData.workStyle}
            onChange={(e) => onChange("workStyle", e.target.value)}
            options={workStyles}
            required
            error={errors.workStyle}
          />
        </div>

        <InputField
          id="location"
          label="Location"
          value={formData.location}
          onChange={(e) => onChange("location", e.target.value)}
          placeholder="e.g. San Francisco, CA"
          required
          error={errors.location}
        />

        <div>
          <label className="block text-sm text-gray-700 mb-2">
            Salary Range <span className="text-gray-700">*</span>
          </label>
          <div className="grid grid-cols-2 gap-4">
            <InputField
              id="salaryMin"
              label=""
              type="number"
              value={formData.salaryMin}
              onChange={(e) => onChange("salaryMin", e.target.value)}
              placeholder="Minimum"
              error={errors.salaryMin}
            />
            <InputField
              id="salaryMax"
              label=""
              type="number"
              value={formData.salaryMax}
              onChange={(e) => onChange("salaryMax", e.target.value)}
              placeholder="Maximum"
              error={errors.salaryMax}
            />
          </div>
        </div>
      </div>
    </FormSection>
  );
};

export default BasicInfoSection;
