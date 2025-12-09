Spotify integration and local dev notes
====================================

1) Rotate your Spotify client secret immediately if it was exposed.

2) Local dev with HTTPS
- You can use ngrok to provide an HTTPS URL for local development. Set `NEXT_PUBLIC_BASE_URL` to the ngrok HTTPS URL and add the redirect URI in the Spotify dashboard.

3) Environment
- Copy `.env.example` -> `.env.local` and fill in your `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET`.
- Do NOT commit `.env.local`.

4) Quick checks
- Run `npm run check-env` to ensure required env vars are present.

5) Running
- Start dev: `npm run dev`
