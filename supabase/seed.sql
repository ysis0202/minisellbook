-- 더미 데이터 시드 스크립트
-- 주의: 이 스크립트는 개발용이며, 실제 사용자 데이터가 있는 경우 실행하지 마세요.

-- 테스트용 사용자 ID (실제로는 auth.users에서 생성된 UUID 사용)
-- 이 ID는 예시이며, 실제 환경에서는 로그인한 사용자의 UUID를 사용해야 합니다.
-- auth.uid()를 통해 현재 로그인한 사용자 ID를 가져와야 합니다.

-- 더미 계정 데이터
INSERT INTO accounts (user_id, name, type, is_default) VALUES
(auth.uid(), '현금', 'cash', true),
(auth.uid(), '신한카드', 'card', false),
(auth.uid(), '국민은행', 'bank', false);

-- 더미 카테고리 데이터 (이미 fn_onboard_seed에서 생성되므로 추가 카테고리만)
INSERT INTO categories (user_id, name, kind, emoji, sort) VALUES
(auth.uid(), '문화생활', 'expense', '🎬', 4),
(auth.uid(), '의료비', 'expense', '💊', 5),
(auth.uid(), '부업', 'income', '💰', 4),
(auth.uid(), '용돈', 'income', '🎁', 5);

-- 더미 항목 데이터 (최근 한 달치)
WITH account_ids AS (
  SELECT id, name FROM accounts WHERE user_id = auth.uid()
),
category_ids AS (
  SELECT id, name, kind FROM categories WHERE user_id = auth.uid()
)
INSERT INTO entries (user_id, account_id, category_id, kind, amount, memo, entry_date)
SELECT
  auth.uid(),
  a.id,
  c.id,
  c.kind,
  CASE
    WHEN c.kind = 'income' THEN (RANDOM() * 300000 + 50000)::numeric(14,2)
    ELSE (RANDOM() * 50000 + 5000)::numeric(14,2)
  END,
  CASE
    WHEN c.kind = 'income' THEN c.name || ' 수입'
    ELSE c.name || ' 지출'
  END,
  CURRENT_DATE - (RANDOM() * 30)::int
FROM account_ids a
CROSS JOIN category_ids c
WHERE c.name IN ('급여', '식비', '교통', '기타')
LIMIT 20;