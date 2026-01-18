import FormSection from "./FormSection";
import SkillsInput from "./SkillsInput";

const SkillsSection = ({ skills, onSkillsChange }) => {
  return (
    <FormSection title="Skills & Tags">
      <SkillsInput skills={skills} onSkillsChange={onSkillsChange} />
    </FormSection>
  );
};

export default SkillsSection;
