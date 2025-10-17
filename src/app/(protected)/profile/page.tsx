'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppLogo } from '@/components/app-logo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { signOut } from '@/server/actions';
import { Profile } from '@/lib/types';
import { User, Settings, LogOut, Download, Shield, Bell, Megaphone, Menu, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (profileData) {
            setProfile(profileData);
          }
        }
      } catch (error) {
        console.error('Profile load error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [supabase]);

  const handleSignOut = async () => {
    if (confirm('정말 로그아웃하시겠습니까?')) {
      try {
        const result = await signOut();
        
        if (result?.success) {
          toast.success('로그아웃되었습니다');
          router.push('/auth');
          router.refresh();
        } else {
          toast.error(result?.error || '로그아웃에 실패했습니다');
        }
      } catch (error) {
        console.error('Sign out error:', error);
        toast.error('로그아웃에 실패했습니다');
      }
    }
  };

  const menuItems = [
    {
      icon: User,
      title: '기본 정보 설정',
      description: '프로필과 개인 정보 관리',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      href: '/profile/settings',
    },
    {
      icon: Bell,
      title: '알림 설정',
      description: '푸시 알림 및 알림 관리',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      href: '/profile/notifications',
    },
    {
      icon: Megaphone,
      title: '공지사항 & 이벤트',
      description: '새로운 소식 확인',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      href: '/profile/notices',
    },
    {
      icon: Download,
      title: '데이터 관리',
      description: '데이터 백업 및 내보내기',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      onClick: () => toast.info('데이터 내보내기 기능은 추후 업데이트 예정입니다'),
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-500">프로필을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 헤더 */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md">
        <div className="px-4 pt-3 pb-2 flex justify-center">
          <AppLogo size="sm" />
        </div>
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 mb-3">
            <Menu className="w-5 h-5" />
            <h1 className="text-lg font-bold">더보기</h1>
          </div>
          <div className="flex items-center gap-3">
            {profile?.profile_image ? (
              <Image
                src={profile.profile_image}
                alt="프로필"
                width={64}
                height={64}
                className="w-16 h-16 rounded-full border-3 border-white shadow-lg"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-white/20 border-3 border-white shadow-lg flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold truncate">{profile?.display_name || '사용자'}</h1>
              <p className="text-emerald-50 text-xs truncate">{profile?.email || ''}</p>
              {profile?.auth_provider && (
                <span className="inline-block mt-1 px-2 py-0.5 bg-white/20 rounded text-[10px]">
                  {profile.auth_provider === 'google' ? 'Google' : 'Kakao'}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 space-y-3">
        {/* 메뉴 리스트 */}
        <div className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card
                key={index}
                className="hover:shadow-md transition-all cursor-pointer active:scale-[0.98] border-gray-200"
                onClick={() => item.href ? router.push(item.href) : item.onClick?.()}
              >
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl ${item.bgColor} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-6 h-6 ${item.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm text-gray-900">{item.title}</h3>
                      <p className="text-xs text-gray-500 truncate">{item.description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* 앱 정보 */}
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100">
          <CardHeader className="pb-2 pt-3 px-3">
            <CardTitle className="flex items-center gap-1.5 text-sm">
              <Shield className="w-4 h-4 text-emerald-600" />
              앱 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1.5 px-2 bg-white/60 rounded">
                <span className="text-gray-600">앱 이름</span>
                <span className="font-semibold text-emerald-700">MiniCellBook</span>
              </div>
              <div className="flex justify-between items-center py-1.5 px-2 bg-white/60 rounded">
                <span className="text-gray-600">버전</span>
                <span className="font-medium text-gray-700">v1.2.0</span>
              </div>
              <div className="flex justify-between items-center py-1.5 px-2 bg-white/60 rounded">
                <span className="text-gray-600">계정 생성일</span>
                <span className="font-medium text-gray-700">
                  {profile?.created_at
                    ? new Date(profile.created_at).toLocaleDateString('ko-KR')
                    : '-'
                  }
                </span>
              </div>
            </div>
            <div className="mt-3 p-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg shadow-sm">
              <p className="text-[10px] text-white text-center font-medium">
                💰 간편하고 직관적인 개인 재정 관리
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 로그아웃 */}
        <Card className="border-red-200">
          <CardContent className="pt-3 pb-3 px-3">
            <Button
              variant="destructive"
              onClick={handleSignOut}
              className="w-full h-9"
            >
              <LogOut className="w-3.5 h-3.5 mr-2" />
              로그아웃
            </Button>
          </CardContent>
        </Card>

        {/* 푸터 */}
        <div className="text-center text-[10px] text-gray-400 py-6">
          <p>MoneyCells로 스마트한 가계 관리를 시작하세요</p>
          <p className="mt-1">© 2024 MoneyCells. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}