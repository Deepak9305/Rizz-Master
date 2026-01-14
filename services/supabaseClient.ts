
import { createClient } from '@supabase/supabase-js';

// robustly check both process.env (injected by Vite define) and import.meta.env (native Vite)
// We cast import.meta to any to avoid TypeScript errors if types aren't configured.
const supabaseUrl = 
  process.env.NEXT_PUBLIC_SUPABASE_URL || 
  (import.meta as any).env?.VITE_SUPABASE_URL || 
  (import.meta as any).env?.NEXT_PUBLIC_SUPABASE_URL;

const supabaseAnonKey = 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 
  (import.meta as any).env?.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("⚠️ Supabase Configuration Missing!");
  console.log("Expected URL and Anon Key. Please check your Vercel Environment Variables or .env file.");
  console.log("Required keys: VITE_SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) and VITE_SUPABASE_ANON_KEY");
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;
