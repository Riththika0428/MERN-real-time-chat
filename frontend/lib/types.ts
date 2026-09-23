export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
export type NavTab = 'all' | 'unread' | 'groups' | 'favorites' | 'archived';

export interface ChatUser {
  id: string;
  name: string;
  username: string;
  email?: string;
  avatarUrl?: string;
  avatarColor: string;
  initials: string;
  online: boolean;
  lastSeen?: string;
  about?: string;
  bio?: string;
  joinedAt?: string;
  isGroup?: boolean;
  memberCount?: number;
  description?: string;
  members?: ChatUser[];
  adminIds?: string[];
}

export interface Reaction {
  emoji: string;
  count: number;
  reactedByMe: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  type: 'text' | 'image' | 'file' | 'link';
  text?: string;
  imageUrl?: string;
  fileName?: string;
  fileSize?: string;
  link?: { title: string; description: string; domain: string };
  timestamp: string;
  dateGroup: string;
  status?: MessageStatus;
  reactions?: Reaction[];
  edited?: boolean;
  replyTo?: { senderName: string; text: string };
}

export interface Conversation {
  id: string;
  user: ChatUser;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  muted: boolean;
  favorite: boolean;
  archived: boolean;
}