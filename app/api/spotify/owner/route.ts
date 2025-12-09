import { NextResponse, NextRequest } from 'next/server';

// In-memory storage for demo - in production use a database
let ownerTokens: { accessToken: string; refreshToken: string; expiresAt: number } | null = null;

export async function GET(req: NextRequest) {
  // Check if owner has authenticated
  if (!ownerTokens || Date.now() > ownerTokens.expiresAt) {
    // Try to refresh if we have a refresh token
    if (ownerTokens?.refreshToken) {
      try {
        const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/spotify/refresh`, {
          method: 'GET',
          headers: { 'Cookie': `spotify_refresh_token=${ownerTokens.refreshToken}` }
        });

        if (refreshRes.ok) {
          const newTokens = await refreshRes.json();
          ownerTokens = {
            accessToken: '', // Would need to get from cookies
            refreshToken: ownerTokens.refreshToken,
            expiresAt: Date.now() + (3600 * 1000) // 1 hour
          };
        } else {
          ownerTokens = null;
        }
      } catch (err) {
        ownerTokens = null;
      }
    }

    if (!ownerTokens) {
      return NextResponse.json({ error: 'no_owner_tokens' }, { status: 401 });
    }
  }

  // Fetch owner's current playing
  try {
    const nowRes = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: { Authorization: `Bearer ${ownerTokens.accessToken}` },
    });

    let now = null;
    if (nowRes.status === 200) {
      now = await nowRes.json();
    }

    return NextResponse.json({ now, isOwnerData: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch owner data' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { accessToken, refreshToken } = await req.json();

    if (!accessToken || !refreshToken) {
      return NextResponse.json({ error: 'Missing tokens' }, { status: 400 });
    }

    ownerTokens = {
      accessToken,
      refreshToken,
      expiresAt: Date.now() + (3600 * 1000) // 1 hour from now
    };

    return NextResponse.json({ success: true, message: 'Owner tokens stored' });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}