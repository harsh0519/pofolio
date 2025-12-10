import { NextResponse, NextRequest } from 'next/server';
import { getValidAccessToken } from '@/lib/spotify-auth';

// Cache for owner's data
let cachedOwnerData: { profile: any; now: any; lastUpdated: number } | null = null;
const CACHE_DURATION = 30 * 1000; // 30 seconds

export async function GET(req: NextRequest) {
  // If we have cached owner data and it's recent, return it
  if (cachedOwnerData && (Date.now() - cachedOwnerData.lastUpdated) < CACHE_DURATION) {
    return NextResponse.json({
      profile: cachedOwnerData.profile,
      now: cachedOwnerData.now,
      cached: true
    });
  }

  const accessToken = await getValidAccessToken(req);

  // If still no token, return cached data or error
  if (!accessToken) {
    if (cachedOwnerData) {
      return NextResponse.json({
        profile: cachedOwnerData.profile,
        now: cachedOwnerData.now,
        cached: true
      });
    }
    return NextResponse.json({ error: 'no_tokens' }, { status: 401 });
  }

  try {
    // Fetch profile
    const profileRes = await fetch('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    // If token expired, return cached data
    if (profileRes.status === 401) {
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

    // Fetch currently playing (may return 204)
    const nowRes = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    let now = null;
    if (nowRes.status === 200) {
      now = await nowRes.json();
    }

    // Cache the data
    cachedOwnerData = { profile, now, lastUpdated: Date.now() };

    return NextResponse.json({ profile, now });
  } catch (err) {
    return NextResponse.json({ error: 'Request failed', details: String(err) }, { status: 500 });
  }
}
