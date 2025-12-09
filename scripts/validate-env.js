const required = [
  'SPOTIFY_CLIENT_ID',
  'SPOTIFY_CLIENT_SECRET',
  'NEXT_PUBLIC_BASE_URL'
];

const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  console.error('Missing required environment variables:', missing.join(', '));
  process.exitCode = 2;
} else {
  console.log('All required environment variables are present.');
}
