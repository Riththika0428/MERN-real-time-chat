'use client';

import { useEffect, useRef, useState } from 'react';
import type { ChatMessage } from '@/lib/types';

const EMOJIS = ['😀', '😂', '😍', '👍', '🙏', '🔥', '🎉', '❤️', '😮', '😢', '👏', '🚀'];

interface ComposerProps {
  onSend: (text: string) => void;
  replyTo: ChatMessage | null;
  onCancelReply: () => void;
  editingMessage: ChatMessage | null;
  onCancelEdit: () => void;
  onSaveEdit: (id: string, text: string) => void;
}

export function Composer({ onSend, replyTo, onCancelReply, editingMessage, onCancelEdit, onSaveEdit }: ComposerProps) {
  const [text, setText] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [recording, setRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editingMessage?.text) setText(editingMessage.text);
  }, [editingMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    if (editingMessage) {
      onSaveEdit(editingMessage.id, text.trim());
    } else {
      onSend(text.trim());
    }
    setText('');
  };

  return (
    <div className="border-t border-border-soft bg-surface px-4 py-3 sm:px-6">
      {(replyTo || editingMessage) && (
        <div className="mb-2 flex items-center justify-between rounded-lg border-l-2 border-accent-solid bg-surface-sunken px-3 py-2">
          <div className="min-w-0">
            <p className="text-[11.5px] font-semibold text-accent-solid">{editingMessage ? 'Editing message' : `Replying to ${replyTo?.senderId === 'me' ? 'yourself' : 'them'}`}</p>
            <p className="truncate text-[12.5px] text-ink-secondary">{editingMessage?.text ?? replyTo?.text}</p>
          </div>
          <button onClick={editingMessage ? onCancelEdit : onCancelReply} aria-label="Cancel" className="shrink-0 rounded-md p-1 text-ink-tertiary hover:text-ink">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end gap-1.5">
        <button type="button" aria-label="Attach file" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] text-ink-secondary hover:bg-surface-sunken hover:text-ink">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-[19px] w-[19px]">
            <path d="M21.4 11.1l-9 9a5 5 0 01-7-7l9-9a3.5 3.5 0 015 5l-9 9a2 2 0 01-3-3l8.1-8" />
          </svg>
        </button>
        <button type="button" aria-label="Attach image" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] text-ink-secondary hover:bg-surface-sunken hover:text-ink">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-[19px] w-[19px]">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="9" cy="9" r="1.6" />
            <path d="M21 15l-5-5-9 9" />
          </svg>
        </button>

        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            rows={1}
            placeholder="Type a message…"
            className="max-h-32 w-full resize-none rounded-[20px] border border-border bg-surface-elevated py-2.5 pl-4 pr-11 text-[13.5px] text-ink placeholder:text-ink-tertiary focus:border-accent-solid focus:outline-none focus:ring-2 focus:ring-accent-tint"
          />
          <div className="absolute bottom-1.5 right-1.5">
            <button
              type="button"
              onClick={() => setShowEmoji((v) => !v)}
              aria-label="Emoji"
              className="flex h-8 w-8 items-center justify-center rounded-full text-ink-tertiary hover:bg-surface-sunken hover:text-ink"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-[17px] w-[17px]">
                <circle cx="12" cy="12" r="9" />
                <path d="M8.5 14s1.2 2 3.5 2 3.5-2 3.5-2M9 9h.01M15 9h.01" />
              </svg>
            </button>
          </div>

          {showEmoji && (
            <div className="absolute bottom-12 right-0 z-20 grid grid-cols-6 gap-1 rounded-lg border border-border bg-surface-elevated p-2 shadow-lg">
              {EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => {
                    setText((t) => t + emoji);
                    setShowEmoji(false);
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-[17px] hover:bg-surface-sunken"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {text.trim() ? (
          <button
            type="submit"
            aria-label="Send message"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-solid text-accent-on transition-transform hover:bg-accent-hover active:scale-95"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-[18px] w-[18px]">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        ) : (
          <button
            type="button"
            onMouseDown={() => setRecording(true)}
            onMouseUp={() => setRecording(false)}
            onMouseLeave={() => setRecording(false)}
            aria-label="Record voice message"
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors ${
              recording ? 'bg-rose-500 text-white' : 'bg-surface-sunken text-ink-secondary hover:text-ink'
            }`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-[18px] w-[18px]">
              <rect x="9" y="2" width="6" height="12" rx="3" />
              <path d="M5 10a7 7 0 0014 0M12 19v3" />
            </svg>
          </button>
        )}
      </form>
      {recording && <p className="mt-1.5 text-center font-mono text-[11px] text-rose-500">Recording… release to send</p>}
    </div>
  );
}