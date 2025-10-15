'use client';

import { useState } from 'react';
import { signInWithGoogle, signInWithKakao } from '@/server/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Coins } from 'lucide-react';

export default function AuthPage() {
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingKakao, setLoadingKakao] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoadingGoogle(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setLoadingGoogle(false);
    }
  };

  const handleKakaoSignIn = async () => {
    setLoadingKakao(true);
    try {
      await signInWithKakao();
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setLoadingKakao(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="text-center space-y-4 pb-8">
          {/* 로고 애니메이션 */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 animate-ping opacity-20">
                <Coins className="w-16 h-16 text-emerald-500" />
              </div>
              <Coins className="w-16 h-16 text-emerald-600 relative" />
            </div>
          </div>
          <div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              MoneyCells
            </CardTitle>
            <p className="text-sm text-gray-500 mt-2">머니셀즈</p>
          </div>
          <CardDescription className="text-base">
            당신의 돈을 셀 단위로 관리하다
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 pb-8">
          {/* Google 로그인 */}
          <Button
            onClick={handleGoogleSignIn}
            disabled={loadingGoogle || loadingKakao}
            className="w-full h-12 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm"
            size="lg"
            variant="outline"
          >
            {loadingGoogle ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">⏳</span> 로그인 중...
              </span>
            ) : (
              <span className="flex items-center gap-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google로 시작하기
              </span>
            )}
          </Button>

          {/* Kakao 로그인 */}
          <Button
            onClick={handleKakaoSignIn}
            disabled={loadingGoogle || loadingKakao}
            className="w-full h-12 bg-[#FEE500] hover:bg-[#FDD835] text-[#3C1E1E] border-0 shadow-sm"
            size="lg"
          >
            {loadingKakao ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">⏳</span> 로그인 중...
              </span>
            ) : (
              <span className="flex items-center gap-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#3C1E1E" d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3zm5.907 8.06l1.47-4.5a.472.472 0 0 0-.47-.582.478.478 0 0 0-.423.283l-.97 2.93-.969-2.93a.479.479 0 0 0-.423-.283.472.472 0 0 0-.47.582l1.47 4.5v1.203c0 .283.195.51.436.51.242 0 .438-.227.438-.51V11.06zm-2.89-4.46H14.17c-.279 0-.508.224-.508.5v4.605c0 .282.229.51.508.51h.847c.28 0 .508-.228.508-.51a.497.497 0 0 0-.508-.5h-.34V6.6zm-3.583 0h-.847c-.279 0-.508.224-.508.5v4.605c0 .282.229.51.508.51h.847c.28 0 .508-.228.508-.51a.497.497 0 0 0-.508-.5h-.34v-1.092h.34c.279 0 .508-.224.508-.5a.497.497 0 0 0-.508-.5h-.34V7.1h.34c.279 0 .508-.224.508-.5a.497.497 0 0 0-.508-.5zm-3.95 1.592l-.356 1.05-.356-1.05a.478.478 0 0 0-.423-.283.472.472 0 0 0-.47.582l.733 2.225v.578c0 .282.195.51.436.51.242 0 .438-.228.438-.51v-.578l.733-2.225a.472.472 0 0 0-.47-.582.478.478 0 0 0-.423.283H7.484z"/>
                </svg>
                Kakao로 시작하기
              </span>
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center pt-4">
            계속 진행하시면{' '}
            <span className="font-medium">이용약관</span> 및{' '}
            <span className="font-medium">개인정보처리방침</span>에<br />
            동의하는 것으로 간주됩니다.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}