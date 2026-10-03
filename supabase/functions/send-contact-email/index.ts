import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ContactData {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  interests: string[];
  message?: string;
  honeypot?: string;
}

function sanitizeText(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\+\(\)\.]+$/;
  return phoneRegex.test(phone) && phone.length >= 10 && phone.length <= 20;
}

function validateContactData(
  data: ContactData
): { valid: boolean; error?: string } {
  if (data.honeypot) {
    return { valid: false, error: "Invalid submission" };
  }

  if (!data.first_name || !data.last_name || !data.email || !data.interests) {
    return { valid: false, error: "Missing required fields" };
  }

  if (data.first_name.length > 100 || data.last_name.length > 100) {
    return { valid: false, error: "Name fields too long" };
  }

  if (!isValidEmail(data.email)) {
    return { valid: false, error: "Invalid email format" };
  }

  if (data.phone && !isValidPhone(data.phone)) {
    return { valid: false, error: "Invalid phone format" };
  }

  if (data.message && data.message.length > 5000) {
    return { valid: false, error: "Message too long" };
  }

  if (!Array.isArray(data.interests) || data.interests.length === 0) {
    return { valid: false, error: "At least one service must be selected" };
  }

  if (data.interests.length > 20) {
    return { valid: false, error: "Too many services selected" };
  }

  return { valid: true };
}

function generateHTMLEmail(data: ContactData): string {
  const interestsHTML = data.interests
    .map(
      (interest) =>
        `<li style="margin: 4px 0;">${sanitizeText(interest)}</li>`
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #059669; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background-color: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
    .field { margin-bottom: 16px; }
    .label { font-weight: bold; color: #374151; margin-bottom: 4px; }
    .value { color: #1f2937; }
    .interests { background-color: white; padding: 12px; border-radius: 6px; margin-top: 8px; }
    .interests ul { margin: 8px 0; padding-left: 20px; }
    .footer { background-color: #f3f4f6; padding: 12px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 8px 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 24px;">New Support Services Request</h1>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">Name:</div>
        <div class="value">${sanitizeText(data.first_name)} ${sanitizeText(data.last_name)}</div>
      </div>

      <div class="field">
        <div class="label">Email:</div>
        <div class="value"><a href="mailto:${sanitizeText(data.email)}">${sanitizeText(data.email)}</a></div>
      </div>

      ${
        data.phone
          ? `
      <div class="field">
        <div class="label">Phone:</div>
        <div class="value"><a href="tel:${sanitizeText(data.phone)}">${sanitizeText(data.phone)}</a></div>
      </div>
      `
          : ""
      }

      <div class="field">
        <div class="label">Services Requested (${data.interests.length}):</div>
        <div class="interests">
          <ul>
            ${interestsHTML}
          </ul>
        </div>
      </div>

      ${
        data.message
          ? `
      <div class="field">
        <div class="label">Message:</div>
        <div class="value" style="background-color: white; padding: 12px; border-radius: 6px; margin-top: 8px;">
          ${sanitizeText(data.message).replace(/\n/g, "<br>")}
        </div>
      </div>
      `
          : ""
      }
    </div>
    <div class="footer">
      <p style="margin: 0;">This request was submitted through pavingthewayfd.com</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

function generatePlainTextEmail(data: ContactData): string {
  const interestsText = data.interests
    .map((interest) => `  - ${interest}`)
    .join("\n");

  return `
NEW SUPPORT SERVICES REQUEST
========================================

Name: ${data.first_name} ${data.last_name}
Email: ${data.email}
${data.phone ? `Phone: ${data.phone}` : ""}

SERVICES REQUESTED (${data.interests.length}):
${interestsText}

${data.message ? `MESSAGE:\n${data.message}` : ""}

----------------------------------------
This request was submitted through pavingthewayfd.com
  `.trim();
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const contactData: ContactData = await req.json();

    const validation = validateContactData(contactData);
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ success: false, error: validation.error }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Save contact to database
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { error: dbError } = await supabase.from("contacts").insert({
      first_name: contactData.first_name,
      last_name: contactData.last_name,
      email: contactData.email,
      phone: contactData.phone || null,
      interests: contactData.interests,
      message: contactData.message || null,
      status: "new",
    });

    if (dbError) {
      console.error("Database insert error:", dbError);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Failed to save your request. Please try again.",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    // Send email notification
    let emailSent = false;
    if (resendApiKey) {
      const htmlContent = generateHTMLEmail(contactData);
      const textContent = generatePlainTextEmail(contactData);

      const emailPayload = {
        from: "Paving The Way <onboarding@resend.dev>",
        to: ["support@pavingthewayfd.org"],
        subject: `New Support Services Request from ${contactData.first_name} ${contactData.last_name}`,
        html: htmlContent,
        text: textContent,
        reply_to: contactData.email,
      };

      const resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify(emailPayload),
      });

      if (!resendResponse.ok) {
        const errorData = await resendResponse.text();
        console.error("Resend API error:", errorData);
      } else {
        emailSent = true;
      }
    }

    return new Response(
      JSON.stringify({ success: true, emailSent }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: "Something went wrong. Please try again.",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
