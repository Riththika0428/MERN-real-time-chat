'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { PasswordStrength } from '@/components/ui/password-strength';
import { AvatarUpload } from '@/components/auth/avatar-upload';
import { useAuth } from '@/lib/auth-context';
import { ApiError } from '@/lib/api';

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

export function RegisterForm() {
  const router = useRouter();
  const { register } = useAuth();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordsMismatch || !termsAccepted) return;

    setError(null);
    setLoading(true);
    try {
      await register({ username, email, password });
      router.push('/chat');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to create account. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[380px] space-y-5">
      <AvatarUpload />

      <Input
        id="username"
        name="username"
        type="text"
        label="Username"
        placeholder="jordandiaz"
        autoComplete="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />

      <Input
        id="email"
        name="email"
        type="email"
        label="Email"
        placeholder="you@example.com"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <div>
        <Input
          id="password"
          name="password"
          type="password"
          label="Password"
          placeholder="Create a password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <PasswordStrength password={password} />
      </div>

      <div>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Confirm password"
          placeholder="Re-enter your password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {passwordsMismatch && <p className="mt-1.5 text-[12px] font-medium text-rose-500">Passwords don&apos;t match</p>}
      </div>

      <Checkbox
        id="terms"
        name="terms"
        checked={termsAccepted}
        onChange={(e) => setTermsAccepted(e.target.checked)}
        label={
          <>
            I agree to the{' '}
            <Link href="/terms" className="font-medium text-accent-solid hover:text-accent-hover">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="font-medium text-accent-solid hover:text-accent-hover">
              Privacy Policy
            </Link>
          </>
        }
      />

      {error && <p className="text-[13px] font-medium text-rose-500">{error}</p>}

      <Button
        type="submit"
        variant="solid"
        size="lg"
        className="w-full justify-center"
        disabled={loading || !termsAccepted || passwordsMismatch}
      >
        {loading ? 'Creating account…' : 'Create Account'}
      </Button>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-tertiary">or sign up with</span>
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
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-accent-solid hover:text-accent-hover">
          Log in
        </Link>
      </p>
    </form>
  );
}