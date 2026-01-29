'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

type Props = {
  children: React.ReactNode;
};

const NAV_ITEMS = [
  { href: '/', label: '오늘' },
  { href: '/calendar', label: '캘린더' },
  { href: '/settings', label: '설정' },
];

export function AppShell({ children }: Props) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-900 to-primary-950 text-neutral-50 flex flex-col">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-primary-900/80 backdrop-blur-sm">
        <div className="mx-auto max-w-xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-neutral-400">
                {pathname === '/' && new Date().toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                }).replace(/\./g, '.').replace(/\s/g, '')}
              </p>
              <h1 className="text-lg font-semibold tracking-tight text-neutral-50">
                {pathname === '/' && 'Today'}
                {pathname === '/calendar' && 'Calendar'}
                {pathname === '/settings' && 'Settings'}
              </h1>
            </div>
            <div className="flex gap-2">
              <Link
                href="/calendar"
                className={cn(
                  'h-11 w-11 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center transition-colors',
                  'hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500',
                  pathname === '/calendar' && 'border-accent-700/60 ring-1 ring-accent-500/20',
                )}
              >
                📅
              </Link>
              <Link
                href="/settings"
                className={cn(
                  'h-11 w-11 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center transition-colors',
                  'hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500',
                  pathname === '/settings' && 'border-accent-700/60 ring-1 ring-accent-500/20',
                )}
              >
                ⚙️
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-xl px-4 py-6">{children}</main>

      <nav className="fixed bottom-0 left-0 right-0 border-t border-white/10 bg-primary-950/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-xl items-center justify-around px-4 py-3 text-xs">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-1 items-center justify-center rounded-2xl px-3 py-2 transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500',
                  active
                    ? 'text-accent-500 font-semibold'
                    : 'text-neutral-200 hover:text-neutral-50',
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

