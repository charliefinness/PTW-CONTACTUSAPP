# Embedding the Contact Form in Canva Website

## How It Works

This contact form sends submissions directly via email without storing any data in a database. When someone submits the form, it:
1. Validates the input
2. Sends an email notification to **support@pavingthewayfd.org**
3. Shows a success message to the user

## Embedding in Canva

### Step 1: Deploy Your Form

First, make sure your form is deployed and accessible at a public URL. You'll need this URL for embedding.

### Step 2: Add to Canva Website

1. In your Canva website editor, go to the page where you want to add the contact form
2. Click on "Apps" or "Elements" in the left sidebar
3. Search for "Embed" or "HTML embed"
4. Add the embed element to your page
5. Use this embed code:

```html
<iframe
  src="https://[YOUR-DEPLOYMENT-URL]/"
  width="100%"
  height="1200"
  frameborder="0"
  style="border: none; max-width: 900px; margin: 0 auto; display: block;"
  title="Contact Form"
></iframe>
```

Replace `[YOUR-DEPLOYMENT-URL]` with your actual deployed application URL.

### Step 3: Adjust Height (Optional)

If the form appears cut off or has too much white space:
- Adjust the `height="1200"` value in the iframe code
- Recommended heights:
  - Desktop: 1200px
  - Tablet: 1300px
  - Mobile: 1400px

## Alternative: Direct Link

If Canva doesn't support iframe embedding on your plan, you can:
1. Create a button in Canva
2. Link the button to your deployed form URL
3. The form will open in a new tab/window

## Features

### Security
- XSS protection with input sanitization
- Rate limiting (3 submissions per minute per IP)
- Honeypot spam prevention
- Server-side validation

### Design
- Fully responsive (mobile, tablet, desktop)
- Matches Paving The Way branding
- Clean, professional appearance
- Smooth animations and interactions

### Email Notifications
- Submissions are sent to: **support@pavingthewayfd.org**
- Professional HTML email format
- Includes all form details and selected services

## Configuration Required

Make sure the following environment variables are set:
- `VITE_SUPABASE_URL` - Your Supabase project URL (for the email edge function)
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `RESEND_API_KEY` - Your Resend API key (configured in Supabase Edge Functions secrets)

## Testing

Before embedding in Canva:
1. Test the form by submitting a test entry
2. Verify you receive the email at support@pavingthewayfd.org
3. Check that the form displays correctly on different screen sizes
4. Confirm all service categories expand and collapse properly
