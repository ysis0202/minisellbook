'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Coins } from 'lucide-react';

export default function SplashScreen() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      // 스플래시 화면을 최소 0.5초 보여주기
      const minDelay = new Promise(resolve => setTimeout(resolve, 1000));

      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // 프로필 체크
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .maybeSingle();

        await minDelay;

        if (profile) {
          router.push('/home');
        } else {
          router.push('/onboard');
        }
      } else {
        await minDelay;
        router.push('/auth');
      }
    };

    checkAuth();
  }, [router, supabase]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="text-center space-y-8">
        {/* 로고 애니메이션 */}
        <div className="flex justify-center">
          <div className="relative">
            {/* Ping 효과 */}
            <div className="absolute inset-0 animate-ping opacity-20">
              <Coins className="w-24 h-24 text-emerald-500" />
            </div>
            {/* 메인 로고 - 회전 애니메이션 */}
            <div className="relative animate-bounce">
              <Coins className="w-24 h-24 text-emerald-600" />
            </div>
          </div>
        </div>

        {/* 앱 이름 - 타이핑 효과 */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent animate-fade-in">
            MoneyCells
          </h1>
          <p className="text-gray-500 text-sm animate-fade-in-delay">
            머니셀즈
          </p>
          <p className="text-gray-400 text-xs animate-fade-in-delay-2">
            당신의 돈을 셀 단위로 관리하다
          </p>
        </div>

        {/* 로딩 스피너 */}
        <div className="flex justify-center">
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        .animate-fade-in-delay {
          opacity: 0;
          animation: fade-in 0.6s ease-out 0.3s forwards;
        }

        .animate-fade-in-delay-2 {
          opacity: 0;
          animation: fade-in 0.6s ease-out 0.6s forwards;
        }
      `}</style>
    </div>
  );
}
