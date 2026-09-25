'use client';

import { useState } from 'react';
import { Logo } from '@/components/ui/logo';
import { Avatar } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/theme-toggle';
import { ConversationItem } from './conversation-item';
import { NoConversations, NoSearchResults } from './empty-states';
import { NewConversationModal } from './new-conversation-modal';
import { NewGroupModal } from './new-group-modal';
import { useAuth } from '@/lib/auth-context';
import { useClickOutside } from '@/lib/hooks';
import type { Conversation, NavTab } from '@/lib/types';

const tabs: { id: NavTab; label: string }[] = [
  { id: 'all', label: 'All Chats' },
  { id: 'unread', label: 'Unread' },
  { id: 'groups', label: 'Groups' },
  { id: 'favorites', label: 'Favorites' },
  { id: 'archived', label: 'Archived' },
];

interface SidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onConversationCreated: (conversation: Conversation) => void;
  onToggleMute: (id: string) => void;
  onToggleArchive: (id: string) => void;
  className?: string;
}

export function Sidebar({
  conversations,
  activeId,
  onSelect,
  activeTab,
  onTabChange,
  onConversationCreated,
  onToggleMute,
  onToggleArchive,
  className = '',
}: SidebarProps) {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [showNewMenu, setShowNewMenu] = useState(false);
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [showNewGroup, setShowNewGroup] = useState(false);
  const newMenuRef = useClickOutside<HTMLDivElement>(() => setShowNewMenu(false));

  const filtered = conversations
    .filter((c) => {
      if (activeTab === 'unread') return c.unreadCount > 0;
      if (activeTab === 'groups') return c.user.isGroup;
      if (activeTab === 'favorites') return c.favorite;
      if (activeTab === 'archived') return c.archived;
      return !c.archived;
    })
    .filter((c) => c.user.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className={`flex h-full flex-col border-r border-border-soft bg-surface ${className}`}>
      <div className="flex items-center justify-between px-4 py-4">
        <Logo size={24} />
        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <div className="relative" ref={newMenuRef}>
            <button
              onClick={() => setShowNewMenu((v) => !v)}
              aria-label="New conversation"
              className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-border bg-surface-elevated text-ink hover:border-ink-tertiary"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-[18px] w-[18px]">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>
            {showNewMenu && (
              <div className="absolute right-0 top-11 z-20 w-52 overflow-hidden rounded-lg border border-border bg-surface-elevated py-1 shadow-lg">
                <button
                  onClick={() => {
                    setShowNewMenu(false);
                    setShowNewConversation(true);
                  }}
                  className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-[13px] text-ink hover:bg-surface-sunken"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                    <path d="M4 4h16v12H8l-4 4V4z" />
                  </svg>
                  New conversation
                </button>
                <button
                  onClick={() => {
                    setShowNewMenu(false);
                    setShowNewGroup(true);
                  }}
                  className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-[13px] text-ink hover:bg-surface-sunken"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                    <circle cx="9" cy="8" r="3" />
                    <path d="M2.5 19c0-3 2.9-5 6.5-5s6.5 2 6.5 5" />
                    <circle cx="17" cy="8.5" r="2.4" />
                    <path d="M15.5 14.2c2.7.4 4.5 2 4.5 4.8" />
                  </svg>
                  New group
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 pb-3">
        <div className="relative">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="pointer-events-none absolute left-3 top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-ink-tertiary">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search conversations"
            className="w-full rounded-[10px] border border-border bg-surface-elevated py-2 pl-9 pr-3 text-[13.5px] text-ink placeholder:text-ink-tertiary focus:border-accent-solid focus:outline-none focus:ring-2 focus:ring-accent-tint"
          />
        </div>
      </div>

      <div className="flex gap-1.5 overflow-x-auto px-4 pb-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-[12.5px] font-medium transition-colors ${
              activeTab === tab.id ? 'bg-accent-solid text-accent-on' : 'bg-surface-sunken text-ink-secondary hover:text-ink'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto px-2 pb-2">
        {conversations.length === 0 ? (
          <NoConversations onNewChat={() => setShowNewConversation(true)} />
        ) : filtered.length === 0 ? (
          <NoSearchResults query={query} />
        ) : (
          <div className="space-y-0.5">
            {filtered.map((c) => (
              <ConversationItem
                key={c.id}
                conversation={c}
                active={c.id === activeId}
                onClick={() => onSelect(c.id)}
                onToggleMute={onToggleMute}
                onToggleArchive={onToggleArchive}
              />
            ))}
          </div>
        )}
      </div>

      {user && (
        <div className="flex items-center gap-2.5 border-t border-border-soft px-4 py-3.5">
          <Avatar initials={user.initials} color={user.avatarColor} avatarUrl={user.avatarUrl} online size={36} />
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] font-semibold text-ink">{user.name}</div>
            <div className="truncate font-mono text-[11px] text-accent-solid">Online</div>
          </div>
          <button aria-label="Settings" className="flex h-8 w-8 items-center justify-center rounded-md text-ink-tertiary hover:bg-surface-sunken hover:text-ink">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-[18px] w-[18px]">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.7 1.7 0 00.3 1.9l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.9-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1-1.6 1.7 1.7 0 00-1.9.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.9 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1 1.7 1.7 0 00-.3-1.9l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.9.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.9-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.9V9a1.7 1.7 0 001.5 1h.1a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z" />
            </svg>
          </button>
        </div>
      )}

      {showNewConversation && (
        <NewConversationModal
          conversations={conversations}
          onClose={() => setShowNewConversation(false)}
          onCreated={onConversationCreated}
        />
      )}

      {showNewGroup && <NewGroupModal onClose={() => setShowNewGroup(false)} onCreated={onConversationCreated} />}
    </div>
  );
}