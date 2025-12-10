import { NextRequest, NextResponse } from 'next/server';

export async function refreshAccessToken(req: NextRequest): Promise<string | null> {
  const refreshToken = req.cookies.get('spotify_refresh_token')?.value;
  if (!refreshToken) return null;

  try {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) return null;

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
    if (!tokenRes.ok) return null;

    const accessToken = tokenData.access_token;
    const expiresIn = tokenData.expires_in || 3600;

    // Update the access token cookie
    const res = NextResponse.json({ ok: true });
    res.cookies.set('spotify_access_token', accessToken, {
      httpOnly: true,
      path: '/',
      maxAge: expiresIn,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    });

    if (tokenData.refresh_token) {
      res.cookies.set('spotify_refresh_token', tokenData.refresh_token, {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 180, // 6 months
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
      });
    }

    return accessToken;
  } catch (err) {
    return null;
  }
}

export async function getValidAccessToken(req: NextRequest): Promise<string | null> {
  let accessToken: string | undefined | null = req.cookies.get('spotify_access_token')?.value;

  // If no access token, try to refresh it
  if (!accessToken) {
    accessToken = await refreshAccessToken(req);
  }

  return accessToken || null;
}