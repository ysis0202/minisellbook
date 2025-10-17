# 🚀 배포 가이드 (Deployment Guide)

> **MiniCellBook v1.2.0** 배포를 위한 단계별 가이드

---

## 📋 목차

1. [배포 전 체크리스트](#-배포-전-체크리스트)
2. [Supabase 설정](#-supabase-설정)
3. [환경 변수 설정](#-환경-변수-설정)
4. [Vercel 배포](#-vercel-배포)
5. [배포 후 확인사항](#-배포-후-확인사항)
6. [공지사항 관리](#-공지사항-관리)
7. [트러블슈팅](#-트러블슈팅)

---

## ✅ 배포 전 체크리스트

### 필수 준비물
- [ ] Supabase 프로젝트 생성 완료
- [ ] Google OAuth Client ID & Secret 발급
- [ ] Kakao REST API Key & Client Secret 발급 (선택)
- [ ] Vercel 계정 (또는 다른 호스팅 플랫폼)

### 코드 확인
- [ ] 모든 환경 변수가 `.env.example`에 문서화됨
- [ ] 빌드 에러 없음 (`npm run build`)
- [ ] TypeScript 에러 없음 (`npm run type-check`)
- [ ] Linting 통과 (`npm run lint`)

---

## 🗄️ Supabase 설정

### 1. 프로젝트 생성
1. https://supabase.com 접속
2. "New Project" 클릭
3. 프로젝트 정보 입력
   - Name: `minicellbook` (원하는 이름)
   - Database Password: **안전하게 보관!**
   - Region: `Northeast Asia (Tokyo)` 권장

### 2. 스키마 적용

#### Step 1: SQL Editor 열기
- 왼쪽 메뉴: **SQL Editor** 클릭
- **New Query** 클릭

#### Step 2: 스키마 실행
1. `supabase/schema.sql` 파일 전체 복사
2. SQL Editor에 붙여넣기
3. **Run** 버튼 클릭 (또는 `Ctrl+Enter`)
4. 성공 메시지 확인

#### Step 3: 샘플 공지사항 추가 (선택)
1. `supabase/seed_notices.sql` 파일 복사
2. SQL Editor에 붙여넣기
3. **Run** 버튼 클릭
4. 공지사항 데이터 확인

### 3. Authentication 설정

#### Google OAuth
1. **Google Cloud Console** 접속
   - https://console.cloud.google.com
2. **OAuth 동의 화면** 설정
   - User Type: External
   - 범위 추가: `email`, `profile`
3. **사용자 인증 정보** 생성
   - OAuth 2.0 클라이언트 ID
   - 유형: 웹 애플리케이션
   - 승인된 리디렉션 URI:
     ```
     https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback
     ```
4. **Supabase** Authentication 설정
   - Authentication → Providers → Google
   - Enabled: ON
   - Client ID & Secret 입력

#### Kakao OAuth (선택)
1. **Kakao Developers** 접속
   - https://developers.kakao.com
2. **애플리케이션 추가**
3. **카카오 로그인** 활성화
   - Redirect URI 등록:
     ```
     https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback
     ```
4. **동의 항목** 설정
   - 프로필 정보 (필수)
   - 카카오계정 (이메일) (선택)
5. **Supabase** Authentication 설정
   - Authentication → Providers → Kakao
   - Enabled: ON
   - Client ID (REST API Key) & Secret 입력

### 4. Row Level Security (RLS) 확인

스키마가 자동으로 RLS를 설정하지만, 확인:

```sql
-- 테이블 목록 확인
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- RLS 활성화 확인
SELECT tablename, rowsecurity FROM pg_tables 
WHERE schemaname = 'public' AND rowsecurity = true;
```

---

## ⚙️ 환경 변수 설정

### `.env.local` 파일 생성

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY

# Site URL (배포 후 실제 URL로 변경)
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
```

### 환경 변수 가져오기

**Supabase Dashboard**에서:
1. Settings → API
2. **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
3. **Project API keys** → anon/public → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 🌐 Vercel 배포

### 1. GitHub 연동

```bash
# GitHub에 푸시
git add .
git commit -m "chore: prepare for deployment"
git push origin main
```

### 2. Vercel 프로젝트 생성

1. https://vercel.com 접속
2. **Add New Project** 클릭
3. **Import Git Repository** 선택
4. 저장소 선택 (`minicellbook`)

### 3. 프로젝트 설정

#### Build Settings
- **Framework Preset**: Next.js
- **Build Command**: `npm run build` (기본값)
- **Output Directory**: `.next` (기본값)
- **Install Command**: `npm install` (기본값)

#### Environment Variables
1. **Add** 버튼 클릭
2. 환경 변수 추가:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
   NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
   ```
3. **Deploy** 클릭

### 4. 도메인 설정 (선택)

1. Vercel Dashboard → Settings → Domains
2. 커스텀 도메인 추가
3. DNS 설정 (Vercel 가이드 따르기)

---

## ✅ 배포 후 확인사항

### 1. 기본 동작 확인
- [ ] 사이트 접속 가능
- [ ] 로그인 페이지 표시
- [ ] Google 로그인 동작
- [ ] Kakao 로그인 동작 (설정한 경우)

### 2. 기능 테스트
- [ ] 첫 로그인 시 온보딩 실행
- [ ] 기본 계정/카테고리 생성 확인
- [ ] 수입/지출/저축 항목 추가
- [ ] 캘린더 표시 (색상 점)
- [ ] 통계 페이지 정상 작동
- [ ] 검색 기능
- [ ] 공지사항 표시 (더보기 탭)

### 3. OAuth Redirect URI 업데이트

#### Supabase
- Authentication → URL Configuration
- Site URL: `https://your-app.vercel.app`
- Redirect URLs:
  ```
  https://your-app.vercel.app/auth/callback
  https://your-app.vercel.app/**
  ```

#### Google Cloud Console
- 승인된 리디렉션 URI 추가:
  ```
  https://your-app.vercel.app/auth/callback
  ```

#### Kakao Developers
- Redirect URI 추가:
  ```
  https://your-app.vercel.app/auth/callback
  ```

---

## 📢 공지사항 관리

### 공지사항 추가

**Supabase SQL Editor**에서:

```sql
INSERT INTO notices (title, content, type, emoji, priority, is_active)
VALUES 
(
  '서비스 오픈!',
  'MoneyCells가 정식으로 오픈했습니다! 많은 이용 부탁드립니다.',
  'notice',
  '🎉',
  100,
  true
);
```

### 타입별 예시

#### 일반 공지
```sql
INSERT INTO notices (title, content, type, emoji, priority)
VALUES ('공지 제목', '공지 내용', 'notice', '📢', 80);
```

#### 업데이트
```sql
INSERT INTO notices (title, content, type, emoji, priority)
VALUES ('v1.3.0 업데이트', '새로운 기능이 추가되었습니다!', 'update', '🚀', 90);
```

#### 이벤트 (기한 있음)
```sql
INSERT INTO notices (title, content, type, emoji, priority, expires_at)
VALUES (
  '이벤트 제목',
  '이벤트 내용',
  'event',
  '🎁',
  95,
  '2025-12-31 23:59:59+00'
);
```

### 공지사항 수정/삭제

```sql
-- 비활성화 (숨김)
UPDATE notices SET is_active = false WHERE id = 'NOTICE_ID';

-- 삭제
DELETE FROM notices WHERE id = 'NOTICE_ID';

-- 우선순위 변경
UPDATE notices SET priority = 100 WHERE id = 'NOTICE_ID';
```

### 공지사항 조회

```sql
-- 활성 공지사항 확인
SELECT * FROM notices 
WHERE is_active = true 
ORDER BY priority DESC, created_at DESC;
```

---

## 🔧 트러블슈팅

### 1. 로그인이 안 됨

**증상**: "App Misconfigured" 오류

**해결**:
```bash
# 환경 변수 확인
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

- Vercel → Settings → Environment Variables에서 값 재확인
- Redeploy 필요

### 2. Redirect URI 오류

**증상**: "redirect_uri_mismatch" 또는 "KOE006"

**해결**:
1. Google Cloud Console에서 Redirect URI 확인
2. Kakao Developers에서 Redirect URI 확인
3. 정확한 URL 등록:
   ```
   https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback
   ```

### 3. 데이터가 안 보임

**증상**: 로그인 후 빈 화면

**해결**:
```sql
-- 온보딩 함수 재실행
SELECT fn_onboard_seed(
  'USER_UUID'::uuid,
  '사용자 이름',
  'user@example.com',
  'google'
);
```

### 4. 빌드 실패

**증상**: Vercel 빌드 오류

**해결**:
```bash
# 로컬에서 빌드 테스트
npm run build

# TypeScript 에러 확인
npm run type-check

# Lint 에러 확인
npm run lint
```

### 5. 공지사항이 안 보임

**증상**: 더보기 탭에 "새로운 소식이 없습니다"

**해결**:
```sql
-- RLS 정책 확인
SELECT * FROM pg_policies WHERE tablename = 'notices';

-- 데이터 확인
SELECT * FROM notices WHERE is_active = true;

-- 정책 재생성 (필요시)
DROP POLICY IF EXISTS "public read" ON notices;
CREATE POLICY "public read" ON notices 
FOR SELECT 
USING (is_active = true AND (expires_at IS NULL OR expires_at > now()));
```

---

## 🎯 성능 최적화 (선택)

### 1. 이미지 최적화
- Next.js Image 컴포넌트 사용
- WebP 포맷 변환

### 2. 캐싱 전략
- SWR의 `revalidateOnFocus` 조정
- `dedupingInterval` 설정

### 3. 번들 크기 최적화
```bash
# 번들 분석
npm run build
npx @next/bundle-analyzer
```

---

## 📊 모니터링

### Vercel Analytics
- Vercel Dashboard → Analytics
- 실시간 방문자 추적
- Web Vitals 모니터링

### Supabase Monitoring
- Supabase Dashboard → Database → Query Performance
- 느린 쿼리 최적화

---

## 🔒 보안 체크리스트

- [ ] 모든 API 키가 환경 변수로 관리됨
- [ ] `.env.local`이 `.gitignore`에 포함됨
- [ ] RLS 정책이 모든 테이블에 적용됨
- [ ] HTTPS 사용 (Vercel 자동 제공)
- [ ] CORS 설정 확인

---

## 📝 배포 체크리스트 요약

### Supabase
- [ ] 프로젝트 생성
- [ ] schema.sql 실행
- [ ] seed_notices.sql 실행 (선택)
- [ ] Google OAuth 설정
- [ ] Kakao OAuth 설정 (선택)
- [ ] RLS 확인

### Vercel
- [ ] GitHub 연동
- [ ] 환경 변수 설정
- [ ] 배포 성공
- [ ] 도메인 설정 (선택)

### 외부 서비스
- [ ] Google OAuth Redirect URI 등록
- [ ] Kakao OAuth Redirect URI 등록

### 테스트
- [ ] 로그인 테스트
- [ ] 기능 테스트
- [ ] 공지사항 확인
- [ ] 모바일 반응형 확인

---

**🎉 배포 완료!**

모든 단계를 완료하셨다면 축하합니다! 이제 MiniCellBook을 사용할 수 있습니다.

문제가 발생하면 [트러블슈팅](#-트러블슈팅) 섹션을 참고하세요.

