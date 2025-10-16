'use client';

import { useRouter } from 'next/navigation';
import { AppLogo } from '@/components/app-logo';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNotices } from '@/lib/hooks/use-notices';
import { NoticeCard } from '@/components/notice-card';
import { ChevronLeft, Bell, Megaphone } from 'lucide-react';

export default function NoticesPage() {
  const router = useRouter();
  const { data: notices, isLoading: noticesLoading } = useNotices();

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
            <Megaphone className="w-5 h-5" />
            <h1 className="text-lg font-bold">공지사항 & 이벤트</h1>
          </div>
          <p className="text-emerald-50 text-xs ml-8">새로운 소식과 이벤트를 확인하세요</p>
        </div>
      </div>

      <div className="p-3 space-y-3">
        {noticesLoading ? (
          <Card className="p-4">
            <div className="flex items-center justify-center text-sm text-gray-500">
              <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mr-2"></div>
              로딩 중...
            </div>
          </Card>
        ) : notices && notices.length > 0 ? (
          <div className="space-y-2">
            {notices.map((notice) => (
              <NoticeCard key={notice.id} notice={notice} />
            ))}
          </div>
        ) : (
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="p-8 text-center">
              <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm text-gray-500 mb-1">새로운 소식이 없습니다</p>
              <p className="text-xs text-gray-400">공지사항이 등록되면 여기에 표시됩니다</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

