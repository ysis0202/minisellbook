'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppLogo } from '@/components/app-logo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';
import { Profile } from '@/lib/types';
import { User, Edit2, Save, X, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

export default function SettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [currency, setCurrency] = useState('KRW');

  const supabase = createClient();

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

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
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
          <div className="flex items-center gap-2 mb-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="h-8 w-8 rounded-full hover:bg-white/20 text-white -ml-2"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-bold">기본 정보 설정</h1>
          </div>
          <p className="text-emerald-50 text-xs ml-8">프로필과 기본 설정을 관리하세요</p>
        </div>
      </div>

      <div className="p-3 space-y-3">
        {/* 프로필 미리보기 */}
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
          <CardContent className="pt-4 pb-4 px-4">
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
                <div className="w-16 h-16 rounded-full bg-emerald-100 border-3 border-white shadow-lg flex items-center justify-center">
                  <User className="w-8 h-8 text-emerald-600" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-gray-900 truncate">{displayName || '사용자'}</h2>
                <p className="text-sm text-gray-600 truncate">{profile?.email || ''}</p>
                {profile?.auth_provider && (
                  <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[10px]">
                    {profile.auth_provider === 'google' ? 'Google' : 'Kakao'}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

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

        {/* 계정 정보 */}
        <Card>
          <CardHeader className="pb-2 pt-3 px-3">
            <CardTitle className="text-sm">계정 정보</CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1.5 px-2 bg-gray-50 rounded">
                <span className="text-gray-600">가입일</span>
                <span className="font-medium text-gray-700">
                  {profile?.created_at
                    ? new Date(profile.created_at).toLocaleDateString('ko-KR')
                    : '-'
                  }
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5 px-2 bg-gray-50 rounded">
                <span className="text-gray-600">로그인 방식</span>
                <span className="font-medium text-gray-700">
                  {profile?.auth_provider === 'google' ? 'Google' : profile?.auth_provider === 'kakao' ? 'Kakao' : '-'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

