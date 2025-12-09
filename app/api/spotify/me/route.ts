import { NextResponse, NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  let accessToken = req.cookies.get('spotify_access_token')?.value;

  // If no access token, try to refresh automatically
  if (!accessToken) {
    console.log('🎵 /me: No access token, attempting auto-refresh');
    try {
      const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/spotify/refresh`, {
        method: 'GET',
        headers: req.headers,
      });

      if (refreshRes.ok) {
        // Get the new access token from cookies (set by refresh endpoint)
        accessToken = req.cookies.get('spotify_access_token')?.value;
        console.log('🎵 /me: Auto-refresh successful, new token:', !!accessToken);
      } else {
        console.log('🎵 /me: Auto-refresh failed');
        return NextResponse.json({ error: 'No access token and refresh failed' }, { status: 401 });
      }
    } catch (err) {
      console.log('🎵 /me: Auto-refresh error:', err);
      return NextResponse.json({ error: 'Auto-refresh failed' }, { status: 401 });
    }
  }

  if (!accessToken) {
    return NextResponse.json({ error: 'No access token' }, { status: 401 });
  }

  // fetch profile
  const profileRes = await fetch('https://api.spotify.com/v1/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (profileRes.status === 401) {
    console.log('🎵 /me: Token expired, attempting refresh');
    // Try to refresh token
    try {
      const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/spotify/refresh`, {
        method: 'GET',
        headers: req.headers,
      });

      if (refreshRes.ok) {
        // Retry with new token
        const newToken = req.cookies.get('spotify_access_token')?.value;
        if (newToken) {
          const retryRes = await fetch('https://api.spotify.com/v1/me', {
            headers: { Authorization: `Bearer ${newToken}` },
          });
          if (retryRes.ok) {
            const profile = await retryRes.json();
            return NextResponse.json({ profile, now: null });
          }
        }
      }
    } catch (err) {
      console.log('🎵 /me: Refresh retry failed:', err);
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

  return NextResponse.json({ profile, now });
}
