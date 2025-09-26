# Basin Forms Integration Setup

This project uses Basin Forms for form submissions. Basin is a powerful form backend service that handles form submissions, spam filtering, and data management.

## 1. Basin Forms Overview

Basin Forms provides:
- **Form Backend**: Handle form submissions without server-side code
- **Spam Protection**: Built-in spam filtering and reCAPTCHA integration
- **Email Notifications**: Automatic email notifications for new submissions
- **Data Management**: Dashboard to view, export, and manage submissions
- **Webhooks**: Real-time notifications to external services

## 2. Current Configuration

The application is configured with the following Basin endpoint:
```
https://usebasin.com/f/d36fd205b3bb
```

## 3. Form Fields

The application form submits the following fields to Basin:
- **name**: Applicant's full name
- **email**: Applicant's email address
- **university**: University name
- **year**: Academic year (1st Year, 2nd Year, etc.)
- **position**: Preferred position/department
- **skills**: Technical skills and expertise
- **experience**: Previous experience and projects
- **motivation**: Motivation for joining GDG
- **submittedAt**: Timestamp of submission

## 4. Testing the Integration

### Browser Console Testing
1. Open your browser's developer console
2. Run the following command to test form submission:
   ```javascript
   BasinFormSubmission.testSubmission()
   ```

### Manual Testing
1. Fill out the application form on the website
2. Submit the form
3. Check the Basin dashboard for the submission at: https://usebasin.com/forms

## 5. Basin Dashboard Access

To access your Basin dashboard:
1. Go to [https://usebasin.com](https://usebasin.com)
2. Sign in to your account
3. Navigate to your form dashboard to view submissions

## 6. Features Available

1. **Form Submissions**: All form data is sent to your Basin dashboard
2. **Email Notifications**: Basin can send email notifications for new submissions
3. **Data Export**: Export submissions as CSV or JSON
4. **Spam Protection**: Built-in spam filtering
5. **Custom Integrations**: Webhooks and API access for custom workflows

## 7. Useful Links

- **Basin Dashboard**: https://usebasin.com/forms
- **Your Form Endpoint**: https://usebasin.com/f/d36fd205b3bb
- **Basin Documentation**: https://usebasin.com/docs
- **Support**: https://usebasin.com/contact

## 8. Troubleshooting

If form submissions are not working:

1. **Check Browser Console**: Look for any JavaScript errors
2. **Test Configuration**: Run `BasinFormSubmission.validateConfiguration()` in console
3. **Network Issues**: Check if the Basin endpoint is accessible
4. **Form Data**: Ensure all required fields are properly filled

## 9. Development Notes

- The Basin integration is handled by `src/lib/basinFormSubmission.ts`
- Debug utilities are available in `src/debug-basin.ts`
- Form validation is handled by `src/lib/formValidation.ts`

Your application is now configured with Basin Forms and ready to handle form submissions! 🚀