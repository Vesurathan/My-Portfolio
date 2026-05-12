export default function GlassFrame({
  children,
  ariaLabel,
}: {
  children: React.ReactNode;
  ariaLabel: string;
}) {
  return (
    <div
      className="ml-glass-card relative rounded-2xl border border-void-600/80 bg-void-950/45 backdrop-blur-md overflow-hidden transition-[box-shadow,transform,border-color] duration-300"
      aria-label={ariaLabel}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-blood/10 blur-[60px]" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-blood-glow/10 blur-[60px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-fg/[0.05] via-transparent to-transparent" />
      </div>
      <div className="relative p-4 md:p-5">{children}</div>
    </div>
  );
}

