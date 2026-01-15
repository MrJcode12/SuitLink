import { useState } from "react";

const useJobForm = (initialData = {}) => {
  const [formData, setFormData] = useState({
    jobTitle: initialData.jobTitle || "",
    jobType: initialData.jobType || "Full-time",
    location: initialData.location || "",
    workStyle: initialData.workStyle || "Office",
    salaryMin: initialData.salaryMin || "",
    salaryMax: initialData.salaryMax || "",
    description: initialData.description || "",
    requirements: initialData.requirements || "",
    benefits: initialData.benefits || "",
    skills: initialData.skills || [],
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleSkillsChange = (skills) => {
    setFormData((prev) => ({
      ...prev,
      skills,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = "Job title is required";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!formData.salaryMin || !formData.salaryMax) {
      newErrors.salaryMin = "Salary range is required";
    } else if (Number(formData.salaryMin) > Number(formData.salaryMax)) {
      newErrors.salaryMin = "Minimum salary cannot exceed maximum salary";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Job description is required";
    }

    if (!formData.requirements.trim()) {
      newErrors.requirements = "Requirements are required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      jobTitle: "",
      jobType: "Full-time",
      location: "",
      workStyle: "Office",
      salaryMin: "",
      salaryMax: "",
      description: "",
      requirements: "",
      benefits: "",
      skills: [],
    });
    setErrors({});
  };

  return {
    formData,
    errors,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    handleSkillsChange,
    validateForm,
    resetForm,
  };
};

export default useJobForm;
