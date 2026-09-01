export function DateSeparator({ label }: { label: string }) {
  return (
    <div className="my-4 flex items-center gap-3">
      <div className="h-px flex-1 bg-border-soft" />
      <span className="font-mono text-[11px] uppercase tracking-wide text-ink-tertiary">{label}</span>
      <div className="h-px flex-1 bg-border-soft" />
    </div>
  );
}