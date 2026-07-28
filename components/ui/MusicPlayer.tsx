'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Music } from 'lucide-react';

export const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState('/assets/audio/bgm.mp3.aac');
  const [trackTitle, setTrackTitle] = useState('Background Music');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Fetch active audio track dynamically from database
    fetch('/api/admin/data?t=' + Date.now())
      .then((res) => res.json())
      .then((data) => {
        const audioTracks = data.AUDIO_TRACKS || [];
        const activeTrack = audioTracks.find((t: any) => t.active);
        if (activeTrack && activeTrack.url) {
          setAudioUrl(activeTrack.url);
          if (activeTrack.title) setTrackTitle(activeTrack.title);
        }
      })
      .catch((err) => console.log('Audio track fetch error:', err));
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((e) => console.log('Audio play blocked:', e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.5;
      const handleEnded = () => setIsPlaying(false);
      audio.addEventListener('ended', handleEnded);
      return () => audio.removeEventListener('ended', handleEnded);
    }
  }, []);

  return (
    <div className="relative flex items-center">
      <audio ref={audioRef} src={audioUrl} loop preload="auto" />
      
      <button
        onClick={togglePlay}
        className={`group relative flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-300 ${
          isPlaying 
            ? 'bg-amber-500/20 border-amber-500/50 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]' 
            : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white hover:bg-white/10'
        }`}
        title={isPlaying ? `Pause: ${trackTitle}` : `Play: ${trackTitle}`}
      >
        {isPlaying && (
          <span className="absolute inset-0 rounded-full border border-amber-500 animate-ping opacity-25" />
        )}
        
        {isPlaying ? (
          <div className="flex items-center justify-center gap-[2px]">
            <div className="w-[2px] h-3 bg-amber-500 rounded-full animate-pulse" style={{ animationDuration: '0.6s' }} />
            <div className="w-[2px] h-4 bg-amber-500 rounded-full animate-pulse" style={{ animationDuration: '0.8s', animationDelay: '0.2s' }} />
            <div className="w-[2px] h-2 bg-amber-500 rounded-full animate-pulse" style={{ animationDuration: '0.7s', animationDelay: '0.4s' }} />
          </div>
        ) : (
          <Music className="w-3.5 h-3.5 transition-transform group-hover:scale-110 group-hover:text-amber-500" />
        )}
      </button>
    </div>
  );
};
