export function EmptyChatState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-tint">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-7 w-7 text-accent-solid">
          <path d="M4 4h16v12H8l-4 4V4z" />
          <path d="M8 9h8M8 12h5" />
        </svg>
      </div>
      <h3 className="font-display text-lg font-semibold text-ink">Select a conversation</h3>
      <p className="mt-1.5 max-w-xs text-[13.5px] text-ink-secondary">Choose a chat from the sidebar, or start a new conversation to begin messaging.</p>
    </div>
  );
}

export function ChatLoadingState() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center gap-3 border-b border-border-soft px-6 py-3">
        <div className="h-9 w-9 animate-pulse rounded-full bg-surface-sunken" />
        <div className="space-y-1.5">
          <div className="h-3 w-28 animate-pulse rounded bg-surface-sunken" />
          <div className="h-2.5 w-16 animate-pulse rounded bg-surface-sunken" />
        </div>
      </div>
      <div className="flex-1 space-y-4 px-6 py-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
            <div className={`h-9 animate-pulse rounded-2xl bg-surface-sunken ${i % 2 === 0 ? 'w-40' : 'w-56'}`} />
          </div>
        ))}
      </div>
    </div>
  );
}