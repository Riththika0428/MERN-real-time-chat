'use client';

import { useEffect, useState } from 'react';
import { Avatar } from '@/components/ui/avatar';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { mapConversation, mapUser, type RawConversation, type RawUser } from '@/lib/adapters';
import type { ChatUser, Conversation } from '@/lib/types';

interface AddMemberModalProps {
  conversationId: string;
  existingMemberIds: string[];
  onClose: () => void;
  onAdded: (conversation: Conversation) => void;
}

export function AddMemberModal({ conversationId, existingMemberIds, onClose, onAdded }: AddMemberModalProps) {
  const { token, user } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<RawUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || query.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    const timeout = setTimeout(() => {
      apiFetch<{ users: RawUser[] }>(`/api/users/search?q=${encodeURIComponent(query.trim())}`, { token })
        .then((res) => setResults(res.users.filter((u) => !existingMemberIds.includes(u._id))))
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 350);
    return () => clearTimeout(timeout);
  }, [query, token, existingMemberIds]);

  const handleAdd = async (targetUser: RawUser) => {
    if (!token || !user) return;
    setAddingId(targetUser._id);
    setError(null);
    try {
      const res = await apiFetch<{ conversation: RawConversation }>(`/api/conversations/${conversationId}/members`, {
        method: 'POST',
        token,
        body: JSON.stringify({ userId: targetUser._id }),
      });
      onAdded(mapConversation(res.conversation, user.id));
      onClose();
    } catch {
      setError('Could not add member. Try again.');
      setAddingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[210] flex items-start justify-center bg-ink/40 px-4 pt-24" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="flex max-h-[60vh] w-full max-w-[400px] flex-col overflow-hidden rounded-lg border border-border bg-surface-elevated shadow-lg">
        <div className="flex items-center justify-between border-b border-border-soft px-4 py-3.5">
          <h3 className="text-[14px] font-semibold text-ink">Add member</h3>
          <button onClick={onClose} aria-label="Close" className="flex h-7 w-7 items-center justify-center rounded-md text-ink-tertiary hover:bg-surface-sunken hover:text-ink">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-4 pb-3 pt-3.5">
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by username or email"
            className="w-full rounded-[10px] border border-border bg-surface px-3.5 py-2.5 text-[13.5px] text-ink placeholder:text-ink-tertiary focus:border-accent-solid focus:outline-none focus:ring-2 focus:ring-accent-tint"
          />
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-3">
          {loading && <p className="px-2.5 py-6 text-center text-[13px] text-ink-tertiary">Searching…</p>}
          {error && <p className="px-2.5 py-2 text-center text-[13px] text-rose-500">{error}</p>}
          {!loading && query.trim().length >= 2 && results.length === 0 && (
            <p className="px-2.5 py-6 text-center text-[13px] text-ink-tertiary">No users found</p>
          )}
          <div className="space-y-0.5">
            {results.map((u) => {
              const mapped: ChatUser = mapUser(u);
              return (
                <button
                  key={u._id}
                  onClick={() => handleAdd(u)}
                  disabled={addingId === u._id}
                  className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left hover:bg-surface-sunken disabled:opacity-60"
                >
                  <Avatar initials={mapped.initials} color={mapped.avatarColor} online={mapped.online} size={34} />
                  <span className="flex-1 truncate text-[13px] font-medium text-ink">{mapped.username}</span>
                  {addingId === u._id && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 animate-spin text-ink-tertiary">
                      <path d="M21 12a9 9 0 11-3-6.7" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}