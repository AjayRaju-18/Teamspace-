import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/drive/upload
 *
 * Uploads a file to the authenticated user's Google Drive using the
 * multipart upload API (uploadType=multipart).
 *
 * Expects:
 *   - Authorization header with the Google OAuth provider_token
 *   - multipart/form-data body with a "file" field
 */
export async function POST(request: NextRequest) {
  const authHeader    = request.headers.get('Authorization') ?? '';
  const providerToken = authHeader.replace(/^Bearer\s+/i, '').trim();

  if (!providerToken) {
    return NextResponse.json(
      { error: 'Missing Google OAuth token. Please sign in again.' },
      { status: 401 },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid multipart form data.' }, { status: 400 });
  }

  const file = formData.get('file') as File | null;
  if (!file) {
    return NextResponse.json({ error: 'No file field in request.' }, { status: 400 });
  }

  // ── Build multipart/related body for Drive API ───────────────────────────────
  // Google Drive requires multipart/related (not multipart/form-data) with:
  //   Part 1: JSON metadata
  //   Part 2: File binary
  const boundary  = `TeamspaceBoundary${Date.now()}`;
  const encoder   = new TextEncoder();
  const fileBytes = new Uint8Array(await file.arrayBuffer());
  const metadata  = JSON.stringify({ name: file.name });
  const mimeType  = file.type || 'application/octet-stream';

  const parts: Uint8Array[] = [
    encoder.encode(`--${boundary}\r\n`),
    encoder.encode(`Content-Type: application/json; charset=UTF-8\r\n\r\n`),
    encoder.encode(metadata),
    encoder.encode(`\r\n--${boundary}\r\n`),
    encoder.encode(`Content-Type: ${mimeType}\r\n\r\n`),
    fileBytes,
    encoder.encode(`\r\n--${boundary}--`),
  ];

  const totalSize = parts.reduce((n, p) => n + p.byteLength, 0);
  const body      = new Uint8Array(totalSize);
  let offset      = 0;
  for (const part of parts) {
    body.set(part, offset);
    offset += part.byteLength;
  }

  // ── Upload to Drive ──────────────────────────────────────────────────────────
  const driveRes = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${providerToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body,
    },
  );

  const data = await driveRes.json();

  if (!driveRes.ok) {
    console.error('[drive/upload] Google API error:', data);
    return NextResponse.json(
      { error: 'Google Drive upload failed', details: data },
      { status: driveRes.status },
    );
  }

  return NextResponse.json(data);
}
