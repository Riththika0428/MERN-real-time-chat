'use client';

import { useTheme } from '@/components/theme-provider';
import { SectionShell, SectionCard } from '../section-shell';

const options = [
  {
    id: 'light' as const,
    label: 'Light',
    preview: <div className="h-14 w-full rounded-md border border-border bg-white" />,
  },
  {
    id: 'dark' as const,
    label: 'Dark',
    preview: <div className="h-14 w-full rounded-md border border-border bg-[#12161D]" />,
  },
  {
    id: 'system' as const,
    label: 'System',
    preview: (
      <div className="flex h-14 w-full overflow-hidden rounded-md border border-border">
        <div className="h-full w-1/2 bg-white" />
        <div className="h-full w-1/2 bg-[#12161D]" />
      </div>
    ),
  },
];

export function AppearanceSection() {
  const { preference, setPreference } = useTheme();

  return (
    <SectionShell title="Appearance" description="Choose how TalkNode looks on this device.">
      <SectionCard title="Theme">
        <div className="mt-2 grid grid-cols-3 gap-3">
          {options.map((opt) => {
            const isActive = preference === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setPreference(opt.id)}
                className={`rounded-lg border-2 p-1.5 transition-colors ${isActive ? 'border-accent-solid' : 'border-transparent hover:border-border'}`}
              >
                {opt.preview}
                <p className="mt-1.5 text-center text-[12px] font-medium text-ink">{opt.label}</p>
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-[12px] text-ink-tertiary">
          &ldquo;System&rdquo; follows your device&apos;s light/dark setting automatically.
        </p>
      </SectionCard>
    </SectionShell>
  );
}