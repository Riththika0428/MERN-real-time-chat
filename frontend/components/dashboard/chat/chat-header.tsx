'use client';

import { useState } from 'react';
import { Avatar } from '@/components/ui/avatar';
import { useClickOutside } from '@/lib/hooks';
import type { ChatUser } from '@/lib/types';

interface ChatHeaderProps {
  user: ChatUser;
  isTyping: boolean;
  onBack?: () => void;
  onOpenProfile: () => void;
  onSearch: () => void;
}

export function ChatHeader({ user, isTyping, onBack, onOpenProfile, onSearch }: ChatHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useClickOutside<HTMLDivElement>(() => setMenuOpen(false));

  const statusText = isTyping ? 'typing…' : user.online ? 'Online' : user.lastSeen || 'Offline';

  return (
    <div className="flex items-center gap-3 border-b border-border-soft bg-surface px-4 py-3 sm:px-6">
      {onBack && (
        <button onClick={onBack} aria-label="Back to conversations" className="flex h-8 w-8 items-center justify-center rounded-md text-ink lg:hidden">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      )}

      <button onClick={onOpenProfile} className="flex min-w-0 flex-1 items-center gap-3 text-left">
        <Avatar initials={user.initials} color={user.avatarColor} online={user.online} isGroup={user.isGroup} size={38} />
        <div className="min-w-0">
          <p className="truncate text-[14.5px] font-semibold text-ink">{user.name}</p>
          <p className={`truncate text-[12px] ${isTyping ? 'text-accent-solid' : 'text-ink-tertiary'}`}>{statusText}</p>
        </div>
      </button>

      <div className="flex items-center gap-1">
        <button aria-label="Voice call" className="hidden h-9 w-9 items-center justify-center rounded-[10px] text-ink-secondary hover:bg-surface-sunken hover:text-ink sm:flex">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-[18px] w-[18px]">
            <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3.1-8.7A2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .3 2 .7 3a2 2 0 01-.4 2.1L8 10.3a16 16 0 006 6l1.5-1.4a2 2 0 012.1-.4c1 .4 2 .6 3 .7a2 2 0 011.7 2.1z" />
          </svg>
        </button>
        <button aria-label="Video call" className="hidden h-9 w-9 items-center justify-center rounded-[10px] text-ink-secondary hover:bg-surface-sunken hover:text-ink sm:flex">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-[18px] w-[18px]">
            <path d="M15 10l6-3v10l-6-3M3 6h9a2 2 0 012 2v8a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2z" />
          </svg>
        </button>
        <button onClick={onSearch} aria-label="Search in conversation" className="flex h-9 w-9 items-center justify-center rounded-[10px] text-ink-secondary hover:bg-surface-sunken hover:text-ink">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-[18px] w-[18px]">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
        </button>

        <div className="relative" ref={menuRef}>
          <button onClick={() => setMenuOpen((v) => !v)} aria-label="More options" className="flex h-9 w-9 items-center justify-center rounded-[10px] text-ink-secondary hover:bg-surface-sunken hover:text-ink">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]">
              <circle cx="12" cy="5" r="1.6" />
              <circle cx="12" cy="12" r="1.6" />
              <circle cx="12" cy="19" r="1.6" />
            </svg>
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-11 z-20 w-52 overflow-hidden rounded-lg border border-border bg-surface-elevated py-1 shadow-lg">
              {['View profile', 'Mute notifications', 'Search in chat', 'Block user'].map((label) => (
                <button key={label} className="block w-full px-3.5 py-2 text-left text-[13px] text-ink hover:bg-surface-sunken">
                  {label}
                </button>
              ))}
              <button className="block w-full px-3.5 py-2 text-left text-[13px] text-rose-500 hover:bg-rose-500/10">Delete conversation</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}