import { Eyebrow } from '@/components/ui/eyebrow';
import { ButtonLink } from '@/components/ui/button';
import { NodeField } from '@/components/hero/node-field';
import { AppMockup } from '@/components/hero/app-mockup';

const trustItems = ['Sub-50ms delivery', 'End-to-end secured', '99.98% uptime'];

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden px-5 pb-16 pt-16 sm:px-8 md:pt-24">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-10 md:grid-cols-2">
        <div>
          <Eyebrow>Real-time messaging, reimagined</Eyebrow>
          <h1 className="mt-5 font-display text-[38px] font-bold leading-[1.08] tracking-tight text-ink md:text-[56px]">
            Connect. Chat.
            <br />
            Stay <span className="text-accent-solid">Connected.</span>
          </h1>
          <p className="mt-[22px] max-w-[460px] text-[17px] leading-relaxed text-ink-secondary">
            TalkNode delivers messages the instant they&apos;re sent, keeps you signed in securely, and shows you
            who&apos;s around — so conversations feel like you&apos;re in the same room, even when you&apos;re not.
          </p>
          <div className="mt-[34px] flex flex-wrap gap-3">
            <ButtonLink href="#get-started" variant="solid" size="lg">
              Start Chatting
            </ButtonLink>
            <ButtonLink href="#features" variant="outline" size="lg">
              Explore Features
            </ButtonLink>
          </div>
          <div className="mt-11 flex flex-wrap gap-7 font-mono text-[12.5px] text-ink-tertiary">
            {trustItems.map((item) => (
              <span key={item} className="flex items-center gap-2">
                <span className="h-[5px] w-[5px] rounded-full bg-accent" aria-hidden="true" />
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="relative h-[380px] md:h-[560px]">
          <NodeField />
          <AppMockup />
        </div>
      </div>
    </section>
  );
}