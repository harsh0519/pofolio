import { NextResponse, NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const storedState = req.cookies.get('spotify_auth_state')?.value ?? null;
  return NextResponse.json({ storedState });
}
