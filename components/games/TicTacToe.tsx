'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

type Cell = 'X' | 'O' | null;
const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];
const TALLY_KEY = 'ashura-ttt';

function getWinner(b: Cell[]): { who: Cell; line: number[] | null } {
  for (const l of LINES) {
    const [a, c, d] = l;
    if (b[a] && b[a] === b[c] && b[a] === b[d]) return { who: b[a], line: l };
  }
  return { who: null, line: null };
}
const isFull = (b: Cell[]) => b.every((c) => c);

// AI = 'O' (maximising). Human = 'X'. depth favours faster wins / slower losses.
function minimax(b: Cell[], depth: number, isMax: boolean): number {
  const { who } = getWinner(b);
  if (who === 'O') return 10 - depth;
  if (who === 'X') return depth - 10;
  if (isFull(b)) return 0;
  if (isMax) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) if (!b[i]) { b[i] = 'O'; best = Math.max(best, minimax(b, depth + 1, false)); b[i] = null; }
    return best;
  }
  let best = Infinity;
  for (let i = 0; i < 9; i++) if (!b[i]) { b[i] = 'X'; best = Math.min(best, minimax(b, depth + 1, true)); b[i] = null; }
  return best;
}
function bestMove(b: Cell[]): number {
  let best = -Infinity;
  let move = -1;
  for (let i = 0; i < 9; i++) if (!b[i]) { b[i] = 'O'; const s = minimax(b, 0, false); b[i] = null; if (s > best) { best = s; move = i; } }
  return move;
}
function randomMove(b: Cell[]): number {
  const e: number[] = [];
  b.forEach((c, i) => { if (!c) e.push(i); });
  return e[(Math.random() * e.length) | 0];
}

type Result = 'X' | 'O' | 'draw' | null;

export default function TicTacToe() {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [result, setResult] = useState<Result>(null);
  const [line, setLine] = useState<number[] | null>(null);
  const [thinking, setThinking] = useState(false);
  const [mode, setMode] = useState<'unbeatable' | 'rookie'>('unbeatable');
  const [tally, setTally] = useState({ you: 0, ai: 0, draw: 0 });
  const modeRef = useRef(mode);
  modeRef.current = mode;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(TALLY_KEY);
      if (raw) setTally(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  function saveTally(t: { you: number; ai: number; draw: number }) {
    setTally(t);
    try { localStorage.setItem(TALLY_KEY, JSON.stringify(t)); } catch { /* ignore */ }
  }

  function finish(b: Cell[]): boolean {
    const { who, line: wl } = getWinner(b);
    if (who) {
      setResult(who);
      setLine(wl);
      saveTally({ ...tally, you: tally.you + (who === 'X' ? 1 : 0), ai: tally.ai + (who === 'O' ? 1 : 0), draw: tally.draw });
      return true;
    }
    if (isFull(b)) {
      setResult('draw');
      saveTally({ ...tally, draw: tally.draw + 1 });
      return true;
    }
    return false;
  }

  function play(i: number) {
    if (result || thinking || board[i]) return;
    const nb = board.slice();
    nb[i] = 'X';
    setBoard(nb);
    if (finish(nb)) return;
    setThinking(true);
    window.setTimeout(() => {
      const move = modeRef.current === 'rookie' ? randomMove(nb) : bestMove(nb);
      const ab = nb.slice();
      if (move >= 0) ab[move] = 'O';
      setBoard(ab);
      finish(ab);
      setThinking(false);
    }, 340);
  }

  function reset() {
    setBoard(Array(9).fill(null));
    setResult(null);
    setLine(null);
    setThinking(false);
  }

  const message =
    result === 'O' ? 'The AI wins. Told you.' :
    result === 'X' ? 'You win! (Rookie mode, though.)' :
    result === 'draw' ? "Draw. That's the best you'll get." :
    thinking ? 'AI is thinking…' : 'Your move — you play X.';

  return (
    <div className="grid lg:grid-cols-[minmax(0,1fr)_260px] gap-8 items-start">
      <div className="relative rounded-2xl border border-white/10 overflow-hidden bg-[#0b0b0b] p-5 sm:p-6 flex flex-col items-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-blood mb-4">
          {mode === 'unbeatable' ? 'minimax · unbeatable' : 'rookie · beatable'}
        </p>

        <div className="grid grid-cols-3 gap-2.5 w-full max-w-[360px] aspect-square">
          {board.map((c, i) => {
            const win = line?.includes(i);
            return (
              <button
                key={i}
                type="button"
                onClick={() => play(i)}
                data-cursor
                disabled={!!c || !!result || thinking}
                aria-label={`Cell ${i + 1}${c ? `, ${c}` : ''}`}
                className={`relative rounded-xl border flex items-center justify-center font-display font-bold text-4xl sm:text-5xl transition-colors ${
                  win ? 'border-blood bg-blood/20' : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06]'
                } ${!c && !result && !thinking ? 'cursor-pointer' : 'cursor-default'}`}
              >
                {c && (
                  <motion.span
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 520, damping: 24 }}
                    style={{ color: c === 'X' ? '#ff3355' : '#ff1744', textShadow: c === 'O' ? '0 0 16px rgba(255,23,68,0.6)' : 'none' }}
                  >
                    {c}
                  </motion.span>
                )}
              </button>
            );
          })}
        </div>

        <p className="mt-5 text-sm font-medium text-white/80 h-5">{message}</p>

        {result && (
          <button
            type="button"
            onClick={reset}
            data-cursor
            className="mt-4 px-7 py-2.5 bg-blood text-white font-semibold rounded-sm hover:bg-blood-600 transition-colors shadow-blood-glow-sm hover:shadow-blood-glow"
          >
            Play again
          </button>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {/* difficulty */}
        <div className="rounded-xl border border-void-600 bg-void-800/40 p-3">
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-fg/40 mb-2 px-1">Difficulty</div>
          <div className="flex gap-1.5">
            {(['unbeatable', 'rookie'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => { setMode(m); reset(); }}
                data-cursor
                className={`flex-1 py-2 rounded-lg text-xs font-semibold capitalize transition-colors ${
                  mode === m ? 'bg-blood text-white' : 'text-fg/60 hover:text-fg bg-void-700/40'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* scoreboard */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { k: 'You', v: tally.you, cls: 'text-fg' },
            { k: 'Draws', v: tally.draw, cls: 'text-fg/60' },
            { k: 'AI', v: tally.ai, cls: 'text-blood' },
          ].map((s) => (
            <div key={s.k} className="rounded-xl border border-void-600 bg-void-800/40 p-3 text-center">
              <div className="text-[10px] font-mono uppercase tracking-[0.15em] text-fg/40">{s.k}</div>
              <div className={`font-display text-2xl font-bold tabular-nums ${s.cls}`}>{s.v}</div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => saveTally({ you: 0, ai: 0, draw: 0 })}
          data-cursor
          className="rounded-lg border border-void-600 bg-void-800/50 text-fg/70 py-2 text-xs font-medium hover:border-blood/50 hover:text-blood transition-colors"
        >
          Reset record
        </button>

        <p className="text-xs text-fg/40 leading-relaxed">
          You&apos;re <span className="text-blood">X</span> and move first. On <b>Unbeatable</b>, the minimax AI never
          loses — a draw is the best you can force. Think you can crack it?
        </p>
      </div>
    </div>
  );
}
