type ConnectionState = 'lost' | 'reconnecting' | 'offline';

const config: Record<ConnectionState, { text: string; tone: string }> = {
  lost: { text: 'Connection lost — trying to reconnect…', tone: 'bg-amber-500/15 text-amber-600 dark:text-amber-400' },
  reconnecting: { text: 'Reconnecting…', tone: 'bg-amber-500/15 text-amber-600 dark:text-amber-400' },
  offline: { text: 'No internet connection', tone: 'bg-rose-500/15 text-rose-600 dark:text-rose-400' },
};

export function ConnectionBanner({ status }: { status: ConnectionState }) {
  const { text, tone } = config[status];
  return (
    <div className={`flex items-center justify-center gap-2 px-4 py-2 font-mono text-[12px] ${tone}`}>
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
      </span>
      {text}
    </div>
  );
}