'use client';

import { useState } from 'react';

export function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const mismatch = confirm.length > 0 && next !== confirm;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-ink/40 px-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-[420px] overflow-hidden rounded-lg border border-border bg-surface-elevated shadow-lg">
        <div className="flex items-center justify-between border-b border-border-soft px-4 py-3.5">
          <h3 className="text-[14px] font-semibold text-ink">Change password</h3>
          <button onClick={onClose} aria-label="Close" className="flex h-7 w-7 items-center justify-center rounded-md text-ink-tertiary hover:bg-surface-sunken hover:text-ink">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-3.5 px-4 py-4">
          <div>
            <label htmlFor="current-password" className="mb-1.5 block text-[13px] font-medium text-ink">
              Current password
            </label>
            <input
              id="current-password"
              type="password"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              className="w-full rounded-[10px] border border-border bg-surface px-3.5 py-2.5 text-sm text-ink focus:border-accent-solid focus:outline-none focus:ring-2 focus:ring-accent-tint"
            />
          </div>
          <div>
            <label htmlFor="new-password" className="mb-1.5 block text-[13px] font-medium text-ink">
              New password
            </label>
            <input
              id="new-password"
              type="password"
              value={next}
              onChange={(e) => setNext(e.target.value)}
              className="w-full rounded-[10px] border border-border bg-surface px-3.5 py-2.5 text-sm text-ink focus:border-accent-solid focus:outline-none focus:ring-2 focus:ring-accent-tint"
            />
          </div>
          <div>
            <label htmlFor="confirm-password" className="mb-1.5 block text-[13px] font-medium text-ink">
              Confirm new password
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full rounded-[10px] border border-border bg-surface px-3.5 py-2.5 text-sm text-ink focus:border-accent-solid focus:outline-none focus:ring-2 focus:ring-accent-tint"
            />
            {mismatch && <p className="mt-1.5 text-[12px] font-medium text-rose-500">Passwords don&apos;t match</p>}
          </div>

          <p className="rounded-md bg-surface-sunken px-3 py-2 text-[11.5px] leading-relaxed text-ink-tertiary">
            Password changes aren&apos;t connected to the backend yet — there&apos;s no endpoint to verify your current
            password and update it. This form is a placeholder until that&apos;s built.
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