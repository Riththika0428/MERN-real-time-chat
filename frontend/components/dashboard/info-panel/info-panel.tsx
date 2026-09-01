'use client';

import { useState } from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import type { ChatUser } from '@/lib/types';

const MEDIA = Array.from({ length: 6 }).map((_, i) => i);
const FILES = [
  { name: 'design-review-notes.pdf', size: '1.2 MB' },
  { name: 'brand-assets.zip', size: '8.4 MB' },
];
const LINKS = [
  { title: 'TalkNode Design System', domain: 'figma.com' },
  { title: 'Q3 roadmap doc', domain: 'notion.so' },
];

export function InfoPanel({ user, onClose }: { user: ChatUser; onClose: () => void }) {
  const [notifications, setNotifications] = useState(true);
  const [muted, setMuted] = useState(false);

  return (
    <div className="flex h-full flex-col overflow-y-auto border-l border-border-soft bg-surface">
      <div className="flex items-center justify-between px-5 py-4">
        <p className="text-[13px] font-semibold text-ink">Conversation info</p>
        <button onClick={onClose} aria-label="Close panel" className="flex h-8 w-8 items-center justify-center rounded-md text-ink-tertiary hover:bg-surface-sunken hover:text-ink">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col items-center px-5 pb-6 pt-2 text-center">
        <Avatar initials={user.initials} color={user.avatarColor} online={user.online} isGroup={user.isGroup} size={88} />
        <h3 className="mt-3 font-display text-lg font-semibold text-ink">{user.name}</h3>
        <p className="text-[13px] text-ink-tertiary">@{user.username}</p>
        <p className={`mt-1 font-mono text-[11.5px] ${user.online ? 'text-accent-solid' : 'text-ink-tertiary'}`}>
          {user.online ? 'Online' : user.lastSeen || 'Offline'}
        </p>
        {user.about && <p className="mt-3 text-[13px] leading-relaxed text-ink-secondary">{user.about}</p>}
      </div>

      <div className="border-t border-border-soft px-5 py-4">
        <div className="flex items-center justify-between">
          <p className="text-[12px] font-semibold uppercase tracking-wide text-ink-tertiary">Shared media</p>
          <span className="text-[11.5px] text-accent-solid">See all</span>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {MEDIA.map((i) => (
            <div key={i} className="aspect-square rounded-lg bg-surface-sunken" />
          ))}
        </div>
      </div>

      <div className="border-t border-border-soft px-5 py-4">
        <p className="text-[12px] font-semibold uppercase tracking-wide text-ink-tertiary">Shared files</p>
        <div className="mt-3 space-y-2">
          {FILES.map((f) => (
            <div key={f.name} className="flex items-center gap-2.5 rounded-lg border border-border p-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-surface-sunken">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4 text-ink-secondary">
                  <path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12.5px] font-medium text-ink">{f.name}</p>
                <p className="text-[11px] text-ink-tertiary">{f.size}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border-soft px-5 py-4">
        <p className="text-[12px] font-semibold uppercase tracking-wide text-ink-tertiary">Shared links</p>
        <div className="mt-3 space-y-2">
          {LINKS.map((l) => (
            <div key={l.title} className="rounded-lg border border-border p-2.5">
              <p className="font-mono text-[10.5px] uppercase tracking-wide text-ink-tertiary">{l.domain}</p>
              <p className="mt-0.5 text-[12.5px] font-medium text-ink">{l.title}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3.5 border-t border-border-soft px-5 py-4">
        <Switch id="notif" checked={notifications} onChange={setNotifications} label="Notifications" />
        <Switch id="mute" checked={muted} onChange={setMuted} label="Mute conversation" />
        <button className="flex w-full items-center gap-2.5 text-[13px] text-ink hover:text-accent-solid">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-[16px] w-[16px]">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          Search in conversation
        </button>
      </div>

      <div className="space-y-1 border-t border-border-soft px-5 py-4">
        <button className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-[13px] font-medium text-rose-500 hover:bg-rose-500/10">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-[16px] w-[16px]">
            <circle cx="12" cy="12" r="9" />
            <path d="M8 8l8 8" />
          </svg>
          Block user
        </button>
        <button className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-[13px] font-medium text-rose-500 hover:bg-rose-500/10">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-[16px] w-[16px]">
            <path d="M4 7h16M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2m-8 0v12a2 2 0 002 2h4a2 2 0 002-2V7" />
          </svg>
          Delete conversation
        </button>
      </div>
    </div>
  );
}