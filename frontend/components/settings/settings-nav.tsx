import type { ReactElement } from 'react';

export type SettingsCategory = 'account' | 'appearance' | 'notifications' | 'privacy' | 'chat';

const categories: { id: SettingsCategory; label: string; icon: ReactElement }[] = [
  {
    id: 'account',
    label: 'Account',
    icon: (
      <>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M4.5 20c0-4 3.4-6.5 7.5-6.5s7.5 2.5 7.5 6.5" />
      </>
    ),
  },
  {
    id: 'appearance',
    label: 'Appearance',
    icon: <path d="M12 3a9 9 0 000 18 4.5 4.5 0 000-9h4.5A4.5 4.5 0 0021 7.5 9 9 0 0012 3zM7 9h.01M11 6h.01M16 8h.01" />,
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0" />,
  },
  {
    id: 'privacy',
    label: 'Privacy',
    icon: <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />,
  },
  {
    id: 'chat',
    label: 'Chat',
    icon: <path d="M4 4h16v12H8l-4 4V4z" />,
  },
];

export function SettingsNav({ active, onChange }: { active: SettingsCategory; onChange: (c: SettingsCategory) => void }) {
  return (
    <nav className="space-y-0.5">
      {categories.map((cat) => {
        const isActive = active === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onChange(cat.id)}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13.5px] font-medium transition-colors ${
              isActive ? 'bg-accent-tint text-accent-solid' : 'text-ink-secondary hover:bg-surface-sunken hover:text-ink'
            }`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-[18px] w-[18px] shrink-0">
              {cat.icon}
            </svg>
            {cat.label}
          </button>
        );
      })}
    </nav>
  );
}

export { categories as settingsCategories };