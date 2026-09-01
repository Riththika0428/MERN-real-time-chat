'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { SocketProvider } from '@/lib/socket-context';
import { ChatShell } from '@/components/dashboard/chat-shell';

export default function ChatPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) router.push('/login');
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return <div className="flex h-dvh items-center justify-center bg-surface text-ink-secondary text-sm">Loading…</div>;
  }

  return (
    <SocketProvider>
      <ChatShell />
    </SocketProvider>
  );
}