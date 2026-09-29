import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type DbEmail = {
  id: string;
  from_name: string;
  from_email: string;
  to_email: string;
  subject: string;
  body: string;
  preview: string;
  category: string;
  is_read: boolean;
  is_starred: boolean;
  has_attachments: boolean;
  tags: string[];
  cc_emails: string[];
  bcc_emails: string[];
  avatar: string | null;
  scheduled_at: string | null;
  created_at: string;
  updated_at: string;
};

export type DbContact = {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  is_favorite: boolean;
  last_contacted: string | null;
  created_at: string;
};

export type DbDraft = {
  id: string;
  to_email: string;
  subject: string;
  body: string;
  cc_emails: string[];
  bcc_emails: string[];
  scheduled_at: string | null;
  created_at: string;
  updated_at: string;
};
