'use client';

import { useRef, useState } from 'react';
import { Avatar } from '@/components/ui/avatar';
import type { Conversation } from '@/lib/types';

const REVEAL_WIDTH = 144; // two 72px action buttons
const OPEN_THRESHOLD = 60;

interface ConversationItemProps {
  conversation: Conversation;
  active: boolean;
  onClick: () => void;
  onToggleMute?: (id: string) => void;
  onToggleArchive?: (id: string) => void;
}

export function ConversationItem({ conversation, active, onClick, onToggleMute, onToggleArchive }: ConversationItemProps) {
  const { id, user, lastMessage, lastMessageTime, unreadCount, muted, archived } = conversation;

  const [offset, setOffset] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const startOffset = useRef(0);
  const dragging = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    startOffset.current = offset;
    dragging.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.touches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 6) dragging.current = true;
    const next = Math.min(0, Math.max(-REVEAL_WIDTH, startOffset.current + delta));
    setOffset(next);
  };

  const handleTouchEnd = () => {
    setOffset(offset < -OPEN_THRESHOLD ? -REVEAL_WIDTH : 0);
    touchStartX.current = null;
  };

  const handleRowClick = () => {
    if (dragging.current) {
      // A swipe just happened — treat this tap as closing the panel,
      // not as selecting the conversation.
      dragging.current = false;
      return;
    }
    if (offset !== 0) {
      setOffset(0);
      return;
    }
    onClick();
  };

  return (
    <div className="relative overflow-hidden rounded-lg">
      {/* Action buttons revealed behind the row via swipe */}
      <div className="absolute inset-y-0 right-0 flex">
        <button
          onClick={() => {
            onToggleMute?.(id);
            setOffset(0);
          }}
          className="flex w-[72px] flex-col items-center justify-center gap-1 bg-amber-500 text-white"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-[18px] w-[18px]">
            {muted ? (
              <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0" />
            ) : (
              <path d="M3 3l18 18M9.3 5A3 3 0 0115 7v3.5M15 15v.5a3 3 0 01-5.7 1.3M18.5 12a6.5 6.5 0 01-1 3.4M5.5 12A6.5 6.5 0 0012 18.5c.6 0 1.1-.1 1.6-.2M12 18.5V21M9 21h6" />
            )}
          </svg>
          <span className="text-[10px] font-medium">{muted ? 'Unmute' : 'Mute'}</span>
        </button>
        <button
          onClick={() => {
            onToggleArchive?.(id);
            setOffset(0);
          }}
          className="flex w-[72px] flex-col items-center justify-center gap-1 bg-ink text-white"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-[18px] w-[18px]">
            <rect x="3" y="4" width="18" height="4" rx="1" />
            <path d="M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8M10 13h4" />
          </svg>
          <span className="text-[10px] font-medium">{archived ? 'Unarchive' : 'Archive'}</span>
        </button>
      </div>

      <button
        onClick={handleRowClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ transform: `translateX(${offset}px)` }}
        className={`relative flex w-full items-center gap-3 bg-surface px-3 py-2.5 text-left transition-transform duration-150 ${
          active ? 'bg-accent-tint' : 'hover:bg-surface-sunken'
        }`}
      >
        <Avatar initials={user.initials} color={user.avatarColor} avatarUrl={user.avatarUrl} online={user.online} isGroup={user.isGroup} size={44} ringClassName={active ? 'border-accent-tint' : 'border-surface'} />

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
    </div>
  );
}