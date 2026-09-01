import type { ChatUser, Conversation, ChatMessage } from './types';
import { formatConversationTime, formatDateGroup, formatMessageTime } from './format';

const PALETTE = ['#0A8F82', '#5B6472', '#8992A0', '#B08A3E', '#7C5CBF', '#2A6F97'];

function colorFromId(id: string) {
  const sum = [...id].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return PALETTE[sum % PALETTE.length];
}

function initialsFrom(name: string) {
  const parts = name.trim().split(/\s+/);
  return parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '').join('') || '?';
}

// --- Raw shapes as returned by the Express API (see backend models) ---
export interface RawUser {
  _id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  isOnline: boolean;
  lastSeen?: string;
}

export interface RawMessage {
  _id: string;
  conversation: string;
  sender: RawUser | string;
  text: string;
  attachmentUrl?: string;
  attachmentType?: string;
  createdAt: string;
}

export interface RawConversation {
  _id: string;
  participants: RawUser[];
  lastMessage?: RawMessage | null;
  lastMessageAt: string;
}

export function mapUser(raw: RawUser): ChatUser {
  return {
    id: raw._id,
    name: raw.username,
    username: raw.username,
    avatarColor: colorFromId(raw._id),
    initials: initialsFrom(raw.username),
    online: raw.isOnline,
    lastSeen: raw.lastSeen ? `Last seen ${new Date(raw.lastSeen).toLocaleString()}` : undefined,
  };
}

export function mapConversation(raw: RawConversation, currentUserId: string): Conversation {
  const otherRaw = raw.participants.find((p) => p._id !== currentUserId) ?? raw.participants[0];
  const user = mapUser(otherRaw);

  return {
    id: raw._id,
    user,
    lastMessage: raw.lastMessage?.text || (raw.lastMessage?.attachmentUrl ? 'Sent an attachment' : 'Start the conversation'),
    lastMessageTime: formatConversationTime(raw.lastMessageAt),
    // Not tracked by the backend yet — defaults until conversation flags/unread counts are added server-side.
    unreadCount: 0,
    muted: false,
    favorite: false,
    archived: false,
  };
}

export function mapMessage(raw: RawMessage, currentUserId: string): ChatMessage {
  const senderId = typeof raw.sender === 'string' ? raw.sender : raw.sender._id;
  const isOwn = senderId === currentUserId;

  return {
    id: raw._id,
    senderId: isOwn ? 'me' : senderId,
    type: raw.attachmentUrl ? (raw.attachmentType === 'image' ? 'image' : 'file') : 'text',
    text: raw.text,
    imageUrl: raw.attachmentType === 'image' ? raw.attachmentUrl : undefined,
    fileName: raw.attachmentType !== 'image' ? raw.attachmentUrl?.split('/').pop() : undefined,
    timestamp: formatMessageTime(raw.createdAt),
    dateGroup: formatDateGroup(raw.createdAt),
    // Read receipts aren't tracked by the backend yet — 'sent' is the only real signal available.
    status: isOwn ? 'sent' : undefined,
  };
}