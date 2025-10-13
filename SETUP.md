# MiniCellBook 설정 가이드

## 🚀 빠른 시작

### 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com)에 가입하고 새 프로젝트를 생성합니다
2. 프로젝트 설정에서 다음 정보를 확인합니다:
   - Project URL
   - anon public key

### 2. 데이터베이스 설정

1. Supabase Dashboard에서 SQL Editor로 이동
2. `supabase/schema.sql` 파일의 내용을 복사하여 실행
3. 테이블과 정책이 정상적으로 생성되었는지 확인

### 3. 인증 설정 (Google OAuth)

1. Supabase Dashboard → Authentication → Settings → Auth Providers
2. Google Provider 활성화:
   - Enable: ON
   - Client ID: Google Cloud Console에서 발급받은 Client ID
   - Client Secret: Google Cloud Console에서 발급받은 Client Secret
3. Site URL 설정:
   - Development: `http://localhost:3000`
   - Production: 실제 도메인
4. Redirect URLs 추가:
   - `http://localhost:3000/auth/callback`
   - `https://your-domain.com/auth/callback`

### 4. 환경 변수 설정

`.env.local` 파일 생성:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_NAME=MiniCellBook
```

### 5. 개발 서버 실행

```bash
npm install
npm run dev
```

## 🔧 추가 설정

### Google Cloud Console 설정

1. [Google Cloud Console](https://console.cloud.google.com) 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. APIs & Services → Library → Google+ API 활성화
4. APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client IDs
5. Application type: Web application
6. Authorized redirect URIs:
   - `https://your-supabase-project.supabase.co/auth/v1/callback`

### 더미 데이터 추가 (선택사항)

1. 앱에 로그인한 후
2. Supabase SQL Editor에서 `supabase/seed.sql` 실행
3. 더미 거래 데이터가 추가됩니다

## 🐛 문제 해결

### 일반적인 문제

1. **로그인이 안 되는 경우**
   - Google OAuth 설정 확인
   - Redirect URL 확인
   - 브라우저 콘솔 에러 확인

2. **데이터가 로드되지 않는 경우**
   - 환경 변수 확인
   - Supabase RLS 정책 확인
   - 네트워크 탭에서 API 호출 확인

3. **온보딩이 실행되지 않는 경우**
   - `fn_onboard_seed` 함수가 올바르게 생성되었는지 확인
   - Supabase Functions 로그 확인

### 개발 팁

- 개발 중에는 Supabase Dashboard의 Table Editor를 활용하여 데이터를 직접 확인/수정할 수 있습니다
- 실시간 로그는 Supabase Dashboard의 Logs 섹션에서 확인할 수 있습니다
- 브라우저 개발자 도구의 Network 탭을 활용하여 API 호출을 디버깅하세요

## 📝 체크리스트

- [ ] Supabase 프로젝트 생성
- [ ] 데이터베이스 스키마 적용
- [ ] Google OAuth 설정
- [ ] 환경 변수 설정
- [ ] 개발 서버 실행
- [ ] 로그인 테스트
- [ ] 기본 기능 테스트

완료하셨다면 `npm run dev`로 개발 서버를 실행하고 [http://localhost:3000](http://localhost:3000)에서 앱을 확인하세요! 🎉