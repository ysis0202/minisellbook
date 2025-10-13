'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';
import { signOut } from '@/server/actions';
import { Profile } from '@/lib/types';
import { User, Settings, LogOut, Download, Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [currency, setCurrency] = useState('KRW');

  const supabase = createClient();

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
        await loadProfile();
      }
    } catch (error) {
      console.error('Save profile error:', error);
      toast.error('오류가 발생했습니다');
    } finally {
      setSaving(false);
    }
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
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b">
        <div className="p-4">
          <h1 className="text-xl font-bold text-gray-900">프로필</h1>
          <p className="text-sm text-gray-500">계정 설정 및 정보</p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* 프로필 정보 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              기본 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">표시 이름</Label>
              <Input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="이름을 입력하세요"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">기본 통화</Label>
              <select
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="KRW">KRW (원)</option>
                <option value="USD">USD (달러)</option>
                <option value="EUR">EUR (유로)</option>
                <option value="JPY">JPY (엔)</option>
              </select>
            </div>

            <Button
              onClick={handleSaveProfile}
              disabled={saving}
              className="w-full"
            >
              {saving ? '저장 중...' : '저장'}
            </Button>
          </CardContent>
        </Card>

        {/* 계정 관리 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              계정 관리
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              onClick={handleExportData}
              className="w-full justify-start"
            >
              <Download className="w-4 h-4 mr-2" />
              데이터 내보내기
            </Button>

            <div className="border-t pt-3">
              <p className="text-sm text-gray-500 mb-3">
                계정을 관리하고 데이터를 백업할 수 있습니다
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 앱 정보 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              앱 정보
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>앱 이름</span>
                <span>미니셀북</span>
              </div>
              <div className="flex justify-between">
                <span>버전</span>
                <span>1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span>계정 생성일</span>
                <span>
                  {profile?.created_at
                    ? new Date(profile.created_at).toLocaleDateString('ko-KR')
                    : '-'
                  }
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 로그아웃 */}
        <Card className="border-red-200">
          <CardContent className="pt-6">
            <Button
              variant="destructive"
              onClick={handleSignOut}
              className="w-full"
            >
              <LogOut className="w-4 h-4 mr-2" />
              로그아웃
            </Button>
          </CardContent>
        </Card>

        {/* 푸터 */}
        <div className="text-center text-xs text-gray-400 py-8">
          <p>미니셀북으로 간편하게 가계부를 관리하세요</p>
          <p className="mt-1">© 2024 MiniCellBook. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}