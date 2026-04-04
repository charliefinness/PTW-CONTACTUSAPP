# Paving The Way Foundation - Contact Form

An embeddable contact form for Paving The Way Foundation that sends email notifications directly without storing data in a database.

## Features

- **No Database Required** - Form submissions are sent directly via email
- **Email Notifications** - Instant email delivery to support@pavingthewayfd.org
- **Service Selection** - Users can select from multiple service categories
- **Spam Protection** - Honeypot field and rate limiting
- **Security** - Input validation, XSS protection, and sanitization
- **Responsive Design** - Works on mobile, tablet, and desktop
- **Embeddable** - Ready to embed in Canva websites or any platform

## How It Works

1. User fills out the contact form
2. Form validates input client-side
3. Submission is sent to Supabase Edge Function
4. Edge Function validates and sends email via Resend API
5. User sees success message

No data is stored in any database.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

3. Configure Resend API key in Supabase Edge Functions:
```bash
# This is done automatically - no manual setup needed
```

4. Deploy the edge function:
```bash
# This is handled automatically
```

## Development

Run the development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

## Embedding in Canva

See [EMBED_INSTRUCTIONS.md](./EMBED_INSTRUCTIONS.md) for detailed instructions on how to embed this form in your Canva website.

Quick embed code:
```html
<iframe
  src="https://[YOUR-DEPLOYMENT-URL]/"
  width="100%"
  height="1200"
  frameborder="0"
  title="Contact Form"
></iframe>
```

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Supabase Edge Functions
- Resend (Email API)
- Lucide React (Icons)

## License

Proprietary - Paving The Way Foundation
