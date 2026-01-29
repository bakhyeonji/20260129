'use client';

import { AppShell } from '@/widgets/app-shell/AppShell';
import { TodayChatScreen } from '@/widgets/today-chat/TodayChatScreen';

export default function Home() {
  return (
    <AppShell>
      <TodayChatScreen />
    </AppShell>
  );
}

