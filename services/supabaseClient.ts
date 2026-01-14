import { createClient } from '@supabase/supabase-js';

// Replaced by Vite 'define' at build time
const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Fallback to import.meta.env if 'define' was bypassed (local dev edge case)
const supabaseUrl = envUrl || (import.meta as any).env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = envKey || (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("⚠️ Supabase Configuration Missing!");
  console.log("Status:");
  console.log("- URL:", supabaseUrl ? "Found" : "Missing");
  console.log("- Key:", supabaseAnonKey ? "Found" : "Missing");
  console.log("Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_ANON_KEY are set in Vercel or .env");
}

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;
