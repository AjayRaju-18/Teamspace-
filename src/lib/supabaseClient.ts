import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _client: SupabaseClient | null = null;

/**
 * Returns the shared browser-side Supabase client.
 *
 * The client is created lazily on first access so that *importing* this module
 * does not trigger `createClient` during Next.js static prerendering (when
 * NEXT_PUBLIC_* vars may not be available).
 *
 * ✅ Call inside event handlers or effects.
 * ❌ Do NOT call at module scope or during render.
 */
export function getSupabase(): SupabaseClient {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
    _client = createClient(url, key);
  }
  return _client;
}
