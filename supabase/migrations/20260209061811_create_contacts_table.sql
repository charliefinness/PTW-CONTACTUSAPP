/*
  # Create Contacts Table for Reentry Non-Profit CRM

  1. New Tables
    - `contacts`
      - `id` (uuid, primary key) - Unique identifier for each contact
      - `first_name` (text) - Contact's first name
      - `last_name` (text) - Contact's last name
      - `email` (text) - Contact's email address
      - `phone` (text, optional) - Contact's phone number
      - `interest_type` (text) - Type of interest (services, volunteer, donate, other)
      - `message` (text, optional) - Additional message from contact
      - `status` (text) - Contact status (new, contacted, in_progress, completed)
      - `notes` (text, optional) - Internal notes about the contact
      - `created_at` (timestamptz) - When the contact was created
      - `updated_at` (timestamptz) - When the contact was last updated

  2. Security
    - Enable RLS on `contacts` table
    - Add policy for public to insert their own contact information
    - Add policy for authenticated users to view and manage all contacts
*/

CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text,
  interest_type text NOT NULL DEFAULT 'services',
  message text,
  status text NOT NULL DEFAULT 'new',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact form"
  ON contacts
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all contacts"
  ON contacts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update contacts"
  ON contacts
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete contacts"
  ON contacts
  FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);