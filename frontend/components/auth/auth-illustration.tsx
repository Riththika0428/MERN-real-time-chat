import { NodeField } from '@/components/hero/node-field';

interface AuthIllustrationProps {
  heading?: string;
  subheading?: string;
}

export function AuthIllustration({
  heading = 'Every conversation, right where you left it.',
  subheading = 'Sign in to pick up your messages, exactly as you left them.',
}: AuthIllustrationProps) {
  return (
    <div className="relative hidden h-full flex-col justify-between overflow-hidden bg-ink px-12 py-14 dark:bg-surface-elevated dark:border-l dark:border-border lg:flex">
      <NodeField />

      <div className="relative z-10 font-display text-xl font-bold text-surface">TalkNode</div>

      <div className="relative z-10 max-w-sm">
        <div className="mb-8 space-y-3">
          <div className="max-w-[78%] rounded-2xl rounded-bl-md bg-white/10 px-4 py-2.5 text-[13px] leading-snug text-surface backdrop-blur-sm">
            Good morning! Ready for the 10am sync?
          </div>
          <div className="ml-auto max-w-[78%] rounded-2xl rounded-br-md bg-accent-solid px-4 py-2.5 text-[13px] leading-snug text-accent-on">
            Always. See you there 👋
          </div>
        </div>
        <h2 className="font-display text-[26px] font-bold leading-tight text-surface">{heading}</h2>
        <p className="mt-2.5 text-[14px] leading-relaxed text-surface/65 dark:text-ink-secondary">{subheading}</p>
      </div>
    </div>
  );
}