import { NextResponse, NextRequest } from 'next/server';

// Cache for owner's data (in production, use Redis or similar)
let cachedOwnerData: { profile: any; now: any; lastUpdated: number } | null = null;
const CACHE_DURATION = 30 * 1000; // 30 seconds

export async function GET(req: NextRequest) {
  const accessToken = req.cookies.get('spotify_access_token')?.value;

  // If we have cached owner data and it's recent, return it for all visitors
  if (cachedOwnerData && (Date.now() - cachedOwnerData.lastUpdated) < CACHE_DURATION) {
    return NextResponse.json({
      profile: cachedOwnerData.profile,
      now: cachedOwnerData.now,
      cached: true
    });
  }

  // Try to use owner's tokens if available
  if (!accessToken) {
    // Check if we have cached data to show to visitors
    if (cachedOwnerData) {
      return NextResponse.json({
        profile: cachedOwnerData.profile,
        now: cachedOwnerData.now,
        cached: true
      });
    }
    return NextResponse.json({ error: 'no_tokens' }, { status: 401 });
  }

  // fetch profile
  const profileRes = await fetch('https://api.spotify.com/v1/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (profileRes.status === 401) {
    // If owner's tokens expired, try to use cached data
    if (cachedOwnerData) {
      return NextResponse.json({
        profile: cachedOwnerData.profile,
        now: cachedOwnerData.now,
        cached: true
      });
    }
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

  // Cache the data for other visitors
  cachedOwnerData = {
    profile,
    now,
    lastUpdated: Date.now()
  };

  return NextResponse.json({ profile, now });
}
