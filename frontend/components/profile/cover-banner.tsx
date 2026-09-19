export function CoverBanner() {
  return (
    <div className="relative h-40 w-full overflow-hidden rounded-t-lg bg-ink sm:h-52 dark:bg-surface-elevated dark:border dark:border-b-0 dark:border-border">
      <svg className="absolute inset-0 h-full w-full opacity-40" preserveAspectRatio="xMidYMid slice" viewBox="0 0 800 200">
        <defs>
          <pattern id="dot-grid" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.4" fill="white" fillOpacity="0.25" />
          </pattern>
        </defs>
        <rect width="800" height="200" fill="url(#dot-grid)" />
        <line x1="80" y1="40" x2="220" y2="110" stroke="white" strokeOpacity="0.15" />
        <line x1="220" y1="110" x2="380" y2="60" stroke="white" strokeOpacity="0.15" />
        <line x1="580" y1="140" x2="720" y2="70" stroke="white" strokeOpacity="0.15" />
        <circle cx="220" cy="110" r="3" fill="#2DE0C7" fillOpacity="0.8" />
        <circle cx="380" cy="60" r="2.4" fill="white" fillOpacity="0.4" />
        <circle cx="580" cy="140" r="2.4" fill="white" fillOpacity="0.4" />
      </svg>
    </div>
  );
}