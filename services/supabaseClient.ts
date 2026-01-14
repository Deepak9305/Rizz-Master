
import { createClient } from '@supabase/supabase-js';

// Replaced by Vite 'define' at build time
const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Fallback to import.meta.env if 'define' was bypassed
const supabaseUrl = envUrl || (import.meta as any).env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = envKey || (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

const isConfigured = supabaseUrl && supabaseAnonKey;

if (!isConfigured) {
  console.info("ℹ️ Supabase not configured. App running in Guest Mode.");
}

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;
