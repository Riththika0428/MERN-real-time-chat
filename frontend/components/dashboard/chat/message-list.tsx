'use client';

import { useEffect, useRef } from 'react';
import { DateSeparator } from './date-separator';
import { MessageBubble } from './message-bubble';
import { TypingIndicator } from './typing-indicator';
import type { ChatMessage, ChatUser } from '@/lib/types';

interface MessageListProps {
  messages: ChatMessage[];
  otherUser: ChatUser;
  isTyping: boolean;
  onReact: (messageId: string, emoji: string) => void;
  onReply: (message: ChatMessage) => void;
  onEdit: (message: ChatMessage) => void;
  onDelete: (messageId: string) => void;
  onRetry: (messageId: string) => void;
}

export function MessageList({ messages, otherUser, isTyping, onReact, onReply, onEdit, onDelete, onRetry }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, isTyping]);

  let lastDateGroup = '';

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
      <div className="mx-auto flex max-w-[760px] flex-col gap-3">
        {messages.map((message, i) => {
          const showDate = message.dateGroup !== lastDateGroup;
          lastDateGroup = message.dateGroup;
          const prev = messages[i - 1];
          const isOwn = message.senderId === 'me';
          const showAvatar = !isOwn && (!prev || prev.senderId !== message.senderId || showDate);

          return (
            <div key={message.id}>
              {showDate && <DateSeparator label={message.dateGroup} />}
              <MessageBubble
                message={message}
                sender={isOwn ? undefined : otherUser}
                isOwn={isOwn}
                showAvatar={showAvatar}
                onReact={onReact}
                onReply={onReply}
                onEdit={onEdit}
                onDelete={onDelete}
                onRetry={onRetry}
              />
            </div>
          );
        })}

        {isTyping && <TypingIndicator name={otherUser.name} color={otherUser.avatarColor} initials={otherUser.initials} />}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}