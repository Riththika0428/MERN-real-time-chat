'use client';

import { useState } from 'react';
import { useSettings } from '@/lib/settings-context';
import { SectionShell, SectionCard } from '../section-shell';
import { ToggleRow } from '../toggle-row';

export function NotificationsSection() {
  const { settings, updateSetting } = useSettings();
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const handleDesktopToggle = async (checked: boolean) => {
    if (!checked) {
      updateSetting('desktopNotifications', false);
      return;
    }
    if (typeof Notification === 'undefined') {
      setPermissionError('This browser doesn\u2019t support desktop notifications.');
      return;
    }
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      updateSetting('desktopNotifications', true);
      setPermissionError(null);
      new Notification('TalkNode', { body: 'Desktop notifications are now on.' });
    } else {
      setPermissionError('Permission was denied in your browser settings.');
    }
  };

  return (
    <SectionShell title="Notifications" description="Control how and when TalkNode notifies you.">
      <SectionCard>
        <ToggleRow
          id="message-notifications"
          label="Message notifications"
          description="Show an in-app alert when a new message arrives"
          checked={settings.messageNotifications}
          onChange={(v) => updateSetting('messageNotifications', v)}
        />
        <ToggleRow
          id="sound-enabled"
          label="Sound"
          description="Play a sound for new messages"
          checked={settings.soundEnabled}
          onChange={(v) => updateSetting('soundEnabled', v)}
        />
        <div>
          <ToggleRow
            id="desktop-notifications"
            label="Desktop notifications"
            description="Show a system notification, even when TalkNode isn't focused"
            checked={settings.desktopNotifications}
            onChange={handleDesktopToggle}
          />
          {permissionError && <p className="pb-2 text-[12px] font-medium text-rose-500">{permissionError}</p>}
        </div>
      </SectionCard>

      <SectionCard>
        <ToggleRow
          id="email-notifications"
          label="Email notifications"
          description="Not yet connected — the backend has no email delivery set up"
          checked={settings.emailNotifications}
          onChange={(v) => updateSetting('emailNotifications', v)}
          disabled
        />
      </SectionCard>
    </SectionShell>
  );
}