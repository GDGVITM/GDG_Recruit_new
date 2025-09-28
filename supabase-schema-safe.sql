-- Supabase SQL Schema for GDG Recruitment Application (Safe Version)
-- Run this in your Supabase SQL editor to create the applications table
-- This version handles existing policies and tables safely

-- Create applications table (only if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  university TEXT NOT NULL,
  year TEXT NOT NULL,
  position TEXT NOT NULL,
  skills TEXT NOT NULL,
  experience TEXT NOT NULL,
  motivation TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add comments to columns for documentation
COMMENT ON TABLE public.applications IS 'Stores GDG recruitment application form submissions';
COMMENT ON COLUMN public.applications.id IS 'Unique identifier for each application';
COMMENT ON COLUMN public.applications.name IS 'Full name of the applicant';
COMMENT ON COLUMN public.applications.email IS 'Email address of the applicant (unique)';
COMMENT ON COLUMN public.applications.university IS 'University/Institution of the applicant';
COMMENT ON COLUMN public.applications.year IS 'Academic year of the applicant';
COMMENT ON COLUMN public.applications.position IS 'Position applied for';
COMMENT ON COLUMN public.applications.skills IS 'Skills and technologies the applicant knows';
COMMENT ON COLUMN public.applications.experience IS 'Previous experience details';
COMMENT ON COLUMN public.applications.motivation IS 'Why the applicant wants to join GDG';
COMMENT ON COLUMN public.applications.created_at IS 'Timestamp when the application was submitted';
COMMENT ON COLUMN public.applications.updated_at IS 'Timestamp when the application was last updated';

-- Create indexes (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_applications_email ON public.applications(email);
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON public.applications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_applications_position ON public.applications(position);

-- Enable Row Level Security (RLS)
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow public insert" ON public.applications;
DROP POLICY IF EXISTS "Allow public select" ON public.applications;
DROP POLICY IF EXISTS "Allow authenticated update" ON public.applications;
DROP POLICY IF EXISTS "Allow authenticated delete" ON public.applications;

-- Create fresh policies
CREATE POLICY "Allow public insert" ON public.applications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public select" ON public.applications
  FOR SELECT USING (true);

-- Optional: Uncomment if you want authenticated users to update/delete
-- CREATE POLICY "Allow authenticated update" ON public.applications
--   FOR UPDATE USING (auth.role() = 'authenticated');

-- CREATE POLICY "Allow authenticated delete" ON public.applications
--   FOR DELETE USING (auth.role() = 'authenticated');

-- Create or replace the updated_at function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists, then create it
DROP TRIGGER IF EXISTS trigger_applications_updated_at ON public.applications;
CREATE TRIGGER trigger_applications_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

GRANT SELECT, INSERT ON public.applications TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.applications TO authenticated;

-- Verify the setup
SELECT 
  'Setup completed successfully!' as status,
  'applications' as table_name,
  count(*) as current_records
FROM public.applications;