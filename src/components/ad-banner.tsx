'use client';

import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { X } from 'lucide-react';

interface AdBannerProps {
  slot: string; // 광고 슬롯 식별자 (예: 'home_header', 'stats_middle')
  className?: string;
  format?: 'horizontal' | 'vertical' | 'rectangle';
  closeable?: boolean; // 닫기 버튼 표시 여부
}

/**
 * 광고 배너 컴포넌트
 * 
 * 현재: 플레이스홀더로 작동
 * 향후: Google AdSense 코드만 추가하면 실제 광고 표시
 * 
 * 사용법:
 * <AdBanner slot="home_header" format="horizontal" />
 */
export function AdBanner({ 
  slot, 
  className = '', 
  format = 'horizontal',
  closeable = false 
}: AdBannerProps) {
  const [isClosed, setIsClosed] = useState(false);
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // TODO: 실제 애드센스 통합 시 여기에 코드 추가
    // if (window.adsbygoogle) {
    //   try {
    //     (window.adsbygoogle = window.adsbygoogle || []).push({});
    //     setIsAdLoaded(true);
    //   } catch (error) {
    //     console.error('AdSense error:', error);
    //   }
    // }

    // 현재는 플레이스홀더로 표시
    setIsAdLoaded(true);
  }, []);

  if (isClosed) {
    return null;
  }

  // 포맷별 높이 설정
  const heightClass = format === 'horizontal' 
    ? 'h-20' 
    : format === 'vertical' 
    ? 'h-[250px]' 
    : 'h-[200px]';

  return (
    <div className={`relative ${className}`} data-ad-slot={slot}>
      <Card className={`${heightClass} flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 overflow-hidden`}>
        {/* 플레이스홀더 - 실제 애드센스 적용 시 제거 */}
        <div className="text-center px-4">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <p className="text-xs font-medium text-gray-500">광고</p>
          </div>
          <p className="text-[10px] text-gray-400">
            AdSense 통합 준비 완료 · {slot}
          </p>
        </div>

        {/* 실제 애드센스 광고는 여기에 렌더링 */}
        <div ref={adRef} className="hidden">
          {/* 
          <ins className="adsbygoogle"
               style={{ display: 'block' }}
               data-ad-client="ca-pub-xxxxxxxxxxxxxxxx"
               data-ad-slot="xxxxxxxxxx"
               data-ad-format={format}
               data-full-width-responsive="true">
          </ins>
          */}
        </div>

        {/* 닫기 버튼 (선택적) */}
        {closeable && (
          <button
            onClick={() => setIsClosed(true)}
            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-gray-200/80 hover:bg-gray-300/80 flex items-center justify-center transition-colors"
            aria-label="광고 닫기"
          >
            <X className="w-3 h-3 text-gray-600" />
          </button>
        )}
      </Card>
    </div>
  );
}

/**
 * 애드센스 스크립트 로드 헬퍼
 * layout.tsx에서 한 번만 호출
 */
export function loadAdSenseScript() {
  if (typeof window !== 'undefined' && !document.querySelector('script[src*="adsbygoogle"]')) {
    const script = document.createElement('script');
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    // TODO: 실제 AdSense 승인 후 client ID 추가
    // script.setAttribute('data-ad-client', 'ca-pub-xxxxxxxxxxxxxxxx');
    document.head.appendChild(script);
  }
}

