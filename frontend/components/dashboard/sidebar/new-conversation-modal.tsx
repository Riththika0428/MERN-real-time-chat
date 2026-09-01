'use client';

import { useEffect, useState } from 'react';
import { Avatar } from '@/components/ui/avatar';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { mapConversation, mapUser, type RawConversation, type RawUser } from '@/lib/adapters';
import type { Conversation } from '@/lib/types';

interface NewConversationModalProps {
  conversations: Conversation[];
  onClose: () => void;
  onCreated: (conversation: Conversation) => void;
}

interface SelectableUser {
  id: string;
  username: string;
  email?: string;
  online: boolean;
  initials: string;
  avatarColor: string;
}

export function NewConversationModal({ conversations, onClose, onCreated }: NewConversationModalProps) {
  const { token, user } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<RawUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<SelectableUser | null>(null);

  const isSearching = query.trim().length >= 2;

  // Real data: the people from your existing conversations, most recent first —
  // not a fabricated list.
  const recentUsers: SelectableUser[] = conversations
    .filter((c) => !c.user.isGroup)
    .slice(0, 6)
    .map((c) => ({
      id: c.user.id,
      username: c.user.username,
      online: c.user.online,
      initials: c.user.initials,
      avatarColor: c.user.avatarColor,
    }));

  useEffect(() => {
    if (!token || !isSearching) {
      setResults([]);
      return;
    }
    setLoading(true);
    setError(null);
    const timeout = setTimeout(() => {
      apiFetch<{ users: RawUser[] }>(`/api/users/search?q=${encodeURIComponent(query.trim())}`, { token })
        .then((res) => setResults(res.users))
        .catch(() => setError('Could not search users right now.'))
        .finally(() => setLoading(false));
    }, 350);
    return () => clearTimeout(timeout);
  }, [query, token, isSearching]);

  const searchResultUsers: SelectableUser[] = results.map((r) => {
    const mapped = mapUser(r);
    return { id: r._id, username: mapped.username, email: r.email, online: mapped.online, initials: mapped.initials, avatarColor: mapped.avatarColor };
  });

  const handleStartChat = async () => {
    if (!token || !user || !selected) return;
    setStarting(true);
    setError(null);
    try {
      const res = await apiFetch<{ conversation: RawConversation }>('/api/conversations', {
        method: 'POST',
        token,
        body: JSON.stringify({ userId: selected.id }),
      });
      onCreated(mapConversation(res.conversation, user.id));
      onClose();
    } catch {
      setError('Could not start conversation. Try again.');
      setStarting(false);
    }
  };

  const renderUserRow = (u: SelectableUser) => {
    const isSelected = selected?.id === u.id;
    return (
      <button
        key={u.id}
        onClick={() => setSelected(u)}
        className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors ${
          isSelected ? 'bg-accent-tint' : 'hover:bg-surface-sunken'
        }`}
      >
        <Avatar initials={u.initials} color={u.avatarColor} online={u.online} size={38} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13.5px] font-semibold text-ink">{u.username}</p>
          <p className="truncate text-[12px] text-ink-tertiary">{u.email ?? (u.online ? 'Online' : 'Offline')}</p>
        </div>
        <div
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
            isSelected ? 'border-accent-solid bg-accent-solid' : 'border-border'
          }`}
        >
          {isSelected && (
            <svg viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="h-2.5 w-2.5">
              <path d="M3 8.2l3 3L13 4.5" />
            </svg>
          )}
        </div>
      </button>
    );
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center bg-ink/40 px-4 pt-24" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[70vh] w-full max-w-[440px] flex-col overflow-hidden rounded-lg border border-border bg-surface-elevated shadow-lg"
      >
        <div className="flex items-center justify-between border-b border-border-soft px-4 py-3.5">
          <h3 className="text-[14px] font-semibold text-ink">New conversation</h3>
          <button onClick={onClose} aria-label="Close" className="flex h-7 w-7 items-center justify-center rounded-md text-ink-tertiary hover:bg-surface-sunken hover:text-ink">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-4 pb-3 pt-3.5">
          <div className="relative">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="pointer-events-none absolute left-3 top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-ink-tertiary">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by username or email"
              className="w-full rounded-[10px] border border-border bg-surface py-2.5 pl-9 pr-3 text-[13.5px] text-ink placeholder:text-ink-tertiary focus:border-accent-solid focus:outline-none focus:ring-2 focus:ring-accent-tint"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-3">
          {isSearching ? (
            <>
              <p className="px-2.5 pb-1.5 pt-1 font-mono text-[11px] uppercase tracking-wide text-ink-tertiary">Search results</p>
              {loading && <p className="px-2.5 py-6 text-center text-[13px] text-ink-tertiary">Searching…</p>}
              {!loading && error && <p className="px-2.5 py-3 text-center text-[13px] text-rose-500">{error}</p>}
              {!loading && !error && searchResultUsers.length === 0 && (
                <p className="px-2.5 py-6 text-center text-[13px] text-ink-tertiary">No users found for &ldquo;{query}&rdquo;</p>
              )}
              <div className="space-y-0.5">{searchResultUsers.map(renderUserRow)}</div>
            </>
          ) : (
            <>
              <p className="px-2.5 pb-1.5 pt-1 font-mono text-[11px] uppercase tracking-wide text-ink-tertiary">Recent</p>
              {recentUsers.length === 0 ? (
                <p className="px-2.5 py-4 text-[13px] text-ink-tertiary">No recent conversations yet.</p>
              ) : (
                <div className="space-y-0.5">{recentUsers.map(renderUserRow)}</div>
              )}

              <p className="px-2.5 pb-1.5 pt-4 font-mono text-[11px] uppercase tracking-wide text-ink-tertiary">Suggested</p>
              <div className="flex flex-col items-center gap-1.5 px-2.5 py-6 text-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-6 w-6 text-ink-tertiary">
                  <circle cx="9" cy="8" r="3" />
                  <path d="M2.5 19c0-3 2.9-5 6.5-5s6.5 2 6.5 5" />
                  <circle cx="17" cy="8.5" r="2.4" />
                  <path d="M15.5 14.2c2.7.4 4.5 2 4.5 4.8" />
                </svg>
                <p className="text-[12.5px] text-ink-tertiary">Search above to find people to chat with.</p>
              </div>
            </>
          )}
        </div>

        <div className="border-t border-border-soft px-4 py-3.5">
          {error && !isSearching && <p className="mb-2 text-[12.5px] font-medium text-rose-500">{error}</p>}
          <button
            onClick={handleStartChat}
            disabled={!selected || starting}
            className="flex w-full items-center justify-center gap-2 rounded-[10px] bg-accent-solid py-2.5 text-[13.5px] font-semibold text-accent-on transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {starting ? (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 animate-spin">
                  <path d="M21 12a9 9 0 11-3-6.7" />
                </svg>
                Starting…
              </>
            ) : selected ? (
              `Start chat with ${selected.username}`
            ) : (
              'Select someone to start chatting'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}