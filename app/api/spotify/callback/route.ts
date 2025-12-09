import { NextResponse, NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');

  console.log('🎵 Spotify Callback - Received params:', { code: !!code, state, error });

  if (error) {
    console.log('🎵 Spotify Callback - Error:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || '/'}?spotify_error=${error}`);
  }

  if (!code) {
    console.log('🎵 Spotify Callback - No code received');
    return NextResponse.json({ error: 'Missing code' }, { status: 400 });
  }

  if (!code) {
    return NextResponse.json({ error: 'Missing code' }, { status: 400 });
  }

  // optional state check
  if (state && storedState && state !== storedState) {
    return NextResponse.json({ error: 'State mismatch', receivedState: state, storedState }, { status: 400 });
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI || `${process.env.NEXT_PUBLIC_BASE_URL}/api/spotify/callback`;

  console.log('🎵 Spotify Callback - Client ID:', !!clientId);
  console.log('🎵 Spotify Callback - Client Secret:', !!clientSecret);
  console.log('🎵 Spotify Callback - Redirect URI:', redirectUri);

  if (!clientId || !clientSecret) {
    console.log('🎵 Spotify Callback - ERROR: Missing credentials');
    return NextResponse.json({ error: 'Missing Spotify client credentials' }, { status: 500 });
  }

  const body = new URLSearchParams();
  body.set('grant_type', 'authorization_code');
  body.set('code', code);
  body.set('redirect_uri', redirectUri);
  body.set('client_id', clientId);
  body.set('client_secret', clientSecret);

  const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  console.log('🎵 Spotify Callback - Token exchange response status:', tokenRes.status);

  const tokenData = await tokenRes.json();

  if (!tokenRes.ok) {
    console.log('🎵 Spotify Callback - Token exchange failed:', tokenData);
    return NextResponse.json({ error: 'Failed to exchange token', details: tokenData }, { status: 500 });
  }

  console.log('🎵 Spotify Callback - Token exchange successful');
  console.log('🎵 Spotify Callback - Access token received:', !!tokenData.access_token);
  console.log('🎵 Spotify Callback - Refresh token received:', !!tokenData.refresh_token);

  const accessToken = tokenData.access_token;
  const refreshToken = tokenData.refresh_token;
  const expiresIn = tokenData.expires_in || 3600;

  const debug = url.searchParams.get('debug');

  // cookie options: make explicit sameSite and secure so cookies are visible in dev
  const cookieOptions = {
    httpOnly: true,
    path: '/',
    maxAge: expiresIn,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
  };

  // If debug mode, return token data so developer can inspect the exchange result
  if (debug === '1') {
    const json = NextResponse.json({ tokenData, redirectUri, clientId, note: 'debug mode — cookies will also be set' });
    json.cookies.set('spotify_access_token', accessToken, cookieOptions);
    if (refreshToken) json.cookies.set('spotify_refresh_token', refreshToken, { ...cookieOptions, maxAge: 60 * 60 * 24 * 30 });
    json.cookies.delete('spotify_auth_state');
    return json;
  }

  // set cookies and redirect to home (or you can redirect to a specific path)
  const res = NextResponse.redirect(process.env.NEXT_PUBLIC_BASE_URL || '/');
  res.cookies.set('spotify_access_token', accessToken, cookieOptions);
  if (refreshToken) {
    // refresh tokens are long lived; set a long expiry (30 days)
    res.cookies.set('spotify_refresh_token', refreshToken, { ...cookieOptions, maxAge: 60 * 60 * 24 * 30 });
  }
  // clear state
  res.cookies.delete('spotify_auth_state');

  return res;
}
