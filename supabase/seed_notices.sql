-- 샘플 공지사항 데이터 삽입
-- 이 파일은 개발/테스트 환경에서 공지사항을 추가할 때 사용합니다.
-- Supabase SQL Editor에서 실행하세요.

-- 기존 샘플 데이터 삭제 (선택사항)
-- DELETE FROM notices WHERE title LIKE '%샘플%' OR title LIKE '%테스트%';

-- 환영 공지사항
INSERT INTO notices (title, content, type, emoji, priority, is_active)
VALUES 
(
  '환영합니다! MoneyCells',
  '개인 재정 관리를 쉽고 간편하게! MoneyCells와 함께 체계적인 가계부 관리를 시작하세요.',
  'notice',
  '👋',
  100,
  true
);

-- 업데이트 공지
INSERT INTO notices (title, content, type, emoji, priority, is_active)
VALUES 
(
  'v1.1.0 업데이트 완료',
  '저축 기능이 추가되었습니다! 이제 수입, 지출, 저축을 한눈에 관리할 수 있습니다. 공지사항 기능도 새롭게 추가되었어요.',
  'update',
  '🎉',
  90,
  true
);

-- 이벤트 (기한 있음)
INSERT INTO notices (title, content, type, emoji, priority, is_active, expires_at)
VALUES 
(
  '초대 이벤트',
  '친구를 초대하고 프리미엄 혜택을 받아보세요! 이벤트는 이번 달 말까지 진행됩니다.',
  'event',
  '🎁',
  80,
  true,
  (date_trunc('month', now()) + interval '1 month' - interval '1 day')::timestamptz
);

-- 팁 공지
INSERT INTO notices (title, content, type, emoji, priority, is_active)
VALUES 
(
  '예산 관리 팁',
  '매달 초 저축 목표를 설정하면 재정 목표 달성에 더 가까워질 수 있어요. 통계 페이지에서 저축 목표를 설정해보세요!',
  'notice',
  '💡',
  70,
  true
);

-- 샘플 데이터 확인
SELECT 
  id,
  title,
  type,
  emoji,
  is_active,
  priority,
  created_at,
  expires_at
FROM notices
ORDER BY priority DESC, created_at DESC;

