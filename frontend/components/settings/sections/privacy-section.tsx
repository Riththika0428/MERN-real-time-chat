'use client';

import { useSettings } from '@/lib/settings-context';
import { SectionShell, SectionCard } from '../section-shell';
import { ToggleRow } from '../toggle-row';

export function PrivacySection() {
  const { settings, updateSetting } = useSettings();

  return (
    <SectionShell title="Privacy" description="Control what other people can see about you.">
      <SectionCard>
        <ToggleRow
          id="online-status"
          label="Show online status"
          description="Not yet enforced by the server — it always reports your real status"
          checked={settings.onlineStatusVisible}
          onChange={(v) => updateSetting('onlineStatusVisible', v)}
          disabled
        />
        <ToggleRow
          id="last-seen"
          label="Show last seen"
          description="Not yet enforced by the server"
          checked={settings.lastSeenVisible}
          onChange={(v) => updateSetting('lastSeenVisible', v)}
          disabled
        />
        <ToggleRow
          id="read-receipts"
          label="Read receipts"
          description="The backend doesn't track read status yet, so this has no effect"
          checked={settings.readReceiptsEnabled}
          onChange={(v) => updateSetting('readReceiptsEnabled', v)}
          disabled
        />
      </SectionCard>

      <SectionCard title="Blocked users">
        <div className="flex flex-col items-center gap-2 py-6 text-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-6 w-6 text-ink-tertiary">
            <circle cx="12" cy="12" r="9" />
            <path d="M8 8l8 8" />
          </svg>
          <p className="text-[12.5px] text-ink-tertiary">No blocking system yet — this needs a backend endpoint.</p>
        </div>
      </SectionCard>
    </SectionShell>
  );
}