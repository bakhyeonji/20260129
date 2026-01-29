'use client';

import { AppShell } from '@/widgets/app-shell/AppShell';
import { CalendarScreen } from '@/widgets/calendar/CalendarScreen';

export default function CalendarPage() {
  return (
    <AppShell>
      <CalendarScreen />
    </AppShell>
  );
}
