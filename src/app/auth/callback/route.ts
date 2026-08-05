import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * GET /auth/callback
 *
 * Supabase redirects here after a successful Google OAuth flow.
 * This handler:
 *   1. Exchanges the one-time `code` for a Supabase session.
 *   2. Upserts a row in `public.profiles` from Google user_metadata
 *      (only on first sign-in — skips if the row already exists).
 *   3. Redirects the user to /workspace.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    console.error('[auth/callback] No code param received.');
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  // Create a server-side Supabase client scoped to this request.
  // Note: for full cookie-based session persistence in the App Router,
  // upgrade to @supabase/ssr and use createServerClient with cookies().
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
  );

  // Exchange the OAuth code for a session
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.session) {
    console.error('[auth/callback] exchangeCodeForSession error:', error?.message);
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }

  const { user } = data;
  const meta = user.user_metadata ?? {};

  // ── Upsert profile on first sign-in ────────────────────────────────────────
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .maybeSingle();

  if (!existingProfile) {
    const { error: insertError } = await supabase.from('profiles').insert({
      id: user.id,
      name: meta.full_name ?? meta.name ?? null,
      avatar_url: meta.avatar_url ?? meta.picture ?? null,
      email: user.email ?? null,
    });

    if (insertError) {
      console.error('[auth/callback] Failed to create profile:', insertError.message);
      // Non-fatal: user is authenticated, proceed to workspace
    }
  }

  return NextResponse.redirect(`${origin}/workspace`);
}
