/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Point, Direction, GRID_SIZE, INITIAL_SNAKE } from '../types';
import { Trophy, RefreshCw, Play } from 'lucide-react';

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
}

export const SnakeGame: React.FC<SnakeGameProps> = ({ onScoreChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(Direction.UP);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);
  const speedRef = useRef(150);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(p => p.x === newFood.x && p.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood({ x: 5, y: 5 });
    setDirection(Direction.UP);
    setIsGameOver(false);
    setIsPaused(false);
    setScore(0);
    onScoreChange(0);
    speedRef.current = 150;
  };

  const moveSnake = useCallback(() => {
    if (isPaused || isGameOver) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case Direction.UP: newHead.y -= 1; break;
        case Direction.DOWN: newHead.y += 1; break;
        case Direction.LEFT: newHead.x -= 1; break;
        case Direction.RIGHT: newHead.x += 1; break;
      }

      // Check wall collisions
      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE
      ) {
        setIsGameOver(true);
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some(p => p.x === newHead.x && p.y === newHead.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        const newScore = score + 10;
        setScore(newScore);
        onScoreChange(newScore);
        setFood(generateFood(newSnake));
        speedRef.current = Math.max(80, 150 - Math.floor(newScore / 50) * 10);
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, score, generateFood, onScoreChange]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== Direction.DOWN) setDirection(Direction.UP); break;
        case 'ArrowDown': if (direction !== Direction.UP) setDirection(Direction.DOWN); break;
        case 'ArrowLeft': if (direction !== Direction.RIGHT) setDirection(Direction.LEFT); break;
        case 'ArrowRight': if (direction !== Direction.LEFT) setDirection(Direction.RIGHT); break;
        case ' ': setIsPaused(p => !p); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (timestamp - lastUpdateTimeRef.current > speedRef.current) {
        moveSnake();
        lastUpdateTimeRef.current = timestamp;
      }
      gameLoopRef.current = requestAnimationFrame(animate);
    };

    gameLoopRef.current = requestAnimationFrame(animate);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [moveSnake]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellWidth = canvas.width / GRID_SIZE;
    const cellHeight = canvas.height / GRID_SIZE;

    // Clear canvas
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Grid
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellWidth, 0);
      ctx.lineTo(i * cellWidth, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellHeight);
      ctx.lineTo(canvas.width, i * cellHeight);
      ctx.stroke();
    }

    // Draw Snake
    snake.forEach((p, index) => {
      ctx.fillStyle = index === 0 ? '#00f3ff' : '#00a8b1';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#00f3ff';
      ctx.fillRect(p.x * cellWidth + 1, p.y * cellHeight + 1, cellWidth - 2, cellHeight - 2);
    });

    // Draw Food
    ctx.fillStyle = '#ff00ff';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff00ff';
    ctx.beginPath();
    ctx.arc(
      food.x * cellWidth + cellWidth / 2,
      food.y * cellHeight + cellHeight / 2,
      cellWidth / 2 - 3,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Reset shadow for next frame
    ctx.shadowBlur = 0;
  }, [snake, food]);

  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-cyan to-neon-magenta rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
      <div className="relative bg-zinc-950 rounded-xl overflow-hidden shadow-2xl border border-zinc-800">
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          className="max-w-full h-auto aspect-square"
        />
        
        <AnimatePresence>
          {isGameOver && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center"
            >
              <Trophy className="w-16 h-16 text-neon-magenta mb-4 drop-shadow-[0_0_10px_rgba(255,0,255,0.8)]" />
              <h2 className="text-4xl font-bold text-white mb-2 tracking-tighter">GAME OVER</h2>
              <p className="text-zinc-400 mb-6 font-mono text-sm uppercase tracking-widest">Final Rhythm Score: {score}</p>
              <button
                onClick={resetGame}
                className="flex items-center gap-2 bg-neon-cyan text-black px-6 py-3 rounded-full font-bold hover:neon-shadow-cyan transition-all active:scale-95"
              >
                <RefreshCw className="w-5 h-5" />
                REBOOT SEQUENCE
              </button>
            </motion.div>
          )}

          {isPaused && !isGameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center"
            >
              <button
                onClick={() => setIsPaused(false)}
                className="group relative flex items-center justify-center w-20 h-20 bg-neon-cyan/20 border-2 border-neon-cyan rounded-full hover:bg-neon-cyan/40 transition-all cursor-pointer"
              >
                <Play className="w-10 h-10 text-neon-cyan fill-neon-cyan" />
                <div className="absolute inset-0 rounded-full animate-ping bg-neon-cyan/20" />
              </button>
              <p className="mt-4 text-neon-cyan font-mono text-xs uppercase tracking-[0.3em] font-bold animate-pulse">Press SPACE or Click to Sync</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
