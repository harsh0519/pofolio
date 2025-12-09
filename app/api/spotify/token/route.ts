import { NextResponse, NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const accessToken = req.cookies.get('spotify_access_token')?.value;
  if (!accessToken) {
    return NextResponse.json({ error: 'No access token' }, { status: 401 });
  }

  return NextResponse.json({ access_token: accessToken });
}
