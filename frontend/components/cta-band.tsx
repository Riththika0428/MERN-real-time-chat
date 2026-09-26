import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function CtaBand() {
  return (
    <section id="about" className="px-5 py-16 sm:px-8 md:py-24">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col items-center gap-6 rounded-lg bg-ink px-7 py-10 text-center dark:border dark:border-border dark:bg-surface-elevated sm:px-14 sm:py-14 md:flex-row md:justify-between md:text-left">
          <div>
            <h3 className="font-display text-[26px] font-bold tracking-tight text-surface md:text-[28px]">
              Ready to start talking?
            </h3>
            <p className="mt-2 text-[14.5px] text-surface/65 dark:text-ink-secondary">
              Create an account in under a minute — no credit card required.
            </p>
          </div>
          <Link href="/register" className="shrink-0">
            <Button variant="solid" size="lg">
              Get Started Free
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}