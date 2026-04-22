/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, Music, Volume2, Disc } from 'lucide-react';
import { Track, TRACKS } from '../types';

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play().catch(e => console.error("Audio play failed:", e));
    }
    setIsPlaying(!isPlaying);
  };

  const skipTrack = (direction: 'next' | 'prev') => {
    let nextIndex;
    if (direction === 'next') {
      nextIndex = (currentTrackIndex + 1) % TRACKS.length;
    } else {
      nextIndex = (currentTrackIndex - 1 + TRACKS.length) % TRACKS.length;
    }
    setCurrentTrackIndex(nextIndex);
    setProgress(0);
    // Auto play next track
    if (isPlaying) {
      setTimeout(() => audioRef.current?.play(), 100);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-neon-cyan/10 blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-neon-magenta/10 blur-3xl -z-10" />

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => skipTrack('next')}
      />

      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Album Art */}
        <div className="relative group">
          <motion.div
            key={currentTrack.id}
            initial={{ rotate: -10, opacity: 0, scale: 0.8 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            className="w-48 h-48 rounded-xl overflow-hidden shadow-2xl border-2 border-zinc-800 neon-shadow-cyan"
          >
            <img
              src={currentTrack.albumArt}
              alt={currentTrack.title}
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
            />
          </motion.div>
          {isPlaying && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              className="absolute -bottom-4 -right-4 w-12 h-12 bg-black rounded-full border-2 border-neon-cyan flex items-center justify-center"
            >
              <Disc className="w-6 h-6 text-neon-cyan" />
            </motion.div>
          )}
        </div>

        {/* Track Info & Controls */}
        <div className="flex-1 w-full space-y-6">
          <div>
            <div className="flex items-center gap-2 text-neon-cyan mb-1">
              <Music className="w-4 h-4" />
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Now Syncing</span>
            </div>
            <motion.h3
              key={`title-${currentTrack.id}`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-3xl font-bold tracking-tighter text-white"
            >
              {currentTrack.title}
            </motion.h3>
            <motion.p
              key={`artist-${currentTrack.id}`}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-zinc-400 font-mono text-sm"
            >
              {currentTrack.artist}
            </motion.p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                initial={false}
                animate={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r from-neon-cyan to-neon-magenta shadow-[0_0_8px_rgba(0,243,255,0.8)]"
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-zinc-500">
              <span>{audioRef.current ? formatTime(audioRef.current.currentTime) : '0:00'}</span>
              <span>{formatTime(currentTrack.duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button
                onClick={() => skipTrack('prev')}
                className="text-zinc-500 hover:text-neon-cyan transition-colors"
                id="music-prev"
              >
                <SkipBack className="w-6 h-6 fill-current" />
              </button>
              <button
                onClick={togglePlay}
                className="w-14 h-14 bg-white rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all neon-shadow-cyan"
                id="music-play-pause"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-black fill-current" />
                ) : (
                  <Play className="w-6 h-6 text-black fill-current ml-1" />
                )}
              </button>
              <button
                onClick={() => skipTrack('next')}
                className="text-zinc-500 hover:text-neon-cyan transition-colors"
                id="music-next"
              >
                <SkipForward className="w-6 h-6 fill-current" />
              </button>
            </div>
            <div className="flex items-center gap-2 text-zinc-500">
              <Volume2 className="w-4 h-4" />
              <div className="w-20 h-1 bg-zinc-800 rounded-full relative">
                <div className="absolute inset-0 w-2/3 bg-neon-cyan rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
