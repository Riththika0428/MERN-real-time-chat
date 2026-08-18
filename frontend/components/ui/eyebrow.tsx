import { cn } from '@/lib/utils';

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-accent-solid',
        className
      )}
    >
      <span
        className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
        style={{ boxShadow: '0 0 0 3px rgb(var(--accent-tint))' }}
        aria-hidden="true"
      />
      {children}
    </span>
  );
}