import type { ChatUser, Conversation, ChatMessage } from './types';

export const CURRENT_USER: ChatUser = {
  id: 'me',
  name: 'Alex Rivera',
  username: 'alexrivera',
  avatarColor: '#0A8F82',
  initials: 'AR',
  online: true,
};

export const USERS: Record<string, ChatUser> = {
  mira: { id: 'mira', name: 'Mira K.', username: 'mirak', avatarColor: '#0A8F82', initials: 'MK', online: true, about: 'Product design lead. Coffee-powered.' },
  jordan: { id: 'jordan', name: 'Jordan D.', username: 'jordand', avatarColor: '#5B6472', initials: 'JD', online: true, about: 'Backend engineer, occasional hiker.' },
  rae: { id: 'rae', name: 'Rae S.', username: 'raes', avatarColor: '#8992A0', initials: 'RS', online: false, lastSeen: 'Last seen 3h ago', about: 'Marketing @TalkNode' },
  theo: { id: 'theo', name: 'Theo N.', username: 'theon', avatarColor: '#B08A3E', initials: 'TN', online: true, about: 'Full-stack, into synths.' },
  priya: { id: 'priya', name: 'Priya M.', username: 'priyam', avatarColor: '#7C5CBF', initials: 'PM', online: false, lastSeen: 'Last seen yesterday' },
  designTeam: { id: 'designTeam', name: 'Design Team', username: 'group', avatarColor: '#0A8F82', initials: 'DT', online: true, isGroup: true, memberCount: 6, about: 'Design crit, critique, and chaos.' },
};

export const CONVERSATIONS: Conversation[] = [
  { id: 'c1', user: USERS.mira, lastMessage: 'Perfect, sending it over', lastMessageTime: '10:42 AM', unreadCount: 0, muted: false, favorite: true, archived: false },
  { id: 'c2', user: USERS.designTeam, lastMessage: 'Theo: Updated the mockups 🎨', lastMessageTime: '9:58 AM', unreadCount: 4, muted: false, favorite: false, archived: false },
  { id: 'c3', user: USERS.jordan, lastMessage: 'Sent a file', lastMessageTime: 'Yesterday', unreadCount: 2, muted: true, favorite: false, archived: false },
  { id: 'c4', user: USERS.rae, lastMessage: 'Sounds good 👍', lastMessageTime: 'Yesterday', unreadCount: 0, muted: false, favorite: false, archived: false },
  { id: 'c5', user: USERS.theo, lastMessage: 'See you at 6', lastMessageTime: 'Mon', unreadCount: 0, muted: false, favorite: true, archived: false },
  { id: 'c6', user: USERS.priya, lastMessage: 'Thanks for the review!', lastMessageTime: 'Sun', unreadCount: 0, muted: false, favorite: false, archived: true },
];

export const MESSAGES_C1: ChatMessage[] = [
  { id: 'm0', senderId: 'mira', type: 'text', text: 'Morning! Quick one before the review tomorrow.', timestamp: '6:15 PM', dateGroup: 'Yesterday' },
  { id: 'm1', senderId: 'mira', type: 'text', text: 'Hey! Are we still on for the design review?', timestamp: '10:20 AM', dateGroup: 'Today' },
  { id: 'm2', senderId: 'me', type: 'text', text: 'Yes — pulling up the file now', timestamp: '10:21 AM', dateGroup: 'Today', status: 'read' },
  { id: 'm3', senderId: 'mira', type: 'image', imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600', text: "Here's the latest export", timestamp: '10:25 AM', dateGroup: 'Today' },
  { id: 'm4', senderId: 'me', type: 'text', text: 'Love the new spacing on the cards', timestamp: '10:26 AM', dateGroup: 'Today', status: 'read', reactions: [{ emoji: '🔥', count: 1, reactedByMe: false }] },
  { id: 'm5', senderId: 'mira', type: 'file', fileName: 'design-review-notes.pdf', fileSize: '1.2 MB', timestamp: '10:30 AM', dateGroup: 'Today' },
  { id: 'm6', senderId: 'me', type: 'text', text: 'Got it, reviewing now', timestamp: '10:31 AM', dateGroup: 'Today', status: 'read', edited: true },
  { id: 'm7', senderId: 'mira', type: 'link', link: { title: 'TalkNode Design System', description: 'Component library and design tokens for the TalkNode product.', domain: 'figma.com' }, timestamp: '10:35 AM', dateGroup: 'Today' },
  { id: 'm8', senderId: 'me', type: 'text', text: 'This is exactly what we needed', timestamp: '10:36 AM', dateGroup: 'Today', status: 'delivered', reactions: [{ emoji: '❤️', count: 2, reactedByMe: true }] },
  { id: 'm9', senderId: 'mira', type: 'text', text: 'Perfect, sending it over', timestamp: '10:42 AM', dateGroup: 'Today' },
  { id: 'm10', senderId: 'me', type: 'text', text: 'Can you also loop in Jordan on this thread?', timestamp: '10:44 AM', dateGroup: 'Today', status: 'failed' },
];