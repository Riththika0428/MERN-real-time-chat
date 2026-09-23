import type { Wallpaper } from '@/lib/settings-context';

const OPTIONS: { id: Wallpaper; label: string; swatchClass: string }[] = [
  { id: 'none', label: 'Default', swatchClass: 'bg-surface' },
  { id: 'dot-grid', label: 'Dot grid', swatchClass: 'bg-surface-sunken' },
  { id: 'soft-teal', label: 'Soft teal', swatchClass: 'bg-accent-tint' },
  { id: 'warm-sand', label: 'Warm sand', swatchClass: 'bg-[#F1E7D8] dark:bg-[#2A241A]' },
  { id: 'slate', label: 'Slate', swatchClass: 'bg-[#E4E7EC] dark:bg-[#1B2028]' },
];

export function WallpaperPicker({ value, onChange }: { value: Wallpaper; onChange: (w: Wallpaper) => void }) {
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
      {OPTIONS.map((opt) => {
        const isActive = value === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            className={`flex flex-col items-center gap-1.5 rounded-lg border-2 p-1.5 transition-colors ${
              isActive ? 'border-accent-solid' : 'border-transparent hover:border-border'
            }`}
          >
            <div className={`relative h-14 w-full rounded-md border border-border ${opt.swatchClass}`}>
              {opt.id === 'dot-grid' && (
                <div
                  className="absolute inset-0 rounded-md opacity-40"
                  style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '10px 10px' }}
                />
              )}
              {isActive && (
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent-solid text-accent-on">
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="h-2.5 w-2.5">
                    <path d="M3 8.2l3 3L13 4.5" />
                  </svg>
                </span>
              )}
            </div>
            <span className="text-[11px] text-ink-secondary">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}