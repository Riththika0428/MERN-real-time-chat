'use client';

import { useState } from 'react';

export function ChangeEmailModal({ currentEmail, onClose }: { currentEmail: string; onClose: () => void }) {
  const [email, setEmail] = useState(currentEmail);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-ink/40 px-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-[420px] overflow-hidden rounded-lg border border-border bg-surface-elevated shadow-lg">
        <div className="flex items-center justify-between border-b border-border-soft px-4 py-3.5">
          <h3 className="text-[14px] font-semibold text-ink">Change email</h3>
          <button onClick={onClose} aria-label="Close" className="flex h-7 w-7 items-center justify-center rounded-md text-ink-tertiary hover:bg-surface-sunken hover:text-ink">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-4 py-4">
          <label htmlFor="new-email" className="mb-1.5 block text-[13px] font-medium text-ink">
            New email address
          </label>
          <input
            id="new-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-[10px] border border-border bg-surface px-3.5 py-2.5 text-sm text-ink focus:border-accent-solid focus:outline-none focus:ring-2 focus:ring-accent-tint"
          />
          <p className="mt-3 rounded-md bg-surface-sunken px-3 py-2 text-[11.5px] leading-relaxed text-ink-tertiary">
            Email changes aren&apos;t connected to the backend yet — there&apos;s no endpoint to update this. This form is
            a placeholder until that&apos;s built.
          </p>
        </div>

        <div className="flex gap-2 border-t border-border-soft px-4 py-3.5">
          <button onClick={onClose} className="flex-1 rounded-[10px] border border-border bg-surface-elevated py-2.5 text-[13.5px] font-semibold text-ink hover:border-ink-tertiary">
            Cancel
          </button>
          <button disabled className="flex-1 cursor-not-allowed rounded-[10px] bg-accent-solid py-2.5 text-[13.5px] font-semibold text-accent-on opacity-50">
            Save (not connected)
          </button>
        </div>
      </div>
    </div>
  );
}