'use client';

import { useEffect, useState } from 'react';
import { Avatar } from '@/components/ui/avatar';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { mapUser, type RawUser } from '@/lib/adapters';

export function ContactsScreen({ onStartChat }: { onStartChat: (userId: string) => void }) {
  const { token } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<RawUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [startingId, setStartingId] = useState<string | null>(null);

  useEffect(() => {
    if (!token || query.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    const timeout = setTimeout(() => {
      apiFetch<{ users: RawUser[] }>(`/api/users/search?q=${encodeURIComponent(query.trim())}`, { token })
        .then((res) => setResults(res.users))
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 350);
    return () => clearTimeout(timeout);
  }, [query, token]);

  return (
    <div className="flex h-full flex-col bg-surface">
      <div className="px-4 pb-3 pt-4">
        <h1 className="mb-3 font-display text-lg font-bold text-ink">Contacts</h1>
        <div className="relative">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="pointer-events-none absolute left-3 top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-ink-tertiary">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by username or email"
            className="w-full rounded-[10px] border border-border bg-surface-elevated py-2.5 pl-9 pr-3 text-[13.5px] text-ink placeholder:text-ink-tertiary focus:border-accent-solid focus:outline-none focus:ring-2 focus:ring-accent-tint"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-4">
        {query.trim().length < 2 && (
          <div className="flex flex-col items-center gap-2 px-4 py-16 text-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-6 w-6 text-ink-tertiary">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
            <p className="text-[13px] text-ink-tertiary">Search for people by username or email to start a chat.</p>
          </div>
        )}

        {loading && <p className="px-4 py-8 text-center text-[13px] text-ink-tertiary">Searching…</p>}

        {!loading && query.trim().length >= 2 && results.length === 0 && (
          <p className="px-4 py-8 text-center text-[13px] text-ink-tertiary">No users found for &ldquo;{query}&rdquo;</p>
        )}

        <div className="space-y-0.5">
          {results.map((rawUser) => {
            const mapped = mapUser(rawUser);
            return (
              <button
                key={rawUser._id}
                onClick={() => {
                  setStartingId(rawUser._id);
                  onStartChat(rawUser._id);
                }}
                disabled={startingId === rawUser._id}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-surface-sunken disabled:opacity-60"
              >
                <Avatar initials={mapped.initials} color={mapped.avatarColor} avatarUrl={mapped.avatarUrl} online={mapped.online} size={42} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-semibold text-ink">{mapped.username}</p>
                  <p className="truncate text-[12px] text-ink-tertiary">{rawUser.email}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}