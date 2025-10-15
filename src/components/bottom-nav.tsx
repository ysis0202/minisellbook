'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Calendar, TrendingUp, Search, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/home', label: '홈', icon: Home },
  { href: '/calendar', label: '요약', icon: Calendar },
  { href: '/stats', label: '통계', icon: TrendingUp },
  { href: '/search', label: '검색', icon: Search },
  { href: '/profile', label: '더보기', icon: Menu },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg safe-area-pb z-50">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-all duration-200 min-w-0 flex-1 active:scale-95',
                isActive
                  ? 'text-emerald-600 bg-emerald-50'
                  : 'text-gray-500 active:text-gray-900 active:bg-gray-100'
              )}
            >
              <Icon className={cn(
                'transition-all duration-200',
                isActive ? 'w-6 h-6 stroke-[2.5]' : 'w-5 h-5'
              )} />
              <span className={cn(
                'text-[11px] font-semibold transition-all',
                isActive && 'scale-105'
              )}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}