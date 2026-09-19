interface ActivityCardProps {
  conversationCount: number | null;
  joinedAt?: string;
  online: boolean;
}

function formatJoinedDate(iso?: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString([], { month: 'long', year: 'numeric' });
}

export function ActivityCard({ conversationCount, joinedAt, online }: ActivityCardProps) {
  const stats = [
    {
      label: 'Conversations',
      value: conversationCount === null ? '—' : conversationCount.toString(),
      icon: <path d="M4 4h16v12H8l-4 4V4z" />,
    },
    {
      label: 'Joined',
      value: formatJoinedDate(joinedAt),
      icon: (
        <>
          <rect x="3" y="4" width="18" height="17" rx="2" />
          <path d="M3 9h18M8 2v4M16 2v4" />
        </>
      ),
    },
    {
      label: 'Status',
      value: online ? 'Online now' : 'Offline',
      icon: (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-lg border border-border bg-surface-elevated p-4">
          <div className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-[10px] bg-accent-tint">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-[18px] w-[18px] text-accent-solid">
              {stat.icon}
            </svg>
          </div>
          <p className="text-[15px] font-semibold text-ink">{stat.value}</p>
          <p className="text-[12px] text-ink-tertiary">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}