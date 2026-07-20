import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';

function readEnvValue(key: "VITE_SUPABASE_URL" | "VITE_SUPABASE_ANON_KEY") {
  return (import.meta.env[key] || "").trim();
}

export function getSupabaseUrl(): string {
  const configuredUrl = readEnvValue("VITE_SUPABASE_URL");
  if (configuredUrl) return configuredUrl.replace(/\/$/, "");

  const meooAccessUrl = (window as any).MEOO_CONFIG?.meoo_app_access_url;
  if (meooAccessUrl) return `${meooAccessUrl.replace(/\/$/, "")}/sb-api`;

  return "";
}

export const supabaseUrl = getSupabaseUrl();
export const supabaseAnonKey = readEnvValue("VITE_SUPABASE_ANON_KEY");
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient<Database> | null = isSupabaseConfigured
  ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;
