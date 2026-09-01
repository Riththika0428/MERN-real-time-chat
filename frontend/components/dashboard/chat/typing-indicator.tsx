import { Avatar } from '@/components/ui/avatar';

export function TypingIndicator({ name, color, initials }: { name: string; color: string; initials: string }) {
  return (
    <div className="flex items-end gap-2 px-1">
      <Avatar initials={initials} color={color} showStatus={false} size={26} />
      <div className="rounded-2xl rounded-bl-md bg-surface-sunken px-3.5 py-2.5">
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-tertiary" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
      <span className="pb-1 text-[11.5px] text-ink-tertiary">{name} is typing…</span>
    </div>
  );
}