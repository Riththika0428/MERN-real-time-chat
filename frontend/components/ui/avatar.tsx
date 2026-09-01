interface AvatarProps {
  initials: string;
  color: string;
  online?: boolean;
  size?: number;
  showStatus?: boolean;
  isGroup?: boolean;
  ringClassName?: string;
}

export function Avatar({ initials, color, online, size = 40, showStatus = true, isGroup, ringClassName = 'border-surface-elevated' }: AvatarProps) {
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <div
        className="flex h-full w-full items-center justify-center rounded-full font-display font-semibold text-white"
        style={{ backgroundColor: color, fontSize: size * 0.38 }}
      >
        {isGroup ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: size * 0.5, height: size * 0.5 }}>
            <circle cx="9" cy="8" r="3" />
            <path d="M2.5 19c0-3 2.9-5 6.5-5s6.5 2 6.5 5" />
            <circle cx="17" cy="8.5" r="2.4" />
            <path d="M15.5 14.2c2.7.4 4.5 2 4.5 4.8" />
          </svg>
        ) : (
          initials
        )}
      </div>
      {showStatus && (
        <span
          className={`absolute rounded-full border-2 ${ringClassName} ${online ? 'bg-accent' : 'bg-ink-tertiary'}`}
          style={{ width: size * 0.28, height: size * 0.28, right: -1, bottom: -1 }}
        />
      )}
    </div>
  );
}