'use client';

import { AppShell } from '@/widgets/app-shell/AppShell';
import { SettingsScreen } from '@/widgets/settings/SettingsScreen';

export default function SettingsPage() {
  return (
    <AppShell>
      <SettingsScreen />
    </AppShell>
  );
}
