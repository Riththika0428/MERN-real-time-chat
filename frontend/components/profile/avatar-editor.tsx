'use client';

import { useRef, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { ApiError } from '@/lib/api';

interface AvatarEditorProps {
  initials: string;
  color: string;
  avatarUrl?: string;
  online: boolean;
}

export function AvatarEditor({ initials, color, avatarUrl, online }: AvatarEditorProps) {
  const { uploadAvatar } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);
    try {
      await uploadAvatar(file);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Upload failed. Try again.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="group relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-surface bg-surface-sunken shadow-md sm:h-32 sm:w-32"
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt="Profile" className="h-full w-full object-cover" />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center font-display text-3xl font-semibold text-white"
            style={{ backgroundColor: color }}
          >
            {initials}
          </div>
        )}

        <span
          className={`absolute inset-0 flex items-center justify-center bg-ink/0 text-surface transition-opacity ${
            uploading ? 'bg-ink/50 opacity-100' : 'opacity-0 group-hover:bg-ink/40 group-hover:opacity-100'
          }`}
        >
          {uploading ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6 animate-spin">
              <path d="M21 12a9 9 0 11-3-6.7" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6">
              <path d="M4 8h3l2-3h6l2 3h3v11H4V8z" />
              <circle cx="12" cy="13" r="3.2" />
            </svg>
          )}
        </span>
      </button>

      <span
        className={`absolute bottom-1.5 right-1.5 h-5 w-5 rounded-full border-[3px] border-surface ${online ? 'bg-accent' : 'bg-ink-tertiary'}`}
      />

      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleChange} className="hidden" />

      {error && <p className="absolute top-full mt-2 w-40 text-[11.5px] font-medium text-rose-500">{error}</p>}
    </div>
  );
}