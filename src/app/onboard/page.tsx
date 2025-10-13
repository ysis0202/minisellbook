'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ensureOnboard } from '@/server/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, User, CreditCard, Tags } from 'lucide-react';

export default function OnboardPage() {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const router = useRouter();

  const steps = [
    { icon: User, title: '프로필 설정', description: '기본 프로필을 생성합니다' },
    { icon: CreditCard, title: '기본 계정', description: '현금 계정을 추가합니다' },
    { icon: Tags, title: '카테고리', description: '기본 수입/지출 카테고리를 생성합니다' },
  ];

  const handleOnboard = async () => {
    setLoading(true);
    try {
      const result = await ensureOnboard();
      if (result.ok) {
        // 단계별 애니메이션
        for (let i = 0; i < steps.length; i++) {
          setStep(i + 1);
          await new Promise(resolve => setTimeout(resolve, 800));
        }

        setTimeout(() => {
          router.push('/home');
        }, 1000);
      } else {
        console.error('Onboard failed:', result.error);
      }
    } catch (error) {
      console.error('Onboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">환영합니다! 🎉</CardTitle>
          <CardDescription>
            미니셀북을 시작하기 위해 기본 설정을 진행합니다
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {steps.map((stepInfo, index) => {
              const IconComponent = stepInfo.icon;
              const isCompleted = step > index;
              const isCurrent = step === index;

              return (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-500 ${
                    isCompleted
                      ? 'bg-green-50 border border-green-200'
                      : isCurrent
                      ? 'bg-blue-50 border border-blue-200'
                      : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className={`transition-all duration-300 ${
                    isCompleted ? 'text-green-600' : isCurrent ? 'text-blue-600' : 'text-gray-400'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <IconComponent className="w-6 h-6" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-medium ${
                      isCompleted ? 'text-green-900' : isCurrent ? 'text-blue-900' : 'text-gray-600'
                    }`}>
                      {stepInfo.title}
                    </h3>
                    <p className={`text-sm ${
                      isCompleted ? 'text-green-600' : isCurrent ? 'text-blue-600' : 'text-gray-500'
                    }`}>
                      {stepInfo.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <Button
            onClick={handleOnboard}
            disabled={loading || step > 0}
            className="w-full"
            size="lg"
          >
            {loading ? '설정 중...' : step === steps.length ? '완료!' : '시작하기'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}