import type { FormData } from "./formValidation";

export class GoogleFormSubmission {
  private static readonly GOOGLE_FORM_URL =
    "https://docs.google.com/forms/d/e/1FAIpQLSc9EpdJDJSCZeagdlul66N7CFjly0j635StP1IW2sccSzQi3A/formResponse";

  private static readonly ENTRY_IDS = {
    name: "entry.999979218",
    email: "entry.1727574457",
    university: "entry.2135975318",
    year: "entry.194244693",
    position: "entry.2001488712",
    skills: "entry.1173118307",
    experience: "entry.1777570729",
    motivation: "entry.103579658",
  };

  static async submit(formData: FormData): Promise<void> {
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

    // Use iframe method as primary (more reliable for Google Forms)
    try {
      await this.submitViaIframe(formData);
      console.log("✅ Form submission successful");
      return;
    } catch (error) {
      console.error("❌ Form submission failed:", error);
      throw new Error("Form submission failed. Please try again.");
    }
  }

  private static async submitDirectly(formData: FormData): Promise<void> {
    const formDataToSubmit = new FormData();

    // Append form data with correct entry IDs
    formDataToSubmit.append(this.ENTRY_IDS.name, formData.name);
    formDataToSubmit.append(this.ENTRY_IDS.email, formData.email);
    formDataToSubmit.append(this.ENTRY_IDS.university, formData.university);
    formDataToSubmit.append(this.ENTRY_IDS.year, formData.year);
    formDataToSubmit.append(this.ENTRY_IDS.position, formData.position);
    formDataToSubmit.append(this.ENTRY_IDS.skills, formData.skills);
    formDataToSubmit.append(this.ENTRY_IDS.experience, formData.experience);
    formDataToSubmit.append(this.ENTRY_IDS.motivation, formData.motivation);

    // Submit to Google Forms with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    console.log("🚀 Attempting direct submission...");

    try {
      const response = await fetch(this.GOOGLE_FORM_URL, {
        method: "POST",
        body: formDataToSubmit,
        mode: "no-cors",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      
      // Since we're using no-cors, we can't check the response
      // But we'll assume success if no error is thrown
      console.log("📤 Request sent (no-cors mode - response not readable)");
      
      // Add a small delay to simulate processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  private static async submitViaIframe(formData: FormData): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log("🚀 Attempting iframe submission...");
      
      // Validate form data first
      const requiredFields = ['name', 'email', 'university', 'year', 'position', 'motivation'];
      const missingFields = requiredFields.filter(field => !formData[field as keyof FormData]?.trim());
      
      if (missingFields.length > 0) {
        console.error("❌ Missing required fields:", missingFields);
        reject(new Error(`Missing required fields: ${missingFields.join(', ')}`));
        return;
      }
      
      // Create a hidden iframe
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.name = `form-submission-frame-${Date.now()}`;
      document.body.appendChild(iframe);

      // Create a form that targets the iframe
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = this.GOOGLE_FORM_URL;
      form.target = iframe.name;
      form.style.display = 'none';

      // Add form fields with better value handling
      Object.entries(this.ENTRY_IDS).forEach(([key, entryId]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = entryId;
        const value = formData[key as keyof FormData] || '';
        input.value = value.toString().trim();
        form.appendChild(input);
        console.log(`📝 Field ${key}: ${entryId} = "${input.value}"`);
      });

      document.body.appendChild(form);

      // Set up cleanup and timeout
      const cleanup = () => {
        if (document.body.contains(form)) document.body.removeChild(form);
        if (document.body.contains(iframe)) document.body.removeChild(iframe);
      };

      let isCompleted = false;

      const timeout = setTimeout(() => {
        if (!isCompleted) {
          isCompleted = true;
          cleanup();
          console.log("✅ Iframe submission completed (timeout)");
          resolve(); // Assume success after timeout
        }
      }, 8000);

      // Handle iframe load (indicates form submission completed)
      iframe.onload = () => {
        if (!isCompleted) {
          isCompleted = true;
          clearTimeout(timeout);
          cleanup();
          console.log("✅ Iframe submission completed (load event)");
          resolve();
        }
      };

      // Handle iframe error
      iframe.onerror = () => {
        if (!isCompleted) {
          isCompleted = true;
          clearTimeout(timeout);
          cleanup();
          console.error("❌ Iframe submission error");
          reject(new Error("Iframe submission failed"));
        }
      };

      // Submit the form
      console.log("📤 Submitting form via iframe...");
      form.submit();
    });
  }

  // Test method to verify form submission is working
  static async testSubmission(): Promise<void> {
    const testData: FormData = {
      name: "Test User",
      email: "test@example.com",
      university: "Test University",
      year: "2nd Year",
      position: "Web Development",
      skills: "Testing the form submission functionality",
      experience: "No previous experience - this is a test",
      motivation: "This is a test submission to verify the form is working correctly"
    };

    console.log("🧪 Running test submission...");
    
    try {
      await this.submit(testData);
      console.log("✅ Test submission successful!");
    } catch (error) {
      console.error("❌ Test submission failed:", error);
      throw error;
    }
  }

  // Simple test that creates a basic form submission
  static createTestForm(): void {
    console.log("🧪 Creating test form in the page...");
    
    // Create a test form
    const testForm = document.createElement('form');
    testForm.method = 'POST';
    testForm.action = this.GOOGLE_FORM_URL;
    testForm.target = '_blank'; // Opens in new tab to see result
    testForm.style.position = 'fixed';
    testForm.style.top = '10px';
    testForm.style.right = '10px';
    testForm.style.background = 'white';
    testForm.style.border = '2px solid #4285f4';
    testForm.style.padding = '10px';
    testForm.style.zIndex = '10000';

    // Add title
    const title = document.createElement('h3');
    title.textContent = 'Test Form   Submission';
    title.style.color = '#4285f4';
    testForm.appendChild(title);

    // Add f  orm fields with visible values for debugging
    Object.entries(this.ENTRY_IDS).forEach(([key, entryId]) => {
      const label = document.createElement('div');
      label.textContent = `${key}: ${entryId}`;
      label.style.fontSize = '10px';
      label.style.margin = '2px 0';
      testForm.appendChild(label);

      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = entryId;
      input.value = `Test ${key} - ${new Date().getTime()}`;
      testForm.appendChild(input);
    });

    // Add visible test button
    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.textContent = 'Submit Test';
    submitBtn.style.background = '#4285f4';
    submitBtn.style.color = 'white';
    submitBtn.style.border = 'none';
    submitBtn.style.padding = '5px 10px';
    submitBtn.style.cursor = 'pointer';
    submitBtn.style.marginTop = '10px';
    testForm.appendChild(submitBtn);

    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.textContent = '×';
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '5px';
    closeBtn.style.right = '5px';
    closeBtn.style.background = 'red';
    closeBtn.style.color = 'white';
    closeBtn.style.border = 'none';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.fontSize = '12px';
    closeBtn.style.width = '20px';
    closeBtn.style.height = '20px';
    closeBtn.onclick = () => document.body.removeChild(testForm);
    testForm.appendChild(closeBtn);

    document.body.appendChild(testForm);
    console.log("✅ Test form created! Click 'Submit Test' to test manually.");
    console.log("📋 Current entry IDs:", this.ENTRY_IDS);
  }
}