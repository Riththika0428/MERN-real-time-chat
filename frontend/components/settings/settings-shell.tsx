'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SettingsNav, settingsCategories, type SettingsCategory } from './settings-nav';
import { AccountSection } from './sections/account-section';
import { AppearanceSection } from './sections/appearance-section';
import { NotificationsSection } from './sections/notifications-section';
import { PrivacySection } from './sections/privacy-section';
import { ChatSection } from './sections/chat-section';

const sectionComponents: Record<SettingsCategory, React.ComponentType> = {
  account: AccountSection,
  appearance: AppearanceSection,
  notifications: NotificationsSection,
  privacy: PrivacySection,
  chat: ChatSection,
};

export function SettingsShell() {
  const [category, setCategory] = useState<SettingsCategory>('account');
  const [mobileView, setMobileView] = useState<'list' | 'detail'>('list');
  const ActiveSection = sectionComponents[category];

  const handleSelect = (c: SettingsCategory) => {
    setCategory(c);
    setMobileView('detail');
  };

  return (
    <div className="min-h-dvh bg-surface-sunken">
      <div className="mx-auto max-w-[880px] px-4 py-6 sm:px-6 sm:py-10">
        <Link href="/chat" className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-secondary hover:text-ink">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Back to chats
        </Link>

        <h1 className="mb-6 font-display text-2xl font-bold text-ink">Settings</h1>

        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <div className="hidden w-[200px] shrink-0 md:block">
            <SettingsNav active={category} onChange={handleSelect} />
          </div>

          {/* Mobile: category list */}
          <div className={`w-full md:hidden ${mobileView === 'detail' ? 'hidden' : 'block'}`}>
            <SettingsNav active={category} onChange={handleSelect} />
          </div>

          {/* Content — always visible on desktop, only in 'detail' view on mobile */}
          <div className={`min-w-0 flex-1 ${mobileView === 'list' ? 'hidden md:block' : 'block'}`}>
            <button
              onClick={() => setMobileView('list')}
              className="mb-4 flex items-center gap-1.5 text-[13px] font-medium text-ink-secondary hover:text-ink md:hidden"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              {settingsCategories.find((c) => c.id === category)?.label}
            </button>
            <ActiveSection />
          </div>
        </div>
      </div>
    </div>
  );
}