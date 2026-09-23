'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { SectionShell, SectionCard } from '../section-shell';
import { ChangeEmailModal } from '../change-email-modal';
import { ChangePasswordModal } from '../change-password-modal';

export function AccountSection() {
  const { user } = useAuth();
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  if (!user) return null;

  return (
    <SectionShell title="Account" description="Manage your profile, email, and password.">
      <SectionCard>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[13.5px] font-medium text-ink">Profile</p>
            <p className="mt-0.5 text-[12.5px] text-ink-tertiary">Edit your avatar, username, and bio</p>
          </div>
          <Link
            href="/profile"
            className="rounded-[10px] border border-border bg-surface-elevated px-3.5 py-2 text-[13px] font-semibold text-ink hover:border-ink-tertiary"
          >
            Go to profile
          </Link>
        </div>
      </SectionCard>

      <SectionCard>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[13.5px] font-medium text-ink">Email</p>
            <p className="mt-0.5 text-[12.5px] text-ink-tertiary">{user.email}</p>
          </div>
          <button
            onClick={() => setShowEmailModal(true)}
            className="rounded-[10px] border border-border bg-surface-elevated px-3.5 py-2 text-[13px] font-semibold text-ink hover:border-ink-tertiary"
          >
            Change
          </button>
        </div>
      </SectionCard>

      <SectionCard>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[13.5px] font-medium text-ink">Password</p>
            <p className="mt-0.5 text-[12.5px] text-ink-tertiary">Change your account password</p>
          </div>
          <button
            onClick={() => setShowPasswordModal(true)}
            className="rounded-[10px] border border-border bg-surface-elevated px-3.5 py-2 text-[13px] font-semibold text-ink hover:border-ink-tertiary"
          >
            Change
          </button>
        </div>
      </SectionCard>

      {showEmailModal && <ChangeEmailModal currentEmail={user.email ?? ''} onClose={() => setShowEmailModal(false)} />}
      {showPasswordModal && <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />}
    </SectionShell>
  );
}