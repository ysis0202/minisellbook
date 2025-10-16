'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, BellOff, CheckCircle2, Clock, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { 
  getNotificationSettings, 
  saveNotificationSettings, 
  requestNotificationPermission,
  testDailyReminder,
  type NotificationSettings as NotificationSettingsType
} from '@/lib/notifications';

export function NotificationSettings() {
  const [settings, setSettings] = useState<NotificationSettingsType>(getNotificationSettings());
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 알림 권한 상태 확인
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }

    // 최신 설정 불러오기
    setSettings(getNotificationSettings());
  }, []);

  const handleRequestPermission = async () => {
    setLoading(true);
    try {
      const granted = await requestNotificationPermission();
      
      if (granted) {
        setPermission('granted');
        const updatedSettings = { ...settings, enabled: true };
        setSettings(updatedSettings);
        saveNotificationSettings(updatedSettings);
        toast.success('알림이 활성화되었습니다! 🎉');
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

  const toggleSetting = (key: keyof NotificationSettingsType) => {
    if (key === 'enabled') {
      if (permission !== 'granted') {
        handleRequestPermission();
        return;
      }
    }

    const newSettings = {
      ...settings,
      [key]: !settings[key],
    };

    setSettings(newSettings);
    saveNotificationSettings(newSettings);
    toast.success('설정이 저장되었습니다');
  };

  const handleTimeChange = (time: string) => {
    const newSettings = {
      ...settings,
      reminderTime: time,
    };
    setSettings(newSettings);
    saveNotificationSettings(newSettings);
    toast.success(`알림 시간이 ${time}로 변경되었습니다`);
  };

  const handleTestNotification = () => {
    if (permission !== 'granted') {
      toast.error('먼저 알림 권한을 허용해주세요');
      return;
    }
    testDailyReminder();
    toast.success('테스트 알림을 발송했습니다');
  };

  const disableAll = () => {
    const newSettings: NotificationSettingsType = {
      enabled: false,
      dailyReminder: false,
      reminderTime: '18:00',
      budgetAlerts: false,
      savingsGoal: false,
    };
    setSettings(newSettings);
    saveNotificationSettings(newSettings);
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
            <div className="space-y-3 pl-3 border-l-2 border-emerald-200">
              {/* 일일 리마인더 - 핵심 기능 */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <Label htmlFor="daily-reminder" className="text-xs font-semibold cursor-pointer text-blue-900">
                        일일 리마인더 💰
                      </Label>
                      <p className="text-[10px] text-blue-700 mt-0.5">
                        매일 정해진 시간에 기록 알림
                      </p>
                    </div>
                  </div>
                  <Button
                    id="daily-reminder"
                    variant={settings.dailyReminder ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleSetting('dailyReminder')}
                    className={`h-7 min-w-[50px] text-xs ${
                      settings.dailyReminder 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'border-blue-300'
                    }`}
                  >
                    {settings.dailyReminder ? 'ON' : 'OFF'}
                  </Button>
                </div>

                {/* 시간 선택 */}
                {settings.dailyReminder && (
                  <div className="mt-2 pt-2 border-t border-blue-200">
                    <Label htmlFor="reminder-time" className="text-[10px] text-blue-700 mb-1 block">
                      알림 시간
                    </Label>
                    <Select value={settings.reminderTime} onValueChange={handleTimeChange}>
                      <SelectTrigger id="reminder-time" className="h-8 text-xs bg-white border-blue-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="09:00">오전 9시</SelectItem>
                        <SelectItem value="12:00">오후 12시</SelectItem>
                        <SelectItem value="15:00">오후 3시</SelectItem>
                        <SelectItem value="18:00">오후 6시 (추천)</SelectItem>
                        <SelectItem value="21:00">오후 9시</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* 예산 초과 알림 - 향후 구현 */}
              <div className="flex items-center justify-between py-2 px-2 opacity-50">
                <div>
                  <Label htmlFor="budget-alerts" className="text-xs font-medium cursor-pointer flex items-center gap-1">
                    예산 초과 경고
                    <span className="text-[9px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">준비중</span>
                  </Label>
                  <p className="text-[10px] text-gray-500">예산 80% 도달 시 알림</p>
                </div>
                <Button
                  id="budget-alerts"
                  variant="outline"
                  size="sm"
                  disabled
                  className="h-7 min-w-[50px] text-xs"
                >
                  OFF
                </Button>
              </div>

              {/* 저축 목표 알림 - 향후 구현 */}
              <div className="flex items-center justify-between py-2 px-2 opacity-50">
                <div>
                  <Label htmlFor="savings-goal" className="text-xs font-medium cursor-pointer flex items-center gap-1">
                    저축 목표 달성
                    <span className="text-[9px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">준비중</span>
                  </Label>
                  <p className="text-[10px] text-gray-500">목표 달성 시 축하 알림</p>
                </div>
                <Button
                  id="savings-goal"
                  variant="outline"
                  size="sm"
                  disabled
                  className="h-7 min-w-[50px] text-xs"
                >
                  OFF
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* 테스트 & 모두 비활성화 버튼 */}
        {settings.enabled && (
          <div className="space-y-2 pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={handleTestNotification}
              className="w-full h-8 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
            >
              <Zap className="w-3 h-3 mr-1" />
              테스트 알림 보내기
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={disableAll}
              className="w-full h-8 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            >
              모든 알림 끄기
            </Button>
          </div>
        )}

        {/* 안내 메시지 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5">
          <p className="text-[10px] text-blue-700 leading-relaxed">
            💡 <strong>팁:</strong> 일일 리마인더는 매일 설정한 시간에 "오늘의 지출과 수입을 입력해보는건 어떠실까요?" 
            메시지를 보내드립니다. 브라우저를 닫아도 알림을 받을 수 있습니다.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
