# Master Form Description — Paving The Way Foundation
## For Jotform Form Specialist / Form Copilot AI

---

## 1. FORM IDENTITY

| Property | Value |
|---|---|
| **Form Title** | Contact Us — Paving The Way Foundation |
| **Organization** | Paving The Way Foundation |
| **Purpose** | Intake / contact form for people seeking support services |
| **Submission Destination** | Email notification to `intrest@pavingthewayfd.com` |
| **Reply-To** | Submitter's email address |
| **Email Subject Line** | `New Support Services Request from [First Name] [Last Name]` |

---

## 2. BRANDING & VISUAL STYLE

- **Logo:** Organization logo displayed at the top center (file: `ptw_logo.png`, size: 112×112px)
- **Heading:** "Contact Us" — large, bold, gradient text (yellow → orange → green)
- **Subheading:** "We're here to help pave your way forward" — gray body text
- **Primary color:** Orange (`#f97316`) — used for focus rings, selected counts, submit button
- **Accent colors:** Yellow (`#eab308`), Green (`#16a34a`)
- **Submit button:** Full-width gradient (yellow → orange → deep orange), bold white text
- **Background:** Soft warm gradient (cream/orange tint/light green tint)
- **Card style:** White card with rounded corners and drop shadow
- **Font:** System sans-serif stack

---

## 3. FORM FIELDS (in order)

### Field 1 — First Name
- **Type:** Short text / Single line
- **Label:** First Name
- **Placeholder:** John
- **Required:** YES
- **Max length:** 100 characters
- **Layout:** Left column (2-column grid row with Last Name)

### Field 2 — Last Name
- **Type:** Short text / Single line
- **Label:** Last Name
- **Placeholder:** Smith
- **Required:** YES
- **Max length:** 100 characters
- **Layout:** Right column (same row as First Name)

### Field 3 — Email Address
- **Type:** Email
- **Label:** Email Address
- **Placeholder:** john.smith@example.com
- **Required:** YES
- **Validation:** Must be valid email format; max 254 characters
- **Layout:** Full width

### Field 4 — Phone Number
- **Type:** Phone / Tel
- **Label:** Phone Number
- **Placeholder:** (555) 123-4567
- **Required:** NO (optional)
- **Validation:** If provided, must be 10–20 digits/characters; digits, spaces, dashes, plus, parentheses, dots allowed
- **Layout:** Full width

### Field 5 — Services Selector (Checkbox Group with Accordion Categories)
- **Type:** Multi-select checkbox with collapsible category groups
- **Label:** What Services Are You Looking For?
- **Required:** YES — at least 1 service must be selected
- **Validation error shown:** "Please select at least one service"
- **Selected count indicator:** Shows "[N] selected" in orange when any service is chosen
- **Layout:** Full width, scrollable box (max height ~380px)
- **Max selections:** 20

#### Category Behavior
- Each category is an accordion/collapsible section
- Default state: ALL categories collapsed
- Clicking category header toggles it open/closed
- Each category has a "Select All" / "Deselect All" toggle button
  - Default state: gray "Select All"
  - Partially selected: orange-tinted "Select All" with partial count shown (e.g., "2/5")
  - Fully selected: solid orange "Deselect All"

#### SERVICE CATEGORIES & SERVICES (exact names):

**Category 1: Employment & Training**
- Job Training / Certifications
- Paid Work & Job Placement
- Reentry Employment Help
- Youth Job Readiness
- Skilled Trades Training

**Category 2: Reentry & Case Support**
- Reentry Support Services
- Care Management Support
- Help Getting ID / Documents
- Mental Health / Recovery Help

**Category 3: Housing & Stability**
- Eviction Help / Tenant Rights
- Emergency Financial Help
- Transportation Assistance

**Category 4: Basic Needs**
- Food Assistance
- Clothing Assistance
- General Community Help

**Category 5: Special Programs**
- Justice-Impacted Women
- Foster / Transition-Age Youth
- DOR Employment Services
- Employed Client Emergency Help

**Category 6: Intake / Routing**
- Not Sure — Need Guidance
- Referred by Another Agency

### Field 6 — Message
- **Type:** Long text / Paragraph / Textarea
- **Label:** Message
- **Placeholder:** Tell us more about how we can help...
- **Required:** NO (optional)
- **Max length:** 5,000 characters
- **Rows:** 4 visible rows
- **Layout:** Full width

### Hidden Field — Honeypot (Spam Prevention)
- **Type:** Hidden text field
- **Name:** `honeypot`
- **Behavior:** Visually hidden (moved offscreen, zero dimensions). If any value is submitted in this field, the submission is silently rejected as spam.
- **Note:** Do NOT label or describe this field. It must be invisible to real users.

---

## 4. PRIVACY NOTICE (static text block)

Display the following text in a gray box above the submit button:

> "By submitting this form, you agree to our collection and use of your personal information as described in our privacy policy. We will only use your information to respond to your inquiry and provide the services you requested."

---

## 5. SUBMIT BUTTON

- **Label:** Submit
- **Loading state label:** Sending...
- **Style:** Full-width, gradient orange, bold white text, rounded
- **Disabled state:** When submitting — grayed out, cursor not-allowed

---

## 6. FORM STATES & MESSAGES

### Success State
- Shown after successful submission
- Message: "Thank you for reaching out! We'll get back to you soon."
- Style: Warm orange-tinted banner with orange border
- After success: Reset all fields to empty, clear all selected checkboxes

### Error State (general)
- Message: "Something went wrong. Please try again or contact us directly."
- Style: Red-tinted banner

### Rate Limit Error (429)
- Message: "Too many submissions. Please try again in a moment."
- Style: Inline validation error (red box)

### Validation Error (400)
- Show the specific error message returned by the server
- Style: Inline validation error (red box)

### Client-side Validation Errors
- No services selected: "Please select at least one service"
- Missing required fields: "Please fill in all required fields."

---

## 7. SUBMISSION DATA STRUCTURE

When submitted, send the following data:

| Field | Key | Type | Notes |
|---|---|---|---|
| First Name | `first_name` | string | Required |
| Last Name | `last_name` | string | Required |
| Email | `email` | string | Required |
| Phone | `phone` | string | Optional — omit if empty |
| Selected Services | `interests` | array of strings | Required, min 1 item |
| Message | `message` | string | Optional — omit if empty |
| Honeypot | `honeypot` | string | Optional — spam trap |

---

## 8. SERVER-SIDE VALIDATION (for reference)

The backend validates:
- Honeypot field is empty (spam check)
- All required fields present
- First/last name max 100 chars each
- Valid email format (max 254 chars)
- Valid phone format if provided (10–20 chars, digits/symbols only)
- Message max 5,000 chars
- At least 1 service selected
- No more than 20 services selected
- Rate limit: 3 submissions per minute per IP address

---

## 9. EMAIL NOTIFICATION FORMAT

**To:** `intrest@pavingthewayfd.com`
**From:** `Paving The Way <noreply@helixitcs.com>`
**Reply-To:** Submitter's email address
**Subject:** `New Support Services Request from [First Name] [Last Name]`

**Email body includes:**
- Full name
- Email address (linked)
- Phone number (linked, if provided)
- List of all selected services with count
- Message (if provided)
- Footer: "This request was submitted through pavingthewayfd.com"

---

## 10. RESPONSIVE BEHAVIOR

- Desktop (>540px): First Name and Last Name appear side-by-side in a 2-column grid
- Mobile (≤540px): All fields stack vertically, single column
- Services box: Scrollable at max-height on all screen sizes
- Submit button: Always full width

---

## 11. ACCESSIBILITY

- All fields have associated `<label>` elements with matching `for`/`id`
- Required fields marked with asterisk (*) in label
- Honeypot field has `aria-hidden="true"` and `tabindex="-1"`
- Form uses `novalidate` to handle all validation in JavaScript
- Submit button disabled during submission to prevent double-submit

---

## 12. QUICK SUMMARY FOR JOTFORM SETUP

1. Add header with logo image + "Contact Us" title + subtitle
2. Add Name field (split: First + Last, both required)
3. Add Email field (required)
4. Add Phone field (optional)
5. Add Checkbox Group field labeled "What Services Are You Looking For?" — add all 6 categories with their exact service names listed above (required, min 1 selection)
6. Add Long Text field labeled "Message" (optional)
7. Add privacy notice as a paragraph/HTML element
8. Configure submit button: label "Submit"
9. Set notification email to: `intrest@pavingthewayfd.com`
10. Set reply-to: submitter's email field
11. Enable spam/CAPTCHA protection
12. Configure thank-you/success message: "Thank you for reaching out! We'll get back to you soon."
