'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { SettingsShell } from '@/components/settings/settings-shell';

export default function SettingsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) router.push('/login');
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return <div className="flex h-dvh items-center justify-center bg-surface text-sm text-ink-secondary">Loading…</div>;
  }

  return <SettingsShell />;
}