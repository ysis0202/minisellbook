'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Bell, BellOff, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface NotificationSettings {
  enabled: boolean;
  dailySummary: boolean;
  budgetAlerts: boolean;
  savingsGoal: boolean;
}

export function NotificationSettings() {
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: false,
    dailySummary: false,
    budgetAlerts: false,
    savingsGoal: false,
  });
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 알림 권한 상태 확인
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }

    // 로컬 스토리지에서 설정 불러오기
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      toast.error('이 브라우저는 알림을 지원하지 않습니다');
      return;
    }

    setLoading(true);
    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === 'granted') {
        toast.success('알림 권한이 허용되었습니다');
        // 테스트 알림 보내기
        new Notification('MoneyCells', {
          body: '알림이 성공적으로 활성화되었습니다! 🎉',
          icon: '/favicon.svg',
        });
        
        setSettings(prev => ({ ...prev, enabled: true }));
      } else {
        toast.error('알림 권한이 거부되었습니다');
      }
    } catch (error) {
      console.error('Permission error:', error);
      toast.error('알림 권한 요청에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const toggleSetting = (key: keyof NotificationSettings) => {
    if (key === 'enabled') {
      if (permission !== 'granted') {
        requestPermission();
        return;
      }
    }

    const newSettings = {
      ...settings,
      [key]: !settings[key],
    };

    setSettings(newSettings);
    localStorage.setItem('notificationSettings', JSON.stringify(newSettings));
    toast.success('설정이 저장되었습니다');
  };

  const disableAll = () => {
    const newSettings = {
      enabled: false,
      dailySummary: false,
      budgetAlerts: false,
      savingsGoal: false,
    };
    setSettings(newSettings);
    localStorage.setItem('notificationSettings', JSON.stringify(newSettings));
    toast.success('모든 알림이 비활성화되었습니다');
  };

  return (
    <Card className="border-purple-100">
      <CardHeader className="pb-3 pt-3 px-3">
        <CardTitle className="flex items-center gap-1.5 text-sm">
          <Bell className="w-4 h-4 text-purple-600" />
          알림 설정
        </CardTitle>
        <CardDescription className="text-xs">
          중요한 재정 활동에 대한 알림을 받아보세요
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 px-3 pb-3">
        {/* 알림 권한 상태 */}
        <div className={`p-3 rounded-lg border ${
          permission === 'granted' 
            ? 'bg-green-50 border-green-200' 
            : permission === 'denied'
            ? 'bg-red-50 border-red-200'
            : 'bg-yellow-50 border-yellow-200'
        }`}>
          <div className="flex items-start gap-2">
            {permission === 'granted' ? (
              <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
            ) : (
              <BellOff className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
            )}
            <div className="flex-1">
              <p className={`text-xs font-medium ${
                permission === 'granted' ? 'text-green-900' : 'text-gray-900'
              }`}>
                {permission === 'granted' 
                  ? '알림이 활성화되었습니다' 
                  : permission === 'denied'
                  ? '알림이 차단되었습니다'
                  : '알림을 허용하면 더 나은 경험을 제공합니다'
                }
              </p>
              {permission === 'denied' && (
                <p className="text-[10px] text-red-700 mt-1">
                  브라우저 설정에서 알림을 허용해주세요
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 메인 토글 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
            <Label htmlFor="enable-notifications" className="text-sm font-medium cursor-pointer">
              푸시 알림 활성화
            </Label>
            <Button
              id="enable-notifications"
              variant={settings.enabled ? "default" : "outline"}
              size="sm"
              onClick={() => toggleSetting('enabled')}
              disabled={loading || permission === 'denied'}
              className={`h-8 min-w-[60px] ${
                settings.enabled 
                  ? 'bg-emerald-600 hover:bg-emerald-700' 
                  : ''
              }`}
            >
              {settings.enabled ? 'ON' : 'OFF'}
            </Button>
          </div>

          {/* 세부 알림 설정 */}
          {settings.enabled && (
            <div className="space-y-2 pl-3 border-l-2 border-emerald-200">
              {/* 일일 요약 */}
              <div className="flex items-center justify-between py-2 px-2">
                <div>
                  <Label htmlFor="daily-summary" className="text-xs font-medium cursor-pointer">
                    일일 요약 (오후 9시)
                  </Label>
                  <p className="text-[10px] text-gray-500">매일 저녁 하루 지출 요약</p>
                </div>
                <Button
                  id="daily-summary"
                  variant={settings.dailySummary ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleSetting('dailySummary')}
                  className={`h-7 min-w-[50px] text-xs ${
                    settings.dailySummary 
                      ? 'bg-emerald-600 hover:bg-emerald-700' 
                      : ''
                  }`}
                >
                  {settings.dailySummary ? 'ON' : 'OFF'}
                </Button>
              </div>

              {/* 예산 초과 알림 */}
              <div className="flex items-center justify-between py-2 px-2">
                <div>
                  <Label htmlFor="budget-alerts" className="text-xs font-medium cursor-pointer">
                    예산 초과 경고
                  </Label>
                  <p className="text-[10px] text-gray-500">예산 80% 도달 시 알림</p>
                </div>
                <Button
                  id="budget-alerts"
                  variant={settings.budgetAlerts ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleSetting('budgetAlerts')}
                  className={`h-7 min-w-[50px] text-xs ${
                    settings.budgetAlerts 
                      ? 'bg-emerald-600 hover:bg-emerald-700' 
                      : ''
                  }`}
                >
                  {settings.budgetAlerts ? 'ON' : 'OFF'}
                </Button>
              </div>

              {/* 저축 목표 알림 */}
              <div className="flex items-center justify-between py-2 px-2">
                <div>
                  <Label htmlFor="savings-goal" className="text-xs font-medium cursor-pointer">
                    저축 목표 달성
                  </Label>
                  <p className="text-[10px] text-gray-500">목표 달성 시 축하 알림</p>
                </div>
                <Button
                  id="savings-goal"
                  variant={settings.savingsGoal ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleSetting('savingsGoal')}
                  className={`h-7 min-w-[50px] text-xs ${
                    settings.savingsGoal 
                      ? 'bg-emerald-600 hover:bg-emerald-700' 
                      : ''
                  }`}
                >
                  {settings.savingsGoal ? 'ON' : 'OFF'}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* 모두 비활성화 버튼 */}
        {settings.enabled && (
          <Button
            variant="outline"
            size="sm"
            onClick={disableAll}
            className="w-full h-8 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
          >
            모든 알림 끄기
          </Button>
        )}

        {/* 안내 메시지 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5">
          <p className="text-[10px] text-blue-700 leading-relaxed">
            💡 <strong>팁:</strong> 알림은 브라우저를 닫아도 계속 받을 수 있습니다. 
            설정은 언제든지 변경할 수 있습니다.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

