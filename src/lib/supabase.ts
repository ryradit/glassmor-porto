import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Detect if Supabase is properly configured or using default placeholders
export const isSupabaseConfigured = 
  !!supabaseUrl && 
  supabaseUrl !== 'https://your-project-ref.supabase.co' && 
  !!supabaseAnonKey && 
  supabaseAnonKey !== 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder-key';

// Initialize the Supabase client safely
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
