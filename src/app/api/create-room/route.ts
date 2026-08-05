import { NextResponse } from 'next/server';

/**
 * POST /api/create-room
 *
 * Creates a Daily.co room via the REST API and returns the room URL.
 * Requires DAILY_API_KEY to be set in the environment.
 */
export async function POST() {
  const apiKey = process.env.DAILY_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'DAILY_API_KEY is not configured on the server.' },
      { status: 500 },
    );
  }

  try {
    const dailyRes = await fetch('https://api.daily.co/v1/rooms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        properties: {
          enable_chat: false,
          enable_screenshare: true,
          // Room expires in 1 hour
          exp: Math.floor(Date.now() / 1000) + 3600,
        },
      }),
    });

    if (!dailyRes.ok) {
      const err = await dailyRes.json().catch(() => ({}));
      console.error('[create-room] Daily API error:', err);
      return NextResponse.json(
        { error: 'Daily API returned an error', details: err },
        { status: dailyRes.status },
      );
    }

    const room = await dailyRes.json();
    return NextResponse.json({ url: room.url as string });
  } catch (err) {
    console.error('[create-room] Unexpected error:', err);
    return NextResponse.json(
      { error: 'Unexpected server error', details: String(err) },
      { status: 500 },
    );
  }
}
