'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Wallpaper = 'none' | 'dot-grid' | 'soft-teal' | 'warm-sand' | 'slate';

export interface SettingsState {
  // Notifications — messageNotifications and soundEnabled are enforced client-side
  // (they gate whether we'd play a sound / show a toast). desktopNotifications is
  // tied to the real browser Notification permission. emailNotifications has no
  // backend endpoint yet — toggling it does nothing server-side.
  messageNotifications: boolean;
  soundEnabled: boolean;
  desktopNotifications: boolean;
  emailNotifications: boolean;

  // Privacy — none of these are enforced by the backend yet. The server
  // always reports real online status and has no read-receipt or
  // last-seen-visibility concept. These toggles are stored for when that
  // backend support exists.
  onlineStatusVisible: boolean;
  lastSeenVisible: boolean;
  readReceiptsEnabled: boolean;

  // Chat — enterToSend is real (wired into the composer). mediaAutoDownload
  // is stored but not enforced anywhere yet (no media pipeline to gate).
  // wallpaper is real — applied to the message list background.
  enterToSend: boolean;
  mediaAutoDownload: boolean;
  wallpaper: Wallpaper;
}

const DEFAULT_SETTINGS: SettingsState = {
  messageNotifications: true,
  soundEnabled: true,
  desktopNotifications: false,
  emailNotifications: true,
  onlineStatusVisible: true,
  lastSeenVisible: true,
  readReceiptsEnabled: true,
  enterToSend: true,
  mediaAutoDownload: true,
  wallpaper: 'none',
};

interface SettingsContextValue {
  settings: SettingsState;
  updateSetting: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);
const STORAGE_KEY = 'talknode-settings';

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
    } catch {
      // fall back to defaults
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // storage unavailable — settings just won't persist across reloads
    }
  }, [settings, hydrated]);

  const updateSetting = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return <SettingsContext.Provider value={{ settings, updateSetting }}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within a SettingsProvider');
  return ctx;
}