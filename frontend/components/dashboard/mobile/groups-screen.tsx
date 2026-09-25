import { ConversationItem } from '@/components/dashboard/sidebar/conversation-item';
import type { Conversation } from '@/lib/types';

interface GroupsScreenProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNewGroup: () => void;
  onToggleMute: (id: string) => void;
  onToggleArchive: (id: string) => void;
}

export function GroupsScreen({ conversations, activeId, onSelect, onNewGroup, onToggleMute, onToggleArchive }: GroupsScreenProps) {
  const groups = conversations.filter((c) => c.user.isGroup && !c.archived);

  return (
    <div className="flex h-full flex-col bg-surface">
      <div className="flex items-center justify-between px-4 pb-3 pt-4">
        <h1 className="font-display text-lg font-bold text-ink">Groups</h1>
        <button
          onClick={onNewGroup}
          aria-label="New group"
          className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-border bg-surface-elevated text-ink"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-[18px] w-[18px]">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-4">
        {groups.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-4 py-16 text-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-6 w-6 text-ink-tertiary">
              <circle cx="9" cy="8" r="3" />
              <path d="M2.5 19c0-3 2.9-5 6.5-5s6.5 2 6.5 5" />
              <circle cx="17" cy="8.5" r="2.4" />
              <path d="M15.5 14.2c2.7.4 4.5 2 4.5 4.8" />
            </svg>
            <p className="text-[13px] font-medium text-ink">No groups yet</p>
            <button onClick={onNewGroup} className="mt-1 rounded-[10px] bg-accent-solid px-4 py-2 text-[13px] font-semibold text-accent-on">
              Create a group
            </button>
          </div>
        ) : (
          <div className="space-y-0.5">
            {groups.map((c) => (
              <ConversationItem
                key={c.id}
                conversation={c}
                active={c.id === activeId}
                onClick={() => onSelect(c.id)}
                onToggleMute={onToggleMute}
                onToggleArchive={onToggleArchive}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}