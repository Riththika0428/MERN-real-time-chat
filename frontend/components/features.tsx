import { Eyebrow } from '@/components/ui/eyebrow';

const features = [
  {
    title: 'Real-time messaging',
    description:
      "Messages arrive the moment they're sent, powered by a persistent Socket.IO connection — no refreshing, no delay.",
    icon: (
      <path d="M4 4h16v12H7l-3 3V4z M8 9h8M8 12h5" />
    ),
  },
  {
    title: 'Secure authentication',
    description: 'Accounts are protected with hashed passwords and signed JWT sessions, so only you can access your conversations.',
    icon: <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z M9.5 12l1.8 1.8L15 10" />,
  },
  {
    title: 'Online presence',
    description: "See who's online, who's away, and when someone was last active — so you always know when to expect a reply.",
    icon: (
      <>
        <circle cx="12" cy="8" r="3.2" />
        <path d="M5 20c0-3.6 3-6 7-6s7 2.4 7 6" />
        <circle cx="19" cy="6" r="2" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    title: 'File & image sharing',
    description: 'Drop in photos and documents right inside the conversation — they show up instantly for everyone in the thread.',
    icon: <path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5z M14 3v5h5" />,
  },
  {
    title: 'Built for every screen',
    description: 'A layout that adapts cleanly from a widescreen desktop down to a phone in your pocket, without losing function.',
    icon: (
      <>
        <rect x="3" y="4" width="18" height="12" rx="2" />
        <rect x="7" y="19" width="10" height="1.6" rx="0.8" fill="currentColor" stroke="none" />
        <path d="M9 19v-3M15 19v-3" />
      </>
    ),
  },
  {
    title: 'Full message history',
    description: 'Every conversation is saved and searchable, so you can pick up exactly where you left off, any time.',
    icon: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7v5l3.2 2" />
      </>
    ),
  },
];

export function Features() {
  return (
    <section id="features" className="border-y border-border-soft bg-surface-elevated px-5 py-16 sm:px-8 md:py-24">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-12 max-w-[560px] md:mb-14">
          <Eyebrow>What TalkNode gives you</Eyebrow>
          <h2 className="mt-3.5 font-display text-3xl font-bold tracking-tight text-ink md:text-[36px]">
            Everything a conversation needs
          </h2>
          <p className="mt-3 text-base leading-relaxed text-ink-secondary">
            No clutter, no friction — just the fundamentals of great messaging, done properly.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-md border border-border bg-surface p-6 transition-all duration-200 hover:-translate-y-[3px] hover:border-ink-tertiary hover:shadow-md"
            >
              <div className="mb-[18px] flex h-[42px] w-[42px] items-center justify-center rounded-[11px] bg-accent-tint">
                <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-5 w-5 stroke-accent-solid">
                  {f.icon}
                </svg>
              </div>
              <h3 className="mb-2 font-display text-[16.5px] font-semibold text-ink">{f.title}</h3>
              <p className="text-[13.5px] leading-relaxed text-ink-secondary">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}