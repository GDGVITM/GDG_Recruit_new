// Debugging utility for testing Google Form submission
// Run this in your browser console to test form submission

import { GoogleFormSubmission } from './lib/googleFormSubmission';

// Add this to window for easy access in console
declare global {
  interface Window {
    testFormSubmission: () => Promise<void>;
    debugFormSubmission: (formData: any) => Promise<void>;
  }
}

// Test form submission function
window.testFormSubmission = async () => {
  console.log("🧪 Starting form submission test...");
  
  const testData = {
    name: "Test User " + new Date().getTime(),
    email: "test" + new Date().getTime() + "@example.com",
    university: "VIT Vellore",
    year: "2nd Year",
    position: "Web Development",
    skills: "JavaScript, React, Testing form submissions",
    experience: "Testing the form submission process to ensure it works correctly",
    motivation: "I want to test if this form submission is working properly and reaching Google Forms successfully"
  };

  try {
    await GoogleFormSubmission.submit(testData);
    console.log("✅ Test completed successfully!");
    console.log("📝 Test data submitted:", testData);
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
};

// Debug specific form data
window.debugFormSubmission = async (formData) => {
  console.log("🔍 Debugging form submission with data:", formData);
  
  try {
    await GoogleFormSubmission.submit(formData);
    console.log("✅ Debug submission successful!");
  } catch (error) {
    console.error("❌ Debug submission failed:", error);
  }
};

console.log("🚀 Debug tools loaded!");
console.log("💡 Run 'testFormSubmission()' in console to test");
console.log("💡 Run 'debugFormSubmission(yourData)' to debug specific data");

export {};