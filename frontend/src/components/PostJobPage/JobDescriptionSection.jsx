import FormSection from "./FormSection";
import TextAreaField from "./TextAreaField";

const JobDescriptionSection = ({ formData, onChange, errors }) => {
  return (
    <FormSection title="Job Description">
      <div className="space-y-4">
        <TextAreaField
          id="description"
          label="Description"
          value={formData.description}
          onChange={(e) => onChange("description", e.target.value)}
          placeholder="Describe the role, responsibilities, and what makes this opportunity unique..."
          rows={6}
          required
          error={errors.description}
        />

        <TextAreaField
          id="requirements"
          label="Requirements"
          value={formData.requirements}
          onChange={(e) => onChange("requirements", e.target.value)}
          placeholder="List required qualifications, experience, and skills..."
          rows={6}
          required
          error={errors.requirements}
        />

        <TextAreaField
          id="benefits"
          label="Benefits"
          value={formData.benefits}
          onChange={(e) => onChange("benefits", e.target.value)}
          placeholder="List benefits and perks..."
          rows={4}
          error={errors.benefits}
        />
      </div>
    </FormSection>
  );
};

export default JobDescriptionSection;
