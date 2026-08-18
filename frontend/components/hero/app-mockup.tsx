const contacts = [
  { initials: 'MK', name: 'Mira K.', snippet: 'typing…', color: '#0A8F82', online: true, active: true },
  { initials: 'JD', name: 'Jordan D.', snippet: 'Sent a file', color: '#5B6472', online: true, active: false },
  { initials: 'RS', name: 'Rae S.', snippet: 'Sounds good 👍', color: '#8992A0', online: false, active: false },
  { initials: 'TN', name: 'Theo N.', snippet: 'See you at 6', color: '#B08A3E', online: true, active: false },
];

function Avatar({
  initials,
  color,
  online,
  size = 30,
  ringClassName,
}: {
  initials: string;
  color: string;
  online: boolean;
  size?: number;
  ringClassName: string;
}) {
  return (
    <div
      className="relative flex shrink-0 items-center justify-center rounded-full font-display text-[11px] font-semibold text-white"
      style={{ width: size, height: size, backgroundColor: color }}
    >
      {initials}
      <span
        className={`absolute -bottom-px -right-px h-2 w-2 rounded-full border-2 ${ringClassName} ${
          online ? 'bg-accent' : 'bg-ink-tertiary'
        }`}
      />
    </div>
  );
}

export function AppMockup() {
  return (
    <div className="relative z-[1] mx-auto w-full max-w-[480px] overflow-hidden rounded-lg border border-border bg-surface-elevated shadow-lg">
      <div className="flex items-center gap-1.5 border-b border-border-soft px-4 py-3.5">
        <span className="h-[9px] w-[9px] rounded-full bg-border" />
        <span className="h-[9px] w-[9px] rounded-full bg-border" />
        <span className="h-[9px] w-[9px] rounded-full bg-border" />
      </div>

      <div className="flex h-[460px]">
        <div className="w-[34%] border-r border-border-soft bg-surface-sunken p-2.5">
          <div className="mb-3 rounded-lg border border-border bg-surface-elevated px-2.5 py-2 font-mono text-[11.5px] text-ink-tertiary">
            Search people…
          </div>
          {contacts.map((c) => (
            <div
              key={c.name}
              className={`mb-0.5 flex items-center gap-2 rounded-lg p-1.5 ${
                c.active ? 'bg-surface-elevated shadow-sm' : ''
              }`}
            >
              <Avatar
                initials={c.initials}
                color={c.color}
                online={c.online}
                ringClassName={c.active ? 'border-surface-elevated' : 'border-surface-sunken'}
              />
              <div className="min-w-0">
                <div className="text-[11.5px] font-semibold text-ink">{c.name}</div>
                <div className="max-w-[90px] truncate text-[10px] text-ink-tertiary">{c.snippet}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-1 flex-col">
          <div className="flex items-center gap-2 border-b border-border-soft px-4 py-3">
            <Avatar initials="MK" color="#0A8F82" online size={26} ringClassName="border-surface-elevated" />
            <div>
              <div className="text-[12.5px] font-semibold text-ink">Mira K.</div>
              <div className="font-mono text-[10px] text-accent-solid">Online</div>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-2.5 p-4">
            <div className="max-w-[72%] self-start rounded-2xl rounded-bl-md bg-surface-sunken px-3 py-2 text-[11.5px] leading-snug text-ink">
              Hey! Are we still on for the design review?
              <span className="mt-0.5 block font-mono text-[9px] opacity-60">10:41</span>
            </div>
            <div className="max-w-[72%] self-end rounded-2xl rounded-br-md bg-accent-solid px-3 py-2 text-[11.5px] leading-snug text-accent-on">
              Yes — pulling up the file now
              <span className="mt-0.5 block font-mono text-[9px] opacity-60">10:42</span>
            </div>
            <div className="max-w-[72%] self-start rounded-2xl rounded-bl-md bg-surface-sunken px-3 py-2 text-[11.5px] leading-snug text-ink">
              Perfect, sending it over
              <span className="mt-0.5 block font-mono text-[9px] opacity-60">10:42</span>
            </div>
            <div className="flex items-center gap-1 self-start px-3 py-2">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-[5px] w-[5px] animate-bounce rounded-full bg-ink-tertiary"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}