'use client';

import { useSettings } from '@/lib/settings-context';
import { SectionShell, SectionCard } from '../section-shell';
import { ToggleRow } from '../toggle-row';
import { WallpaperPicker } from '../wallpaper-picker';

export function ChatSection() {
  const { settings, updateSetting } = useSettings();

  return (
    <SectionShell title="Chat" description="Customize how conversations look and behave.">
      <SectionCard>
        <ToggleRow
          id="enter-to-send"
          label="Enter to send"
          description="Press Enter to send a message; Shift+Enter for a new line"
          checked={settings.enterToSend}
          onChange={(v) => updateSetting('enterToSend', v)}
        />
        <ToggleRow
          id="media-auto-download"
          label="Media auto-download"
          description="Automatically download images and files in chats"
          checked={settings.mediaAutoDownload}
          onChange={(v) => updateSetting('mediaAutoDownload', v)}
        />
      </SectionCard>

      <SectionCard title="Chat wallpaper">
        <WallpaperPicker value={settings.wallpaper} onChange={(w) => updateSetting('wallpaper', w)} />
      </SectionCard>
    </SectionShell>
  );
}