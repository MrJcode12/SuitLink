import { useState } from "react";
import * as z from "zod";

const jobSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title too long"),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(5000, "Description too long"),
  employmentType: z.enum(["full-time", "part-time", "contract", "internship"], {
    errorMap: () => ({ message: "Please select employment type" }),
  }),
  location: z
    .string()
    .min(2, "Location is required")
    .max(150, "Location too long"),
  remote: z.boolean(),
  salaryRange: z
    .object({
      min: z.number().min(0, "Min salary must be positive").optional(),
      max: z.number().min(0, "Max salary must be positive").optional(),
      currency: z.string().default("PHP"),
    })
    .optional()
    .nullable(),
  requirements: z
    .object({
      skills: z.array(z.string()).default([]),
      experienceYears: z.number().min(0).max(50).optional().nullable(),
      educationLevel: z.string().optional().nullable(),
    })
    .optional()
    .nullable(),
});

const useJobForm = (initialData = null) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    employmentType: initialData?.employmentType || "full-time",
    location: initialData?.location || "",
    remote: initialData?.remote || false,
    salaryRange: {
      min: initialData?.salaryRange?.min || "",
      max: initialData?.salaryRange?.max || "",
      currency: initialData?.salaryRange?.currency || "PHP",
    },
    requirements: {
      skills: initialData?.requirements?.skills || [],
      experienceYears: initialData?.requirements?.experienceYears || "",
      educationLevel: initialData?.requirements?.educationLevel || "",
    },
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }));
  };

  const handleSkillsChange = (skills) => {
    setFormData((prev) => ({
      ...prev,
      requirements: {
        ...prev.requirements,
        skills,
      },
    }));
  };

  const validateForm = () => {
    try {
      // Convert string numbers to actual numbers
      const dataToValidate = {
        ...formData,
        salaryRange:
          formData.salaryRange &&
          (formData.salaryRange.min || formData.salaryRange.max)
            ? {
                min: formData.salaryRange.min
                  ? Number(formData.salaryRange.min)
                  : undefined,
                max: formData.salaryRange.max
                  ? Number(formData.salaryRange.max)
                  : undefined,
                currency: formData.salaryRange.currency,
              }
            : undefined,
        requirements:
          formData.requirements.skills?.length > 0 ||
          formData.requirements.experienceYears ||
          formData.requirements.educationLevel
            ? {
                skills: formData.requirements.skills || [],
                experienceYears: formData.requirements.experienceYears
                  ? Number(formData.requirements.experienceYears)
                  : undefined,
                educationLevel:
                  formData.requirements.educationLevel || undefined,
              }
            : undefined,
      };

      jobSchema.parse(dataToValidate);
      setErrors({});
      return true;
    } catch (error) {
      console.error("Validation error:", error);
      if (error instanceof z.ZodError) {
        const formattedErrors = {};
        if (error.errors && Array.isArray(error.errors)) {
          error.errors.forEach((err) => {
            const path = err.path.join(".");
            formattedErrors[path] = err.message;
          });
        }
        setErrors(formattedErrors);
      } else {
        // Generic error fallback
        setErrors({ general: "Validation failed. Please check your inputs." });
      }
      return false;
    }
  };

  const getSubmitData = () => {
    const data = {
      title: formData.title,
      description: formData.description,
      employmentType: formData.employmentType,
      location: formData.location,
      remote: formData.remote,
    };

    // Only include salary if provided
    if (formData.salaryRange.min || formData.salaryRange.max) {
      data.salaryRange = {
        min: formData.salaryRange.min
          ? Number(formData.salaryRange.min)
          : undefined,
        max: formData.salaryRange.max
          ? Number(formData.salaryRange.max)
          : undefined,
        currency: formData.salaryRange.currency,
      };
    }

    // Only include requirements if provided
    const hasRequirements =
      formData.requirements.skills.length > 0 ||
      formData.requirements.experienceYears ||
      formData.requirements.educationLevel;

    if (hasRequirements) {
      data.requirements = {
        skills: formData.requirements.skills,
        experienceYears: formData.requirements.experienceYears
          ? Number(formData.requirements.experienceYears)
          : undefined,
        educationLevel: formData.requirements.educationLevel || undefined,
      };
    }

    return data;
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      employmentType: "full-time",
      location: "",
      remote: false,
      salaryRange: {
        min: "",
        max: "",
        currency: "PHP",
      },
      requirements: {
        skills: [],
        experienceYears: "",
        educationLevel: "",
      },
    });
    setErrors({});
  };

  return {
    formData,
    errors,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    handleNestedChange,
    handleSkillsChange,
    validateForm,
    getSubmitData,
    resetForm,
  };
};

export default useJobForm;
