# MiniCellBook (미니셀북)

간편하고 직관적인 가계부 앱 📱💰

## 📋 프로젝트 소개

MiniCellBook은 Next.js와 Supabase를 기반으로 한 모던한 가계부 애플리케이션입니다. 사용자 친화적인 인터페이스와 실시간 데이터 동기화를 통해 일상의 수입과 지출을 효율적으로 관리할 수 있습니다.

## ✨ 주요 기능

### 🏠 홈 화면
- **월별 요약**: 수입, 지출, 잔액을 한눈에 확인
- **인터랙티브 달력**: 날짜별 거래 내역 시각화
- **일별 거래 목록**: 선택한 날짜의 상세 거래 내역

### 📊 통계
- **월별 통계**: 수입/지출 분석 및 저축률 계산
- **일평균 데이터**: 일별 평균 수입/지출 통계
- **시각적 차트**: 직관적인 데이터 시각화

### 💳 거래 관리
- **빠른 입력**: FAB 버튼을 통한 원터치 거래 추가
- **카테고리 분류**: 수입/지출별 세분화된 카테고리
- **계정 관리**: 현금, 카드, 은행 등 다중 계정 지원
- **메모 기능**: 거래별 상세 메모 추가

### 🔍 검색 & 필터
- **키워드 검색**: 메모나 카테고리명으로 검색
- **날짜 범위 필터**: 특정 기간의 거래 내역 조회
- **빠른 필터**: 이번 주, 이번 달 등 preset 필터

### 👤 프로필 관리
- **계정 설정**: 사용자 정보 및 기본 통화 설정
- **데이터 백업**: 거래 데이터 내보내기 (예정)
- **보안**: Google OAuth를 통한 안전한 로그인

## 🛠 기술 스택

### Frontend
- **Next.js 14**: App Router, TypeScript
- **React**: 컴포넌트 기반 UI
- **Tailwind CSS**: 유틸리티 기반 스타일링
- **shadcn/ui**: 모던한 UI 컴포넌트
- **Framer Motion**: 부드러운 애니메이션
- **date-fns**: 날짜 처리

### Backend & Database
- **Supabase**:
  - PostgreSQL 데이터베이스
  - 실시간 구독
  - Row Level Security (RLS)
  - OAuth 인증

### State Management & Data Fetching
- **SWR**: 데이터 캐싱 및 동기화
- **React Hook Form**: 폼 상태 관리
- **Zod**: 타입 안전한 스키마 검증

### UI/UX
- **Responsive Design**: 모바일 퍼스트 반응형 디자인
- **Sonner**: 토스트 알림
- **Lucide React**: 아이콘 라이브러리

## 🚀 설치 및 실행

### 1. 저장소 클론
```bash
git clone https://github.com/ysis0202/minisellbook.git
cd minicellbook
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경 변수 설정
`.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# 앱 설정
NEXT_PUBLIC_APP_NAME=MiniCellBook
```

### 4. Supabase 데이터베이스 설정
`supabase/schema.sql` 파일의 내용을 Supabase SQL Editor에서 실행하세요.

### 5. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 앱을 확인하세요.

## 📱 사용법

### 1. 회원가입/로그인
- Google 계정으로 간편 로그인
- 최초 로그인 시 자동 온보딩 진행

### 2. 거래 추가
- 우하단 FAB 버튼 클릭
- 수입/지출 선택
- 금액, 카테고리, 계정 선택
- 메모 추가 (선택사항)

### 3. 거래 수정/삭제
- 거래 항목 클릭하여 수정
- 삭제 버튼으로 거래 삭제

### 4. 통계 확인
- 하단 탭에서 "통계" 선택
- 월별 수입/지출 현황 확인
- 저축률 및 일평균 데이터 조회

## 🗄 데이터베이스 구조

### 주요 테이블
- **profiles**: 사용자 프로필 정보
- **accounts**: 계정 정보 (현금, 카드, 은행 등)
- **categories**: 수입/지출 카테고리
- **entries**: 거래 내역

### 보안
- Row Level Security (RLS) 적용
- 사용자별 데이터 격리
- OAuth 기반 인증

## 📂 프로젝트 구조

```
src/
├── app/                 # Next.js App Router
│   ├── (protected)/     # 인증이 필요한 페이지
│   │   ├── home/        # 홈 페이지
│   │   ├── calendar/    # 달력 페이지
│   │   ├── stats/       # 통계 페이지
│   │   ├── search/      # 검색 페이지
│   │   └── profile/     # 프로필 페이지
│   ├── auth/            # 인증 관련 페이지
│   └── onboard/         # 온보딩 페이지
├── components/          # 재사용 가능한 컴포넌트
│   ├── ui/             # 기본 UI 컴포넌트
│   ├── top-summary.tsx # 월별 요약 카드
│   ├── month-calendar.tsx # 월 달력
│   ├── day-list.tsx    # 일별 거래 목록
│   ├── entry-modal.tsx # 거래 입력/수정 모달
│   └── bottom-nav.tsx  # 하단 네비게이션
├── lib/                # 유틸리티 및 설정
│   ├── supabase/       # Supabase 클라이언트
│   ├── hooks/          # 커스텀 훅
│   ├── schemas.ts      # Zod 스키마
│   └── types.ts        # TypeScript 타입 정의
└── server/             # 서버 액션
    └── actions.ts      # 서버 사이드 로직
```

## 🔧 커스터마이징

### 테마 변경
`src/app/globals.css`에서 CSS 변수를 수정하여 테마를 변경할 수 있습니다.

### 카테고리 추가
데이터베이스의 `categories` 테이블에 새로운 카테고리를 추가하거나, 온보딩 시드 함수를 수정하세요.

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 지원

문제가 있거나 제안사항이 있으시면 [GitHub Issues](https://github.com/ysis0202/minisellbook/issues)를 통해 알려주세요.

---

**MiniCellBook으로 스마트한 가계 관리를 시작하세요! 💫**
