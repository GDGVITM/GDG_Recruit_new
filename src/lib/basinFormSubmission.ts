import type { FormData } from "./formValidation";

export class BasinFormSubmission {
  // Your Basin form endpoint from environment variables
  private static readonly BASIN_ENDPOINT = import.meta.env.VITE_BASIN_ENDPOINT;

  static async submit(formData: FormData): Promise<void> {
    // Validate that the Basin endpoint is configured
    if (!this.BASIN_ENDPOINT) {
      throw new Error("Basin endpoint not configured. Please set VITE_BASIN_ENDPOINT in your environment file.");
    }

    console.log("🔍 Debug: Form data being submitted to Basin:", {
      name: formData.name,
      email: formData.email,
      university: formData.university,
      year: formData.year,
      position: formData.position,
      skills: formData.skills,
      experience: formData.experience,
      motivation: formData.motivation,
    });

    try {
      const response = await fetch(this.BASIN_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          university: formData.university,
          year: formData.year,
          position: formData.position,
          skills: formData.skills,
          experience: formData.experience,
          motivation: formData.motivation,
          // Add timestamp for tracking
          submittedAt: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const responseData = await response.json();
      console.log("✅ Form submission successful:", responseData);
      
    } catch (error) {
      console.error("❌ Form submission failed:", error);
      
      // Provide specific error messages
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error("Network error. Please check your internet connection and try again.");
      }
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error("Form submission failed. Please try again.");
    }
  }

  // Test method to verify form submission is working
  static async testSubmission(): Promise<void> {
    const testData: FormData = {
      name: "Test User",
      email: "test@example.com",
      university: "Test University",
      year: "2nd Year",
      position: "Web Development",
      skills: "Testing the Basin integration",
      experience: "No previous experience - this is a test",
      motivation: "This is a test submission to verify Basin integration is working correctly"
    };

    console.log("🧪 Running Basin test submission...");
    
    try {
      await this.submit(testData);
      console.log("✅ Basin test submission successful!");
    } catch (error) {
      console.error("❌ Basin test submission failed:", error);
      throw error;
    }
  }

  // Validate Basin endpoint configuration
  static validateConfiguration(): boolean {
    if (!this.BASIN_ENDPOINT) {
      console.error("❌ Basin endpoint not configured! Please set VITE_BASIN_ENDPOINT in your environment file.");
      return false;
    }

    if (this.BASIN_ENDPOINT.includes("YOUR_FORM_ID") || this.BASIN_ENDPOINT.includes("your_basin_endpoint_here")) {
      console.error("❌ Basin endpoint not configured! Please update VITE_BASIN_ENDPOINT with your actual form ID.");
      return false;
    }
    
    if (!this.BASIN_ENDPOINT.startsWith("https://usebasin.com/f/")) {
      console.error("❌ Invalid Basin endpoint format! Expected format: https://usebasin.com/f/YOUR_FORM_ID");
      return false;
    }
    
    console.log("✅ Basin configuration is valid:", this.BASIN_ENDPOINT);
    return true;
  }
}