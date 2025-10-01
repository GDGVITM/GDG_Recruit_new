import { supabase, ApplicationFormData, APPLICATIONS_TABLE } from './supabase'
import type { FormData } from './formValidation'

export class SupabaseFormSubmission {
  /**
   * Validate that Supabase is properly configured
   * @returns boolean
   */
  static validateConfiguration(): boolean {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
      return !!(supabaseUrl && supabaseKey)
    } catch (error) {
      console.error('❌ Error validating Supabase configuration:', error)
      return false
    }
  }

  /**
   * Submit form data to Supabase database
   * @param formData The form data to submit
   * @returns Promise<void>
   */
  static async submit(formData: FormData): Promise<void> {
    try {
      // Prepare data for Supabase insertion
      const applicationData: Omit<ApplicationFormData, 'id' | 'created_at' | 'updated_at'> = {
        name: formData.name,
        email: formData.email,
        university: formData.university,
        year: formData.year,
        position: formData.position,
        skills: formData.skills,
        experience: formData.experience,
        motivation: formData.motivation,
      }

      // Insert data into Supabase
      const { data, error } = await supabase
        .from(APPLICATIONS_TABLE)
        .insert([applicationData])
        .select()

      if (error) {
        console.error('❌ Supabase insertion error:', error)
        throw new Error(`Database error: ${error.message}`)
      }

      if (!data || data.length === 0) {
        throw new Error('No data returned from database insertion')
      }

      console.log('✅ Form submission successful:', data[0])
    } catch (error) {
      console.error('❌ Form submission failed:', error)

      // Provide specific error messages
      if (error instanceof Error) {
        // Check for specific Supabase/database errors
        if (error.message.includes('duplicate key')) {
          throw new Error('An application with this email already exists. Please use a different email address.')
        }
        if (error.message.includes('violates foreign key constraint')) {
          throw new Error('Invalid data provided. Please check your input and try again.')
        }
        if (error.message.includes('connection')) {
          throw new Error('Database connection error. Please check your internet connection and try again.')
        }
        throw error
      }

      throw new Error('Form submission failed. Please try again.')
    }
  }

  /**
   * Check if email already exists in applications
   * @param email The email to check
   * @returns Promise<boolean>
   */
  static async emailExists(email: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from(APPLICATIONS_TABLE)
        .select('id')
        .eq('email', email)
        .limit(1)

      if (error) {
        console.error('❌ Error checking email existence:', error)
        return false // Return false to allow submission attempt
      }

      return data && data.length > 0
    } catch (error) {
      console.error('❌ Failed to check email existence:', error)
      return false // Return false to allow submission attempt
    }
  }
}