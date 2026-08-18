import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  rightAdornment?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, rightAdornment, className, ...props }, ref) => {
    return (
      <div>
        <label htmlFor={id} className="mb-1.5 block text-[13px] font-medium text-ink">
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            id={id}
            className={cn(
              'w-full rounded-[10px] border border-border bg-surface-elevated px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-tertiary',
              'transition-colors focus:border-accent-solid focus:outline-none focus:ring-2 focus:ring-accent-tint',
              rightAdornment && 'pr-11',
              className
            )}
            {...props}
          />
          {rightAdornment && (
            <div className="absolute right-1 top-1/2 -translate-y-1/2">{rightAdornment}</div>
          )}
        </div>
      </div>
    );
  }
);
Input.displayName = 'Input';