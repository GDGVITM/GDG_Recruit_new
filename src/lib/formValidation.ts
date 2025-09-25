export interface FormData {
  name: string;
  email: string;
  university: string;
  year: string;
  position: string;
  skills: string;
  experience: string;
  motivation: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export class FormValidation {
  static validateApplicationForm(formData: FormData): ValidationResult {
    const errors: Record<string, string> = {};

    // Name validation
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    // University validation
    if (!formData.university) {
      errors.university = "Please select your university";
    }

    // Year validation
    if (!formData.year) {
      errors.year = "Please select your academic year";
    }

    // Position validation
    if (!formData.position) {
      errors.position = "Please select your preferred position";
    }

    // Skills validation
    if (!formData.skills.trim()) {
      errors.skills = "Please describe your skills and interests";
    } else if (formData.skills.trim().length < 10) {
      errors.skills =
        "Please provide more detail about your skills (at least 10 characters)";
    }

    // Motivation validation (required field)
    if (!formData.motivation.trim()) {
      errors.motivation = "This field is required";
    } else if (formData.motivation.trim().length < 20) {
      errors.motivation =
        "Please provide more detail about your motivation (at least 20 characters)";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}