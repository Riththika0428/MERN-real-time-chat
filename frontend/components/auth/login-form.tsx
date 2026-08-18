'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-[18px] w-[18px]">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-[18px] w-[18px]">
      <path d="M3 3l18 18" />
      <path d="M10.6 5.2A10.7 10.7 0 0112 5c6.5 0 10 7 10 7a15.6 15.6 0 01-3.1 3.9M6.5 6.6A15.6 15.6 0 002 12s3.5 7 10 7c1.3 0 2.5-.2 3.6-.6" />
      <path d="M9.9 9.9a3 3 0 004.2 4.2" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]">
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.7-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8z" />
      <path fill="#34A853" d="M12 24c3.2 0 6-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1C3.3 21.3 7.3 24 12 24z" />
      <path fill="#FBBC05" d="M5.4 14.4A7.2 7.2 0 015 12c0-.8.1-1.6.4-2.4V6.5H1.4A12 12 0 000 12c0 1.9.5 3.8 1.4 5.5l4-3.1z" />
      <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.5 1.8l3.4-3.4C17.9 1.2 15.2 0 12 0 7.3 0 3.3 2.7 1.4 6.5l4 3.1C6.3 6.9 8.9 4.8 12 4.8z" />
    </svg>
  );
}

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: wire up to POST /api/auth/login
    setTimeout(() => setLoading(false), 800);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[380px] space-y-5">
      <Input id="email" name="email" type="email" label="Email" placeholder="you@example.com" autoComplete="email" required />

      <Input
        id="password"
        name="password"
        type={showPassword ? 'text' : 'password'}
        label="Password"
        placeholder="••••••••"
        autoComplete="current-password"
        required
        rightAdornment={
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="flex h-8 w-8 items-center justify-center rounded-md text-ink-tertiary hover:text-ink"
          >
            <EyeIcon open={showPassword} />
          </button>
        }
      />

      <div className="flex items-center justify-between">
        <Checkbox id="remember" name="remember" label="Remember me" />
        <Link href="/forgot-password" className="text-[13px] font-medium text-accent-solid hover:text-accent-hover">
          Forgot password?
        </Link>
      </div>

      <Button type="submit" variant="solid" size="lg" className="w-full justify-center" disabled={loading}>
        {loading ? 'Signing in…' : 'Log in'}
      </Button>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-tertiary">or continue with</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <button
        type="button"
        className="flex w-full items-center justify-center gap-2.5 rounded-[10px] border border-border bg-surface-elevated py-2.5 text-sm font-semibold text-ink transition-colors hover:border-ink-tertiary"
      >
        <GoogleIcon />
        Continue with Google
      </button>

      <p className="text-center text-[13.5px] text-ink-secondary">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="font-semibold text-accent-solid hover:text-accent-hover">
          Register
        </Link>
      </p>
    </form>
  );
}