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

    // Debug: Log the entry IDs being used
    console.log("🔍 Debug: Entry IDs mapping:", this.ENTRY_IDS);

    // Additional debugging: Check for potential data issues
    this.validateFormData(formData);

    // Test network connectivity first
    await this.testNetworkConnectivity();

    // Use iframe method as primary (more reliable for Google Forms)
    try {
      await this.submitViaIframe(formData);
      console.log("✅ Form submission successful");
      return;
    } catch (iframeError) {
      console.warn("⚠️ Iframe submission failed, trying direct method:", iframeError);
      
      // Fallback to direct submission
      try {
        await this.submitDirectly(formData);
        console.log("✅ Direct form submission successful");
        return;
      } catch (directError) {
        console.error("❌ Both submission methods failed:", {
          iframe: iframeError,
          direct: directError
        });
        throw new Error("Form submission failed. Please try again or contact support.");
      }
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
      
      // Add sandbox attributes for better security and compatibility
      iframe.setAttribute('sandbox', 'allow-forms allow-same-origin allow-scripts');
      document.body.appendChild(iframe);

      // Create a form that targets the iframe
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = this.GOOGLE_FORM_URL;
      form.target = iframe.name;
      form.style.display = 'none';
      
      // Add additional form attributes for better compatibility
      form.setAttribute('accept-charset', 'UTF-8');
      form.setAttribute('enctype', 'application/x-www-form-urlencoded');

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
        try {
          if (document.body.contains(form)) document.body.removeChild(form);
          if (document.body.contains(iframe)) document.body.removeChild(iframe);
        } catch (cleanupError) {
          console.warn("⚠️ Cleanup warning:", cleanupError);
        }
      };

      let isCompleted = false;

      const timeout = setTimeout(() => {
        if (!isCompleted) {
          isCompleted = true;
          cleanup();
          console.log("✅ Iframe submission completed (timeout - assuming success)");
          resolve(); // Assume success after timeout
        }
      }, 10000); // Increased timeout to 10 seconds

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
      iframe.onerror = (event) => {
        if (!isCompleted) {
          isCompleted = true;
          clearTimeout(timeout);
          cleanup();
          console.error("❌ Iframe submission error:", event);
          reject(new Error("Iframe submission failed"));
        }
      };

      // Try to detect navigation events
      try {
        iframe.addEventListener('load', () => {
          if (!isCompleted) {
            setTimeout(() => {
              if (!isCompleted) {
                isCompleted = true;
                clearTimeout(timeout);
                cleanup();
                console.log("✅ Iframe submission completed (navigation detected)");
                resolve();
              }
            }, 2000); // Wait 2 seconds after load to ensure processing
          }
        });
      } catch (listenerError) {
        console.warn("⚠️ Could not add event listener:", listenerError);
      }

      // Submit the form
      console.log("📤 Submitting form via iframe...");
      try {
        form.submit();
      } catch (submitError) {
        isCompleted = true;
        clearTimeout(timeout);
        cleanup();
        console.error("❌ Form submission error:", submitError);
        reject(new Error(`Form submission failed: ${submitError.message}`));
      }
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

  // Enhanced debugging method to help verify Google Form setup
  static debugGoogleForm(): void {
    console.log("🔍 Google Form Debug Information:");
    console.log("Form URL:", this.GOOGLE_FORM_URL);
    console.log("Entry IDs:", this.ENTRY_IDS);
    console.log("📝 To verify entry IDs:");
    console.log("1. Open your Google Form in a browser");
    console.log("2. Right-click -> View Page Source");
    console.log("3. Search for 'entry.' to find all entry IDs");
    console.log("4. Compare with the IDs above");
    console.log("📝 Current entry mapping:");
    Object.entries(this.ENTRY_IDS).forEach(([field, entryId]) => {
      console.log(`  ${field}: ${entryId}`);
    });
    
    // Create a test form for manual verification
    this.createTestForm();
  }

  // Validate form data for potential issues
  private static validateFormData(formData: FormData): void {
    console.log("🔍 Validating form data...");
    
    // Check for common data issues
    Object.entries(formData).forEach(([key, value]) => {
      if (typeof value === 'string') {
        // Check for extremely long values
        if (value.length > 5000) {
          console.warn(`⚠️ Field '${key}' is very long (${value.length} characters). This might cause issues.`);
        }
        
        // Check for special characters that might cause encoding issues
        if (/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/u.test(value)) {
          console.warn(`⚠️ Field '${key}' contains emojis. This might cause encoding issues.`);
        }
        
        // Check for HTML content
        if (/<[^>]*>/g.test(value)) {
          console.warn(`⚠️ Field '${key}' contains HTML tags. This might be sanitized by Google Forms.`);
        }
      }
    });
    
    console.log("✅ Form data validation complete");
  }

  // Test network connectivity to Google Forms
  private static async testNetworkConnectivity(): Promise<void> {
    console.log("🔍 Testing network connectivity to Google Forms...");
    
    try {
      // Test basic connectivity to Google
      const response = await fetch('https://www.google.com/favicon.ico', {
        method: 'HEAD',
        mode: 'no-cors',
        signal: AbortSignal.timeout(5000)
      });
      console.log("✅ Network connectivity to Google: OK");
      
      // Test if the form URL is accessible
      const formResponse = await fetch(this.GOOGLE_FORM_URL.replace('/formResponse', '/viewform'), {
        method: 'HEAD',
        mode: 'no-cors',
        signal: AbortSignal.timeout(5000)
      });
      console.log("✅ Google Form URL accessibility: OK");
      
    } catch (error) {
      console.warn("⚠️ Network connectivity issue:", error);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error("Network timeout. Please check your internet connection.");
      }
    }
  }

  // Method to test individual field mapping
  static testFieldMapping(field: keyof typeof this.ENTRY_IDS, testValue: string): void {
    console.log(`🧪 Testing field mapping: ${field} -> ${this.ENTRY_IDS[field]}`);
    
    const testForm = document.createElement('form');
    testForm.method = 'POST';
    testForm.action = this.GOOGLE_FORM_URL;
    testForm.target = '_blank';
    
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = this.ENTRY_IDS[field];
    input.value = testValue;
    testForm.appendChild(input);
    
    document.body.appendChild(testForm);
    testForm.submit();
    document.body.removeChild(testForm);
    
    console.log(`🚀 Test submitted for ${field}. Check if it appears in Google Form responses.`);
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

  // Comprehensive troubleshooting method
  static async troubleshoot(): Promise<void> {
    console.log("🔧 Starting comprehensive troubleshooting...");
    
    // 1. Check form setup
    console.log("🔍 Step 1: Checking form configuration...");
    this.debugGoogleForm();
    
    // 2. Test network connectivity
    console.log("🔍 Step 2: Testing network connectivity...");
    try {
      await this.testNetworkConnectivity();
    } catch (error) {
      console.error("❌ Network test failed:", error);
    }
    
    // 3. Test with minimal data
    console.log("🔍 Step 3: Testing with minimal form data...");
    const minimalData = {
      name: "Test",
      email: "test@test.com",
      university: "Test University",
      year: "1st Year",
      position: "Technical Team",
      skills: "Testing",
      experience: "None",
      motivation: "Testing form submission"
    };
    
    try {
      await this.submit(minimalData);
      console.log("✅ Minimal data test passed!");
    } catch (error) {
      console.error("❌ Minimal data test failed:", error);
    }
    
    // 4. Check browser environment
    console.log("🔍 Step 4: Checking browser environment...");
    console.log("User Agent:", navigator.userAgent);
    console.log("Online status:", navigator.onLine);
    console.log("Cookies enabled:", navigator.cookieEnabled);
    console.log("Do Not Track:", navigator.doNotTrack);
    
    // 5. Test individual methods
    console.log("🔍 Step 5: Testing submission methods individually...");
    
    // Test iframe method
    try {
      console.log("Testing iframe method...");
      await this.submitViaIframe(minimalData);
      console.log("✅ Iframe method works!");
    } catch (error) {
      console.error("❌ Iframe method failed:", error);
    }
    
    // Test direct method
    try {
      console.log("Testing direct method...");
      await this.submitDirectly(minimalData);
      console.log("✅ Direct method works!");
    } catch (error) {
      console.error("❌ Direct method failed:", error);
    }
    
    console.log("🔧 Troubleshooting complete! Check the logs above for issues.");
  }
}