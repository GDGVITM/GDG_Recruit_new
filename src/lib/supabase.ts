import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Type definitions for our application form data
export interface ApplicationFormData {
  id?: string
  name: string
  email: string
  university: string
  year: string
  position: string
  skills: string
  experience: string
  motivation: string
  created_at?: string
  updated_at?: string
}

// Database table name
export const APPLICATIONS_TABLE = 'applications'