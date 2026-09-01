export function NoConversations({ onNewChat }: { onNewChat: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-surface-sunken">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-6 w-6 text-ink-tertiary">
          <path d="M4 4h16v12H8l-4 4V4z" />
        </svg>
      </div>
      <p className="text-[13.5px] font-medium text-ink">No conversations yet</p>
      <p className="mt-1 text-[12.5px] text-ink-tertiary">Start a new chat to get things going.</p>
      <button onClick={onNewChat} className="mt-4 rounded-[10px] bg-accent-solid px-4 py-2 text-[13px] font-semibold text-accent-on hover:bg-accent-hover">
        New conversation
      </button>
    </div>
  );
}

export function NoSearchResults({ query }: { query: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-surface-sunken">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-6 w-6 text-ink-tertiary">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
      </div>
      <p className="text-[13.5px] font-medium text-ink">No results found</p>
      <p className="mt-1 text-[12.5px] text-ink-tertiary">Nothing matches &ldquo;{query}&rdquo;</p>
    </div>
  );
}