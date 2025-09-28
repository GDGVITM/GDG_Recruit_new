# Supabase Setup Guide 🚀

This guide will help you set up Supabase as the backend for your GDG recruitment application form.

## 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com) and create a free account
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `gdg-recruitment` (or any name you prefer)
   - **Database Password**: Create a strong password
   - **Region**: Choose the closest region to your users
5. Click "Create new project"

## 2. Set up the Database

1. Once your project is created, go to the SQL Editor in your Supabase dashboard
2. Copy the entire content from `supabase-schema.sql` file
3. Paste it in the SQL Editor and click "Run"
4. This will create the `applications` table with all necessary indexes and policies

### Table Structure
The `applications` table includes:
- `id` - Unique UUID for each application
- `name` - Applicant's full name
- `email` - Applicant's email (unique)
- `university` - Applicant's university/institution
- `year` - Academic year
- `position` - Applied position
- `skills` - Technical skills
- `experience` - Previous experience
- `motivation` - Why they want to join GDG
- `created_at` - Submission timestamp
- `updated_at` - Last update timestamp

## 3. Configure Environment Variables

1. In your Supabase project dashboard, go to **Settings > API**
2. Copy your project details:
   - **Project URL** (looks like `https://your-project-id.supabase.co`)
   - **Project API Key** (anon/public key)

3. Create a `.env` file in your project root:
```bash
cp .env.example .env
```

4. Update the `.env` file with your Supabase credentials:
```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 4. Row Level Security (RLS)

The setup automatically enables RLS with these policies:
- **Public Insert**: Anyone can submit applications (required for the form)
- **Public Select**: Anyone can read applications (optional - you can remove this)

### Optional: Restrict Read Access
If you want to restrict who can read applications:

1. Go to **Authentication > Policies** in your Supabase dashboard
2. Remove the "Allow public select" policy
3. Create a new policy for authenticated users only:
```sql
CREATE POLICY "Allow authenticated select" ON public.applications
  FOR SELECT USING (auth.role() = 'authenticated');
```

## 5. Testing the Setup

1. Start your development server:
```bash
npm run dev
```

2. Open the browser console and run:
```javascript
// Test if Supabase is configured correctly
testSupabaseSubmission()

// Check all applications (if public read is enabled)
getAllApplications()

// Check if a specific email exists
checkEmailExists("test@example.com")
```

## 6. Viewing Applications

### Option 1: Supabase Dashboard
1. Go to **Database > Tables > applications** in your Supabase dashboard
2. View all submitted applications in the table view

### Option 2: Browser Console (if public read is enabled)
```javascript
getAllApplications()
```

### Option 3: Create an Admin Panel (Recommended)
Consider creating a simple admin interface to view and manage applications.

## 7. Production Considerations

### Security
- Consider removing public read access if not needed
- Implement proper authentication for admin features
- Set up email notifications for new applications

### Monitoring
- Set up alerts for database errors
- Monitor application submission rates
- Consider implementing rate limiting

### Backup
- Supabase automatically backs up your data
- Consider exporting important data regularly

## 8. Advanced Features

### Email Notifications
You can set up email notifications when new applications are submitted:

1. Go to **Database > Webhooks** in Supabase
2. Create a webhook for the `applications` table
3. Set up an endpoint to handle new submissions and send emails

### Real-time Updates
If you want real-time updates for admin dashboards:

```javascript
import { supabase } from './lib/supabase'

// Listen for new applications
const subscription = supabase
  .channel('applications')
  .on('postgres_changes', { 
    event: 'INSERT', 
    schema: 'public', 
    table: 'applications' 
  }, (payload) => {
    console.log('New application:', payload.new)
  })
  .subscribe()
```

## 9. Migration from Basin

If you were previously using Basin Forms:

1. ✅ Basin forms service has been removed
2. ✅ Supabase integration is now active
3. ✅ All form validations remain the same
4. ✅ Debug utilities have been updated
5. Remove Basin-related environment variables if any

## 10. Troubleshooting

### Common Issues

**Error: "Missing Supabase environment variables"**
- Make sure `.env` file exists and has correct variables
- Restart your development server after updating `.env`

**Error: "Database error: relation 'applications' does not exist"**
- Run the SQL schema from `supabase-schema.sql`
- Make sure you're connected to the correct project

**Error: "Row Level Security policy violation"**
- Check that RLS policies are properly set up
- Verify the policies allow the operation you're trying to perform

**Form submission fails with network error**
- Check your internet connection
- Verify Supabase URL and API key are correct
- Check Supabase project status

### Getting Help

1. Check the browser console for detailed error messages
2. Visit the Supabase documentation: https://supabase.com/docs
3. Check Supabase status page: https://status.supabase.com/
4. Join the Supabase Discord community for help

---

## Summary

Your GDG recruitment form now uses Supabase for:
- ✅ Storing application data securely
- ✅ Real-time database operations
- ✅ Built-in user management (if needed later)
- ✅ Automatic backups
- ✅ Scalable infrastructure
- ✅ Free tier with generous limits

The migration is complete! Your form will now store all submissions in your Supabase database instead of Basin Forms.