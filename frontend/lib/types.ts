export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
export type NavTab = 'all' | 'unread' | 'groups' | 'favorites' | 'archived';

export interface ChatUser {
  id: string;
  name: string;
  username: string;
  avatarColor: string;
  initials: string;
  online: boolean;
  lastSeen?: string;
  about?: string;
  isGroup?: boolean;
  memberCount?: number;
}

export interface Reaction {
  emoji: string;
  count: number;
  reactedByMe: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string; // 'me' or a ChatUser id
  type: 'text' | 'image' | 'file' | 'link';
  text?: string;
  imageUrl?: string;
  fileName?: string;
  fileSize?: string;
  link?: { title: string; description: string; domain: string };
  timestamp: string;
  dateGroup: string; // 'Today' | 'Yesterday' | 'Mon, Aug 10'
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