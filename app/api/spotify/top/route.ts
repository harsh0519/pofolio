import { NextResponse, NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  let accessToken = req.cookies.get('spotify_access_token')?.value;

  // If no access token, try to refresh automatically
  if (!accessToken) {
    console.log('🎵 /top: No access token, attempting auto-refresh');
    try {
      const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/spotify/refresh`, {
        method: 'GET',
        headers: req.headers,
      });

      if (refreshRes.ok) {
        accessToken = req.cookies.get('spotify_access_token')?.value;
        console.log('🎵 /top: Auto-refresh successful, new token:', !!accessToken);
      } else {
        console.log('🎵 /top: Auto-refresh failed');
        return NextResponse.json({ error: 'No access token and refresh failed' }, { status: 401 });
      }
    } catch (err) {
      console.log('🎵 /top: Auto-refresh error:', err);
      return NextResponse.json({ error: 'Auto-refresh failed' }, { status: 401 });
    }
  }

  if (!accessToken) {
    return NextResponse.json({ error: 'No access token' }, { status: 401 });
  }

  try {
    const [artistsRes, tracksRes] = await Promise.all([
      fetch('https://api.spotify.com/v1/me/top/artists?limit=6', { headers: { Authorization: `Bearer ${accessToken}` } }),
      fetch('https://api.spotify.com/v1/me/top/tracks?limit=8', { headers: { Authorization: `Bearer ${accessToken}` } }),
    ]);

    if (artistsRes.status === 401 || tracksRes.status === 401) {
      console.log('🎵 /top: Token expired, attempting refresh');
      try {
        const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/spotify/refresh`, {
          method: 'GET',
          headers: req.headers,
        });

        if (refreshRes.ok) {
          const newToken = req.cookies.get('spotify_access_token')?.value;
          if (newToken) {
            const [retryArtistsRes, retryTracksRes] = await Promise.all([
              fetch('https://api.spotify.com/v1/me/top/artists?limit=6', { headers: { Authorization: `Bearer ${newToken}` } }),
              fetch('https://api.spotify.com/v1/me/top/tracks?limit=8', { headers: { Authorization: `Bearer ${newToken}` } }),
            ]);

            if (retryArtistsRes.ok && retryTracksRes.ok) {
              const artists = await retryArtistsRes.json();
              const tracks = await retryTracksRes.json();
              return NextResponse.json({ artists: artists.items ?? [], tracks: tracks.items ?? [] });
            }
          }
        }
      } catch (err) {
        console.log('🎵 /top: Refresh retry failed:', err);
      }
      return NextResponse.json({ error: 'Token expired and refresh failed' }, { status: 401 });
    }

    if (!artistsRes.ok || !tracksRes.ok) {
      const a = await artistsRes.json().catch(() => ({}));
      const t = await tracksRes.json().catch(() => ({}));
      return NextResponse.json({ error: 'Failed to fetch top items', details: { artists: a, tracks: t } }, { status: 500 });
    }

    const artists = await artistsRes.json();
    const tracks = await tracksRes.json();

    return NextResponse.json({ artists: artists.items ?? [], tracks: tracks.items ?? [] });
  } catch (err) {
    return NextResponse.json({ error: 'Request failed', details: String(err) }, { status: 500 });
  }
}
