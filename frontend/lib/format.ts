export function formatMessageTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export function formatDateGroup(iso: string) {
  const date = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

  if (isSameDay(date, today)) return 'Today';
  if (isSameDay(date, yesterday)) return 'Yesterday';
  return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
}

export function formatConversationTime(iso: string) {
  const date = new Date(iso);
  const today = new Date();
  const isSameDay = date.toDateString() === today.toDateString();

  if (isSameDay) return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  const daysAgo = Math.floor((today.getTime() - date.getTime()) / 86400000);
  if (daysAgo === 1) return 'Yesterday';
  if (daysAgo < 7) return date.toLocaleDateString([], { weekday: 'short' });
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}