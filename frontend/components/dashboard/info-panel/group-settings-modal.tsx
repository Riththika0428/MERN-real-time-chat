'use client';

import { useRef, useState } from 'react';
import { apiFetch, apiUpload, ApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { mapConversation, type RawConversation } from '@/lib/adapters';
import type { Conversation } from '@/lib/types';

interface GroupSettingsModalProps {
  conversationId: string;
  initialName: string;
  initialDescription: string;
  avatarUrl?: string;
  onClose: () => void;
  onSaved: (conversation: Conversation) => void;
}

export function GroupSettingsModal({ conversationId, initialName, initialDescription, avatarUrl, onClose, onSaved }: GroupSettingsModalProps) {
  const { token, user } = useAuth();
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token || !user) return;
    setUploadingPhoto(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const res = await apiUpload<{ conversation: RawConversation }>(`/api/conversations/${conversationId}/group/avatar`, formData, token);
      onSaved(mapConversation(res.conversation, user.id));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not upload photo.');
    } finally {
      setUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !user || !name.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const res = await apiFetch<{ conversation: RawConversation }>(`/api/conversations/${conversationId}/group`, {
        method: 'PATCH',
        token,
        body: JSON.stringify({ name: name.trim(), description: description.trim() }),
      });
      onSaved(mapConversation(res.conversation, user.id));
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not save changes.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[210] flex items-center justify-center bg-ink/40 px-4" onClick={onClose}>
      <form onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit} className="w-full max-w-[420px] overflow-hidden rounded-lg border border-border bg-surface-elevated shadow-lg">
        <div className="flex items-center justify-between border-b border-border-soft px-4 py-3.5">
          <h3 className="text-[14px] font-semibold text-ink">Group settings</h3>
          <button type="button" onClick={onClose} aria-label="Close" className="flex h-7 w-7 items-center justify-center rounded-md text-ink-tertiary hover:bg-surface-sunken hover:text-ink">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4 px-4 py-4">
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingPhoto}
              className="group relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-dashed border-border bg-surface-sunken"
            >
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-7 w-7 text-ink-tertiary">
                  <circle cx="9" cy="8" r="3" />
                  <path d="M2.5 19c0-3 2.9-5 6.5-5s6.5 2 6.5 5" />
                  <circle cx="17" cy="8.5" r="2.4" />
                  <path d="M15.5 14.2c2.7.4 4.5 2 4.5 4.8" />
                </svg>
              )}
              <span className={`absolute inset-0 flex items-center justify-center bg-ink/0 text-surface transition-opacity ${uploadingPhoto ? 'bg-ink/50 opacity-100' : 'opacity-0 group-hover:bg-ink/40 group-hover:opacity-100'}`}>
                {uploadingPhoto ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 animate-spin">
                    <path d="M21 12a9 9 0 11-3-6.7" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                    <path d="M4 8h3l2-3h6l2 3h3v11H4V8z" />
                    <circle cx="12" cy="13" r="3.2" />
                  </svg>
                )}
              </span>
            </button>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handlePhotoChange} className="hidden" />
          </div>

          <div>
            <label htmlFor="group-settings-name" className="mb-1.5 block text-[13px] font-medium text-ink">
              Group name
            </label>
            <input
              id="group-settings-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
              className="w-full rounded-[10px] border border-border bg-surface px-3.5 py-2.5 text-sm text-ink focus:border-accent-solid focus:outline-none focus:ring-2 focus:ring-accent-tint"
            />
          </div>

          <div>
            <label htmlFor="group-settings-description" className="mb-1.5 block text-[13px] font-medium text-ink">
              Description
            </label>
            <textarea
              id="group-settings-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              maxLength={250}
              className="w-full resize-none rounded-[10px] border border-border bg-surface px-3.5 py-2.5 text-sm text-ink focus:border-accent-solid focus:outline-none focus:ring-2 focus:ring-accent-tint"
            />
          </div>

          {error && <p className="text-[13px] font-medium text-rose-500">{error}</p>}
        </div>

        <div className="flex gap-2 border-t border-border-soft px-4 py-3.5">
          <button type="button" onClick={onClose} className="flex-1 rounded-[10px] border border-border bg-surface-elevated py-2.5 text-[13.5px] font-semibold text-ink hover:border-ink-tertiary">
            Cancel
          </button>
          <button type="submit" disabled={saving || !name.trim()} className="flex-1 rounded-[10px] bg-accent-solid py-2.5 text-[13.5px] font-semibold text-accent-on hover:bg-accent-hover disabled:opacity-60">
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  );
}