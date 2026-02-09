import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ContactData {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  interests: string[];
  message?: string;
}

function generateHTMLEmail(data: ContactData): string {
  const interestsHTML = data.interests
    .map((interest) => `<li style="margin: 4px 0;">${interest}</li>`)
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
        <div class="value">${data.first_name} ${data.last_name}</div>
      </div>

      <div class="field">
        <div class="label">Email:</div>
        <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
      </div>

      ${
        data.phone
          ? `
      <div class="field">
        <div class="label">Phone:</div>
        <div class="value"><a href="tel:${data.phone}">${data.phone}</a></div>
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
          ${data.message.replace(/\n/g, "<br>")}
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
  const interestsText = data.interests.map((interest) => `  - ${interest}`).join("\n");

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
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const contactData: ContactData = await req.json();

    const htmlContent = generateHTMLEmail(contactData);
    const textContent = generatePlainTextEmail(contactData);

    const emailPayload = {
      from: `${contactData.first_name} ${contactData.last_name} <${contactData.email}>`,
      to: ["intake@pavingthewayfd.com"],
      subject: "INTRESTED IN SUPPORT SERVICES",
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
      throw new Error(`Failed to send email: ${resendResponse.status} - ${errorData}`);
    }

    const result = await resendResponse.json();

    return new Response(
      JSON.stringify({
        success: true,
        messageId: result.id,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error sending email:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 500,
      }
    );
  }
});
