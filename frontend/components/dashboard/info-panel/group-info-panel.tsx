'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar } from '@/components/ui/avatar';
import { apiFetch, ApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { mapConversation, type RawConversation } from '@/lib/adapters';
import { AddMemberModal } from './add-member-modal';
import { GroupSettingsModal } from './group-settings-modal';
import type { ChatUser, Conversation } from '@/lib/types';

interface GroupInfoPanelProps {
  conversationId: string;
  user: ChatUser;
  onClose: () => void;
  onUpdated: (conversation: Conversation) => void;
  onLeft: (conversationId: string) => void;
}

export function GroupInfoPanel({ conversationId, user, onClose, onUpdated, onLeft }: GroupInfoPanelProps) {
  const { token, user: currentUser } = useAuth();
  const router = useRouter();
  const [showAddMember, setShowAddMember] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const members = user.members ?? [];
  const adminIds = user.adminIds ?? [];
  const isCurrentUserAdmin = currentUser ? adminIds.includes(currentUser.id) : false;

  const handleLeave = async () => {
    if (!token || !currentUser) return;
    if (!window.confirm(`Leave "${user.name}"? You'll need to be re-added to rejoin.`)) return;

    setLeaving(true);
    setError(null);
    try {
      await apiFetch(`/api/conversations/${conversationId}/members/${currentUser.id}`, {
        method: 'DELETE',
        token,
      });
      onLeft(conversationId);
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not leave group.');
      setLeaving(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!token || !currentUser) return;
    try {
      const res = await apiFetch<{ conversation: RawConversation }>(`/api/conversations/${conversationId}/members/${memberId}`, {
        method: 'DELETE',
        token,
      });
      onUpdated(mapConversation(res.conversation, currentUser.id));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not remove member.');
    }
  };

  return (
    <div className="flex h-full flex-col overflow-y-auto border-l border-border-soft bg-surface">
      <div className="flex items-center justify-between px-5 py-4">
        <p className="text-[13px] font-semibold text-ink">Group info</p>
        <button onClick={onClose} aria-label="Close panel" className="flex h-8 w-8 items-center justify-center rounded-md text-ink-tertiary hover:bg-surface-sunken hover:text-ink">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col items-center px-5 pb-6 pt-2 text-center">
        <Avatar initials={user.initials} color={user.avatarColor} avatarUrl={user.avatarUrl} isGroup showStatus={false} size={88} />
        <h3 className="mt-3 font-display text-lg font-semibold text-ink">{user.name}</h3>
        <p className="text-[13px] text-ink-tertiary">{members.length} members</p>
        {user.description && <p className="mt-3 text-[13px] leading-relaxed text-ink-secondary">{user.description}</p>}

        {isCurrentUserAdmin && (
          <button
            onClick={() => setShowSettings(true)}
            className="mt-4 flex items-center gap-1.5 rounded-[10px] border border-border bg-surface-elevated px-3.5 py-2 text-[12.5px] font-semibold text-ink hover:border-ink-tertiary"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-[15px] w-[15px]">
              <path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            Group settings
          </button>
        )}
      </div>

      <div className="border-t border-border-soft px-5 py-4">
        <div className="flex items-center justify-between">
          <p className="text-[12px] font-semibold uppercase tracking-wide text-ink-tertiary">
            {members.length} Members
          </p>
          {isCurrentUserAdmin && (
            <button onClick={() => setShowAddMember(true)} className="flex items-center gap-1 text-[11.5px] font-semibold text-accent-solid hover:text-accent-hover">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Add member
            </button>
          )}
        </div>

        <div className="mt-3 space-y-1">
          {members.map((member) => {
            const memberIsAdmin = adminIds.includes(member.id);
            const isSelf = member.id === currentUser?.id;
            return (
              <div key={member.id} className="group flex items-center gap-2.5 rounded-lg px-1.5 py-1.5 hover:bg-surface-sunken">
                <Avatar initials={member.initials} color={member.avatarColor} avatarUrl={member.avatarUrl} online={member.online} size={32} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12.5px] font-medium text-ink">
                    {member.username} {isSelf && <span className="text-ink-tertiary">(you)</span>}
                  </p>
                </div>
                {memberIsAdmin && (
                  <span className="rounded-full bg-accent-tint px-2 py-0.5 font-mono text-[9.5px] font-semibold uppercase tracking-wide text-accent-solid">
                    Admin
                  </span>
                )}
                {isCurrentUserAdmin && !isSelf && !memberIsAdmin && (
                  <button
                    onClick={() => handleRemoveMember(member.id)}
                    aria-label={`Remove ${member.username}`}
                    className="hidden h-6 w-6 items-center justify-center rounded-md text-ink-tertiary hover:bg-rose-500/10 hover:text-rose-500 group-hover:flex"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {error && <p className="px-5 py-2 text-[12.5px] font-medium text-rose-500">{error}</p>}

      <div className="mt-auto border-t border-border-soft px-5 py-4">
        <button
          onClick={handleLeave}
          disabled={leaving}
          className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-[13px] font-medium text-rose-500 hover:bg-rose-500/10 disabled:opacity-60"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-[16px] w-[16px]">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
          {leaving ? 'Leaving…' : 'Leave group'}
        </button>
      </div>

      {showAddMember && (
        <AddMemberModal
          conversationId={conversationId}
          existingMemberIds={members.map((m) => m.id)}
          onClose={() => setShowAddMember(false)}
          onAdded={onUpdated}
        />
      )}

      {showSettings && (
        <GroupSettingsModal
          conversationId={conversationId}
          initialName={user.name}
          initialDescription={user.description ?? ''}
          avatarUrl={user.avatarUrl}
          onClose={() => setShowSettings(false)}
          onSaved={onUpdated}
        />
      )}
    </div>
  );
}