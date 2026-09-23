import type { ReactNode } from 'react';

export function SectionShell({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <div>
      <div className="mb-5">
        <h2 className="font-display text-[19px] font-bold text-ink">{title}</h2>
        <p className="mt-1 text-[13.5px] text-ink-secondary">{description}</p>
      </div>
      <div className="rounded-lg border border-border bg-surface-elevated">{children}</div>
    </div>
  );
}

export function SectionCard({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="border-b border-border-soft px-5 py-4 last:border-b-0">
      {title && <p className="mb-1 font-mono text-[11px] uppercase tracking-wide text-ink-tertiary">{title}</p>}
      {children}
    </div>
  );
}