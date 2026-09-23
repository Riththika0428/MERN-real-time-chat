'use client';

import { useEffect, useState } from 'react';
import { Avatar } from '@/components/ui/avatar';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { mapConversation, mapUser, type RawConversation, type RawUser } from '@/lib/adapters';
import type { Conversation } from '@/lib/types';

interface NewGroupModalProps {
  onClose: () => void;
  onCreated: (conversation: Conversation) => void;
}

export function NewGroupModal({ onClose, onCreated }: NewGroupModalProps) {
  const { token, user } = useAuth();
  const [step, setStep] = useState<'members' | 'details'>('members');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<RawUser[]>([]);
  const [selected, setSelected] = useState<RawUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const toggleSelect = (u: RawUser) => {
    setSelected((prev) => (prev.some((s) => s._id === u._id) ? prev.filter((s) => s._id !== u._id) : [...prev, u]));
  };

  const handleCreate = async () => {
    if (!token || !user || !name.trim()) return;
    setCreating(true);
    setError(null);
    try {
      const res = await apiFetch<{ conversation: RawConversation }>('/api/conversations/group', {
        method: 'POST',
        token,
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          participantIds: selected.map((s) => s._id),
        }),
      });
      onCreated(mapConversation(res.conversation, user.id));
      onClose();
    } catch {
      setError('Could not create group. Try again.');
      setCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center bg-ink/40 px-4 pt-24" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[70vh] w-full max-w-[440px] flex-col overflow-hidden rounded-lg border border-border bg-surface-elevated shadow-lg"
      >
        <div className="flex items-center justify-between border-b border-border-soft px-4 py-3.5">
          <h3 className="text-[14px] font-semibold text-ink">
            {step === 'members' ? 'New group — add members' : 'New group — details'}
          </h3>
          <button onClick={onClose} aria-label="Close" className="flex h-7 w-7 items-center justify-center rounded-md text-ink-tertiary hover:bg-surface-sunken hover:text-ink">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {step === 'members' ? (
          <>
            <div className="px-4 pb-3 pt-3.5">
              {selected.length > 0 && (
                <div className="mb-2.5 flex flex-wrap gap-1.5">
                  {selected.map((s) => (
                    <span key={s._id} className="flex items-center gap-1.5 rounded-full bg-accent-tint py-1 pl-1 pr-2 text-[12px] font-medium text-accent-solid">
                      <Avatar initials={mapUser(s).initials} color={mapUser(s).avatarColor} showStatus={false} size={18} />
                      {s.username}
                      <button onClick={() => toggleSelect(s)} className="ml-0.5">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-3 w-3">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <div className="relative">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="pointer-events-none absolute left-3 top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-ink-tertiary">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M21 21l-4.3-4.3" />
                </svg>
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search people to add"
                  className="w-full rounded-[10px] border border-border bg-surface py-2.5 pl-9 pr-3 text-[13.5px] text-ink placeholder:text-ink-tertiary focus:border-accent-solid focus:outline-none focus:ring-2 focus:ring-accent-tint"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-2 pb-2">
              {loading && <p className="px-2.5 py-6 text-center text-[13px] text-ink-tertiary">Searching…</p>}
              {!loading && query.trim().length >= 2 && results.length === 0 && (
                <p className="px-2.5 py-6 text-center text-[13px] text-ink-tertiary">No users found</p>
              )}
              <div className="space-y-0.5">
                {results.map((u) => {
                  const mapped = mapUser(u);
                  const isSelected = selected.some((s) => s._id === u._id);
                  return (
                    <button
                      key={u._id}
                      onClick={() => toggleSelect(u)}
                      className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left ${isSelected ? 'bg-accent-tint' : 'hover:bg-surface-sunken'}`}
                    >
                      <Avatar initials={mapped.initials} color={mapped.avatarColor} online={mapped.online} size={36} />
                      <span className="flex-1 truncate text-[13.5px] font-medium text-ink">{mapped.username}</span>
                      <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${isSelected ? 'border-accent-solid bg-accent-solid' : 'border-border'}`}>
                        {isSelected && (
                          <svg viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="h-2.5 w-2.5">
                            <path d="M3 8.2l3 3L13 4.5" />
                          </svg>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-border-soft px-4 py-3.5">
              <button
                onClick={() => setStep('details')}
                disabled={selected.length === 0}
                className="w-full rounded-[10px] bg-accent-solid py-2.5 text-[13.5px] font-semibold text-accent-on hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next ({selected.length} selected)
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-3.5 px-4 py-4">
              <div>
                <label htmlFor="group-name" className="mb-1.5 block text-[13px] font-medium text-ink">
                  Group name
                </label>
                <input
                  id="group-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={50}
                  placeholder="e.g. Design Team"
                  className="w-full rounded-[10px] border border-border bg-surface px-3.5 py-2.5 text-sm text-ink focus:border-accent-solid focus:outline-none focus:ring-2 focus:ring-accent-tint"
                />
              </div>
              <div>
                <label htmlFor="group-description" className="mb-1.5 block text-[13px] font-medium text-ink">
                  Description <span className="text-ink-tertiary">(optional)</span>
                </label>
                <textarea
                  id="group-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  maxLength={250}
                  className="w-full resize-none rounded-[10px] border border-border bg-surface px-3.5 py-2.5 text-sm text-ink focus:border-accent-solid focus:outline-none focus:ring-2 focus:ring-accent-tint"
                />
              </div>
              {error && <p className="text-[13px] font-medium text-rose-500">{error}</p>}
            </div>

            <div className="flex gap-2 border-t border-border-soft px-4 py-3.5">
              <button onClick={() => setStep('members')} className="flex-1 rounded-[10px] border border-border bg-surface-elevated py-2.5 text-[13.5px] font-semibold text-ink hover:border-ink-tertiary">
                Back
              </button>
              <button
                onClick={handleCreate}
                disabled={!name.trim() || creating}
                className="flex-1 rounded-[10px] bg-accent-solid py-2.5 text-[13.5px] font-semibold text-accent-on hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                {creating ? 'Creating…' : 'Create group'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}