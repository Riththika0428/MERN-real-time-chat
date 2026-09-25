export function NotificationsScreen() {
  return (
    <div className="flex h-full flex-col bg-surface">
      <div className="px-4 pb-3 pt-4">
        <h1 className="font-display text-lg font-bold text-ink">Notifications</h1>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-sunken">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-6 w-6 text-ink-tertiary">
            <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0" />
          </svg>
        </div>
        <p className="text-[13.5px] font-medium text-ink">No notifications yet</p>
        <p className="max-w-xs text-[12.5px] leading-relaxed text-ink-tertiary">
          A notification history isn&apos;t built on the backend yet — this screen will list message and mention
          alerts once that&apos;s added.
        </p>
      </div>
    </div>
  );
}