'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import SnakeGame from '@/components/games/SnakeGame';
import TicTacToe from '@/components/games/TicTacToe';
import PatternGame from '@/components/games/PatternGame';

const GAMES = [
  { id: 'snake', label: 'Neural Snake' },
  { id: 'beat-ai', label: 'Beat the AI' },
  { id: 'pattern', label: 'Pattern Recall' },
] as const;

type GameId = (typeof GAMES)[number]['id'];

export default function GameBreak() {
  const [game, setGame] = useState<GameId>('snake');

  return (
    <section id="play" className="py-24 md:py-28 bg-void relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="flex items-center gap-4 mb-4"
        >
          <span className="text-blood font-display text-2xl font-bold">06</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-fg">Off the clock</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-blood/50 to-transparent max-w-[200px]" />
        </motion.div>
        <p className="text-fg/55 mb-8 max-w-xl">
          Made it this far? Take a break — pick a game.
        </p>

        {/* game switcher */}
        <div className="inline-flex gap-1.5 p-1.5 mb-8 rounded-xl border border-void-600 bg-void-800/40">
          {GAMES.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setGame(g.id)}
              data-cursor
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                game === g.id ? 'bg-blood text-white' : 'text-fg/60 hover:text-fg'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>

        {game === 'snake' && <SnakeGame />}
        {game === 'beat-ai' && <TicTacToe />}
        {game === 'pattern' && <PatternGame />}
      </div>
    </section>
  );
}
