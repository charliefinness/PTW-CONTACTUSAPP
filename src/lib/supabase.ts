import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Contact = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  interests: string[];
  message?: string;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
};
