import { Logo } from '@/components/ui/logo';

const columns = [
  {
    title: 'Product',
    links: ['Features', 'Security', 'Pricing', 'Changelog'],
  },
  {
    title: 'Company',
    links: ['About', 'Blog', 'Careers', 'Contact'],
  },
  {
    title: 'Resources',
    links: ['Documentation', 'API reference', 'Support', 'Status'],
  },
];

const socials = [
  {
    label: 'Twitter',
    path: 'M22 5.9c-.7.3-1.5.6-2.3.7.8-.5 1.5-1.3 1.8-2.3-.8.5-1.7.8-2.6 1a4.1 4.1 0 00-7 3.7A11.6 11.6 0 013 4.9a4.1 4.1 0 001.3 5.5c-.7 0-1.3-.2-1.9-.5 0 2 1.4 3.6 3.2 4a4.1 4.1 0 01-1.9.1 4.1 4.1 0 003.8 2.8A8.2 8.2 0 012 18.4a11.6 11.6 0 006.3 1.8c7.5 0 11.7-6.3 11.7-11.7v-.5c.8-.6 1.5-1.3 2-2.1z',
  },
  {
    label: 'GitHub',
    path: 'M12 2a10 10 0 00-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.5-1.1-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.7.3-1.1.6-1.4-2.2-.2-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.2-.5-1.2.1-2.6 0 0 .8-.3 2.7 1a9.4 9.4 0 015 0c1.9-1.3 2.7-1 2.7-1 .6 1.4.2 2.4.1 2.6.6.7 1 1.6 1 2.7 0 3.9-2.4 4.8-4.6 5 .3.3.6.9.6 1.8v2.6c0 .3.2.6.7.5A10 10 0 0012 2z',
  },
];

export function Footer() {
  return (
    <footer id="contact" className="border-t border-border-soft px-5 py-14 sm:px-8 md:py-[72px]">
      <div className="mx-auto max-w-[1200px]">
        <div className="grid grid-cols-1 gap-8 pb-10 sm:grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:pb-12">
          <div>
            <Logo size={24} />
            <p className="mt-3 max-w-[240px] text-[13.5px] leading-relaxed text-ink-secondary">
              A real-time messaging platform built for conversations that don&apos;t wait.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.08em] text-ink-tertiary">
                {col.title}
              </h4>
              {col.links.map((link) => (
               <a 
                  key={link}
                  href="#"
                  className="mb-3 block text-[13.5px] text-ink-secondary transition-colors hover:text-ink"
                >
                  {link}
                </a>
              ))}
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-4 border-t border-border-soft pt-7 text-[12.5px] text-ink-tertiary sm:flex-row sm:justify-between">
          <span>© 2026 TalkNode. All rights reserved.</span>
          <div className="flex gap-3.5">
            {socials.map((s) => (
              <a
                key={s.label}
                href="#"
                aria-label={s.label}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-ink-secondary hover:border-ink-tertiary hover:text-ink"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-[15px] w-[15px]">
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}