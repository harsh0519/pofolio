import { NextResponse, NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI || `${process.env.NEXT_PUBLIC_BASE_URL}/api/spotify/callback`;

  console.log('🎵 Spotify Auth - Starting authentication');
  console.log('🎵 Spotify Auth - Client ID:', !!clientId);
  console.log('🎵 Spotify Auth - Redirect URI:', redirectUri);

  if (!clientId) {
    console.log('🎵 Spotify Auth - ERROR: Missing SPOTIFY_CLIENT_ID');
    return NextResponse.json({ error: 'Missing SPOTIFY_CLIENT_ID env var' }, { status: 500 });
  }
  const scopes = [
    'user-read-playback-state',
    'user-read-currently-playing',
    'user-read-private',
    'user-read-email',
    'user-top-read',
    'streaming',
  ].join(' ');

  if (!clientId) {
    return NextResponse.json({ error: 'Missing SPOTIFY_CLIENT_ID env var' }, { status: 500 });
  }

  // simple state token
  const state = Math.random().toString(36).slice(2, 12);

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId!,
    scope: scopes,
    redirect_uri: redirectUri,
    state,
  });

  const authUrl = `https://accounts.spotify.com/authorize?${params.toString()}`;

  console.log('🎵 Spotify Auth - Generated auth URL:', authUrl.replace(/response_type=code&client_id=[^&]+&scope=[^&]+&redirect_uri=([^&]+)&state=[^&]+/, 'response_type=code&client_id=***&scope=***&redirect_uri=$1&state=***'));

  // allow debug mode to inspect the exact URL Spotify will receive
  const url = new URL(req.url);
  const debug = url.searchParams.get('debug');

  const cookieOptions = {
    httpOnly: true,
    path: '/',
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
  };

  if (debug === '1') {
    const json = NextResponse.json({ authUrl, redirectUri, params: Object.fromEntries(params) });
    // still set state cookie for parity
    json.cookies.set('spotify_auth_state', state, cookieOptions);
    return json;
  }

  const res = NextResponse.redirect(authUrl);
  // store state in a cookie briefly
  res.cookies.set('spotify_auth_state', state, cookieOptions);
  return res;
}
