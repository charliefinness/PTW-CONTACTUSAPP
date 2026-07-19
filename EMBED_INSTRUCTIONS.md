# Embedding the Contact Form in a Canva Website Page

## What you're embedding

A standalone, self-contained contact form at **`/form.html`**.

- No external CSS or JS files to load — everything is inline, so it works inside Canva's iframe embed block without dependency or CORS issues.
- Transparent background — blends into any Canva page background.
- Auto-resizing — the iframe grows/shrinks to fit the form exactly, so there's never a scrollbar or empty space (no need to guess a pixel height).
- Sends submissions to **support@pavingthewayfd.org** via the Supabase edge function.

## Step 1 — Deploy

Deploy this project (Bolt's Deploy button). Note the deployed URL, e.g.

```
https://your-project.bolt.new
```

The form will be available at:

```
https://your-project.bolt.new/form.html
```

(Test it in a browser first — you should see the form load with the logo, fields, and collapsible service categories.)

## Step 2 — Add to Canva

1. Open your Canva website in the editor.
2. Go to the page where you want the contact form.
3. In the left sidebar, click **Apps** → search **Embed** → add the **HTML embed** / **Embed** app.
4. Click the embed element on the page → choose **"Enter a URL"** (or paste embed code, depending on your Canva plan).
5. Paste this URL:

   ```
   https://your-project.bolt.new/form.html
   ```

   …or if your Canva plan requires the iframe code snippet, paste this:

   ```html
   <iframe
     src="https://your-project.bolt.new/form.html"
     width="100%"
     style="border:0;width:100%;max-width:720px;margin:0 auto;display:block;"
     title="Contact Paving The Way Foundation"
     loading="lazy"
     allow="clipboard-write"
   ></iframe>
   <script>
   (function(){
     function autoSize(frame){
       try {
         var doc = frame.contentDocument || frame.contentWindow.document;
         if (doc && doc.body) frame.style.height = doc.body.scrollHeight + 'px';
       } catch(e) {}
     }
     var frames = document.querySelectorAll('iframe[src*="form.html"]');
     frames.forEach(function(frame){
       frame.addEventListener('load', function(){ autoSize(frame); });
       autoSize(frame);
     });
   })();
   </script>
   ```

6. Resize the embed block on the Canva canvas to your desired width (recommended: full column width, roughly 720px). The height auto-adjusts.

## Step 3 — Preview & publish

1. Click **Preview** in Canva to test the form.
2. Submit a test entry and confirm the email arrives at **support@pavingthewayfd.org**.
3. Publish your Canva site.

## How auto-resize works

`form.html` posts a message to its parent window whenever its height changes (initial load, expanding/collapsing a category, selecting services, showing a success/error message). The snippet above listens for the iframe's `load` event and sizes it to the content. If Canva strips the `<script>` tag, the form still works — you'll just see the fixed height instead of auto-resize, and you can switch to the URL-only embed method.

## Form features

- **Chip-based service selection** — selected services leave the category list and appear as removable chips at the top, with a **Clear All** link.
- **Collapsible categories** with **Select All / Deselect All** per group.
- **Validation** — required fields + at least one service; inline error messages.
- **Security** — honeypot spam trap, server-side validation, rate limiting (3 submissions/min/IP), XSS-sanitized inputs.
- **Responsive** — adapts cleanly to mobile, tablet, and desktop column widths.
- **Branded** — PTW logo, gradient "Contact Us" heading matching the foundation's palette.

## Required environment variables

Already configured in this project's `.env` — no action needed unless you redeploy elsewhere:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `RESEND_API_KEY` (stored as a Supabase Edge Function secret)

## Troubleshooting

| Symptom | Fix |
|---|---|
| Form doesn't appear in Canva | Use the URL method (`/form.html`), not the project root. |
| Submit button does nothing | Check browser console — the deployed URL must be HTTPS and reachable. |
| No email arrives | Confirm `RESEND_API_KEY` is set in Supabase Edge Function secrets. |
| Form is cut off | Widen the embed block in Canva; the script auto-sizes height. |
| Background doesn't match | `form.html` uses a transparent background — it inherits your Canva page color. |
