/**
 * 알림 시스템 유틸리티
 * 
 * 기능:
 * - 일일 리마인더 (18:00)
 * - 권한 관리
 * - 확장 가능한 구조 (향후 예산 경고, 저축 목표 등 추가 가능)
 */

// 로컬 스토리지 키
const KEYS = {
  NOTIFICATION_SETTINGS: 'notificationSettings',
  LAST_REMINDER_DATE: 'lastReminderDate',
  NOTIFICATION_PERMISSION: 'notificationPermission',
};

// 알림 설정 타입
export interface NotificationSettings {
  enabled: boolean;
  dailyReminder: boolean;
  reminderTime: string; // HH:MM 형식 (예: "18:00")
  budgetAlerts: boolean;
  savingsGoal: boolean;
}

// 기본 설정
const DEFAULT_SETTINGS: NotificationSettings = {
  enabled: false,
  dailyReminder: false,
  reminderTime: '18:00',
  budgetAlerts: false,
  savingsGoal: false,
};

/**
 * 알림 권한 요청
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.warn('이 브라우저는 알림을 지원하지 않습니다.');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission === 'denied') {
    console.warn('알림 권한이 거부되었습니다.');
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    const granted = permission === 'granted';
    
    if (granted) {
      localStorage.setItem(KEYS.NOTIFICATION_PERMISSION, 'granted');
    }
    
    return granted;
  } catch (error) {
    console.error('알림 권한 요청 실패:', error);
    return false;
  }
}

/**
 * 알림 설정 불러오기
 */
export function getNotificationSettings(): NotificationSettings {
  // 서버 사이드에서는 기본 설정 반환
  if (typeof window === 'undefined') {
    return DEFAULT_SETTINGS;
  }

  try {
    const saved = localStorage.getItem(KEYS.NOTIFICATION_SETTINGS);
    if (saved) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    }
  } catch (error) {
    console.error('알림 설정 불러오기 실패:', error);
  }
  return DEFAULT_SETTINGS;
}

/**
 * 알림 설정 저장
 */
export function saveNotificationSettings(settings: Partial<NotificationSettings>): void {
  // 서버 사이드에서는 아무것도 하지 않음
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const current = getNotificationSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(KEYS.NOTIFICATION_SETTINGS, JSON.stringify(updated));
  } catch (error) {
    console.error('알림 설정 저장 실패:', error);
  }
}

/**
 * 알림 발송
 */
export function sendNotification(title: string, options?: NotificationOptions): void {
  if (!('Notification' in window)) {
    console.warn('알림이 지원되지 않습니다.');
    return;
  }

  if (Notification.permission !== 'granted') {
    console.warn('알림 권한이 없습니다.');
    return;
  }

  try {
    new Notification(title, {
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      ...options,
    });
  } catch (error) {
    console.error('알림 발송 실패:', error);
  }
}

/**
 * 일일 리마인더 알림 발송
 */
export function sendDailyReminder(): void {
  // 서버 사이드에서는 실행 안 함
  if (typeof window === 'undefined') {
    return;
  }

  const settings = getNotificationSettings();
  
  if (!settings.enabled || !settings.dailyReminder) {
    return;
  }

  sendNotification('MoneyCells', {
    body: '오늘의 지출과 수입을 입력해보는건 어떠실까요? 💰',
    tag: 'daily-reminder', // 중복 알림 방지
    requireInteraction: false,
    silent: false,
  });

  // 마지막 알림 날짜 저장
  const today = new Date().toISOString().split('T')[0];
  localStorage.setItem(KEYS.LAST_REMINDER_DATE, today);
}

/**
 * 오늘 이미 리마인더를 받았는지 확인
 */
function hasReceivedReminderToday(): boolean {
  // 서버 사이드에서는 false 반환
  if (typeof window === 'undefined') {
    return false;
  }

  const lastDate = localStorage.getItem(KEYS.LAST_REMINDER_DATE);
  const today = new Date().toISOString().split('T')[0];
  return lastDate === today;
}

/**
 * 리마인더 시간이 되었는지 확인
 */
function isReminderTime(reminderTime: string): boolean {
  const now = new Date();
  const [hours, minutes] = reminderTime.split(':').map(Number);
  
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  
  // 정확한 시간 또는 1분 이내
  return currentHours === hours && currentMinutes >= minutes && currentMinutes < minutes + 1;
}

/**
 * 일일 리마인더 체크 (매분마다 호출)
 */
export function checkDailyReminder(): void {
  const settings = getNotificationSettings();
  
  // 알림이 비활성화되어 있거나 이미 오늘 받았으면 종료
  if (!settings.enabled || !settings.dailyReminder || hasReceivedReminderToday()) {
    return;
  }

  // 설정된 시간인지 확인
  if (isReminderTime(settings.reminderTime)) {
    sendDailyReminder();
  }
}

/**
 * 알림 스케줄러 시작
 * 앱 전역에서 한 번만 호출 (layout.tsx)
 */
export function startNotificationScheduler(): void {
  // 1분마다 체크
  const interval = setInterval(() => {
    checkDailyReminder();
  }, 60 * 1000); // 60초

  // 페이지 언로드 시 정리
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
      clearInterval(interval);
    });
  }

  // 최초 실행 시 즉시 한 번 체크
  setTimeout(() => {
    checkDailyReminder();
  }, 1000);
}

/**
 * 테스트용: 즉시 리마인더 발송
 */
export function testDailyReminder(): void {
  console.log('테스트 알림 발송...');
  sendNotification('MoneyCells 테스트', {
    body: '오늘의 지출과 수입을 입력해보는건 어떠실까요? 💰',
    tag: 'test-reminder',
  });
}

// 향후 확장 가능한 알림 함수들
// =====================================

/**
 * 예산 초과 경고 알림 (향후 구현)
 */
export function sendBudgetAlert(amount: number, limit: number): void {
  const settings = getNotificationSettings();
  
  if (!settings.enabled || !settings.budgetAlerts) {
    return;
  }

  const percentage = Math.round((amount / limit) * 100);
  
  sendNotification('예산 경고 ⚠️', {
    body: `이번 달 예산의 ${percentage}%를 사용했어요!\n${amount.toLocaleString()}원 / ${limit.toLocaleString()}원`,
    tag: 'budget-alert',
    requireInteraction: true,
  });
}

/**
 * 저축 목표 달성 알림 (향후 구현)
 */
export function sendSavingsGoalAlert(amount: number, goal: number): void {
  const settings = getNotificationSettings();
  
  if (!settings.enabled || !settings.savingsGoal) {
    return;
  }

  sendNotification('목표 달성! 🎉', {
    body: `축하합니다! 이번 달 저축 목표를 달성했어요!\n${amount.toLocaleString()}원 / ${goal.toLocaleString()}원`,
    tag: 'savings-goal',
    requireInteraction: true,
  });
}

