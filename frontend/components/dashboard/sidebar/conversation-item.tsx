import { Avatar } from '@/components/ui/avatar';
import type { Conversation } from '@/lib/types';

export function ConversationItem({
  conversation,
  active,
  onClick,
}: {
  conversation: Conversation;
  active: boolean;
  onClick: () => void;
}) {
  const { user, lastMessage, lastMessageTime, unreadCount, muted } = conversation;

  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
        active ? 'bg-accent-tint' : 'hover:bg-surface-sunken'
      }`}
    >
      <Avatar initials={user.initials} color={user.avatarColor} online={user.online} isGroup={user.isGroup} size={44} ringClassName={active ? 'border-accent-tint' : 'border-surface'} />

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-[14px] font-semibold text-ink">{user.name}</span>
          <span className="shrink-0 font-mono text-[11px] text-ink-tertiary">{lastMessageTime}</span>
        </div>
        <div className="mt-0.5 flex items-center justify-between gap-2">
          <span className="truncate text-[13px] text-ink-secondary">{lastMessage}</span>
          <div className="flex shrink-0 items-center gap-1.5">
            {muted && (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-[13px] w-[13px] text-ink-tertiary">
                <path d="M3 3l18 18M9.3 5A3 3 0 0115 7v3.5M15 15v.5a3 3 0 01-5.7 1.3" />
                <path d="M18.5 12a6.5 6.5 0 01-1 3.4M5.5 12A6.5 6.5 0 0012 18.5c.6 0 1.1-.1 1.6-.2" />
                <path d="M12 18.5V21M9 21h6" />
              </svg>
            )}
            {unreadCount > 0 && (
              <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent-solid px-1 font-mono text-[10.5px] font-semibold text-accent-on">
                {unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}