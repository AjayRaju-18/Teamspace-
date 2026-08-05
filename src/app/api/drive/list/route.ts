import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/drive/list
 *
 * Lists the authenticated user's Google Drive files.
 * Expects the Google OAuth provider_token as a Bearer token in the
 * Authorization header (sent by DriveView after reading it from the
 * Supabase session client-side).
 */
export async function GET(request: NextRequest) {
  const authHeader   = request.headers.get('Authorization') ?? '';
  const providerToken = authHeader.replace(/^Bearer\s+/i, '').trim();

  if (!providerToken) {
    return NextResponse.json(
      { error: 'Missing Google OAuth token. Please sign in again.' },
      { status: 401 },
    );
  }

  const driveRes = await fetch(
    'https://www.googleapis.com/drive/v3/files' +
      '?fields=files(id,name,mimeType,iconLink,webViewLink,modifiedTime)' +
      '&pageSize=100' +
      '&orderBy=modifiedTime+desc',
    {
      headers: { Authorization: `Bearer ${providerToken}` },
    },
  );

  const data = await driveRes.json();

  if (!driveRes.ok) {
    console.error('[drive/list] Google API error:', data);
    return NextResponse.json(
      { error: 'Google Drive API error', details: data },
      { status: driveRes.status },
    );
  }

  return NextResponse.json(data);
}
