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
    // Return demo data instead of 401 error
    return NextResponse.json({
      artists: [
        { name: "The Weeknd", images: [{ url: "https://i.scdn.co/image/ab6761610000e5eb214f3cf1cbe7139c1e26ffbb" }, { url: "https://i.scdn.co/image/ab67616100005174e5a079854e9ce459a3346a82" }, { url: "https://i.scdn.co/image/ab6761610000f178214f3cf1cbe7139c1e26ffbb" }], genres: ["pop", "r&b"] },
        { name: "Daft Punk", images: [{ url: "https://i.scdn.co/image/ab6761610000e5eb7da39dea0a72f581535fb11f" }, { url: "https://i.scdn.co/image/ab676161000051747da39dea0a72f581535fb11f" }, { url: "https://i.scdn.co/image/ab6761610000f1787da39dea0a72f581535fb11f" }], genres: ["electronic", "dance"] },
        { name: "Arctic Monkeys", images: [{ url: "https://i.scdn.co/image/ab6761610000e5eb7da39dea0a72f581535fb11f" }, { url: "https://i.scdn.co/image/ab676161000051747da39dea0a72f581535fb11f" }, { url: "https://i.scdn.co/image/ab6761610000f1787da39dea0a72f581535fb11f" }], genres: ["indie rock", "alternative"] },
        { name: "Billie Eilish", images: [{ url: "https://i.scdn.co/image/ab6761610000e5eb7da39dea0a72f581535fb11f" }, { url: "https://i.scdn.co/image/ab676161000051747da39dea0a72f581535fb11f" }, { url: "https://i.scdn.co/image/ab6761610000f1787da39dea0a72f581535fb11f" }], genres: ["pop", "electropop"] },
        { name: "Radiohead", images: [{ url: "https://i.scdn.co/image/ab6761610000e5eb7da39dea0a72f581535fb11f" }, { url: "https://i.scdn.co/image/ab676161000051747da39dea0a72f581535fb11f" }, { url: "https://i.scdn.co/image/ab6761610000f1787da39dea0a72f581535fb11f" }], genres: ["alternative rock", "art rock"] },
        { name: "Tame Impala", images: [{ url: "https://i.scdn.co/image/ab6761610000e5eb7da39dea0a72f581535fb11f" }, { url: "https://i.scdn.co/image/ab676161000051747da39dea0a72f581535fb11f" }, { url: "https://i.scdn.co/image/ab6761610000f1787da39dea0a72f581535fb11f" }], genres: ["psychedelic rock", "indie rock"] },
      ],
      tracks: [
        { name: "Blinding Lights", artists: [{ name: "The Weeknd" }], album: { images: [{ url: "https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36" }, { url: "https://i.scdn.co/image/ab67616d00001e028863bc11d2aa12b54f5aeb36" }, { url: "https://i.scdn.co/image/ab67616d000048518863bc11d2aa12b54f5aeb36" }] } },
        { name: "Get Lucky", artists: [{ name: "Daft Punk" }, { name: "Pharrell Williams" }], album: { images: [{ url: "https://i.scdn.co/image/ab67616d0000b2738b32b139981e79f2ebe005eb" }, { url: "https://i.scdn.co/image/ab67616d00001e028b32b139981e79f2ebe005eb" }, { url: "https://i.scdn.co/image/ab67616d000048518b32b139981e79f2ebe005eb" }] } },
        { name: "Do I Wanna Know?", artists: [{ name: "Arctic Monkeys" }], album: { images: [{ url: "https://i.scdn.co/image/ab67616d0000b2734ae1c4c5c45aabe565499163" }, { url: "https://i.scdn.co/image/ab67616d00001e024ae1c4c5c45aabe565499163" }, { url: "https://i.scdn.co/image/ab67616d000048514ae1c4c5c45aabe565499163" }] } },
        { name: "bad guy", artists: [{ name: "Billie Eilish" }], album: { images: [{ url: "https://i.scdn.co/image/ab67616d0000b27350a3147b4edd7701a876c6ce" }, { url: "https://i.scdn.co/image/ab67616d00001e0250a3147b4edd7701a876c6ce" }, { url: "https://i.scdn.co/image/ab67616d0000485150a3147b4edd7701a876c6ce" }] } },
        { name: "Creep", artists: [{ name: "Radiohead" }], album: { images: [{ url: "https://i.scdn.co/image/ab67616d0000b273c8b444df094279e70c0ed85d" }, { url: "https://i.scdn.co/image/ab67616d00001e02c8b444df094279e70c0ed85d" }, { url: "https://i.scdn.co/image/ab67616d00004851c8b444df094279e70c0ed85d" }] } },
        { name: "The Less I Know The Better", artists: [{ name: "Tame Impala" }], album: { images: [{ url: "https://i.scdn.co/image/ab67616d0000b2739e1cfc756886ac782e363d79" }, { url: "https://i.scdn.co/image/ab67616d00001e029e1cfc756886ac782e363d79" }, { url: "https://i.scdn.co/image/ab67616d000048519e1cfc756886ac782e363d79" }] } },
        { name: "Watermelon Sugar", artists: [{ name: "Harry Styles" }], album: { images: [{ url: "https://i.scdn.co/image/ab67616d0000b273adaa848e5c4e6b1b0e47cd92" }, { url: "https://i.scdn.co/image/ab67616d00001e02adaa848e5c4e6b1b0e47cd92" }, { url: "https://i.scdn.co/image/ab67616d00004851adaa848e5c4e6b1b0e47cd92" }] } },
        { name: "Levitating", artists: [{ name: "Dua Lipa" }], album: { images: [{ url: "https://i.scdn.co/image/ab67616d0000b273b98f116b2d27edc9fed85ddc" }, { url: "https://i.scdn.co/image/ab67616d00001e02b98f116b2d27edc9fed85ddc" }, { url: "https://i.scdn.co/image/ab67616d00004851b98f116b2d27edc9fed85ddc" }] } },
      ],
      demo: true
    });
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
      // Return demo data instead of 401 error
      return NextResponse.json({
        artists: [
          { name: "The Weeknd", images: [{ url: "https://i.scdn.co/image/ab6761610000e5eb214f3cf1cbe7139c1e26ffbb" }, { url: "https://i.scdn.co/image/ab67616100005174e5a079854e9ce459a3346a82" }, { url: "https://i.scdn.co/image/ab6761610000f178214f3cf1cbe7139c1e26ffbb" }], genres: ["pop", "r&b"] },
          { name: "Daft Punk", images: [{ url: "https://i.scdn.co/image/ab6761610000e5eb7da39dea0a72f581535fb11f" }, { url: "https://i.scdn.co/image/ab676161000051747da39dea0a72f581535fb11f" }, { url: "https://i.scdn.co/image/ab6761610000f1787da39dea0a72f581535fb11f" }], genres: ["electronic", "dance"] },
          { name: "Arctic Monkeys", images: [{ url: "https://i.scdn.co/image/ab6761610000e5eb7da39dea0a72f581535fb11f" }, { url: "https://i.scdn.co/image/ab676161000051747da39dea0a72f581535fb11f" }, { url: "https://i.scdn.co/image/ab6761610000f1787da39dea0a72f581535fb11f" }], genres: ["indie rock", "alternative"] },
          { name: "Billie Eilish", images: [{ url: "https://i.scdn.co/image/ab6761610000e5eb7da39dea0a72f581535fb11f" }, { url: "https://i.scdn.co/image/ab676161000051747da39dea0a72f581535fb11f" }, { url: "https://i.scdn.co/image/ab6761610000f1787da39dea0a72f581535fb11f" }], genres: ["pop", "electropop"] },
          { name: "Radiohead", images: [{ url: "https://i.scdn.co/image/ab6761610000e5eb7da39dea0a72f581535fb11f" }, { url: "https://i.scdn.co/image/ab676161000051747da39dea0a72f581535fb11f" }, { url: "https://i.scdn.co/image/ab6761610000f1787da39dea0a72f581535fb11f" }], genres: ["alternative rock", "art rock"] },
          { name: "Tame Impala", images: [{ url: "https://i.scdn.co/image/ab6761610000e5eb7da39dea0a72f581535fb11f" }, { url: "https://i.scdn.co/image/ab676161000051747da39dea0a72f581535fb11f" }, { url: "https://i.scdn.co/image/ab6761610000f1787da39dea0a72f581535fb11f" }], genres: ["psychedelic rock", "indie rock"] },
        ],
        tracks: [
          { name: "Blinding Lights", artists: [{ name: "The Weeknd" }], album: { images: [{ url: "https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36" }, { url: "https://i.scdn.co/image/ab67616d00001e028863bc11d2aa12b54f5aeb36" }, { url: "https://i.scdn.co/image/ab67616d000048518863bc11d2aa12b54f5aeb36" }] } },
          { name: "Get Lucky", artists: [{ name: "Daft Punk" }, { name: "Pharrell Williams" }], album: { images: [{ url: "https://i.scdn.co/image/ab67616d0000b2738b32b139981e79f2ebe005eb" }, { url: "https://i.scdn.co/image/ab67616d00001e028b32b139981e79f2ebe005eb" }, { url: "https://i.scdn.co/image/ab67616d000048518b32b139981e79f2ebe005eb" }] } },
          { name: "Do I Wanna Know?", artists: [{ name: "Arctic Monkeys" }], album: { images: [{ url: "https://i.scdn.co/image/ab67616d0000b2734ae1c4c5c45aabe565499163" }, { url: "https://i.scdn.co/image/ab67616d00001e024ae1c4c5c45aabe565499163" }, { url: "https://i.scdn.co/image/ab67616d000048514ae1c4c5c45aabe565499163" }] } },
          { name: "bad guy", artists: [{ name: "Billie Eilish" }], album: { images: [{ url: "https://i.scdn.co/image/ab67616d0000b27350a3147b4edd7701a876c6ce" }, { url: "https://i.scdn.co/image/ab67616d00001e0250a3147b4edd7701a876c6ce" }, { url: "https://i.scdn.co/image/ab67616d0000485150a3147b4edd7701a876c6ce" }] } },
          { name: "Creep", artists: [{ name: "Radiohead" }], album: { images: [{ url: "https://i.scdn.co/image/ab67616d0000b273c8b444df094279e70c0ed85d" }, { url: "https://i.scdn.co/image/ab67616d00001e02c8b444df094279e70c0ed85d" }, { url: "https://i.scdn.co/image/ab67616d00004851c8b444df094279e70c0ed85d" }] } },
          { name: "The Less I Know The Better", artists: [{ name: "Tame Impala" }], album: { images: [{ url: "https://i.scdn.co/image/ab67616d0000b2739e1cfc756886ac782e363d79" }, { url: "https://i.scdn.co/image/ab67616d00001e029e1cfc756886ac782e363d79" }, { url: "https://i.scdn.co/image/ab67616d000048519e1cfc756886ac782e363d79" }] } },
          { name: "Watermelon Sugar", artists: [{ name: "Harry Styles" }], album: { images: [{ url: "https://i.scdn.co/image/ab67616d0000b273adaa848e5c4e6b1b0e47cd92" }, { url: "https://i.scdn.co/image/ab67616d00001e02adaa848e5c4e6b1b0e47cd92" }, { url: "https://i.scdn.co/image/ab67616d00004851adaa848e5c4e6b1b0e47cd92" }] } },
          { name: "Levitating", artists: [{ name: "Dua Lipa" }], album: { images: [{ url: "https://i.scdn.co/image/ab67616d0000b273b98f116b2d27edc9fed85ddc" }, { url: "https://i.scdn.co/image/ab67616d00001e02b98f116b2d27edc9fed85ddc" }, { url: "https://i.scdn.co/image/ab67616d00004851b98f116b2d27edc9fed85ddc" }] } },
        ],
        demo: true
      });
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
