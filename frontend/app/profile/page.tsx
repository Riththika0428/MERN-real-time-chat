'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { apiFetch } from '@/lib/api';
import type { RawConversation } from '@/lib/adapters';
import { CoverBanner } from '@/components/profile/cover-banner';
import { AvatarEditor } from '@/components/profile/avatar-editor';
import { ActivityCard } from '@/components/profile/activity-card';
import { EditProfileModal } from '@/components/profile/edit-profile-modal';

export default function ProfilePage() {
  const { user, token, isLoading } = useAuth();
  const router = useRouter();
  const [conversationCount, setConversationCount] = useState<number | null>(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) router.push('/login');
  }, [isLoading, user, router]);

  useEffect(() => {
    if (!token) return;
    apiFetch<{ conversations: RawConversation[] }>('/api/conversations', { token })
      .then((res) => setConversationCount(res.conversations.length))
      .catch(() => setConversationCount(null));
  }, [token]);

  if (isLoading || !user) {
    return <div className="flex h-dvh items-center justify-center bg-surface text-sm text-ink-secondary">Loading…</div>;
  }

  return (
    <div className="min-h-dvh bg-surface-sunken">
      <div className="mx-auto max-w-[720px] px-4 py-6 sm:px-6 sm:py-10">
        <Link href="/chat" className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-secondary hover:text-ink">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Back to chats
        </Link>

        <div className="overflow-hidden rounded-lg border border-border bg-surface-elevated shadow-sm">
          <CoverBanner />

          <div className="px-5 pb-6 sm:px-8">
            <div className="-mt-14 flex items-end justify-between sm:-mt-16">
              <AvatarEditor initials={user.initials} color={user.avatarColor} avatarUrl={user.avatarUrl} online={user.online} />
              <button
                onClick={() => setEditing(true)}
                className="mb-1 flex items-center gap-2 rounded-[10px] border border-border bg-surface-elevated px-4 py-2 text-[13px] font-semibold text-ink hover:border-ink-tertiary"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                  <path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
                Edit profile
              </button>
            </div>

            <div className="mt-4">
              <div className="flex items-center gap-2">
                <h1 className="font-display text-xl font-bold text-ink">{user.username}</h1>
                <span
                  className={`rounded-full px-2 py-0.5 font-mono text-[10.5px] font-medium ${
                    user.online ? 'bg-accent-tint text-accent-solid' : 'bg-surface-sunken text-ink-tertiary'
                  }`}
                >
                  {user.online ? 'Online' : 'Offline'}
                </span>
              </div>
              <p className="text-[13.5px] text-ink-tertiary">@{user.username}</p>
              {user.email && <p className="mt-1 text-[13px] text-ink-secondary">{user.email}</p>}

              <p className="mt-3.5 max-w-[480px] text-[13.5px] leading-relaxed text-ink">
                {user.bio || <span className="text-ink-tertiary">No bio yet — tell people a little about yourself.</span>}
              </p>
            </div>

            <div className="mt-6">
              <p className="mb-3 font-mono text-[11px] uppercase tracking-wide text-ink-tertiary">Activity</p>
              <ActivityCard conversationCount={conversationCount} joinedAt={user.joinedAt} online={user.online} />
            </div>
          </div>
        </div>
      </div>

      {editing && (
        <EditProfileModal initialUsername={user.username} initialBio={user.bio ?? ''} onClose={() => setEditing(false)} />
      )}
    </div>
  );
}