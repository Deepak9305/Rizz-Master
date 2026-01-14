
import { createClient } from '@supabase/supabase-js';

// Replaced by Vite 'define' at build time
const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Fallback to import.meta.env if 'define' was bypassed
const supabaseUrl = envUrl || (import.meta as any).env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = envKey || (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

const isConfigured = !!supabaseUrl && !!supabaseAnonKey;

// App runs in Guest Mode if Supabase is not configured.
// We export null to indicate the client is unavailable, which is handled by App.tsx and LoginPage.tsx.
export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;
