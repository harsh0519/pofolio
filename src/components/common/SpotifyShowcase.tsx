'use client';
import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { motion } from 'framer-motion';

type Profile = {
  display_name?: string;
  images?: { url: string }[];
  product?: string;
};

export default function SpotifyShowcase() {
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [now, setNow] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [playerReady, setPlayerReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const playerRef = useRef<any | null>(null);
  const [topArtists, setTopArtists] = useState<any[]>([]);
  const [topTracks, setTopTracks] = useState<any[]>([]);
  const cardRefs = useRef<any[]>([]);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    // NOW PLAYING PANEL ENTRY 3D LIFT
    gsap.fromTo(
      panelRef.current,
      { rotateX: 15, rotateY: -15, opacity: 0, y: 40 },
      {
        rotateX: 0,
        rotateY: 0,
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out"
      }
    );

    // FLOATING TRACK CARDS
    (cardRefs.current || []).forEach((el, i) => {
      gsap.to(el, {
        y: "+=12",
        rotateY: "+=6",
        duration: 2 + i * 0.15,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    });

    // MOUSE PARALLAX 3D
    const handleMove = (e: any) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.width / 2) / 35;
      const y = (e.clientY - rect.height / 2) / 35;

      gsap.to(panelRef.current, {
        rotateX: y,
        rotateY: -x,
        duration: 0.6,
        ease: "power2.out",
      });

      gsap.to(cardRefs.current, {
        rotateY: -x * 0.4,
        rotateX: y * 0.4,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.05,
      });
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  async function fetchMe(retry = true) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/spotify/me');
      if (res.status === 401 && retry) {
        // try refresh
        await fetch('/api/spotify/refresh');
        return fetchMe(false);
      }

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setError(json?.error || 'Failed to load');
        setConnected(false);
        setLoading(false);
        return;
      }

      const data = await res.json();
      setProfile(data.profile ?? null);
      setNow(data.now ?? null);
      setConnected(true);
    } catch (err: any) {
      setError(err.message || String(err));
      setConnected(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMe();
    fetchTop();

    // Set up live updates every 30 seconds
    const liveUpdateInterval = setInterval(() => {
      fetchCurrentPlaying();
    }, 30000);

    return () => clearInterval(liveUpdateInterval);
  }, []);

  // Separate function for live current playing updates
  async function fetchCurrentPlaying() {
    console.log('🎵 fetchCurrentPlaying: Starting...');
    try {
      const res = await fetch('/api/spotify/me');
      console.log('🎵 fetchCurrentPlaying: Response status:', res.status);

      if (res.ok) {
        const data = await res.json();
        console.log('🎵 fetchCurrentPlaying: Data received:', data);
        setNow(data.now ?? null);
        setProfile(data.profile ?? null);
        setConnected(true);
        console.log('🎵 fetchCurrentPlaying: Connected set to true');
      } else if (res.status === 401) {
        console.log('🎵 fetchCurrentPlaying: 401 - trying refresh');
        // Try to refresh token
        const refreshRes = await fetch('/api/spotify/refresh');
        console.log('🎵 fetchCurrentPlaying: Refresh response:', refreshRes.status);
        if (refreshRes.ok) {
          // Retry after refresh
          setTimeout(fetchCurrentPlaying, 1000);
        } else {
          setConnected(false);
          console.log('🎵 fetchCurrentPlaying: Refresh failed');
        }
      } else {
        setConnected(false);
        console.log('🎵 fetchCurrentPlaying: Other error status:', res.status);
      }
    } catch (err) {
      console.log('🎵 fetchCurrentPlaying: Error:', err);
      setConnected(false);
      // Silently fail for live updates
    }
  }

  // fetch user's top artists/tracks
  async function fetchTop(retry = true) {
    try {
      const res = await fetch('/api/spotify/top');
      if (res.status === 401 && retry) {
        await fetch('/api/spotify/refresh');
        return fetchTop(false);
      }

      if (!res.ok) return;
      const data = await res.json();
      setTopArtists(data.artists ?? []);
      setTopTracks(data.tracks ?? []);
    } catch (e) {
      // ignore
    }
  }

  // Spotify Web Playback SDK init
  useEffect(() => {
    if (!connected) return;

    const loadSDK = () => {
      if ((window as any).Spotify) return onSDKReady();

      const script = document.createElement('script');
      script.src = 'https://sdk.scdn.co/spotify-player.js';
      script.async = true;
      document.body.appendChild(script);

      (window as any).onSpotifyWebPlaybackSDKReady = onSDKReady;
    };

    const onSDKReady = async () => {
      const Player = (window as any).Spotify?.Player;
      if (!Player) return;

      const player = new Player({
        name: 'Portfolio Player',
        getOAuthToken: (cb: (token: string) => void) => {
          // fetch temporary access token to initialize player
          fetch('/api/spotify/token')
            .then((r) => r.json())
            .then((j) => cb(j.access_token))
            .catch(() => cb(''));
        },
      });

      playerRef.current = player;

      player.addListener('initialization_error', ({ message }: any) => console.error(message));
      player.addListener('authentication_error', ({ message }: any) => console.error('auth error', message));
      player.addListener('account_error', ({ message }: any) => console.error('account error', message));
      player.addListener('playback_error', ({ message }: any) => console.error('playback error', message));

      player.addListener('ready', ({ device_id }: { device_id: string }) => {
        setDeviceId(device_id);
        setPlayerReady(true);
        fetch('/api/spotify/token')
          .then((r) => r.json())
          .then(async (j) => {
            if (!j.access_token) return;
            await fetch('https://api.spotify.com/v1/me/player', {
              method: 'PUT',
              headers: { Authorization: `Bearer ${j.access_token}`, 'Content-Type': 'application/json' },
              body: JSON.stringify({ device_ids: [device_id], play: false }),
            });
          })
          .catch(console.error);
      });

      player.addListener('player_state_changed', (state: any) => {
        if (!state) {
          setIsPlaying(false);
          setNow(null);
          return;
        }
        setIsPlaying(!state.paused);
        setNow(state.track_window?.current_track ? { item: state.track_window.current_track, progress_ms: state.position } : null);
      });

      await player.connect();
    };

    loadSDK();

    return () => {
      try {
        playerRef.current?.disconnect();
      } catch (e) { }
    };
  }, [connected]);

  // when connected, also fetch top lists
  useEffect(() => {
    if (!connected) return;
    fetchTop();
  }, [connected]);

  const handlePlay = async () => {
    const player = playerRef.current;
    if (!player) return;
    try {
      await player.resume();
    } catch (e) {
      // Some players might not support resume; try transfer + start playback via API
      const tokenRes = await fetch('/api/spotify/token');
      const t = await tokenRes.json();
      if (t.access_token && deviceId) {
        await fetch('https://api.spotify.com/v1/me/player/play', {
          method: 'PUT',
          headers: { Authorization: `Bearer ${t.access_token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ device_ids: [deviceId], play: true }),
        });
      }
    }
  };

  const handlePause = async () => {
    const player = playerRef.current;
    if (!player) return;
    try {
      await player.pause();
    } catch (e) {
      const tokenRes = await fetch('/api/spotify/token');
      const t = await tokenRes.json();
      if (t.access_token) {
        await fetch('https://api.spotify.com/v1/me/player/pause', { method: 'PUT', headers: { Authorization: `Bearer ${t.access_token}` } });
      }
    }
  };

  const handleNext = async () => {
    const player = playerRef.current;
    if (!player) return;
    try { await player.nextTrack(); } catch (e) {
      const tokenRes = await fetch('/api/spotify/token');
      const t = await tokenRes.json();
      if (t.access_token) await fetch('https://api.spotify.com/v1/me/player/next', { method: 'POST', headers: { Authorization: `Bearer ${t.access_token}` } });
    }
  };

  const handlePrevious = async () => {
    const player = playerRef.current;
    if (!player) return;
    try { await player.previousTrack(); } catch (e) {
      const tokenRes = await fetch('/api/spotify/token');
      const t = await tokenRes.json();
      if (t.access_token) await fetch('https://api.spotify.com/v1/me/player/previous', { method: 'POST', headers: { Authorization: `Bearer ${t.access_token}` } });
    }
  };

  const handlePlayTrack = async (uri: string) => {
    if (!uri) return;
    const tokenRes = await fetch('/api/spotify/token');
    const t = await tokenRes.json();
    if (!t.access_token) return;
    if (!deviceId) {
      // try to play without device (Spotify will pick user's active device)
      await fetch('https://api.spotify.com/v1/me/player/play', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${t.access_token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ uris: [uri] }),
      });
      return;
    }

    await fetch('https://api.spotify.com/v1/me/player/play', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${t.access_token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ device_ids: [deviceId], uris: [uri], play: true }),
    });
  };

  const handleSurprise = () => {
    if (!topTracks || topTracks.length === 0) return;
    const idx = Math.floor(Math.random() * topTracks.length);
    const track = topTracks[idx];
    if (track?.uri) handlePlayTrack(track.uri);
  };

  return (
    <div
      ref={sectionRef}
      className="w-full overflow-hidden py-20 relative bg-transparent"
    >
      {/* Heading with playful animation */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="mb-16 px-6 sm:px-10 justify-center text-center"
      >
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white mb-3">
          <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 bg-clip-text text-transparent animate-pulse">
            Spotify
          </span>
          {" "}Player
        </h1>
        <p className="text-gray-400 text-lg">Want a moment to think? Hit play and drift</p>
      </motion.div>

      {/* ===== MAIN LAYOUT ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

        {/* Left Side - Top Tracks */}
        {connected && topTracks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold text-white mb-4">Your Top Tracks</h3>
            {topTracks.slice(0, 5).map((track: any, index: number) => (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ x: 8, scale: 1.02 }}
                className="group flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 
                         hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
                onClick={() => handlePlayTrack(track.uri)}
              >
                {/* Track number */}
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 border border-green-400/30 
                              flex items-center justify-center text-xs font-bold text-green-400">
                  {index + 1}
                </div>

                {/* Album art */}
                <div className="flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden border border-white/20">
                  {track.album?.images?.[2] && (
                    <Image
                      src={track.album.images[2].url}
                      width={40}
                      height={40}
                      alt={track.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                  )}
                </div>

                {/* Track info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium text-sm truncate group-hover:text-green-400 transition-colors">
                    {track.name}
                  </h4>
                  <p className="text-gray-400 text-xs truncate">
                    {track.artists?.map((a: any) => a.name).join(', ')}
                  </p>
                </div>

                {/* Play indicator */}
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 border border-green-400/30 
                           flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <span className="text-green-400 text-xs">▶</span>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Center - Player Panel */}
        <motion.div
          ref={panelRef}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-1"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Album Art - Rotating Disk */}
            <motion.div
              whileHover={{ scale: 1.05, rotateY: 8 }}
              transition={{ duration: 0.3 }}
              className="relative group md:order-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/30 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
              <div className="relative w-full aspect-square rounded-full bg-white/10 overflow-hidden border border-white/20 shadow-2xl">
                {now?.item?.album?.images?.[0] ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="w-full h-full relative"
                  >
                    <Image
                      src={now.item.album.images[0].url}
                      fill
                      alt="current"
                      className="object-cover group-hover:scale-110 transition-transform duration-500 rounded-full"
                    />
                    {/* Vinyl record center hole */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 bg-black rounded-full border-4 border-white/20 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white/40 rounded-full"></div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  // Demo album art when not connected
                  <motion.div
                    animate={{ rotate: connected ? 0 : 360 }}
                    transition={{ duration: connected ? 0 : 3, repeat: connected ? 0 : Infinity, ease: "linear" }}
                    className="w-full h-full relative flex items-center justify-center"
                  >
                    <div className="text-6xl">🎵</div>
                    {!connected && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 bg-black rounded-full border-4 border-white/20 flex items-center justify-center">
                          <div className="w-2 h-2 bg-white/40 rounded-full"></div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>
            </motion.div>

            {/* Track Info & Progress */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col justify-center gap-4 md:col-span-2 md:order-2"
            >
            <div>
              <div className="text-xs text-green-400 font-semibold uppercase tracking-widest mb-2">
                Now Playing
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                {now?.item?.name ?? (connected ? "Nothing Playing" : "Live Music Feed")}
              </h2>
              <p className="text-gray-400 text-base mt-2">
                {now?.item?.artists ? (now.item.artists || [])
                  .map((a: any) => a.name)
                  .join(", ") : (connected ? "Unknown Artist" : "Portfolio owner's current track")}
              </p>
            </div>

            {/* Progress Bar - Show demo when not connected */}
            {(now?.item || !connected) && (
              <div className="space-y-2">
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 rounded-full"
                    animate={!connected ? { width: ["0%", "30%", "60%", "100%"] } : {}}
                    transition={!connected ? { duration: 4, repeat: Infinity, ease: "linear" } : { duration: 0.3 }}
                    style={{
                      width: connected && now?.progress_ms && now?.item?.duration_ms
                        ? `${Math.round((now.progress_ms / now.item.duration_ms) * 100)}%`
                        : (!connected ? "30%" : "0%"),
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>
                    {connected && now?.progress_ms
                      ? Math.floor((now.progress_ms || 0) / 1000 / 60) + ":" + String(Math.floor(((now.progress_ms || 0) / 1000) % 60)).padStart(2, '0')
                      : (!connected ? "1:23" : "0:00")}
                  </span>
                  <span>
                    {connected && now?.item?.duration_ms
                      ? Math.floor((now.item.duration_ms || 0) / 1000 / 60) + ":" + String(Math.floor(((now.item.duration_ms || 0) / 1000) % 60)).padStart(2, '0')
                      : (!connected ? "3:45" : "0:00")}
                  </span>
                </div>
              </div>
            )}

            {/* Controls - Show demo controls when not connected */}
            {(now?.item || !connected) && (
              <div className="flex gap-3 items-center">
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={connected ? handlePrevious : undefined}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-white/20 to-white/10 
                           border border-white/30 flex items-center justify-center text-white 
                           hover:from-white/40 hover:to-white/20 transition-all disabled:opacity-50"
                  disabled={!connected}
                >
                  ◀
                </motion.button>

                {!connected ? (
                  <motion.button
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 
                             text-black font-bold flex items-center justify-center shadow-lg"
                  >
                    ▶
                  </motion.button>
                ) : (isPlaying ? (
                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePause}
                    className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 
                             text-black font-bold flex items-center justify-center shadow-lg 
                             hover:shadow-green-500/50 transition-all"
                  >
                    ❚❚
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePlay}
                    className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 
                             text-black font-bold flex items-center justify-center shadow-lg 
                             hover:shadow-green-500/50 transition-all"
                  >
                    ▶
                  </motion.button>
                ))}

                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={connected ? handleNext : undefined}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-white/20 to-white/10 
                           border border-white/30 flex items-center justify-center text-white 
                           hover:from-white/40 hover:to-white/20 transition-all disabled:opacity-50"
                  disabled={!connected}
                >
                  ▶
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={connected ? handleSurprise : undefined}
                  className="ml-auto px-4 py-2 text-sm rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20
                           border border-purple-400/30 text-white font-semibold
                           hover:from-purple-500/40 hover:to-pink-500/40 transition-all disabled:opacity-50"
                  disabled={!connected}
                >
                  🎲 Surprise
                </motion.button>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>

        {/* Right Side - More Top Tracks */}
        {connected && topTracks.length > 5 && (
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold text-white mb-4">More Favorites</h3>
            {topTracks.slice(5, 10).map((track: any, index: number) => (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ x: -8, scale: 1.02 }}
                className="group flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 
                         hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
                onClick={() => handlePlayTrack(track.uri)}
              >
                {/* Track number */}
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 border border-green-400/30 
                              flex items-center justify-center text-xs font-bold text-green-400">
                  {index + 6}
                </div>

                {/* Album art */}
                <div className="flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden border border-white/20">
                  {track.album?.images?.[2] && (
                    <Image
                      src={track.album.images[2].url}
                      width={40}
                      height={40}
                      alt={track.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                  )}
                </div>

                {/* Track info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium text-sm truncate group-hover:text-green-400 transition-colors">
                    {track.name}
                  </h4>
                  <p className="text-gray-400 text-xs truncate">
                    {track.artists?.map((a: any) => a.name).join(', ')}
                  </p>
                </div>

                {/* Play indicator */}
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 border border-green-400/30 
                           flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <span className="text-green-400 text-xs">▶</span>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        )}

      </div>

      {/* Empty State - Show when no data available */}
      {!connected && !now && topTracks.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-10"
        >
          <div className="text-center px-6">
            <div className="text-6xl mb-4">🎧</div>
            <h3 className="text-2xl font-bold text-white mb-2">Live Spotify Showcase</h3>
            <p className="text-gray-400 mb-4">Portfolio owner: Connect your Spotify to show live music activity</p>
            <div className="mb-4 p-3 bg-red-500/20 border border-red-400/30 rounded-lg">
              <p className="text-red-400 text-sm">⚠️ Authentication required for live data</p>
            </div>
            <button
              onClick={() => window.location.href = '/api/spotify/auth'}
              className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full transition-all"
            >
              Connect Spotify
            </button>
          </div>
        </motion.div>
      )}

      {/* Live Status Indicator */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-4 right-4 z-20 flex items-center gap-2"
      >
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
          connected
            ? 'bg-green-500/20 border border-green-400/30 text-green-400'
            : 'bg-red-500/20 border border-red-400/30 text-red-400'
        }`}>
          <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
          <span>{connected ? 'Live' : 'Demo'}</span>
        </div>

        {/* Debug Info */}
        <div className="text-xs text-gray-500 bg-black/50 px-2 py-1 rounded flex flex-col items-start">
          <div>Now: {now ? '✅' : '❌'} | Profile: {profile ? '✅' : '❌'}</div>
          <button
            onClick={async () => {
              try {
                const res = await fetch('/api/spotify/me');
                console.log('Manual check - Status:', res.status);
                if (res.ok) {
                  const data = await res.json();
                  console.log('Manual check - Data:', data);
                } else {
                  console.log('Manual check - Error response');
                }
              } catch (err) {
                console.log('Manual check - Error:', err);
              }
            }}
            className="mt-1 px-2 py-1 bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 text-xs rounded"
          >
            Check Auth
          </button>
        </div>
      </motion.div>
    </div>
  );


}
