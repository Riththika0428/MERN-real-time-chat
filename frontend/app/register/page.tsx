import type { Metadata } from 'next';
import Link from 'next/link';
import { Logo } from '@/components/ui/logo';
import { RegisterForm } from '@/components/auth/register-form';
import { AuthIllustration } from '@/components/auth/auth-illustration';

export const metadata: Metadata = {
  title: 'Create your account — TalkNode',
};

export default function RegisterPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col px-6 py-8 sm:px-12 lg:px-16">
        <Link href="/">
          <Logo />
        </Link>

        <div className="flex flex-1 flex-col items-center justify-center py-10">
          <div className="w-full max-w-[380px]">
            <h1 className="font-display text-[28px] font-bold tracking-tight text-ink">Create your account</h1>
            <p className="mt-1.5 text-[14.5px] text-ink-secondary">Join TalkNode and start chatting in seconds.</p>
          </div>

          <div className="mt-8 w-full">
            <RegisterForm />
          </div>
        </div>
      </div>

      <AuthIllustration
        heading="Real conversations, instantly."
        subheading="Create an account and start messaging in real time — no delay, no friction."
      />
    </div>
  );
}