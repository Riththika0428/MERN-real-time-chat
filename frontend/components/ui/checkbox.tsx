import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
   label: React.ReactNode;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, id, className, ...props }, ref) => {
    return (
      <label htmlFor={id} className="flex cursor-pointer select-none items-center gap-2 text-[13px] text-ink-secondary">
        <span className="relative flex h-4 w-4 shrink-0 items-center justify-center">
          <input
            ref={ref}
            id={id}
            type="checkbox"
            className={cn(
              'peer h-4 w-4 shrink-0 appearance-none rounded-[5px] border border-border bg-surface-elevated',
              'checked:border-accent-solid checked:bg-accent-solid',
              'focus:outline-none focus:ring-2 focus:ring-accent-tint',
              className
            )}
            {...props}
          />
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="pointer-events-none absolute h-2.5 w-2.5 text-accent-on opacity-0 peer-checked:opacity-100"
          >
            <path d="M3 8.2l3 3L13 4.5" />
          </svg>
        </span>
        {label}
      </label>
    );
  }
);
Checkbox.displayName = 'Checkbox';