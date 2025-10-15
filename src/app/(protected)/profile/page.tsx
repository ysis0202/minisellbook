'use client';

import { useState, useEffect } from 'react';
import { AppLogo } from '@/components/app-logo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';
import { signOut } from '@/server/actions';
import { Profile } from '@/lib/types';
import { User, Settings, LogOut, Download, Shield, Edit2, Save, X, Bell, Megaphone } from 'lucide-react';
import { toast } from 'sonner';
import { useNotices } from '@/lib/hooks/use-notices';
import { NoticeCard } from '@/components/notice-card';

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [currency, setCurrency] = useState('KRW');

  const supabase = createClient();
  const { data: notices, isLoading: noticesLoading } = useNotices();

  useEffect(() => {
    loadProfile();
  }, []);

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
          setDisplayName(profileData.display_name || '');
          setCurrency(profileData.currency || 'KRW');
        }
      }
    } catch (error) {
      console.error('Profile load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!profile) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: displayName,
          currency: currency,
        })
        .eq('id', profile.id);

      if (error) {
        toast.error('프로필 저장에 실패했습니다');
      } else {
        toast.success('프로필이 저장되었습니다');
        setIsEditing(false);
        await loadProfile();
      }
    } catch (error) {
      console.error('Save profile error:', error);
      toast.error('오류가 발생했습니다');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setDisplayName(profile?.display_name || '');
    setCurrency(profile?.currency || 'KRW');
    setIsEditing(false);
  };

  const handleSignOut = async () => {
    if (confirm('정말 로그아웃하시겠습니까?')) {
      try {
        await signOut();
      } catch (error) {
        console.error('Sign out error:', error);
        toast.error('로그아웃에 실패했습니다');
      }
    }
  };

  const handleExportData = () => {
    toast.info('데이터 내보내기 기능은 추후 업데이트 예정입니다');
  };

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
        <div className="px-4 pb-4">
          <div className="flex items-center gap-3">
            {profile?.profile_image ? (
              <img
                src={profile.profile_image}
                alt="프로필"
                className="w-16 h-16 rounded-full border-3 border-white shadow-lg"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-white/20 border-3 border-white shadow-lg flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold truncate">{displayName || '사용자'}</h1>
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
        {/* 공지사항/이벤트 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
              <Megaphone className="w-4 h-4 text-emerald-600" />
              공지사항 & 이벤트
            </h2>
            {notices && notices.length > 0 && (
              <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-semibold">
                {notices.length}개
              </span>
            )}
          </div>
          
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
              <CardContent className="p-4 text-center">
                <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-xs text-gray-500">새로운 소식이 없습니다</p>
              </CardContent>
            </Card>
          )}
        </div>
        {/* 프로필 정보 */}
        <Card className="border-emerald-100">
          <CardHeader className="pb-2 pt-3 px-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-1.5 text-sm">
                <User className="w-4 h-4 text-emerald-600" />
                기본 정보
              </CardTitle>
              {!isEditing && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="h-7 px-2 text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                >
                  <Edit2 className="w-3.5 h-3.5 mr-1" />
                  수정
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3 px-3 pb-3">
            <div className="space-y-1.5">
              <Label htmlFor="displayName" className="text-xs font-medium text-gray-700">
                표시 이름
              </Label>
              <Input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="이름을 입력하세요"
                disabled={!isEditing}
                className={`h-9 text-sm ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-medium text-gray-700">
                이메일
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={profile?.email || ''}
                  disabled
                  className="bg-gray-50 h-9 text-sm cursor-not-allowed"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <span className="text-[9px] px-1.5 py-0.5 bg-gray-200 rounded text-gray-600">
                    고정
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="currency" className="text-xs font-medium text-gray-700">
                기본 통화
              </Label>
              <select
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                disabled={!isEditing}
                className={`w-full px-3 py-2 h-9 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
              >
                <option value="KRW">🇰🇷 KRW (원)</option>
                <option value="USD">🇺🇸 USD (달러)</option>
                <option value="EUR">🇪🇺 EUR (유로)</option>
                <option value="JPY">🇯🇵 JPY (엔)</option>
              </select>
            </div>

            {isEditing && (
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={saving}
                  className="flex-1 h-9 text-sm"
                >
                  <X className="w-3.5 h-3.5 mr-1" />
                  취소
                </Button>
                <Button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="flex-1 h-9 text-sm bg-emerald-600 hover:bg-emerald-700"
                >
                  <Save className="w-3.5 h-3.5 mr-1" />
                  {saving ? '저장 중...' : '저장'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 계정 관리 */}
        <Card>
          <CardHeader className="pb-2 pt-3 px-3">
            <CardTitle className="flex items-center gap-1.5 text-sm">
              <Settings className="w-4 h-4" />
              계정 관리
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 px-3 pb-3">
            <Button
              variant="outline"
              onClick={handleExportData}
              className="w-full justify-start h-9 active:scale-95"
            >
              <Download className="w-3.5 h-3.5 mr-2" />
              <span className="text-sm">데이터 내보내기</span>
            </Button>

            <div className="border-t pt-2">
              <p className="text-xs text-gray-500">
                계정을 관리하고 데이터를 백업할 수 있습니다
              </p>
            </div>
          </CardContent>
        </Card>

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