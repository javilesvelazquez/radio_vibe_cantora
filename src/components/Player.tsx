import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, Music, SkipForward, Disc } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../DataContext';
import { NowPlaying } from '../types';

const DEFAULT_NOW_PLAYING: NowPlaying = {
  title: "Sintonizando...",
  artist: "Cantora Radio",
  album: "En Vivo",
  coverUrl: "https://picsum.photos/seed/cantora-radio/200/200",
  streamUrl: "" 
};

export const Player: React.FC = () => {
  const { streamUrl } = useData();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [nowPlaying, setNowPlaying] = useState<NowPlaying>({ ...DEFAULT_NOW_PLAYING, streamUrl });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [audioError, setAudioError] = useState<string | null>(null);

  useEffect(() => {
    setNowPlaying(prev => ({ ...prev, streamUrl }));
    setAudioError(null);
    
    // Force reload audio element when URL changes
    if (audioRef.current) {
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.error("Error playing stream after URL change:", err);
          setIsPlaying(false);
          setAudioError("Error al conectar con el nuevo stream.");
        });
      }
    }
  }, [streamUrl]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Metadata Fetching Logic
  useEffect(() => {
    if (!streamUrl) return;

    let isMounted = true;
    let pollInterval: NodeJS.Timeout | null = null;

    // 1. Check for Zeno.fm (SSE)
    const zenoMatch = streamUrl.match(/stream\.zeno\.fm\/([a-zA-Z0-9]+)/);
    if (zenoMatch) {
      const mountId = zenoMatch[1];
      const sseUrl = `https://api.zeno.fm/mounts/metadata/subscribe/${mountId}`;
      let eventSource = new EventSource(sseUrl);
      
      eventSource.onmessage = async (event) => {
        if (!isMounted) return;
        try {
          const data = JSON.parse(event.data);
          if (data.streamTitle) {
            await updateMetadata(data.streamTitle, data.artwork);
          }
        } catch (e) { console.error("Error parsing Zeno metadata:", e); }
      };

      return () => {
        isMounted = false;
        eventSource.close();
      };
    } 
    
    // 2. Generic Icecast/Aloncast Polling
    const fetchIcecastMetadata = async () => {
      try {
        const url = new URL(streamUrl);
        const baseUrl = `${url.protocol}//${url.host}`;
        
        // Aloncast specific cover endpoint
        const aloncastCover = `${baseUrl}/playingart.php`;
        
        // Common Icecast/Aloncast metadata endpoints
        const endpoints = [
          `${baseUrl}/status-json.xsl`,
          `${baseUrl}/stats?format=json`,
          `${baseUrl}/7.html`
        ];

        let foundMetadata = false;
        for (const endpoint of endpoints) {
          try {
            const response = await fetch(endpoint);
            if (!response.ok) continue;

            if (endpoint.endsWith('.xsl') || endpoint.includes('format=json')) {
              const data = await response.json();
              const source = data.icestats?.source;
              const currentSource = Array.isArray(source) ? source[0] : source;
              
              if (currentSource?.title) {
                // Try Aloncast cover first, then stream metadata, then iTunes
                await updateMetadata(currentSource.title, aloncastCover);
                foundMetadata = true;
                return;
              }
            } else if (endpoint.endsWith('7.html')) {
              const text = await response.text();
              const songTitle = text.split(',')[6];
              if (songTitle) {
                await updateMetadata(songTitle, aloncastCover);
                foundMetadata = true;
                return;
              }
            }
          } catch (e) { }
        }

        // If no metadata found but we have a stream, at least try to refresh the cover
        if (!foundMetadata && isPlaying) {
          setNowPlaying(prev => ({ ...prev, coverUrl: `${aloncastCover}?t=${Date.now()}` }));
        }
      } catch (e) {
        console.error("Metadata fetch error:", e);
      }
    };

    const fetchArtwork = async (artist: string, title: string) => {
      // Clean terms for better search results (remove (Live), [Remix], etc.)
      const clean = (str: string) => str.replace(/\(.*\)|\[.*\]/g, '').trim();
      const searchTerm = `${clean(artist)} ${clean(title)}`;
      
      try {
        // 1. Try iTunes API
        const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(searchTerm)}&media=music&limit=1`);
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          return {
            url: data.results[0].artworkUrl100.replace('100x100', '600x600'),
            album: data.results[0].collectionName
          };
        }
      } catch (e) {
        console.error("iTunes API error:", e);
      }
      return null;
    };

    const updateMetadata = async (rawTitle: string, aloncastArtUrl?: string) => {
      if (!isMounted) return;
      
      const parts = rawTitle.split(' - ');
      const artist = (parts.length > 1 ? parts[0] : "Cantora Radio").trim();
      const title = (parts.length > 1 ? parts.slice(1).join(' - ') : parts[0]).trim();
      
      let finalArtwork = null;
      let albumName = 'Cantora Radio';

      // 1. Try iTunes first for high-quality album art and album name
      if (artist !== "Cantora Radio") {
        const itunesData = await fetchArtwork(artist, title);
        if (itunesData) {
          finalArtwork = itunesData.url;
          albumName = itunesData.album;
        }
      }

      // 2. Fallback to Aloncast's playingart.php if iTunes fails
      if (!finalArtwork && aloncastArtUrl) {
        finalArtwork = `${aloncastArtUrl}?t=${Date.now()}`;
      }

      // 3. Last fallback: Dynamic placeholder
      const fallbackArt = `https://picsum.photos/seed/${encodeURIComponent(rawTitle)}/600/600`;

      setNowPlaying(prev => ({
        ...prev,
        artist,
        title,
        album: albumName,
        coverUrl: finalArtwork || fallbackArt
      }));

      // Update Media Session API (OS controls)
      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title,
          artist,
          album: albumName,
          artwork: [{ 
            src: finalArtwork || fallbackArt, 
            sizes: '512x512', 
            type: 'image/png' 
          }]
        });
      }
    };

    fetchIcecastMetadata();
    pollInterval = setInterval(fetchIcecastMetadata, 15000); // Poll every 15s

    return () => {
      isMounted = false;
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [streamUrl]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        if (!nowPlaying.streamUrl) {
          setAudioError("No hay URL de streaming configurada.");
          return;
        }
        
        // Check for mixed content
        if (window.location.protocol === 'https:' && nowPlaying.streamUrl.startsWith('http:')) {
          setAudioError("Error de seguridad: El stream es HTTP y el sitio es HTTPS. Usa una URL HTTPS.");
          return;
        }

        setAudioError(null);
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(err => {
          console.error("Error playing stream:", err);
          setAudioError("Error al reproducir. Verifica que la URL sea válida y HTTPS.");
          setIsPlaying(false);
        });
      }
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-lg border-t border-white/10 text-white p-4 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Now Playing Info */}
        <div className="flex items-center gap-6 flex-1 min-w-0">
          <div className="relative w-16 h-16 flex-shrink-0">
            {/* Record Player Base */}
            <div className="absolute inset-0 bg-zinc-800/50 rounded-xl border border-white/5 shadow-inner" />
            
            {/* Vinyl Record Animation */}
            <motion.div 
              animate={{ 
                rotate: isPlaying ? 360 : 0,
                scale: isPlaying ? 0.9 : 0.85
              }}
              transition={{ 
                rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                scale: { type: "spring", stiffness: 100 }
              }}
              className="absolute inset-0 m-auto w-14 h-14 bg-zinc-900 rounded-full border-2 border-zinc-800 flex items-center justify-center overflow-hidden shadow-2xl z-10"
            >
              {/* Record Grooves */}
              <div className="absolute inset-0 opacity-30" style={{ 
                background: 'repeating-radial-gradient(circle, transparent, transparent 1px, #fff 2px, transparent 3px)' 
              }} />
              
              {/* Vinyl Label (Generic) */}
              <div className="relative w-5 h-5 rounded-full bg-emerald-500 border border-emerald-400/50 flex items-center justify-center shadow-inner">
                <div className="w-1 h-1 bg-black rounded-full" />
              </div>
            </motion.div>

            {/* Tonearm (Needle) */}
            <motion.div 
              initial={{ rotate: -45 }}
              animate={{ rotate: isPlaying ? -10 : -45 }}
              transition={{ type: "spring", stiffness: 50, damping: 15 }}
              style={{ originX: "80%", originY: "20%" }}
              className="absolute top-1 right-1 w-8 h-1 bg-zinc-400 rounded-full z-20 shadow-lg"
            >
              {/* Needle Head */}
              <div className="absolute left-0 top-0 w-2 h-2 bg-zinc-300 rounded-sm -translate-y-1/4" />
              {/* Pivot Point */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-zinc-500 rounded-full border border-zinc-600" />
            </motion.div>
          </div>
          
          <div className="min-w-0">
            <h4 className="font-medium truncate text-sm sm:text-base">{nowPlaying.title}</h4>
            <p className="text-xs sm:text-sm text-white/60 truncate">{nowPlaying.artist} — {nowPlaying.album}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-1 flex-1">
          <div className="flex items-center gap-6">
            <button 
              onClick={togglePlay}
              className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 transition-transform"
            >
              {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
            </button>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-[10px] text-white/40 uppercase tracking-widest font-mono">
            {audioError ? (
              <span className="text-red-400">{audioError}</span>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                En Vivo: Cantora Radio
              </>
            )}
          </div>
        </div>

        {/* Volume & Extra */}
        <div className="hidden md:flex items-center justify-end gap-4 flex-1">
          <div className="flex items-center gap-2 w-32">
            <Volume2 size={18} className="text-white/60" />
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
            />
          </div>
        </div>

        <audio 
          key={nowPlaying.streamUrl}
          ref={audioRef} 
          src={nowPlaying.streamUrl} 
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      </div>
    </div>
  );
};
