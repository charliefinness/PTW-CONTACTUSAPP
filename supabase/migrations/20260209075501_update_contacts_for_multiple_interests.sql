/*
  # Update Contacts Table for Multiple Interest Selections

  1. Changes
    - Drop the existing interest_type column
    - Add new interests column as text array to support multiple selections
    - Update default value to empty array

  2. Notes
    - This allows contacts to select multiple services they're interested in
    - Each category and sub-category can be selected independently
*/

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contacts' AND column_name = 'interest_type'
  ) THEN
    ALTER TABLE contacts DROP COLUMN interest_type;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contacts' AND column_name = 'interests'
  ) THEN
    ALTER TABLE contacts ADD COLUMN interests text[] DEFAULT '{}';
  END IF;
END $$;