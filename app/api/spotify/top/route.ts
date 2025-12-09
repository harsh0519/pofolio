import { NextResponse, NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const accessToken = req.cookies.get('spotify_access_token')?.value;
  if (!accessToken) {
    return NextResponse.json({ error: 'No access token' }, { status: 401 });
  }

  try {
    const [artistsRes, tracksRes] = await Promise.all([
      fetch('https://api.spotify.com/v1/me/top/artists?limit=6', { headers: { Authorization: `Bearer ${accessToken}` } }),
      fetch('https://api.spotify.com/v1/me/top/tracks?limit=8', { headers: { Authorization: `Bearer ${accessToken}` } }),
    ]);

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
