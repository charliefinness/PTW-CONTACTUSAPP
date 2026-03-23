# Embedding the Contact Form on pavingthewayfd.com

## Option 1: iframe Embedding (Recommended)

Add this code to your `/contact-us` page:

```html
<iframe
  src="https://[YOUR-DEPLOYMENT-URL]/"
  width="100%"
  height="1200px"
  frameborder="0"
  style="border: none; max-width: 900px; margin: 0 auto; display: block;"
  title="Paving The Way Contact Form"
></iframe>
```

Replace `[YOUR-DEPLOYMENT-URL]` with your deployed application URL.

## Option 2: Direct Integration (React)

If your website is built with React, you can import the component directly:

1. Copy the following files to your project:
   - `src/components/ContactForm.tsx`
   - `src/lib/supabase.ts`

2. Install dependencies:
   ```bash
   npm install @supabase/supabase-js lucide-react
   ```

3. Create a `.env` file with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://pqwwhbwqrojdctdwgyza.supabase.co
   VITE_SUPABASE_ANON_KEY=[YOUR_NEW_ANON_KEY]
   ```

4. Import and use the component:
   ```tsx
   import ContactForm from './components/ContactForm';

   function ContactPage() {
     return (
       <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-yellow-50 py-12 px-4">
         <ContactForm />
       </div>
     );
   }
   ```

## Responsive Design

The form is fully responsive and will adapt to:
- Mobile devices (320px+)
- Tablets (768px+)
- Desktop (1024px+)

## Security Features

The form includes:
- XSS protection with input sanitization
- Rate limiting (3 submissions per minute per IP)
- Honeypot spam prevention
- Server-side validation
- Privacy compliance notice

## Email Configuration

Submissions are sent to: **support@pavingthewayfd.org**

Make sure the RESEND_API_KEY is configured in your Supabase Edge Functions secrets.
