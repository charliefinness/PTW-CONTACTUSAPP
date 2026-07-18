# AGENTS.md

## Overview
- This repository contains the Paving The Way contact experience: a public-facing contact form, Supabase edge-function email delivery, and CRM/admin components that are present in the codebase but not currently mounted by `src/App.tsx`.
- The active entrypoint is `src/App.tsx`, which renders `src/components/ContactForm.tsx`.
- Treat `FORM_MASTER_DESCRIPTION.md` and `EMBED_INSTRUCTIONS.md` as product requirements for the form UX, copy, and submission behavior.

## Repository layout
- `src/App.tsx` - current app shell for the public contact form.
- `src/components/ContactForm.tsx` - primary user flow, validation, service selection UI, and submit logic.
- `src/components/EmbeddableContactForm.tsx` - alternate wrapper for embedded use.
- `src/components/Login.tsx` and `src/components/CRMDashboard.tsx` - CRM/admin UI components; currently unused by `App.tsx`.
- `src/lib/supabase.ts` - Supabase client setup and `Contact` type.
- `public/` - static assets, including `ptw_logo.png` and `form.html`.
- `supabase/functions/send-contact-email/index.ts` - edge function for validation, rate limiting, and Resend email delivery.
- `supabase/migrations/` - contact table schema and migration history.

## Development commands
- `npm install` - install dependencies.
- `npm run dev` - serve the app locally on port 3000.
- `npm run start` - same as `dev`.
- `npm run preview` - serve the app locally on port 4000.
- `npm run build` - currently a no-op verification command that prints `No build step needed — static HTML app`.

## Environment and integrations
- Frontend expects `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- The edge function expects `RESEND_API_KEY` in the Supabase environment.
- The client submits to `${VITE_SUPABASE_URL}/functions/v1/send-contact-email`.

## Implementation notes
- Keep frontend and edge-function validation rules aligned: required names/email/interests, phone formatting, message limits, honeypot handling, and rate-limit messaging.
- The service taxonomy is duplicated in multiple places (`ContactForm.tsx`, `CRMDashboard.tsx`, and documentation). Update all relevant copies together when changing service names or categories.
- Submission payloads and contact records use snake_case keys such as `first_name`, `last_name`, and `created_at`; preserve that shape unless you are updating all dependent code.
- The public form uses Tailwind utility classes and existing visual branding from the current components and docs.
- Be careful with secrets: do not hardcode API keys or Supabase credentials in source files.

## Validation expectations
- There is no test script in `package.json`.
- There is an ESLint config in `eslint.config.js`, but no repo script currently invokes it.
- For documentation-only changes, review the diff for accuracy.
- For app or edge-function changes, at minimum run the existing repo command set and any directly relevant checks you add temporarily during development.
