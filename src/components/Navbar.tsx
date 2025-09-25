import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Menu, X } from "lucide-react";
import {
  AVAILABLE_POSITIONS,
  ACADEMIC_YEARS,
  UNIVERSITIES,
} from "@/lib/constants";

interface NavbarProps {
  isFormOpen: boolean;
  setIsFormOpen: (open: boolean) => void;
  preSelectedPosition?: string;
  clearPreSelectedPosition?: () => void;
}

export const Navbar = ({
  isFormOpen,
  setIsFormOpen,
  preSelectedPosition,
  clearPreSelectedPosition,
}: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    university: "",
    year: "",
    position: "",
    skills: "",
    experience: "",
    motivation: "",
  });
  const { toast } = useToast();

  // Handle pre-selected position when form opens
  useEffect(() => {
    if (isFormOpen && preSelectedPosition) {
      setFormData((prev) => ({ ...prev, position: preSelectedPosition }));
    }
  }, [isFormOpen, preSelectedPosition]);

  // Form validation function
  const validateForm = (): boolean => {
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

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Check network connectivity
  const checkNetworkConnectivity = (): boolean => {
    if (!navigator.onLine) {
      toast({
        title: "No Internet Connection",
        description: "Please check your internet connection and try again.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setFormErrors({});

    // Validate form
    if (!validateForm()) {
      toast({
        title: "Please Fix Form Errors",
        description: "Please correct the highlighted fields before submitting.",
        variant: "destructive",
      });
      return;
    }

    // Check network connectivity
    if (!checkNetworkConnectivity()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Google Form submission URL - IMPORTANT: Follow these steps to get the correct URL and entry IDs:
      // 1. Open your Google Form: https://forms.gle/RHgd3C94CkcnxCdN6
      // 2. Click "Send" -> Get the embed code OR inspect the form
      // 3. Look for the form action URL, it should look like:
      //    https://docs.google.com/forms/d/e/1FAIpQLSe[FORM_ID]/formResponse
      // 4. For entry IDs, inspect each input field in the form and look for 'name' attributes
      //    like 'entry.123456789' - these are your field IDs

      const GOOGLE_FORM_URL =
        "https://docs.google.com/forms/u/0/d/e/1FAIpQLSc9EpdJDJSCZeagdlul66N7CFjly0j635StP1IW2sccSzQi3A/formResponse";

      // Create form data for Google Forms
      const formDataToSubmit = new FormData();

      // Debug: Log the form data being submitted
      console.log("🔍 Debug: Form data being submitted:", {
        name: formData.name,
        email: formData.email,
        university: formData.university,
        year: formData.year,
        position: formData.position,
        skills: formData.skills,
        experience: formData.experience,
        motivation: formData.motivation,
      });

      // Entry IDs - Make sure these match your Google Form exactly
      formDataToSubmit.append("entry.999979218", formData.name); // Name field
      formDataToSubmit.append("entry.1727574457", formData.email); // Email field
      formDataToSubmit.append("entry.1173118307", formData.university); // University
      formDataToSubmit.append("entry.1777570729", formData.year); // Academic Year
      formDataToSubmit.append("entry.103579658", formData.position); // Position/Domain - Removed _sentinel
      formDataToSubmit.append("entry.2135975318", formData.skills); // Skills - Removed _sentinel
      formDataToSubmit.append("entry.194244693", formData.experience); // Experience - Removed _sentinel
      formDataToSubmit.append("entry.2001488712", formData.motivation); // Motivation - Removed _sentinel

      // Debug: Log the FormData entries
      console.log("🔍 Debug: FormData entries:");
      for (let pair of formDataToSubmit.entries()) {
        console.log(pair[0], pair[1]);
      }

      // Submit to Google Forms with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      console.log("🚀 Submitting to Google Forms...");

      const response = await fetch(GOOGLE_FORM_URL, {
        method: "POST",
        body: formDataToSubmit,
        mode: "no-cors", // Required for Google Forms
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Note: With no-cors mode, we can't check response status
      // But if no error is thrown, the submission likely succeeded
      console.log(
        "✅ Form submission completed (no-cors mode - can't verify response)"
      );

      toast({
        title: "Application Submitted Successfully! 🎉",
        description:
          "Thank you for applying to GDG! We'll review your application and get back to you soon. Check your Google Form responses to verify.",
      });

      setIsFormOpen(false);
      if (clearPreSelectedPosition) {
        clearPreSelectedPosition();
      }

      // Reset form data
      setFormData({
        name: "",
        email: "",
        university: "",
        year: "",
        position: "",
        skills: "",
        experience: "",
        motivation: "",
      });

      // Clear any remaining errors
      setFormErrors({});
    } catch (error) {
      console.error("Error submitting form:", error);

      let errorTitle = "Submission Error";
      let errorDescription =
        "There was an issue submitting your application. Please try again.";

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          errorTitle = "Request Timeout";
          errorDescription =
            "The submission is taking too long. Please check your connection and try again.";
        } else if (error.message.includes("fetch")) {
          errorTitle = "Network Error";
          errorDescription =
            "Unable to connect to the server. Please check your internet connection.";
        }
      }

      toast({
        title: errorTitle,
        description: errorDescription,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error for this field when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Debug function to test Google Forms submission
  

  const getDynamicFieldLabels = (position: string) => {
    const baseLabels = {
      skills: "Skills",
      experience: "Experience",
      motivation: "What inspires you to be part of GDG?",
    };

    switch (position) {
      case "Technical Team":
        return {
          ...baseLabels,
          skills: "Technical Skills & Interests",
          experience: "Technical Experience & Projects",
          motivation: "What inspires you to be part of the Technical Team?",
        };
      case "Finance Team":
        return {
          ...baseLabels,
          skills: "Financial Management & Leadership Skills",
          experience: "Financial Management & Leadership Experience",
          motivation: "What inspires you to be part of the Finance Team?",
        };
      case "Open-Source Team":
        return {
          ...baseLabels,
          skills: "Open-Source Development Skills",
          experience: "Open-Source Contribution Experience",
          motivation: "What inspires you to be part of the Open-Source Team?",
        };
      case "Documentation Team":
        return {
          ...baseLabels,
          skills: "Technical Writing & Documentation Skills",
          experience: "Documentation & Writing Experience",
          motivation: "What inspires you to be part of the Documentation Team?",
        };
      case "Media Team":
        return {
          ...baseLabels,
          skills: "Content Creation & Social Media Skills",
          experience: "Media & Content Creation Experience",
          motivation: "What inspires you to be part of the Media Team?",
        };
      case "Event Management Team":
        return {
          ...baseLabels,
          skills: "Event Planning & Management Skills",
          experience: "Event Management & Organization Experience",
          motivation:
            "What inspires you to be part of the Event Management Team?",
        };
      case "UI/UX Team":
        return {
          ...baseLabels,
          skills: "UI/UX Design Skills & Tools",
          experience: "Design Experience & Portfolio",
          motivation: "What inspires you to be part of the UI/UX Team?",
        };
      case "Events & Outreach":
        return {
          ...baseLabels,
          skills: "Community Outreach & Partnership Skills",
          experience: "Outreach & Community Building Experience",
          motivation: "What inspires you to be part of Events & Outreach?",
        };
      case "Design":
        return {
          ...baseLabels,
          skills: "Visual Design & Creative Skills",
          experience: "Design Portfolio & Creative Projects",
          motivation: "What inspires you to be part of the Design Team?",
        };
      default:
        return baseLabels;
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img src="/gdglogo.png" alt="GDG Logo" className="w-11 h-8" />
            <div className="flex flex-col">
              <span className="text-lg font-bold text-foreground">
                GDG Recruitment
              </span>
              <span className="text-xs text-muted-foreground">2025-2026</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#home"
              className="text-foreground hover:text-google-blue transition-colors"
            >
              Home
            </a>
            <a
              href="#opportunities"
              className="text-foreground hover:text-google-blue transition-colors"
            >
              Opportunities
            </a>
            <a
              href="#about"
              className="text-foreground hover:text-google-blue transition-colors"
            >
              About GDG
            </a>
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button className="google-button gdg-glow bg-google-blue hover:bg-google-blue/90 text-white">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Apply Now
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="google-heading-3 text-2xl font-bold text-google-blue">
                    Join GDG Community
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="google-caption">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        required
                        className={`scan-effect ${
                          formErrors.name
                            ? "border-destructive focus-visible:ring-destructive"
                            : ""
                        }`}
                      />
                      {formErrors.name && (
                        <p className="text-sm text-destructive">
                          {formErrors.name}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        required
                        className={`scan-effect ${
                          formErrors.email
                            ? "border-destructive focus-visible:ring-destructive"
                            : ""
                        }`}
                      />
                      {formErrors.email && (
                        <p className="text-sm text-destructive">
                          {formErrors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="university">University/College *</Label>
                      <Select
                        value={formData.university}
                        onValueChange={(value) =>
                          handleInputChange("university", value)
                        }
                        required
                      >
                        <SelectTrigger
                          className={`scan-effect ${
                            formErrors.university
                              ? "border-destructive focus:ring-destructive"
                              : ""
                          }`}
                        >
                          <SelectValue placeholder="Select your university/college" />
                        </SelectTrigger>
                        <SelectContent>
                          {UNIVERSITIES.map((university) => (
                            <SelectItem
                              key={university.value}
                              value={university.value}
                            >
                              {university.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formErrors.university && (
                        <p className="text-sm text-destructive">
                          {formErrors.university}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="year">Academic Year *</Label>
                      <Select
                        value={formData.year}
                        onValueChange={(value) =>
                          handleInputChange("year", value)
                        }
                      >
                        <SelectTrigger
                          className={`scan-effect ${
                            formErrors.year
                              ? "border-destructive focus:ring-destructive"
                              : ""
                          }`}
                        >
                          <SelectValue placeholder="Select your year" />
                        </SelectTrigger>
                        <SelectContent>
                          {ACADEMIC_YEARS.map((year) => (
                            <SelectItem key={year.value} value={year.value}>
                              {year.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formErrors.year && (
                        <p className="text-sm text-destructive">
                          {formErrors.year}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Position Field */}
                  <div className="space-y-2">
                    <Label htmlFor="position">
                      Preferred Position/Domain *
                    </Label>
                    <Select
                      value={formData.position}
                      onValueChange={(value) =>
                        handleInputChange("position", value)
                      }
                      required
                    >
                      <SelectTrigger
                        className={`scan-effect ${
                          formErrors.position
                            ? "border-destructive focus:ring-destructive"
                            : ""
                        }`}
                      >
                        <SelectValue placeholder="Select your preferred domain/team" />
                      </SelectTrigger>
                      <SelectContent>
                        {AVAILABLE_POSITIONS.map((position) => (
                          <SelectItem key={position} value={position}>
                            {position}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.position && (
                      <p className="text-sm text-destructive">
                        {formErrors.position}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="skills">
                      {getDynamicFieldLabels(formData.position).skills}
                    </Label>
                    <Textarea
                      id="skills"
                      value={formData.skills}
                      onChange={(e) =>
                        handleInputChange("skills", e.target.value)
                      }
                      placeholder="e.g., Web Development, Mobile Apps, AI/ML, Cloud Computing, etc."
                      className={`scan-effect min-h-[80px] ${
                        formErrors.skills
                          ? "border-destructive focus-visible:ring-destructive"
                          : ""
                      }`}
                    />
                    {formErrors.skills && (
                      <p className="text-sm text-destructive">
                        {formErrors.skills}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">
                      {getDynamicFieldLabels(formData.position).experience}
                    </Label>
                    <Textarea
                      id="experience"
                      value={formData.experience}
                      onChange={(e) =>
                        handleInputChange("experience", e.target.value)
                      }
                      placeholder="Tell us about your projects, internships, or relevant experience"
                      className={`scan-effect min-h-[80px] ${
                        formErrors.experience
                          ? "border-destructive focus-visible:ring-destructive"
                          : ""
                      }`}
                    />
                    {formErrors.experience && (
                      <p className="text-sm text-destructive">
                        {formErrors.experience}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="motivation">
                      {getDynamicFieldLabels(formData.position).motivation} *
                    </Label>
                    <Textarea
                      id="motivation"
                      value={formData.motivation}
                      onChange={(e) =>
                        handleInputChange("motivation", e.target.value)
                      }
                      placeholder="Share your motivation and what you hope to achieve"
                      required
                      className={`scan-effect min-h-[100px] ${
                        formErrors.motivation
                          ? "border-destructive focus-visible:ring-destructive"
                          : ""
                      }`}
                    />
                    {formErrors.motivation && (
                      <p className="text-sm text-destructive">
                        {formErrors.motivation}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setIsFormOpen(false)}
                      className="flex-1"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="google-button flex-1 bg-google-blue hover:bg-google-blue/90 text-white gdg-glow"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Application"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-border bg-card/95 backdrop-blur-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a
                href="#home"
                className="block px-3 py-2 text-foreground hover:text-google-blue transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Home
              </a>
              <a
                href="#opportunities"
                className="block px-3 py-2 text-foreground hover:text-google-blue transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Opportunities
              </a>
              <a
                href="#about"
                className="block px-3 py-2 text-foreground hover:text-google-blue transition-colors"
                onClick={() => setIsOpen(false)}
              >
                About GDG
              </a>
              <div className="px-3 py-2">
                <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full gdg-glow bg-google-blue hover:bg-google-blue/90 text-white">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Apply Now
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
