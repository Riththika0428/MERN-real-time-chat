'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/logo';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';

const links = [
  { href: '#home', label: 'Home' },
  { href: '#features', label: 'Features' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-[100] border-b border-border-soft bg-surface/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-[1200px] items-center justify-between px-5 py-[18px] sm:px-8">
        <Logo />

        <div className="hidden items-center gap-9 text-[14.5px] font-medium text-ink-secondary md:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="relative py-1.5 transition-colors hover:text-ink">
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <Link href="/login" className="hidden md:inline-flex">
            <Button variant="outline">Log in</Button>
          </Link>
          <Link href="/register" className="hidden md:inline-flex">
            <Button variant="solid">Get Started</Button>
          </Link>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Open menu"
            className="flex h-[38px] w-[38px] items-center justify-center rounded-[10px] border border-border bg-surface-elevated text-ink md:hidden"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6">
              <line x1="1" y1="4" x2="17" y2="4" />
              <line x1="1" y1="9" x2="17" y2="9" />
              <line x1="1" y1="14" x2="17" y2="14" />
            </svg>
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="border-t border-border-soft bg-surface-elevated px-5 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-md px-2 py-2.5 text-sm font-medium text-ink-secondary hover:bg-surface-sunken hover:text-ink"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="mt-3 flex gap-2 border-t border-border-soft pt-3">
            <Link href="/login" className="flex-1" onClick={() => setMenuOpen(false)}>
              <Button variant="outline" className="w-full justify-center">
                Log in
              </Button>
            </Link>
            <Link href="/register" className="flex-1" onClick={() => setMenuOpen(false)}>
              <Button variant="solid" className="w-full justify-center">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}