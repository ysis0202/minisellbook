# 🚀 배포 체크리스트 (MiniCellBook v1.2.0)

> **최종 업데이트**: 2025-10-16  
> **현재 상태**: 배포 준비 완료 ✅

---

## ✅ 완료된 작업

### 1. 코드 품질 개선
- ✅ TypeScript 5.6.3으로 업그레이드
- ✅ Zod 3.23.8 안정 버전 사용
- ✅ 모든 ESLint 경고 수정
  - useEffect 의존성 배열 수정
  - next/image 사용으로 이미지 최적화
- ✅ next.config.js 개선 (remotePatterns 사용)
- ✅ 빌드 성공 확인 (경고 없음)

### 2. 기능 구현 완료
- ✅ 수입/지출/저축 관리 시스템
- ✅ 월별/연도별 통계
- ✅ 캘린더 뷰
- ✅ 검색 기능
- ✅ 공지사항 시스템 (v1.2.0)
- ✅ Google/Kakao OAuth 로그인
- ✅ 자동 온보딩

### 3. 데이터베이스
- ✅ 스키마 완성 (`supabase/schema.sql`)
- ✅ RLS 정책 적용
- ✅ 저축 기능 포함 (income, expense, savings)
- ✅ 공지사항 테이블 추가

### 4. 문서화
- ✅ README.md 업데이트
- ✅ DEPLOYMENT_GUIDE.md 작성
- ✅ WORK_STATUS.md 유지
- ✅ .env.example 생성

---

## 🔴 배포 전 필수 확인사항

### 1. Supabase 데이터베이스 설정

#### A. 스키마 적용
```sql
-- Supabase SQL Editor에서 실행
-- 1. supabase/schema.sql 전체 내용 복사 & 실행
-- 2. supabase/seed_notices.sql 실행 (선택사항 - 샘플 공지사항)
```

**확인 방법:**
```sql
-- 테이블 확인
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- RLS 활성화 확인
SELECT tablename, rowsecurity FROM pg_tables 
WHERE schemaname = 'public' AND rowsecurity = true;

-- 공지사항 확인
SELECT * FROM notices WHERE is_active = true;
```

#### B. OAuth 설정

**Google OAuth:**
1. Google Cloud Console (https://console.cloud.google.com)
2. OAuth 동의 화면 설정
3. 승인된 리디렉션 URI 추가:
   ```
   https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback
   https://YOUR_DOMAIN.vercel.app/auth/callback
   ```
4. Supabase Dashboard → Authentication → Providers → Google
   - Client ID & Secret 입력

**Kakao OAuth (선택):**
1. Kakao Developers (https://developers.kakao.com)
2. 애플리케이션 추가
3. Redirect URI 등록:
   ```
   https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback
   ```
4. Supabase Dashboard → Authentication → Providers → Kakao
   - Client ID (REST API Key) & Secret 입력

### 2. Vercel 환경 변수 설정

Vercel Dashboard → Settings → Environment Variables에서 추가:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
```

**주의사항:**
- `NEXT_PUBLIC_SITE_URL`은 배포 후 실제 URL로 변경
- Production, Preview, Development 모두 설정

### 3. Vercel 배포 설정

```yaml
# Framework: Next.js
Build Command: npm run build
Output Directory: .next (기본값)
Install Command: npm install
Node.js Version: 18.x 이상
```

---

## 📋 배포 후 테스트 체크리스트

### A. 기본 동작 확인
- [ ] 사이트 접속 가능
- [ ] 로그인 페이지 표시
- [ ] 스플래시 화면 정상 작동

### B. 인증 테스트
- [ ] Google 로그인 성공
- [ ] Kakao 로그인 성공 (설정한 경우)
- [ ] 온보딩 자동 실행
- [ ] 기본 계정/카테고리 생성 확인
- [ ] 로그아웃 정상 작동

### C. 주요 기능 테스트
- [ ] 수입 항목 추가/수정/삭제
- [ ] 지출 항목 추가/수정/삭제
- [ ] 저축 항목 추가/수정/삭제
- [ ] 금액 천 단위 콤마 표시
- [ ] 캘린더에 색상 점 표시
- [ ] 날짜별 항목 목록 표시
- [ ] 월별 요약 통계 표시
- [ ] 저축 목표 설정 가능

### D. 통계 페이지
- [ ] 월별 통계 표시
- [ ] 연도별 통계 표시
- [ ] 카테고리별 분석 (수입/지출/저축)
- [ ] 진행률 바 정상 작동
- [ ] 순잔액 계산 정확

### E. 검색 기능
- [ ] 키워드 검색 작동
- [ ] 날짜 범위 필터 작동
- [ ] 빠른 필터 (최근 7일/30일) 작동
- [ ] 검색 결과 정상 표시

### F. 더보기 페이지
- [ ] 공지사항 표시 (DB에 데이터가 있는 경우)
- [ ] 프로필 정보 수정 가능
- [ ] 로그아웃 작동

### G. 반응형 디자인
- [ ] 모바일 (375px ~ 768px) 레이아웃 정상
- [ ] 태블릿 (768px ~ 1024px) 레이아웃 정상
- [ ] 데스크톱 (1024px+) 레이아웃 정상
- [ ] 하단 네비게이션 모든 화면에서 작동

### H. 성능 확인
- [ ] 페이지 로딩 속도 3초 이내
- [ ] 이미지 최적화 확인
- [ ] 애니메이션 부드러움
- [ ] 네트워크 탭에서 오류 없음

---

## 🐛 알려진 이슈 및 해결 방법

### 이슈 1: 로그인 후 빈 화면
**증상**: 로그인 성공 후 데이터가 표시되지 않음

**원인**: 온보딩이 실행되지 않아 기본 데이터 미생성

**해결**:
```sql
-- Supabase SQL Editor에서 수동 실행
SELECT fn_onboard_seed(
  'USER_UUID'::uuid,
  '사용자 이름',
  'user@example.com',
  'google'
);
```

### 이슈 2: "저축 카테고리가 없습니다" 에러
**증상**: 저축 항목 추가 시 에러

**원인**: DB에 저축 카테고리 미생성

**해결**:
```sql
-- 현재 사용자의 ID 확인
SELECT id FROM auth.users;

-- 저축 카테고리 추가 (UUID 교체 필요)
INSERT INTO categories (user_id, name, kind, emoji, sort)
VALUES ('YOUR_USER_UUID', '저축', 'savings', '💰', 1);
```

### 이슈 3: 공지사항이 안 보임
**증상**: 더보기 탭에 "새로운 소식이 없습니다"

**원인**: DB에 공지사항 데이터 없음

**해결**:
```sql
-- supabase/seed_notices.sql 실행
-- 또는 수동으로 추가
INSERT INTO notices (title, content, type, emoji, priority, is_active)
VALUES 
('서비스 오픈!', 'MoneyCells가 정식으로 오픈했습니다!', 'notice', '🎉', 100, true);
```

### 이슈 4: OAuth Redirect URI 오류
**증상**: "redirect_uri_mismatch" 또는 "KOE006"

**원인**: OAuth 제공자에 Redirect URI 미등록

**해결**:
1. Google Cloud Console 또는 Kakao Developers에서 Redirect URI 확인
2. 정확한 URL 등록:
   ```
   https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback
   https://your-app.vercel.app/auth/callback
   ```

---

## 🎯 성능 최적화 권장사항

### 1. Supabase 쿼리 최적화
- 인덱스 확인 (이미 schema.sql에 포함됨)
- 느린 쿼리 모니터링

### 2. Next.js 최적화
- ✅ next/image 사용 (완료)
- ✅ SWR 캐싱 활용 (완료)
- ✅ 동적 임포트 적용 (필요시)

### 3. Vercel 설정
- Analytics 활성화
- Web Vitals 모니터링
- 자동 HTTPS (기본 제공)

---

## 🔒 보안 체크리스트

- ✅ 모든 API 키가 환경 변수로 관리됨
- ✅ `.env.local`이 `.gitignore`에 포함됨
- ✅ RLS 정책이 모든 테이블에 적용됨
- ✅ HTTPS 사용 (Vercel 자동 제공)
- ✅ 소프트 삭제 구현 (deleted_at)
- ✅ 사용자별 데이터 격리

---

## 📊 배포 단계 요약

### Phase 1: 준비 (로컬)
1. ✅ 코드 품질 검증
2. ✅ 빌드 테스트 (`npm run build`)
3. ✅ 로컬 테스트 (`npm run dev`)

### Phase 2: Supabase 설정
1. [ ] 스키마 적용
2. [ ] RLS 확인
3. [ ] OAuth 설정
4. [ ] 공지사항 데이터 추가 (선택)

### Phase 3: Vercel 배포
1. [ ] GitHub 연동
2. [ ] 환경 변수 설정
3. [ ] 배포 실행
4. [ ] 배포 성공 확인

### Phase 4: 테스트
1. [ ] 인증 테스트
2. [ ] 기능 테스트
3. [ ] 반응형 테스트
4. [ ] 성능 테스트

### Phase 5: 모니터링
1. [ ] Vercel Analytics 확인
2. [ ] Supabase 모니터링
3. [ ] 에러 로그 확인

---

## 📞 문제 발생 시 대응 방법

### 1. Vercel 빌드 실패
- Vercel Dashboard → Logs 확인
- 로컬에서 `npm run build` 재실행
- `DEPLOYMENT_GUIDE.md` 트러블슈팅 참고

### 2. 데이터베이스 오류
- Supabase Dashboard → Logs 확인
- RLS 정책 재확인
- 스키마 재적용

### 3. 인증 오류
- OAuth 설정 재확인
- Redirect URI 정확히 일치하는지 확인
- 브라우저 콘솔 에러 메시지 확인

---

## 🎉 배포 완료 후

### 1. 사용자 안내
- README.md에 라이브 데모 링크 추가
- 스크린샷 추가
- 사용 가이드 작성 (선택)

### 2. 지속적 개선
- 사용자 피드백 수집
- 버그 수정
- 기능 추가 (ROADMAP.md 참고)

### 3. 모니터링
- 주기적인 로그 확인
- 성능 지표 추적
- 데이터베이스 사용량 확인

---

**🚀 준비 완료! 이제 배포하세요!**

Phase 2부터 시작하면 됩니다 (Supabase 설정).
모든 코드 변경사항은 Git에 커밋되어 있어 안전합니다.

**문의사항**: WORK_STATUS.md 또는 DEPLOYMENT_GUIDE.md 참고

