# 💰 MiniCellBook - 개인 재정 관리 웹앱

> **간편하고 직관적인 개인 장부 앱**  
> 수입, 지출, 저축을 한눈에 관리하고 통계로 분석하세요!

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue)](https://react.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-green)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)](https://tailwindcss.com/)

---

## 📋 목차

- [주요 기능](#-주요-기능)
- [빠른 시작](#-빠른-시작) ⭐ NEW
- [기술 스택](#-기술-스택)
- [시작하기](#-시작하기)
- [Google Play 배포](#-google-play-배포)
- [프로젝트 구조](#-프로젝트-구조)
- [데이터베이스 스키마](#-데이터베이스-스키마)
- [핵심 기능 상세](#-핵심-기능-상세)
- [주의사항](#-주의사항)
- [트러블슈팅](#-트러블슈팅)
- [문서 가이드](#-문서-가이드) ⭐ NEW
- [업데이트 내역](#-업데이트-내역)

---

## ⚡ 빠른 시작

### 🎯 처음 보시는 분
**프로젝트 전체를 파악하고 싶으신가요?**

👉 **[PROJECT_MASTER.md](./PROJECT_MASTER.md)** - 한 문서에서 모든 것을 확인하세요!

이 문서에 포함된 내용:
- ✅ 프로젝트 개요 & 기술 스택
- ✅ 개발 환경 설정 (5분)
- ✅ 주요 기능 상세
- ✅ 배포 가이드 (단계별)
- ✅ 업데이트 방법
- ✅ 트러블슈팅

### 🚀 앱 스토어 출시하시는 분
**Google Play Store 출시 진행 중이신가요?**

👉 **[QUICK_START_CHECKLIST.md](./QUICK_START_CHECKLIST.md)** - 30분 체크리스트

### 📚 모든 문서 보기
👉 **[docs/README.md](./docs/README.md)** - 문서 가이드

---

## ✨ 주요 기능

### 💵 재정 관리
- **수입/지출/저축** 3가지 유형 관리
- 실시간 **천 단위 콤마** 자동 입력
- 다양한 **카테고리** 설정 (이모지 지원)
- 여러 **계정**(현금, 카드, 은행) 관리
- **메모** 및 **날짜** 기록

### 📊 통계 & 분석
- **월별/년도별** 요약 통계
- **카테고리별** 지출/수입/저축 분석
- **시각화된 진행률** 표시
- **저축 목표** 설정 및 추적
- **순잔액** 자동 계산 (수입 - 지출 - 저축)

### 📅 캘린더
- **월간 달력** 뷰
- 날짜별 **색상 점** 표시
  - 🟢 초록: 수입
  - 🔴 빨강: 지출
  - 🔵 파랑: 저축
- **날짜 더블클릭**으로 빠른 항목 보기
- **연간 요약** 카드

### 🔍 검색
- **키워드** 검색 (메모, 카테고리)
- **날짜 범위** 필터
- **빠른 필터** (최근 7일/30일)
- 검색 결과 **색상 구분** 표시

### 📢 공지사항 & 이벤트
- **실시간 공지사항** 관리
- **이벤트** 알림 (기한 설정 가능)
- **업데이트** 소식 자동 표시
- 타입별 **색상 구분** (공지/이벤트/업데이트)
- **우선순위** 기반 정렬

### 🔐 인증
- **Google** 소셜 로그인
- **Kakao** 소셜 로그인 (설정 시)
- **자동 온보딩** (첫 로그인 시 기본 데이터 생성)

---

## 🛠 기술 스택

### Frontend
- **Next.js 15.5** - App Router, Server Components
- **React 19.2** - 최신 React 기능
- **TypeScript** - 타입 안전성
- **Tailwind CSS** - 유틸리티 기반 스타일링
- **Framer Motion** - 애니메이션
- **Lucide React** - 아이콘
- **SWR** - 데이터 페칭 및 캐싱
- **React Hook Form** - 폼 관리
- **Zod** - 스키마 검증
- **Sonner** - 토스트 알림

### Backend
- **Supabase** - BaaS (Backend as a Service)
  - **PostgreSQL** - 데이터베이스
  - **Row Level Security (RLS)** - 보안
  - **Auth** - 인증 관리
  - **Storage** - 파일 저장 (선택)

### UI 컴포넌트
- **Radix UI** - 접근성 좋은 UI 프리미티브
- **class-variance-authority** - 컴포넌트 변형 관리
- **tailwind-merge** - 클래스 병합

---

## 🚀 시작하기

### 1. 사전 요구사항

- Node.js 18 이상
- npm, yarn, 또는 pnpm
- Supabase 계정

### 2. 설치

```bash
# 저장소 클론
cd minicellbook

# 의존성 설치
npm install
```

### 3. 환경 변수 설정

`.env.local` 파일 생성:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. 데이터베이스 설정

#### 4-1. Supabase 프로젝트 생성
1. https://supabase.com 접속
2. 새 프로젝트 생성
3. URL과 ANON KEY 복사

#### 4-2. 스키마 적용

**중요:** 순서대로 실행하세요!

```sql
-- 1. Check Constraint 수정 (필수!)
ALTER TABLE categories DROP CONSTRAINT IF EXISTS categories_kind_check;
ALTER TABLE categories ADD CONSTRAINT categories_kind_check 
  CHECK (kind IN ('income', 'expense', 'savings'));

ALTER TABLE entries DROP CONSTRAINT IF EXISTS entries_kind_check;
ALTER TABLE entries ADD CONSTRAINT entries_kind_check 
  CHECK (kind IN ('income', 'expense', 'savings'));

ALTER TABLE recurring_rules DROP CONSTRAINT IF EXISTS recurring_rules_kind_check;
ALTER TABLE recurring_rules ADD CONSTRAINT recurring_rules_kind_check 
  CHECK (kind IN ('income', 'expense', 'savings'));

-- 2. 전체 스키마 실행
-- supabase/schema.sql 파일 내용 전체 복사해서 실행

-- 3. 현재 사용자에게 저축 카테고리 생성
INSERT INTO categories (user_id, name, kind, emoji, sort, archived)
VALUES (auth.uid(), '저축', 'savings', '💰', 1, false);
```

#### 4-3. Google OAuth 설정

Supabase Dashboard → Authentication → Providers → Google:
1. Google OAuth 활성화
2. Client ID, Client Secret 입력
3. Redirect URL 추가: `https://your-project.supabase.co/auth/v1/callback`

### 5. 개발 서버 실행

```bash
npm run dev
```

http://localhost:3000 접속

---

## 📱 Google Play 배포

### 🚀 빠른 시작

**앱 스토어 배포를 시작하시나요?**

👉 **[시작하기.md](./시작하기.md)** - 전체 개요 및 안내  
👉 **[QUICK_START_CHECKLIST.md](./QUICK_START_CHECKLIST.md)** - 단계별 체크리스트 (30분)  
👉 **[SCREENSHOT_GUIDE.md](./SCREENSHOT_GUIDE.md)** - 스크린샷 촬영 가이드  
👉 **[COMPLETE_DEPLOYMENT_GUIDE.md](./COMPLETE_DEPLOYMENT_GUIDE.md)** - 전체 가이드 + 업데이트 방법

### 📦 앱 정보

```
앱 이름: MoneyCells (머니셀즈)
Package ID: com.moneycells.app
현재 버전: 1.0.0
Google Play Store: 출시 준비 중
```

### 🔄 앱 업데이트 방법

**간단 요약**: 웹사이트만 수정하면 앱도 자동 업데이트! (PWA)

1. 코드 수정 → Git 푸시
2. Vercel 자동 배포 (2-3분)
3. 사용자가 앱 새로고침 → 업데이트 완료!

**자세한 내용**: [COMPLETE_DEPLOYMENT_GUIDE.md](./COMPLETE_DEPLOYMENT_GUIDE.md) → "앱 업데이트 방법" 섹션

---

## 📁 프로젝트 구조

```
minicellbook/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (protected)/       # 로그인 필요 페이지
│   │   │   ├── home/          # 📱 홈 (캘린더)
│   │   │   ├── calendar/      # 📅 연간 요약
│   │   │   ├── stats/         # 📊 통계
│   │   │   ├── search/        # 🔍 검색
│   │   │   └── profile/       # 👤 프로필
│   │   ├── auth/              # 🔐 인증
│   │   └── onboard/           # 🎯 온보딩
│   ├── components/            # React 컴포넌트
│   │   ├── ui/                # 기본 UI 컴포넌트
│   │   ├── top-summary.tsx    # 홈 상단 요약
│   │   ├── month-calendar.tsx # 월간 달력
│   │   ├── entry-modal.tsx    # 항목 추가/수정 모달
│   │   ├── date-entries-modal.tsx # 날짜별 항목 모달
│   │   └── ...
│   ├── lib/
│   │   ├── hooks/             # Custom Hooks
│   │   │   └── use-entries.ts # 데이터 페칭 훅
│   │   ├── supabase/          # Supabase 클라이언트
│   │   ├── schemas.ts         # Zod 스키마
│   │   ├── types.ts           # TypeScript 타입
│   │   └── utils.ts           # 유틸리티 함수
│   ├── server/
│   │   └── actions.ts         # Server Actions
│   └── types/
│       └── index.ts           # 타입 정의
├── supabase/
│   ├── schema.sql            # 데이터베이스 스키마
│   └── seed.sql              # 시드 데이터
├── SCHEMA_UPDATE_GUIDE.md    # DB 업데이트 가이드
└── README.md                 # 이 파일
```

---

## 🗄 데이터베이스 스키마

### 주요 테이블

#### `profiles` - 사용자 프로필
```sql
- id: UUID (auth.users FK)
- email: TEXT
- display_name: TEXT
- auth_provider: TEXT (google/kakao)
- currency: CHAR(3) (기본: KRW)
```

#### `accounts` - 계정 (현금/카드/은행)
```sql
- id: UUID
- user_id: UUID
- name: TEXT
- type: TEXT (cash/card/bank/other)
- is_default: BOOLEAN
- archived: BOOLEAN
```

#### `categories` - 카테고리
```sql
- id: UUID
- user_id: UUID
- name: TEXT
- kind: TEXT (income/expense/savings) ⭐
- emoji: TEXT
- sort: INT
- archived: BOOLEAN
```

#### `entries` - 항목 (수입/지출/저축)
```sql
- id: UUID
- user_id: UUID
- account_id: UUID (FK)
- category_id: UUID (FK)
- kind: TEXT (income/expense/savings) ⭐
- amount: NUMERIC(14,2)
- memo: TEXT
- entry_date: DATE
- deleted_at: TIMESTAMPTZ (소프트 삭제)
```

#### `savings_goals` - 저축 목표
```sql
- id: UUID
- user_id: UUID
- month: DATE
- goal_amount: NUMERIC(14,2)
```

### RLS (Row Level Security) 정책

모든 테이블에 다음 정책 적용:
```sql
CREATE POLICY "own rows" ON table_name
FOR ALL USING (user_id = auth.uid());
```

---

## 🎯 핵심 기능 상세

### 1. 순잔액 계산 로직

```typescript
순잔액 = 수입 - 지출 - 저축

예시:
수입: 3,000,000원
지출: 2,000,000원
저축:   500,000원
─────────────────
순잔액: 500,000원 ✅
```

### 2. 저축 항목 처리

- **개념**: 저축은 "지출처럼" 돈이 빠져나가지만, 통계에서 별도로 표시
- **UI 구분**:
  - 색상: 파란색 (🔵)
  - 아이콘: 💰 (금화) 또는 💎 (보석)
  - 위치: 수입/지출과 동등하게 표시

### 3. 카테고리별 통계

```typescript
// use-entries.ts
export function useCategoryStats(month: string) {
  // ...
  return {
    income: [...],      // 수입 카테고리별
    expense: [...],     // 지출 카테고리별
    savings: [...]      // 저축 카테고리별 ⭐
  };
}
```

### 4. 저축 목표 관리

- 월별로 목표 금액 설정
- 실제 저축액과 비교
- 진행률 시각화 (프로그레스 바)
- 달성률 퍼센티지 표시

### 5. 금액 입력 포맷

```typescript
// 실시간 천 단위 콤마 자동 입력
입력: 1000000
표시: 1,000,000

// onChange 핸들러
const numbersOnly = input.replace(/[^\d]/g, '');
const formatted = new Intl.NumberFormat('ko-KR').format(Number(numbersOnly));
```

---

## ⚠️ 주의사항

### 1. 데이터베이스 설정

#### ❌ 흔한 실수
```sql
-- 잘못됨: savings 없이 constraint 생성
ALTER TABLE categories ADD CONSTRAINT categories_kind_check 
  CHECK (kind IN ('income', 'expense'));  -- ❌
```

#### ✅ 올바른 방법
```sql
-- 올바름: savings 포함
ALTER TABLE categories ADD CONSTRAINT categories_kind_check 
  CHECK (kind IN ('income', 'expense', 'savings'));  -- ✅
```

### 2. 저축 카테고리 생성

**문제**: SQL Editor에서 `auth.uid()`가 작동하지 않음

**해결**:
```sql
-- ❌ 작동 안함 (SQL Editor에서)
INSERT INTO categories (user_id, name, kind, emoji, sort)
VALUES (auth.uid(), '저축', 'savings', '💰', 1);

-- ✅ 올바름
-- 1. 먼저 사용자 ID 확인
SELECT id FROM auth.users;

-- 2. 실제 UUID 사용
INSERT INTO categories (user_id, name, kind, emoji, sort)
VALUES ('4f6f66dc-898b-4d5a-ae88-4153df48d01e', '저축', 'savings', '💰', 1);
```

### 3. 타입스크립트 타입

#### ❌ 흔한 실수
```typescript
// types.ts
kind: 'income' | 'expense'  // ❌ savings 누락!
```

#### ✅ 올바른 방법
```typescript
// types.ts
kind: 'income' | 'expense' | 'savings'  // ✅
```

### 4. 기존 사용자 데이터

**문제**: 기존 사용자는 저축 카테고리가 없음

**해결**:
```sql
-- 모든 기존 사용자에게 저축 카테고리 추가
INSERT INTO categories (user_id, name, kind, emoji, sort, archived)
SELECT id, '저축', 'savings', '💰', 1, false
FROM auth.users
WHERE NOT EXISTS (
  SELECT 1 FROM categories 
  WHERE categories.user_id = auth.users.id 
  AND categories.kind = 'savings'
);
```

---

## 🐛 트러블슈팅

### 문제 1: "저축 카테고리가 없습니다" 에러

**원인**: DB에 저축 카테고리 미생성

**해결**:
```sql
INSERT INTO categories (user_id, name, kind, emoji, sort)
VALUES ('YOUR_USER_ID', '저축', 'savings', '💰', 1);
```

### 문제 2: Check Constraint 위반

**에러 메시지**:
```
new row violates check constraint "categories_kind_check"
```

**해결**:
```sql
-- Constraint 재생성
ALTER TABLE categories DROP CONSTRAINT categories_kind_check;
ALTER TABLE categories ADD CONSTRAINT categories_kind_check 
  CHECK (kind IN ('income', 'expense', 'savings'));
```

### 문제 3: 카테고리가 "미분류"로 표시됨

**원인**: 데이터 구조 불일치

**해결**:
```typescript
// ❌ 잘못됨
entry.category_name

// ✅ 올바름
entry.categories?.name
```

### 문제 4: 통계에서 저축이 안 보임

**원인**: `useCategoryStats`에 저축 필터 누락

**해결**: 이미 수정 완료됨 ✅
```typescript
return {
  income: [...],
  expense: [...],
  savings: [...]  // ✅ 추가됨
};
```

---

## 📈 업데이트 내역

### v1.2.0 (2025-10-15) - 공지사항 시스템 & UI 개선

#### ✨ 새로운 기능
- 📢 **공지사항 & 이벤트** 시스템 추가
  - 실시간 공지사항 표시
  - 이벤트 알림 (기한 설정 가능)
  - 업데이트 소식 자동 표시
  - 타입별 색상 구분 (공지/이벤트/업데이트)
  - 우선순위 기반 정렬
- 🔗 외부 링크 연결 기능 (공지사항 클릭 시)

#### 🔧 개선 사항
- 🔄 **프로필 탭** → **더보기 탭**으로 변경
  - 더 많은 기능 확장 가능한 구조
  - 공지사항 섹션 최상단 배치
- 📧 Google 로그인 시 **이메일 권한** 명시적 요청
  - `scopes: 'email profile'` 추가
  - OAuth 동의 화면 개선
- 🎨 UI 일관성 향상
  - 아이콘 통일 (Menu 아이콘으로 변경)
  - 카드 디자인 개선

#### 🗄️ 데이터베이스
- **notices** 테이블 추가
  ```sql
  - title, content, type, emoji
  - is_active, priority, expires_at
  - RLS 정책 (공개 읽기)
  ```

#### 📝 문서
- README.md 업데이트 (공지사항 기능 추가)
- seed_notices.sql 추가 (샘플 데이터)

---

### v1.1.0 (2025-10-15) - 저축 기능 추가

#### ✨ 새로운 기능
- 💰 **저축** 타입 추가 (income, expense에 이어 3번째)
- 📊 **순잔액** 계산 로직 개선 (수입 - 지출 - 저축)
- 🎯 **저축 목표** 설정 및 추적
- 📈 통계 페이지에 **저축 탭** 추가
- 🔵 저축 항목 **파란색** 구분 표시
- 🟢🔴🔵 캘린더 **색상 점** 개선

#### 🔧 개선 사항
- 💵 금액 입력 시 **천 단위 콤마** 자동 생성
- 🏷️ 저축 탭에서 **카테고리 선택 숨김** (자동 "저축"으로 설정)
- 📱 모바일에서 **숫자 키패드** 자동 표시
- 🎨 UI 일관성 개선

#### 🐛 버그 수정
- ✅ 타입 정의 불일치 수정 (Database, Entry, Category)
- ✅ DateEntriesModal 카테고리 표시 수정
- ✅ 통계 페이지 카테고리 통계에 저축 포함

#### 📝 문서
- README.md 전면 개선
- SCHEMA_UPDATE_GUIDE.md 추가
- 주의사항 및 트러블슈팅 가이드 추가

### v1.0.0 (Initial Release)
- 기본 수입/지출 관리
- 월간 캘린더
- 통계 및 검색
- Google/Kakao 로그인

---

## 📚 문서 가이드

### 어떤 문서를 읽어야 하나요?

| 상황 | 문서 | 소요 시간 |
|------|------|----------|
| 🎯 **프로젝트 전체 파악** | [PROJECT_MASTER.md](./PROJECT_MASTER.md) | 10분 |
| 🚀 **Google Play 출시** | [QUICK_START_CHECKLIST.md](./QUICK_START_CHECKLIST.md) | 30분 |
| 📖 **상세 배포 가이드** | [COMPLETE_DEPLOYMENT_GUIDE.md](./COMPLETE_DEPLOYMENT_GUIDE.md) | - |
| 🍎 **iOS 출시** | [APPLE_APP_STORE_GUIDE.md](./APPLE_APP_STORE_GUIDE.md) | - |
| 📸 **스크린샷 촬영** | [SCREENSHOT_GUIDE.md](./SCREENSHOT_GUIDE.md) | 10분 |
| 🎨 **UI 업데이트** | [UI_UPDATE_GUIDE.md](./UI_UPDATE_GUIDE.md) | - |
| 🗄️ **DB 스키마** | [SCHEMA_UPDATE_GUIDE.md](./SCHEMA_UPDATE_GUIDE.md) | - |

### 문서 구조
```
minicellbook/
├── PROJECT_MASTER.md           ⭐ 마스터 문서
├── README.md                   이 파일!
├── QUICK_START_CHECKLIST.md    배포 체크리스트
├── COMPLETE_DEPLOYMENT_GUIDE.md 상세 가이드
├── APPLE_APP_STORE_GUIDE.md    iOS 가이드
├── SCREENSHOT_GUIDE.md         스크린샷 가이드
├── UI_UPDATE_GUIDE.md          UI 변경 내역
├── SCHEMA_UPDATE_GUIDE.md      DB 가이드
└── docs/
    ├── README.md               문서 안내
    └── archive/                오래된 문서
```

---

## 🔮 향후 계획

### 단기 (다음 버전)
- [ ] 저축 목표 **알림 기능** (매월 28일)
- [ ] **예산** 설정 기능
- [ ] **반복 항목** 자동 생성
- [ ] **영수증** 이미지 첨부

### 중기
- [ ] **다크 모드**
- [ ] **다국어** 지원 (영어)
- [ ] **PWA** 완전 지원
- [ ] **오프라인** 모드

### 장기
- [ ] **AI 지출 분석** 및 조언
- [ ] **가족 공유** 기능
- [ ] **은행 연동** (Open Banking)
- [ ] **투자** 추적 기능

---

## 👥 기여하기

기여를 환영합니다! PR을 보내주세요.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 라이선스

This project is licensed under the MIT License.

---

## 💬 문의

프로젝트에 대한 질문이나 제안이 있으시면 이슈를 열어주세요!

---

**Made with ❤️ using Next.js & Supabase**
