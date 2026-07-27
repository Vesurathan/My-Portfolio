'use client';

import { useEffect, useRef, useState } from 'react';

const PADS = [
  { base: '#5c0f24', lit: '#ff5a72', freq: 277 },
  { base: '#8a1538', lit: '#ff2d55', freq: 330 },
  { base: '#a51d33', lit: '#ff1744', freq: 392 },
  { base: '#c41e3a', lit: '#ff7a90', freq: 466 },
];
const HS_KEY = 'ashura-simon-high';

type Status = 'idle' | 'showing' | 'input' | 'over';

/** Pattern Recall — repeat the growing sequence of pads. */
export default function PatternGame() {
  const [status, setStatus] = useState<Status>('idle');
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [high, setHigh] = useState(0);
  const [active, setActive] = useState<number | null>(null);

  const seq = useRef<number[]>([]);
  const inputIdx = useRef(0);
  const statusRef = useRef<Status>('idle');
  statusRef.current = status;
  const highRef = useRef(0);
  const timers = useRef<number[]>([]);
  const audio = useRef<AudioContext | null>(null);

  useEffect(() => {
    const h = Number(localStorage.getItem(HS_KEY) || 0);
    highRef.current = h;
    setHigh(h);
    return () => timers.current.forEach((t) => clearTimeout(t));
  }, []);

  function beep(freq: number) {
    const ctx = audio.current;
    if (!ctx) return;
    try {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = freq;
      g.gain.value = 0.05;
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2);
      o.stop(ctx.currentTime + 0.22);
    } catch { /* ignore */ }
  }

  function flash(i: number) {
    setActive(i);
    beep(PADS[i].freq);
    const t = window.setTimeout(() => setActive(null), 260);
    timers.current.push(t);
  }

  function showSequence() {
    setStatus('showing');
    let delay = 520;
    seq.current.forEach((i) => {
      const t = window.setTimeout(() => flash(i), delay);
      timers.current.push(t);
      delay += 540;
    });
    const done = window.setTimeout(() => {
      inputIdx.current = 0;
      setStatus('input');
    }, delay + 40);
    timers.current.push(done);
  }

  function nextRound() {
    seq.current = [...seq.current, (Math.random() * 4) | 0];
    setRound(seq.current.length);
    showSequence();
  }

  function start() {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
    if (!audio.current) {
      try {
        audio.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      } catch { /* ignore */ }
    }
    audio.current?.resume();
    seq.current = [];
    inputIdx.current = 0;
    setRound(0);
    setScore(0);
    const t = window.setTimeout(nextRound, 350);
    timers.current.push(t);
  }

  function padClick(i: number) {
    if (statusRef.current !== 'input') return;
    flash(i);
    if (seq.current[inputIdx.current] === i) {
      inputIdx.current++;
      if (inputIdx.current === seq.current.length) {
        const s = seq.current.length;
        setScore(s);
        if (s > highRef.current) {
          highRef.current = s;
          setHigh(s);
          try { localStorage.setItem(HS_KEY, String(s)); } catch { /* ignore */ }
        }
        setStatus('showing');
        const t = window.setTimeout(nextRound, 750);
        timers.current.push(t);
      }
    } else {
      setStatus('over');
    }
  }

  const message =
    status === 'showing' ? 'Watch the pattern…' :
    status === 'input' ? 'Your turn — repeat it' :
    status === 'over' ? 'Wrong pad!' : 'Repeat the growing sequence';

  return (
    <div className="grid lg:grid-cols-[minmax(0,1fr)_260px] gap-8 items-start">
      <div className="relative rounded-2xl border border-white/10 overflow-hidden bg-[#0b0b0b] p-5 sm:p-8 flex flex-col items-center">
        <div className="flex items-center justify-between w-full max-w-[360px] mb-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-blood">pattern recall</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg/40">round {round}</span>
        </div>

        <div className="relative grid grid-cols-2 gap-3 w-full max-w-[360px] aspect-square">
          {PADS.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => padClick(i)}
              data-cursor
              aria-label={`Pad ${i + 1}`}
              className="rounded-2xl border border-white/10 transition-all duration-150"
              style={{
                background: active === i ? p.lit : p.base,
                boxShadow: active === i ? `0 0 34px ${p.lit}` : 'none',
                transform: active === i ? 'scale(0.97)' : 'scale(1)',
                cursor: status === 'input' ? 'pointer' : 'default',
              }}
            />
          ))}

          {(status === 'idle' || status === 'over') && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-black/65 backdrop-blur-[2px] rounded-2xl px-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-blood mb-2">
                {status === 'over' ? 'sequence broken' : 'pattern recall'}
              </p>
              <h3 className="font-display text-3xl font-bold text-white mb-1">
                {status === 'over' ? 'Game Over' : 'Recall the pattern'}
              </h3>
              {status === 'over' ? (
                <p className="text-white/70 text-sm mb-5">
                  Reached round <span className="text-blood font-bold">{score}</span>
                  {score >= high && score > 0 && <span className="text-blood-glow"> · new best!</span>}
                </p>
              ) : (
                <p className="text-white/60 text-sm mb-5">Watch, then repeat — it grows each round</p>
              )}
              <button
                type="button"
                onClick={start}
                data-cursor
                className="px-7 py-3 bg-blood text-white font-semibold rounded-sm hover:bg-blood-600 transition-colors shadow-blood-glow-sm hover:shadow-blood-glow"
              >
                {status === 'over' ? 'Play again' : 'Start'}
              </button>
            </div>
          )}
        </div>

        <p className="mt-5 text-sm font-medium text-white/80 h-5">{message}</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-void-600 bg-void-800/40 p-4">
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-fg/40">Round</div>
            <div className="font-display text-3xl font-bold text-fg tabular-nums">{score}</div>
          </div>
          <div className="rounded-xl border border-void-600 bg-void-800/40 p-4">
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-fg/40">Best</div>
            <div className="font-display text-3xl font-bold text-blood tabular-nums">{high}</div>
          </div>
        </div>
        <p className="text-xs text-fg/40 leading-relaxed">
          The AI flashes a sequence of pads — repeat it back in order. Each round adds one more step.
          How many can you hold in memory?
        </p>
        <p className="text-[11px] text-fg/30">Sound on for audio cues 🔊</p>
      </div>
    </div>
  );
}
