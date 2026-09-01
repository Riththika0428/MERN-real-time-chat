'use client';

import { useState } from 'react';
import { Avatar } from '@/components/ui/avatar';
import type { ChatMessage, ChatUser } from '@/lib/types';

const QUICK_REACTIONS = ['👍', '❤️', '😂', '🔥', '🙌'];

function StatusTicks({ status }: { status: ChatMessage['status'] }) {
  if (status === 'sending') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3 animate-spin opacity-70">
        <path d="M21 12a9 9 0 11-3-6.7" />
      </svg>
    );
  }
  if (status === 'failed') {
    return (
      <span className="flex items-center gap-1 text-rose-500">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v5M12 16h.01" />
        </svg>
        Failed
      </span>
    );
  }
  const doubleCheck = status === 'delivered' || status === 'read';
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className={`h-3.5 w-3.5 ${status === 'read' ? 'text-accent-solid' : 'text-ink-tertiary'}`}>
      <path d="M2 12l4 4L14 8" />
      {doubleCheck && <path d="M8 12l4 4L20 8" />}
    </svg>
  );
}

interface MessageBubbleProps {
  message: ChatMessage;
  sender?: ChatUser;
  isOwn: boolean;
  showAvatar: boolean;
  onReact: (messageId: string, emoji: string) => void;
  onReply: (message: ChatMessage) => void;
  onEdit: (message: ChatMessage) => void;
  onDelete: (messageId: string) => void;
  onRetry: (messageId: string) => void;
}

export function MessageBubble({ message, sender, isOwn, showAvatar, onReact, onReply, onEdit, onDelete, onRetry }: MessageBubbleProps) {
  const [showReactions, setShowReactions] = useState(false);

  const bubbleBase = 'max-w-full rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-relaxed';
  const bubbleTone = isOwn
    ? `bg-accent-solid text-accent-on rounded-br-md ${message.status === 'failed' ? 'opacity-60' : ''}`
    : 'bg-surface-sunken text-ink rounded-bl-md';

  return (
    <div className={`group flex items-end gap-2 ${isOwn ? 'flex-row-reverse' : ''}`}>
      {!isOwn && (
        <div className="w-[26px] shrink-0">
          {showAvatar && sender && <Avatar initials={sender.initials} color={sender.avatarColor} showStatus={false} size={26} />}
        </div>
      )}

      <div className={`flex max-w-[75%] flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
        {message.replyTo && (
          <div className="mb-1 max-w-full rounded-lg border-l-2 border-accent-solid bg-surface-sunken px-2.5 py-1.5 text-[11.5px] text-ink-secondary">
            <span className="font-semibold text-ink">{message.replyTo.senderName}</span>
            <p className="truncate">{message.replyTo.text}</p>
          </div>
        )}

        <div className="relative">
          <div className={`${bubbleBase} ${bubbleTone}`}>
            {message.type === 'text' && <p className="whitespace-pre-wrap">{message.text}</p>}

            {message.type === 'image' && (
              <div className="max-w-[240px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={message.imageUrl} alt="Shared" className="rounded-lg" />
                {message.text && <p className="mt-1.5">{message.text}</p>}
              </div>
            )}

            {message.type === 'file' && (
              <div className="flex min-w-[220px] items-center gap-3">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${isOwn ? 'bg-white/15' : 'bg-surface'}`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-[18px] w-[18px]">
                    <path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5z" />
                    <path d="M14 3v5h5" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{message.fileName}</p>
                  <p className={`text-[11.5px] ${isOwn ? 'text-white/70' : 'text-ink-tertiary'}`}>{message.fileSize}</p>
                </div>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-[16px] w-[16px] shrink-0">
                  <path d="M12 4v11M7 11l5 5 5-5M5 20h14" />
                </svg>
              </div>
            )}

            {message.type === 'link' && message.link && (
              <a href="#" className={`block max-w-[260px] overflow-hidden rounded-lg border ${isOwn ? 'border-white/20' : 'border-border'}`}>
                <div className={`px-3 py-2.5 ${isOwn ? 'bg-white/10' : 'bg-surface'}`}>
                  <p className="font-mono text-[10.5px] uppercase tracking-wide opacity-70">{message.link.domain}</p>
                  <p className="mt-0.5 font-semibold">{message.link.title}</p>
                  <p className={`mt-0.5 text-[12px] ${isOwn ? 'text-white/70' : 'text-ink-secondary'}`}>{message.link.description}</p>
                </div>
              </a>
            )}
          </div>

          <div
            className={`absolute top-1/2 hidden -translate-y-1/2 items-center gap-0.5 rounded-lg border border-border bg-surface-elevated p-0.5 shadow-md group-hover:flex ${
              isOwn ? 'right-full mr-1.5' : 'left-full ml-1.5'
            }`}
          >
            <button onClick={() => setShowReactions((v) => !v)} aria-label="React" className="flex h-7 w-7 items-center justify-center rounded-md text-ink-tertiary hover:bg-surface-sunken hover:text-ink">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-[15px] w-[15px]">
                <circle cx="12" cy="12" r="9" />
                <path d="M8.5 14s1.2 2 3.5 2 3.5-2 3.5-2M9 9h.01M15 9h.01" />
              </svg>
            </button>
            <button onClick={() => onReply(message)} aria-label="Reply" className="flex h-7 w-7 items-center justify-center rounded-md text-ink-tertiary hover:bg-surface-sunken hover:text-ink">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-[15px] w-[15px]">
                <path d="M9 14L4 9l5-5M4 9h9a6 6 0 016 6v3" />
              </svg>
            </button>
            {isOwn && message.type === 'text' && (
              <button onClick={() => onEdit(message)} aria-label="Edit" className="flex h-7 w-7 items-center justify-center rounded-md text-ink-tertiary hover:bg-surface-sunken hover:text-ink">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-[15px] w-[15px]">
                  <path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              </button>
            )}
            {isOwn && (
              <button onClick={() => onDelete(message.id)} aria-label="Delete" className="flex h-7 w-7 items-center justify-center rounded-md text-ink-tertiary hover:bg-rose-500/10 hover:text-rose-500">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-[15px] w-[15px]">
                  <path d="M4 7h16M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2m-8 0v12a2 2 0 002 2h4a2 2 0 002-2V7" />
                </svg>
              </button>
            )}
          </div>

          {showReactions && (
            <div className={`absolute -top-11 z-10 flex items-center gap-1 rounded-full border border-border bg-surface-elevated px-2 py-1.5 shadow-md ${isOwn ? 'right-0' : 'left-0'}`}>
              {QUICK_REACTIONS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    onReact(message.id, emoji);
                    setShowReactions(false);
                  }}
                  className="flex h-7 w-7 items-center justify-center rounded-full text-[15px] hover:bg-surface-sunken"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {message.reactions && message.reactions.length > 0 && (
          <div className="mt-1 flex gap-1">
            {message.reactions.map((r) => (
              <button
                key={r.emoji}
                onClick={() => onReact(message.id, r.emoji)}
                className={`flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[11px] ${
                  r.reactedByMe ? 'border-accent-solid bg-accent-tint text-accent-solid' : 'border-border bg-surface-elevated text-ink-secondary'
                }`}
              >
                <span>{r.emoji}</span>
                <span>{r.count}</span>
              </button>
            ))}
          </div>
        )}

        <div className={`mt-1 flex items-center gap-1.5 px-1 font-mono text-[10.5px] text-ink-tertiary ${isOwn ? 'flex-row-reverse' : ''}`}>
          {message.edited && <span>Edited</span>}
          <span>{message.timestamp}</span>
          {isOwn && message.status && (
            <button onClick={() => message.status === 'failed' && onRetry(message.id)} className={message.status === 'failed' ? 'cursor-pointer underline' : ''}>
              <StatusTicks status={message.status} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}