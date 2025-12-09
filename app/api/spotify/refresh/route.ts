import { NextResponse, NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const refreshToken = req.cookies.get('spotify_refresh_token')?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: 'No refresh token' }, { status: 401 });
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: 'Missing Spotify client credentials' }, { status: 500 });
  }

  const body = new URLSearchParams();
  body.set('grant_type', 'refresh_token');
  body.set('refresh_token', refreshToken);
  body.set('client_id', clientId);
  body.set('client_secret', clientSecret);

  const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  const tokenData = await tokenRes.json();
  if (!tokenRes.ok) {
    return NextResponse.json({ error: 'Failed to refresh token', details: tokenData }, { status: 500 });
  }

  const accessToken = tokenData.access_token;
  const expiresIn = tokenData.expires_in || 3600;

  const res = NextResponse.json({ ok: true, expiresIn });
  res.cookies.set('spotify_access_token', accessToken, { httpOnly: true, path: '/', maxAge: expiresIn });
  return res;
}
