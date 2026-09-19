'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { ApiError } from '@/lib/api';

interface EditProfileModalProps {
  initialUsername: string;
  initialBio: string;
  onClose: () => void;
}

export function EditProfileModal({ initialUsername, initialBio, onClose }: EditProfileModalProps) {
  const { updateProfile } = useAuth();
  const [username, setUsername] = useState(initialUsername);
  const [bio, setBio] = useState(initialBio);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await updateProfile({ username, bio });
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not save changes. Try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-ink/40 px-4" onClick={onClose}>
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="w-full max-w-[420px] overflow-hidden rounded-lg border border-border bg-surface-elevated shadow-lg"
      >
        <div className="flex items-center justify-between border-b border-border-soft px-4 py-3.5">
          <h3 className="text-[14px] font-semibold text-ink">Edit profile</h3>
          <button type="button" onClick={onClose} aria-label="Close" className="flex h-7 w-7 items-center justify-center rounded-md text-ink-tertiary hover:bg-surface-sunken hover:text-ink">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4 px-4 py-4">
          <div>
            <label htmlFor="edit-username" className="mb-1.5 block text-[13px] font-medium text-ink">
              Username
            </label>
            <input
              id="edit-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              minLength={3}
              maxLength={30}
              required
              className="w-full rounded-[10px] border border-border bg-surface px-3.5 py-2.5 text-sm text-ink focus:border-accent-solid focus:outline-none focus:ring-2 focus:ring-accent-tint"
            />
          </div>

          <div>
            <label htmlFor="edit-bio" className="mb-1.5 block text-[13px] font-medium text-ink">
              Bio
            </label>
            <textarea
              id="edit-bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              maxLength={160}
              placeholder="Tell people a little about yourself"
              className="w-full resize-none rounded-[10px] border border-border bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-tertiary focus:border-accent-solid focus:outline-none focus:ring-2 focus:ring-accent-tint"
            />
            <p className="mt-1 text-right text-[11px] text-ink-tertiary">{bio.length}/160</p>
          </div>

          {error && <p className="text-[13px] font-medium text-rose-500">{error}</p>}
        </div>

        <div className="flex gap-2 border-t border-border-soft px-4 py-3.5">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="flex-1 rounded-[10px] border border-border bg-surface-elevated py-2.5 text-[13.5px] font-semibold text-ink hover:border-ink-tertiary disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 rounded-[10px] bg-accent-solid py-2.5 text-[13.5px] font-semibold text-accent-on hover:bg-accent-hover disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  );
}