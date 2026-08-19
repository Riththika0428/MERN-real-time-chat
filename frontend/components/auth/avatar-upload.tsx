'use client';

import { useRef, useState } from 'react';

export function AvatarUpload() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setPreview(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleActionClick = () => {
    if (preview) {
      handleRemove();
    } else {
      inputRef.current?.click();
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="group relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-dashed border-border bg-surface-sunken transition-colors hover:border-ink-tertiary"
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Profile preview" className="h-full w-full object-cover" />
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-7 w-7 text-ink-tertiary">
            <circle cx="12" cy="8" r="3.5" />
            <path d="M4.5 20c0-4 3.4-6.5 7.5-6.5s7.5 2.5 7.5 6.5" />
          </svg>
        )}

        <span className="absolute inset-0 flex items-center justify-center bg-ink/0 text-surface opacity-0 transition-opacity group-hover:bg-ink/40 group-hover:opacity-100">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
            <path d="M4 8h3l2-3h6l2 3h3v11H4V8z" />
            <circle cx="12" cy="13" r="3.2" />
          </svg>
        </span>
      </button>

      <input ref={inputRef} type="file" accept="image/*" onChange={handleChange} className="hidden" />

      <button
        type="button"
        onClick={handleActionClick}
        className="mt-2.5 text-[12.5px] font-medium text-accent-solid hover:text-accent-hover"
      >
        {preview ? 'Remove photo' : 'Upload photo'}
      </button>
    </div>
  );
}