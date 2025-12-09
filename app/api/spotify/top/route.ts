import { NextResponse, NextRequest } from 'next/server';

// Cache for owner's top data
let cachedTopData: { artists: any[]; tracks: any[]; lastUpdated: number } | null = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour (top data doesn't change often)

export async function GET(req: NextRequest) {
  const accessToken = req.cookies.get('spotify_access_token')?.value;

  // If we have cached top data and it's recent, return it for all visitors
  if (cachedTopData && (Date.now() - cachedTopData.lastUpdated) < CACHE_DURATION) {
    return NextResponse.json({
      artists: cachedTopData.artists,
      tracks: cachedTopData.tracks,
      cached: true
    });
  }

  // Try to use owner's tokens if available
  if (!accessToken) {
    // Check if we have cached data to show to visitors
    if (cachedTopData) {
      return NextResponse.json({
        artists: cachedTopData.artists,
        tracks: cachedTopData.tracks,
        cached: true
      });
    }
    return NextResponse.json({ error: 'no_tokens' }, { status: 401 });
  }

  try {
    const [artistsRes, tracksRes] = await Promise.all([
      fetch('https://api.spotify.com/v1/me/top/artists?limit=6', { headers: { Authorization: `Bearer ${accessToken}` } }),
      fetch('https://api.spotify.com/v1/me/top/tracks?limit=8', { headers: { Authorization: `Bearer ${accessToken}` } }),
    ]);

    if (artistsRes.status === 401 || tracksRes.status === 401) {
      // If owner's tokens expired, try to use cached data
      if (cachedTopData) {
        return NextResponse.json({
          artists: cachedTopData.artists,
          tracks: cachedTopData.tracks,
          cached: true
        });
      }
      return NextResponse.json({ error: 'token_expired' }, { status: 401 });
    }

    if (!artistsRes.ok || !tracksRes.ok) {
      const a = await artistsRes.json().catch(() => ({}));
      const t = await tracksRes.json().catch(() => ({}));
      return NextResponse.json({ error: 'Failed to fetch top items', details: { artists: a, tracks: t } }, { status: 500 });
    }

    const artists = await artistsRes.json();
    const tracks = await tracksRes.json();

    // Cache the data for other visitors
    cachedTopData = {
      artists: artists.items ?? [],
      tracks: tracks.items ?? [],
      lastUpdated: Date.now()
    };

    return NextResponse.json({ artists: artists.items ?? [], tracks: tracks.items ?? [] });
  } catch (err) {
    return NextResponse.json({ error: 'Request failed', details: String(err) }, { status: 500 });
  }
}
