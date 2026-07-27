'use client';

import { useEffect, useRef, useState } from 'react';

type P = { x: number; y: number };
const COLS = 21;
const ROWS = 14;
const HS_KEY = 'ashura-snake-high';

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Neural Snake — collect data nodes, don't bite yourself. */
export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [status, setStatus] = useState<'idle' | 'playing' | 'over'>('idle');
  const [score, setScore] = useState(0);
  const [high, setHigh] = useState(0);

  const snake = useRef<P[]>([{ x: 8, y: 7 }, { x: 7, y: 7 }, { x: 6, y: 7 }]);
  const dir = useRef<P>({ x: 1, y: 0 });
  const nextDir = useRef<P>({ x: 1, y: 0 });
  const food = useRef<P>({ x: 14, y: 7 });
  const speed = useRef(150);
  const acc = useRef(0);
  const last = useRef(0);
  const raf = useRef(0);
  const scoreRef = useRef(0);
  const highRef = useRef(0);
  const statusRef = useRef<'idle' | 'playing' | 'over'>('idle');
  statusRef.current = status;
  const touchStart = useRef<P | null>(null);

  useEffect(() => {
    const h = Number(localStorage.getItem(HS_KEY) || 0);
    highRef.current = h;
    setHigh(h);
  }, []);

  function placeFood() {
    for (;;) {
      const f = { x: (Math.random() * COLS) | 0, y: (Math.random() * ROWS) | 0 };
      if (!snake.current.some((s) => s.x === f.x && s.y === f.y)) {
        food.current = f;
        return;
      }
    }
  }

  function start() {
    snake.current = [{ x: 8, y: 7 }, { x: 7, y: 7 }, { x: 6, y: 7 }];
    dir.current = { x: 1, y: 0 };
    nextDir.current = { x: 1, y: 0 };
    speed.current = 150;
    acc.current = 0;
    last.current = 0;
    scoreRef.current = 0;
    setScore(0);
    placeFood();
    setStatus('playing');
  }

  function setDir(d: P) {
    const cur = dir.current;
    if (d.x === -cur.x && d.y === -cur.y) return;
    nextDir.current = d;
  }

  useEffect(() => {
    const map: Record<string, P> = {
      arrowup: { x: 0, y: -1 }, w: { x: 0, y: -1 },
      arrowdown: { x: 0, y: 1 }, s: { x: 0, y: 1 },
      arrowleft: { x: -1, y: 0 }, a: { x: -1, y: 0 },
      arrowright: { x: 1, y: 0 }, d: { x: 1, y: 0 },
    };
    const onKey = (e: KeyboardEvent) => {
      const m = map[e.key.toLowerCase()];
      if (m && statusRef.current === 'playing') {
        setDir(m);
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let cell = 0;

    const fit = () => {
      const w = cv.clientWidth;
      cell = Math.floor(w / COLS);
      cv.style.height = `${cell * ROWS}px`;
      cv.width = COLS * cell * dpr;
      cv.height = ROWS * cell * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    fit();
    window.addEventListener('resize', fit);

    const gameOver = () => {
      setStatus('over');
      if (scoreRef.current > highRef.current) {
        highRef.current = scoreRef.current;
        setHigh(scoreRef.current);
        try { localStorage.setItem(HS_KEY, String(scoreRef.current)); } catch { /* ignore */ }
      }
    };

    const step = () => {
      dir.current = nextDir.current;
      const head = snake.current[0];
      const nh = { x: head.x + dir.current.x, y: head.y + dir.current.y };
      if (nh.x < 0 || nh.x >= COLS || nh.y < 0 || nh.y >= ROWS) return gameOver();
      if (snake.current.some((s) => s.x === nh.x && s.y === nh.y)) return gameOver();
      snake.current.unshift(nh);
      if (nh.x === food.current.x && nh.y === food.current.y) {
        scoreRef.current += 1;
        setScore(scoreRef.current);
        if (speed.current > 70) speed.current -= 4;
        placeFood();
      } else {
        snake.current.pop();
      }
    };

    const draw = () => {
      const w = COLS * cell;
      const h = ROWS * cell;
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = 'rgba(196,30,58,0.07)';
      ctx.lineWidth = 1;
      for (let x = 0; x <= COLS; x++) {
        ctx.beginPath();
        ctx.moveTo(x * cell, 0);
        ctx.lineTo(x * cell, h);
        ctx.stroke();
      }
      for (let y = 0; y <= ROWS; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * cell);
        ctx.lineTo(w, y * cell);
        ctx.stroke();
      }
      const f = food.current;
      ctx.fillStyle = '#ff1744';
      ctx.shadowColor = '#ff1744';
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(f.x * cell + cell / 2, f.y * cell + cell / 2, cell * 0.3, 0, 6.283);
      ctx.fill();
      ctx.shadowBlur = 0;
      const len = snake.current.length;
      snake.current.forEach((s, i) => {
        ctx.fillStyle = i === 0 ? '#ff3355' : `rgba(196,30,58,${Math.max(0.35, 1 - i / (len + 4))})`;
        const pad = cell * 0.12;
        roundRect(ctx, s.x * cell + pad, s.y * cell + pad, cell - 2 * pad, cell - 2 * pad, Math.max(2, cell * 0.18));
        ctx.fill();
      });
    };

    const loop = (t: number) => {
      if (statusRef.current === 'playing') {
        if (!last.current) last.current = t;
        acc.current += t - last.current;
        last.current = t;
        let guard = 0;
        while (acc.current >= speed.current && guard < 5) {
          step();
          acc.current -= speed.current;
          guard++;
        }
      } else {
        last.current = 0;
      }
      draw();
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener('resize', fit);
    };
  }, []);

  function onTouchStart(e: React.TouchEvent) {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  }
  function onTouchMove(e: React.TouchEvent) {
    if (!touchStart.current || statusRef.current !== 'playing') return;
    const t = e.touches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    if (Math.abs(dx) < 18 && Math.abs(dy) < 18) return;
    if (Math.abs(dx) > Math.abs(dy)) setDir({ x: dx > 0 ? 1 : -1, y: 0 });
    else setDir({ x: 0, y: dy > 0 ? 1 : -1 });
    touchStart.current = { x: t.clientX, y: t.clientY };
    e.preventDefault();
  }

  const DPAD: { d: P; label: string; cls: string }[] = [
    { d: { x: 0, y: -1 }, label: '↑', cls: 'col-start-2 row-start-1' },
    { d: { x: -1, y: 0 }, label: '←', cls: 'col-start-1 row-start-2' },
    { d: { x: 1, y: 0 }, label: '→', cls: 'col-start-3 row-start-2' },
    { d: { x: 0, y: 1 }, label: '↓', cls: 'col-start-2 row-start-2' },
  ];

  return (
    <div className="grid lg:grid-cols-[minmax(0,1fr)_260px] gap-8 items-start">
      <div className="relative rounded-2xl border border-white/10 overflow-hidden bg-[#0b0b0b]">
        <canvas
          ref={canvasRef}
          className="block w-full touch-none"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          aria-label="Neural Snake game board"
        />
        {status !== 'playing' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-black/55 backdrop-blur-[2px] px-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-blood mb-2">
              {status === 'over' ? 'connection lost' : 'neural snake'}
            </p>
            <h3 className="font-display text-3xl font-bold text-white mb-1">
              {status === 'over' ? 'Game Over' : 'Collect the data'}
            </h3>
            {status === 'over' && (
              <p className="text-white/70 text-sm mb-5">
                Score <span className="text-blood font-bold">{score}</span>
                {score >= high && score > 0 && <span className="text-blood-glow"> · new best!</span>}
              </p>
            )}
            {status === 'idle' && <p className="text-white/60 text-sm mb-5">Arrow keys / WASD · swipe on mobile</p>}
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

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-void-600 bg-void-800/40 p-4">
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-fg/40">Score</div>
            <div className="font-display text-3xl font-bold text-fg tabular-nums">{score}</div>
          </div>
          <div className="rounded-xl border border-void-600 bg-void-800/40 p-4">
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-fg/40">Best</div>
            <div className="font-display text-3xl font-bold text-blood tabular-nums">{high}</div>
          </div>
        </div>

        <div className="grid grid-cols-3 grid-rows-2 gap-2 w-[168px] mx-auto lg:mx-0">
          {DPAD.map((b) => (
            <button
              key={b.label}
              type="button"
              onClick={() => setDir(b.d)}
              data-cursor
              aria-label={`Move ${b.label}`}
              className={`${b.cls} h-12 rounded-lg border border-void-600 bg-void-800/50 text-fg/80 text-xl hover:border-blood/50 hover:text-blood transition-colors active:scale-95`}
            >
              {b.label}
            </button>
          ))}
        </div>

        <p className="text-xs text-fg/40 leading-relaxed">
          Tip: the snake speeds up with every node. Don&apos;t hit the walls — or yourself.
        </p>
      </div>
    </div>
  );
}
