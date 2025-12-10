import { NextResponse, NextRequest } from 'next/server';
import { getValidAccessToken } from '@/lib/spotify-auth';

export async function GET(req: NextRequest) {
  const accessToken = await getValidAccessToken(req);

  if (!accessToken) {
    return NextResponse.json({ error: 'No access token available' }, { status: 401 });
  }

  return NextResponse.json({ access_token: accessToken });
}
