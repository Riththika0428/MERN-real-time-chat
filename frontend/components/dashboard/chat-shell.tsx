'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from './sidebar/sidebar';
import { ChatHeader } from './chat/chat-header';
import { MessageList } from './chat/message-list';
import { Composer } from './chat/composer';
import { EmptyChatState, ChatLoadingState } from './chat/empty-chat';
import { InfoPanel } from './info-panel/info-panel';
import { GroupInfoPanel } from './info-panel/group-info-panel';
import { MobileNav, type MobileTab } from './mobile-nav';
import { ConnectionBanner } from './connection-banner';
import { ContactsScreen } from './mobile/contacts-screen';
import { GroupsScreen } from './mobile/groups-screen';
import { NotificationsScreen } from './mobile/notifications-screen';
import { NewGroupModal } from './sidebar/new-group-modal';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { useSocket } from '@/lib/socket-context';
import { mapConversation, mapMessage, type RawConversation, type RawMessage } from '@/lib/adapters';
import type { ChatMessage, Conversation, NavTab } from '@/lib/types';

export function ChatShell() {
  const { user, token } = useAuth();
  const { socket, connectionState } = useSocket();
  const router = useRouter();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [conversationsLoading, setConversationsLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<NavTab>('all');

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [typingUserId, setTypingUserId] = useState<string | null>(null);

  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const [editingMessage, setEditingMessage] = useState<ChatMessage | null>(null);
  const [infoPanelOpen, setInfoPanelOpen] = useState(false);
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');
  const [mobileTab, setMobileTab] = useState<MobileTab>('chats');
  const [mobileNewGroupOpen, setMobileNewGroupOpen] = useState(false);

  const activeIdRef = useRef(activeId);
  activeIdRef.current = activeId;

  const activeConversation = conversations.find((c) => c.id === activeId) ?? null;

  useEffect(() => {
    if (!user || !token) return;
    setConversationsLoading(true);
    apiFetch<{ conversations: RawConversation[] }>('/api/conversations', { token })
      .then((res) => setConversations(res.conversations.map((c) => mapConversation(c, user.id))))
      .catch(() => {})
      .finally(() => setConversationsLoading(false));
  }, [user, token]);

  useEffect(() => {
    if (!activeId || !token || !user) return;
    setMessagesLoading(true);
    apiFetch<{ messages: RawMessage[] }>(`/api/conversations/${activeId}/messages`, { token })
      .then((res) => setMessages(res.messages.map((m) => mapMessage(m, user.id))))
      .catch(() => setMessages([]))
      .finally(() => setMessagesLoading(false));

    socket?.emit('join_conversation', activeId);
    return () => {
      socket?.emit('leave_conversation', activeId);
    };
  }, [activeId, token, user, socket]);

  useEffect(() => {
    if (!socket || !user) return;

    const handleReceive = (raw: RawMessage) => {
      if (raw.conversation !== activeIdRef.current) {
        setConversations((prev) =>
          prev.map((c) => (c.id === raw.conversation ? { ...c, lastMessage: raw.text || 'Sent an attachment', lastMessageTime: 'Just now' } : c))
        );
        return;
      }

      const mapped = mapMessage(raw, user.id);

      setMessages((prev) => {
        if (prev.some((m) => m.id === mapped.id)) return prev;
        if (mapped.senderId === 'me') {
          const pendingIndex = prev.findIndex((m) => m.senderId === 'me' && m.status === 'sending');
          if (pendingIndex !== -1) {
            const next = [...prev];
            next[pendingIndex] = mapped;
            return next;
          }
        }
        return [...prev, mapped];
      });

      setConversations((prev) =>
        prev.map((c) => (c.id === raw.conversation ? { ...c, lastMessage: raw.text || 'Sent an attachment', lastMessageTime: 'Just now' } : c))
      );
    };

    const handleTyping = ({ conversationId, userId }: { conversationId: string; userId: string }) => {
      if (conversationId === activeIdRef.current) setTypingUserId(userId);
    };
    const handleStopTyping = ({ conversationId }: { conversationId: string }) => {
      if (conversationId === activeIdRef.current) setTypingUserId(null);
    };
    const handleUserOnline = ({ userId }: { userId: string }) => {
      setConversations((prev) => prev.map((c) => (c.user.id === userId ? { ...c, user: { ...c.user, online: true } } : c)));
    };
    const handleUserOffline = ({ userId }: { userId: string }) => {
      setConversations((prev) => prev.map((c) => (c.user.id === userId ? { ...c, user: { ...c.user, online: false } } : c)));
    };

    socket.on('receive_message', handleReceive);
    socket.on('typing', handleTyping);
    socket.on('stop_typing', handleStopTyping);
    socket.on('user_online', handleUserOnline);
    socket.on('user_offline', handleUserOffline);

    return () => {
      socket.off('receive_message', handleReceive);
      socket.off('typing', handleTyping);
      socket.off('stop_typing', handleStopTyping);
      socket.off('user_online', handleUserOnline);
      socket.off('user_offline', handleUserOffline);
    };
  }, [socket, user]);

  const handleSelect = (id: string) => {
    setActiveId(id);
    setMobileView('chat');
    setReplyTo(null);
    setEditingMessage(null);
    setTypingUserId(null);
  };

  const handleConversationCreated = (conversation: Conversation) => {
    setConversations((prev) => [conversation, ...prev.filter((c) => c.id !== conversation.id)]);
    handleSelect(conversation.id);
  };

  const handleConversationUpdated = (conversation: Conversation) => {
    setConversations((prev) => prev.map((c) => (c.id === conversation.id ? conversation : c)));
  };

  const handleGroupLeft = (conversationId: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== conversationId));
    if (activeId === conversationId) {
      setActiveId(null);
      setMobileView('list');
    }
  };

  // Mute/Archive are local-only flags — the backend has no endpoint for
  // them yet, but they genuinely drive the existing "Archived" sidebar tab
  // and the muted icon, so they're functional within the app itself.
  const handleToggleMute = (id: string) => {
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, muted: !c.muted } : c)));
  };
  const handleToggleArchive = (id: string) => {
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, archived: !c.archived } : c)));
  };

  const handleSend = (text: string) => {
    if (!socket || !activeId) return;

    const tempId = `local-${Date.now()}`;
    const optimistic: ChatMessage = {
      id: tempId,
      senderId: 'me',
      type: 'text',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      dateGroup: 'Today',
      status: 'sending',
    };
    setMessages((prev) => [...prev, optimistic]);
    setReplyTo(null);

    socket.emit('send_message', { conversationId: activeId, text }, (res: { success?: boolean; error?: string }) => {
      if (!res?.success) {
        setMessages((prev) => prev.map((m) => (m.id === tempId ? { ...m, status: 'failed' } : m)));
      }
    });
  };

  const handleRetry = (messageId: string) => {
    const failed = messages.find((m) => m.id === messageId);
    if (!failed?.text) return;
    setMessages((prev) => prev.filter((m) => m.id !== messageId));
    handleSend(failed.text);
  };

  const handleReact = (messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== messageId) return m;
        const existing = m.reactions?.find((r) => r.emoji === emoji);
        if (existing) {
          const reactions = m.reactions!
            .map((r) => (r.emoji === emoji ? { ...r, count: r.reactedByMe ? r.count - 1 : r.count + 1, reactedByMe: !r.reactedByMe } : r))
            .filter((r) => r.count > 0);
          return { ...m, reactions };
        }
        return { ...m, reactions: [...(m.reactions ?? []), { emoji, count: 1, reactedByMe: true }] };
      })
    );
  };
  const handleDelete = (messageId: string) => setMessages((prev) => prev.filter((m) => m.id !== messageId));
  const handleSaveEdit = (id: string, text: string) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, text, edited: true } : m)));
    setEditingMessage(null);
  };

  const handleMobileTabChange = (tab: MobileTab) => {
    if (tab === 'profile') {
      router.push('/profile');
      return;
    }
    setMobileTab(tab);
  };

  const handleStartChatFromContacts = async (userId: string) => {
    if (!token || !user) return;
    try {
      const res = await apiFetch<{ conversation: RawConversation }>('/api/conversations', {
        method: 'POST',
        token,
        body: JSON.stringify({ userId }),
      });
      handleConversationCreated(mapConversation(res.conversation, user.id));
    } catch {
      // Silently fail here — the user stays on the Contacts screen and can retry.
    }
  };

  const isTyping = typingUserId === activeConversation?.user.id;

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-surface">
      {connectionState === 'connecting' && <ConnectionBanner status="reconnecting" />}
      {connectionState === 'disconnected' && <ConnectionBanner status="lost" />}

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop: sidebar always visible. Mobile: only the 'chats' tab shows it, and only in 'list' view. */}
        <Sidebar
          conversations={conversations}
          activeId={activeId}
          onSelect={handleSelect}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onConversationCreated={handleConversationCreated}
          onToggleMute={handleToggleMute}
          onToggleArchive={handleToggleArchive}
          className={`w-full lg:w-[320px] ${
            mobileView === 'chat' ? 'hidden lg:flex' : mobileTab === 'chats' ? 'flex' : 'hidden lg:flex'
          }`}
        />

        {/* Mobile-only alternate tabs, shown when not viewing an open chat */}
        {mobileView === 'list' && mobileTab === 'contacts' && (
          <div className="flex w-full lg:hidden">
            <ContactsScreen onStartChat={handleStartChatFromContacts} />
          </div>
        )}
        {mobileView === 'list' && mobileTab === 'groups' && (
          <div className="flex w-full lg:hidden">
            <GroupsScreen
              conversations={conversations}
              activeId={activeId}
              onSelect={handleSelect}
              onNewGroup={() => setMobileNewGroupOpen(true)}
              onToggleMute={handleToggleMute}
              onToggleArchive={handleToggleArchive}
            />
          </div>
        )}
        {mobileView === 'list' && mobileTab === 'notifications' && (
          <div className="flex w-full lg:hidden">
            <NotificationsScreen />
          </div>
        )}

        <div
          className={`min-w-0 flex-1 flex-col lg:flex ${
            mobileView === 'chat' ? 'flex' : 'hidden'
          }`}
        >
          {messagesLoading ? (
            <ChatLoadingState />
          ) : activeConversation ? (
            <>
              <ChatHeader
                user={activeConversation.user}
                isTyping={isTyping}
                onBack={() => setMobileView('list')}
                onOpenProfile={() => setInfoPanelOpen((v) => !v)}
                onSearch={() => {}}
              />
              <MessageList
                messages={messages}
                otherUser={activeConversation.user}
                isTyping={isTyping}
                onReact={handleReact}
                onReply={setReplyTo}
                onEdit={setEditingMessage}
                onDelete={handleDelete}
                onRetry={handleRetry}
              />
              <Composer
                onSend={handleSend}
                replyTo={replyTo}
                onCancelReply={() => setReplyTo(null)}
                editingMessage={editingMessage}
                onCancelEdit={() => setEditingMessage(null)}
                onSaveEdit={handleSaveEdit}
              />
            </>
          ) : (
            <div className="hidden lg:flex lg:flex-1">
              <EmptyChatState />
            </div>
          )}
        </div>

        {infoPanelOpen && activeConversation && (
          <div className="hidden w-[320px] shrink-0 lg:block">
            {activeConversation.user.isGroup ? (
              <GroupInfoPanel
                conversationId={activeConversation.id}
                user={activeConversation.user}
                onClose={() => setInfoPanelOpen(false)}
                onUpdated={handleConversationUpdated}
                onLeft={handleGroupLeft}
              />
            ) : (
              <InfoPanel user={activeConversation.user} onClose={() => setInfoPanelOpen(false)} />
            )}
          </div>
        )}
      </div>

      {mobileView === 'list' && <MobileNav active={mobileTab} onChange={handleMobileTabChange} />}

      {mobileNewGroupOpen && (
        <NewGroupModal
          onClose={() => setMobileNewGroupOpen(false)}
          onCreated={(conversation) => {
            handleConversationCreated(conversation);
            setMobileNewGroupOpen(false);
          }}
        />
      )}
    </div>
  );
}