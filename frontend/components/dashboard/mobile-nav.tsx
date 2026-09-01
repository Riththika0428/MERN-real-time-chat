'use client';

const items = [
  { id: 'chats', label: 'Chats', icon: <path d="M4 4h16v12H8l-4 4V4z" /> },
  {
    id: 'contacts',
    label: 'Contacts',
    icon: (
      <>
        <circle cx="12" cy="8" r="3.2" />
        <path d="M5 20c0-3.6 3-6 7-6s7 2.4 7 6" />
      </>
    ),
  },
  {
    id: 'groups',
    label: 'Groups',
    icon: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M2.5 19c0-3 2.9-5 6.5-5s6.5 2 6.5 5" />
        <circle cx="17" cy="8.5" r="2.4" />
        <path d="M15.5 14.2c2.7.4 4.5 2 4.5 4.8" />
      </>
    ),
  },
  { id: 'notifications', label: 'Alerts', icon: <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0" /> },
  {
    id: 'profile',
    label: 'Profile',
    icon: (
      <>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M4.5 20c0-4 3.4-6.5 7.5-6.5s7.5 2.5 7.5 6.5" />
      </>
    ),
  },
] as const;

export type MobileTab = (typeof items)[number]['id'];

export function MobileNav({ active, onChange }: { active: MobileTab; onChange: (tab: MobileTab) => void }) {
  return (
    <nav className="grid grid-cols-5 border-t border-border-soft bg-surface-elevated pb-[env(safe-area-inset-bottom)] lg:hidden">
      {items.map((item) => {
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={`flex flex-col items-center gap-1 py-2.5 text-[10.5px] font-medium ${isActive ? 'text-accent-solid' : 'text-ink-tertiary'}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-[21px] w-[21px]">
              {item.icon}
            </svg>
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}