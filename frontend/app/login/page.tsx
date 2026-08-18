import type { Metadata } from 'next';
import Link from 'next/link';
import { Logo } from '@/components/ui/logo';
import { LoginForm } from '@/components/auth/login-form';
import { AuthIllustration } from '@/components/auth/auth-illustration';

export const metadata: Metadata = {
  title: 'Log in — TalkNode',
};

export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col px-6 py-8 sm:px-12 lg:px-16">
        <Link href="/">
          <Logo />
        </Link>

        <div className="flex flex-1 flex-col items-center justify-center py-10">
          <div className="w-full max-w-[380px]">
            <h1 className="font-display text-[28px] font-bold tracking-tight text-ink">Welcome back</h1>
            <p className="mt-1.5 text-[14.5px] text-ink-secondary">Sign in to pick up where you left off.</p>
          </div>

          <div className="mt-8 w-full">
            <LoginForm />
          </div>
        </div>
      </div>

      <AuthIllustration />
    </div>
  );
}