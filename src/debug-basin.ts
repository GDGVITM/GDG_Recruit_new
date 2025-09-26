// Debugging utility for testing Basin submission
// Run this in your browser console to test form submission

import { BasinFormSubmission } from './lib/basinFormSubmission';

// Add this to window for easy access in console
declare global {
  interface Window {
    testBasinSubmission: () => Promise<void>;
    debugBasinSubmission: (formData: any) => Promise<void>;
  }
}

// Test form submission function
window.testBasinSubmission = async () => {
  console.log("🧪 Starting Basin submission test...");
  
  const testData = {
    name: "Test User " + new Date().getTime(),
    email: "test" + new Date().getTime() + "@example.com",
    university: "Test University",
    year: "3rd Year",
    position: "Web Development",
    skills: "JavaScript, TypeScript, React, Node.js",
    experience: "This is a test submission to verify Basin integration",
    motivation: "Testing Basin form submission functionality"
  };

  try {
    console.log("📤 Submitting test data:", testData);
    await BasinFormSubmission.submit(testData);
    console.log("✅ Test submission successful!");
  } catch (error) {
    console.error("❌ Test submission failed:", error);
  }
};

// Debug function for custom form data
window.debugBasinSubmission = async (formData: any) => {
  console.log("🔍 Debug: Custom form submission test");
  console.log("📤 Form data:", formData);
  
  try {
    await BasinFormSubmission.submit(formData);
    console.log("✅ Debug submission successful!");
  } catch (error) {
    console.error("❌ Debug submission failed:", error);
  }
};

console.log("🛠️ Basin debugging utilities loaded!");
console.log("🧪 Run 'testBasinSubmission()' in console to test form submission");
console.log("🔍 Run 'debugBasinSubmission(yourFormData)' to test with custom data");