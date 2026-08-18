export function LogoMark({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 26 26" fill="none" aria-hidden="true">
      <line x1="6" y1="20" x2="13" y2="7" className="stroke-border" strokeWidth="1.4" />
      <line x1="13" y1="7" x2="20" y2="20" className="stroke-border" strokeWidth="1.4" />
      <line x1="6" y1="20" x2="20" y2="20" className="stroke-border" strokeWidth="1.4" />
      <circle cx="13" cy="7" r="3.4" className="fill-accent-solid" />
      <circle cx="6" cy="20" r="3" className="fill-ink-tertiary" />
      <circle cx="20" cy="20" r="3" className="fill-ink-tertiary" />
    </svg>
  );
}

export function Logo({ size = 26 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2.5 font-display text-xl font-bold tracking-tight text-ink">
      <LogoMark size={size} />
      TalkNode
    </div>
  );
}