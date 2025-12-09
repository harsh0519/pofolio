import { NextResponse, NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const accessToken = req.cookies.get('spotify_access_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'no_tokens' }, { status: 401 });
  }

  // fetch profile
  const profileRes = await fetch('https://api.spotify.com/v1/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (profileRes.status === 401) {
    return NextResponse.json({ error: 'token_expired' }, { status: 401 });
  }

  if (!profileRes.ok) {
    const txt = await profileRes.text();
    return NextResponse.json({ error: 'Failed to fetch profile', details: txt }, { status: 500 });
  }

  const profile = await profileRes.json();

  // fetch currently playing (may return 204)
  const nowRes = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  let now = null;
  if (nowRes.status === 200) {
    now = await nowRes.json();
  }

  return NextResponse.json({ profile, now });
}
