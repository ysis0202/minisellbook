'use client';

import { useRouter } from 'next/navigation';
import { AppLogo } from '@/components/app-logo';
import { NotificationSettings } from '@/components/notification-settings';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotificationsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 헤더 */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md">
        <div className="px-4 pt-3 pb-2 flex justify-center">
          <AppLogo size="sm" />
        </div>
        <div className="px-4 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="h-8 w-8 rounded-full hover:bg-white/20 text-white -ml-2"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-bold">알림 설정</h1>
          </div>
          <p className="text-emerald-50 text-xs ml-8">중요한 재정 활동 알림을 관리하세요</p>
        </div>
      </div>

      <div className="p-3">
        <NotificationSettings />
      </div>
    </div>
  );
}

