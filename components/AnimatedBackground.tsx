'use client';

export default function AnimatedBackground() {
  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none z-0"
      aria-hidden
    >
      {/* Large drifting orbs — soft red lights moving around */}
      <div
        className="absolute w-[80vmax] h-[80vmax] rounded-full bg-blood/30 -left-[30vmax] -top-[30vmax] blur-[100px] animate-orb-drift-1"
        style={{ animationDelay: '0s' }}
      />
      <div
        className="absolute w-[70vmax] h-[70vmax] rounded-full bg-blood-glow/25 -right-[25vmax] top-[10vh] blur-[90px] animate-orb-drift-2"
        style={{ animationDelay: '-5s' }}
      />
      <div
        className="absolute w-[60vmax] h-[60vmax] rounded-full bg-blood/20 left-[20vw] -bottom-[20vmax] blur-[110px] animate-orb-drift-3"
        style={{ animationDelay: '-10s' }}
      />

      {/* Pulsing center glow — luminate effect */}
      <div
        className="absolute w-[50vmax] h-[50vmax] rounded-full bg-blood-glow/20 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 blur-[120px] animate-orb-luminate"
        style={{ animationDelay: '-2s' }}
      />

      {/* Orbiting lights — run around in circles */}
      <div className="absolute left-1/2 top-1/2 w-0 h-0">
        <div className="absolute left-0 top-0 w-[24vmin] h-[24vmin] rounded-full bg-blood/35 blur-[55px] animate-orb-orbit-slow" />
        <div className="absolute left-0 top-0 w-[18vmin] h-[18vmin] rounded-full bg-blood-glow/30 blur-[45px] animate-orb-orbit-fast" style={{ animationDelay: '-8s' }} />
      </div>
    </div>
  );
}
