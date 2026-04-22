/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { Gamepad2, Headphones, Activity } from 'lucide-react';

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const handleScoreChange = (newScore: number) => {
    setScore(newScore);
    if (newScore > highScore) setHighScore(newScore);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-neon-cyan/5 blur-[120px] rounded-full" />
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-neon-magenta/5 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50 contrast-150" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-6 flex justify-between items-center border-b border-zinc-900/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-neon-cyan rounded-lg flex items-center justify-center neon-shadow-cyan">
            <Activity className="w-6 h-6 text-black" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-white uppercase italic">
              Neon Rhythm <span className="text-neon-cyan">Snake</span>
            </h1>
            <p className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">System v4.2.0 // Active</p>
          </div>
        </div>

        <div className="flex gap-8">
          <div className="text-right">
            <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Live Score</p>
            <p className="text-2xl font-bold text-neon-cyan font-mono tabular-nums text-glow-cyan">
              {score.toString().padStart(4, '0')}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">High Record</p>
            <p className="text-2xl font-bold text-neon-magenta font-mono tabular-nums text-glow-magenta">
              {highScore.toString().padStart(4, '0')}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10 flex flex-col items-center justify-center p-4 md:p-8 gap-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_500px] gap-8 w-full items-start">
          
          {/* Left Side: Instructions & Player */}
          <div className="flex flex-col gap-6 order-2 xl:order-1">
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
              <h2 className="flex items-center gap-2 text-white font-bold mb-4 uppercase tracking-tighter">
                <Gamepad2 className="w-5 h-5 text-neon-cyan" />
                Control Schema
              </h2>
              <div className="grid grid-cols-2 gap-4 text-xs font-mono text-zinc-400">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-zinc-800 rounded text-neon-cyan border border-neon-cyan/30">ARROWS</span>
                  <span>MOVEMENT</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-zinc-800 rounded text-neon-cyan border border-neon-cyan/30">SPACE</span>
                  <span>SYNC/PAUSE</span>
                </div>
              </div>
            </div>

            <MusicPlayer />

            <div className="hidden xl:flex bg-zinc-900/20 border border-zinc-800/50 rounded-2xl p-8 flex-col items-center justify-center text-center gap-4">
              <Headphones className="w-12 h-12 text-zinc-800" />
              <p className="text-zinc-600 text-sm italic font-serif">
                "The rhythm of the machine is the heartbeat of the grid."
              </p>
            </div>
          </div>

          {/* Right Side: Snake Canvas */}
          <div className="flex flex-col items-center order-1 xl:order-2">
            <SnakeGame onScoreChange={handleScoreChange} />
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mt-6 text-neon-cyan/50 font-mono text-[10px] uppercase tracking-[0.4em]"
            >
              Hardware Link Established // Data Flowing
            </motion.p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6 flex justify-center border-t border-zinc-900/50">
        <p className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest">
          &copy; 2026 AI-GEN SYTHWAVE INC // BUILT WITH PULSE ENGINE
        </p>
      </footer>
    </div>
  );
}
