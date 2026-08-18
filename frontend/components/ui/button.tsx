import { type AnchorHTMLAttributes, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

const base =
  'inline-flex items-center gap-2 whitespace-nowrap rounded-[10px] font-semibold transition-all duration-150 text-sm';

const variants = {
  solid: 'bg-accent-solid text-accent-on shadow-sm hover:bg-accent-hover hover:-translate-y-px hover:shadow-md',
  outline: 'border border-border bg-surface-elevated text-ink hover:border-ink-tertiary',
  ghost: 'text-ink hover:bg-surface-sunken',
};

const sizes = {
  default: 'px-[18px] py-[10px]',
  lg: 'px-[26px] py-[14px] text-[15px] rounded-xl',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
}

export function Button({ variant = 'solid', size = 'default', className, ...props }: ButtonProps) {
  return <button className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
}

export function ButtonLink({ variant = 'solid', size = 'default', className, ...props }: ButtonLinkProps) {
  return <a className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}