'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';

interface AppLogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function AppLogo({ className, showText = true, size = 'md' }: AppLogoProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const textSizeClasses = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
  };

  return (
    <Link href="/home" className={cn('flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform', className)}>
      {/* 로고 아이콘 */}
      <div className={cn(
        'rounded-lg bg-white flex items-center justify-center font-bold text-emerald-600 shadow-sm',
        sizeClasses[size]
      )}>
        <span className="text-lg leading-none">₩</span>
      </div>

      {/* 앱 이름 */}
      {showText && (
        <span className={cn('font-bold text-white', textSizeClasses[size])}>
          MoneyCells
        </span>
      )}
    </Link>
  );
}
