'use client';

import { useEffect } from 'react';
import { startNotificationScheduler } from '@/lib/notifications';

/**
 * 알림 스케줄러 컴포넌트
 * 
 * 앱 전역에서 알림 스케줄러를 시작합니다.
 * layout.tsx에 포함되어 자동으로 실행됩니다.
 */
export function NotificationScheduler() {
  useEffect(() => {
    // 클라이언트 사이드에서만 실행
    if (typeof window !== 'undefined') {
      startNotificationScheduler();
    }
  }, []);

  // UI를 렌더링하지 않음
  return null;
}

