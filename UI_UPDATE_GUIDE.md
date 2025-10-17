# 🎨 UI 업데이트 가이드 (v1.1.0)

> **홈 화면 최적화**  
> 캘린더를 더 크게, 더 깔끔하게!

---

## 📋 변경 사항 요약

### ✅ 개선된 점

1. **광고 배너 숨김** 
   - 기본적으로 숨겨짐 (나중에 켜기 쉬움)
   - 환경 변수로 간단히 제어

2. **상단 헤더 최소화**
   - 앱 로고 제거 (더 많은 공간 확보)
   - TopSummary 크기 축소 (컴팩트 모드)
   
3. **캘린더 뷰 확대**
   - 상단 영역 줄임으로 캘린더가 더 크게 보임
   - 사용자가 한눈에 더 많은 날짜를 볼 수 있음

---

## 🎯 변경된 파일

### 1. `src/app/(protected)/home/page.tsx`

**변경 사항**:
```typescript
// 환경 변수로 광고 표시 제어
const showAds = process.env.NEXT_PUBLIC_SHOW_ADS === 'true';

// 광고 배너는 조건부로만 표시
{showAds && (
  <div className="bg-white px-3 py-2 border-b border-gray-200">
    <AdBanner slot="home_header" format="horizontal" />
  </div>
)}

// TopSummary에 compact 모드 적용
<TopSummary month={currentMonth} compact />
```

**결과**:
- 앱 로고 제거 (AppLogo 컴포넌트 제거)
- 광고 배너 숨김 (환경 변수로 제어)
- 월 전환 버튼 패딩 축소

---

### 2. `src/components/top-summary.tsx`

**변경 사항**:
```typescript
interface TopSummaryProps {
  month: string;
  compact?: boolean; // 컴팩트 모드 추가
}

// 컴팩트 모드 스타일 적용
const paddingClass = compact ? "p-2 space-y-1.5" : "p-3 space-y-2";
const cardPaddingClass = compact ? "p-2" : "p-2.5";
const iconSizeClass = compact ? "w-3 h-3" : "w-3.5 h-3.5";
// ... 등등
```

**결과**:
- 패딩 감소: `p-3` → `p-2`
- 카드 간격 감소: `gap-2` → `gap-1.5`
- 아이콘 크기 감소: `w-3.5 h-3.5` → `w-3 h-3`
- 텍스트 크기 감소: `text-[11px]` → `text-[10px]`
- 순잔액 높이 감소

---

### 3. `.env.local.example` (신규)

**새 파일 생성**:
```env
# 광고 표시 여부
NEXT_PUBLIC_SHOW_ADS=false
```

**용도**:
- 개발자가 쉽게 광고를 켜거나 끌 수 있음
- 기본값: `false` (숨김)
- 나중에 필요하면 `true`로 변경

---

## 📊 Before & After

### Before (이전)
```
┌─────────────────────────────────┐
│        앱 로고 영역 (헤더)         │  ← 제거됨
├─────────────────────────────────┤
│     수입 / 지출 / 저축 (큼)       │  ← 축소됨
│        순잔액 (큼)               │
├─────────────────────────────────┤
│        광고 배너 (80px)          │  ← 숨김
├─────────────────────────────────┤
│        월 전환 버튼              │  ← 축소됨
├─────────────────────────────────┤
│                                 │
│        캘린더                    │  ← 작음
│                                 │
└─────────────────────────────────┘

상단 고정 영역 높이: ~260px
```

### After (현재)
```
┌─────────────────────────────────┐
│   수입 / 지출 / 저축 (작음)       │  ✅ 축소
│      순잔액 (작음)               │  ✅ 축소
├─────────────────────────────────┤
│        월 전환 버튼 (작음)        │  ✅ 축소
├─────────────────────────────────┤
│                                 │
│                                 │
│        캘린더                    │  ✅ 확대!
│         (더 크게!)               │
│                                 │
│                                 │
└─────────────────────────────────┘

상단 고정 영역 높이: ~140px (-120px!)
```

**절약된 공간**: 약 **120px** (46% 감소!)

---

## 🔧 광고 표시 방법 (나중에 필요할 때)

### 로컬 개발 환경

1. **`.env.local` 파일 열기** (없으면 생성)
   ```env
   NEXT_PUBLIC_SHOW_ADS=true
   ```

2. **개발 서버 재시작**
   ```bash
   npm run dev
   ```

3. **확인**: 광고 배너가 나타남

---

### Vercel 프로덕션 배포

1. **Vercel Dashboard** 접속
2. **Settings** → **Environment Variables**
3. 새 환경 변수 추가:
   ```
   Key: NEXT_PUBLIC_SHOW_ADS
   Value: true
   ```
4. **Save** 클릭
5. **Deployments** → **Redeploy** (또는 새로 푸시)

---

## 🎨 세부 크기 변경 내역

### TopSummary 컴포넌트

| 요소 | Before | After | 변화 |
|------|--------|-------|------|
| 전체 패딩 | `p-3` | `p-2` | -25% |
| 카드 패딩 | `p-2.5` | `p-2` | -20% |
| 카드 간격 | `gap-2` | `gap-1.5` | -25% |
| 아이콘 크기 | `w-3.5 h-3.5` | `w-3 h-3` | -14% |
| 타이틀 크기 | `text-[11px]` | `text-[10px]` | -9% |
| 금액 크기 | `text-sm` | `text-xs` | -14% |
| 단위 크기 | `text-[9px]` | `text-[8px]` | -11% |
| 순잔액 패딩 | `px-3 py-2` | `px-2.5 py-1.5` | -25% |
| 순잔액 금액 | `text-base` | `text-sm` | -14% |

### 홈 페이지

| 요소 | Before | After | 변화 |
|------|--------|-------|------|
| 앱 로고 헤더 | 있음 (~40px) | 없음 | -100% |
| 광고 배너 | 있음 (80px) | 없음 | -100% |
| 월 전환 패딩 | `px-4 py-2` | `px-3 py-1.5` | -25% |

---

## 📱 사용자 경험 개선

### ✅ 장점

1. **더 많은 캘린더 공간**
   - 한 화면에 더 많은 날짜 표시
   - 스크롤 없이 월간 뷰 확인 가능

2. **깔끔한 UI**
   - 불필요한 요소 제거
   - 시각적 혼잡도 감소

3. **빠른 로딩**
   - 광고 스크립트 로드 안 함
   - 렌더링 속도 향상

4. **집중도 향상**
   - 핵심 기능(캘린더)에 집중
   - 산만한 요소 제거

### ⚠️ 고려사항

1. **수익화 지연**
   - 광고 수익 일시적 포기
   - 나중에 언제든 켤 수 있음

2. **정보 밀도 감소**
   - 요약 정보 글자 크기 작아짐
   - 하지만 여전히 읽기 쉬움

---

## 🔄 원상 복구 방법

### 원래대로 되돌리고 싶다면?

#### 1. 광고 배너 표시
```bash
# .env.local
NEXT_PUBLIC_SHOW_ADS=true
```

#### 2. TopSummary 원래 크기로
```typescript
// home/page.tsx
<TopSummary month={currentMonth} />  // compact 제거
```

#### 3. 앱 로고 복원
```typescript
// home/page.tsx (118줄 근처에 추가)
<div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
  <div className="px-4 py-1 flex justify-center">
    <AppLogo size="sm" />
  </div>
</div>
```

---

## 🚀 배포 방법

### Git 커밋 및 푸시

```bash
git add .
git commit -m "feat: UI 최적화 - 홈 화면 상단 영역 축소, 캘린더 확대"
git push origin main
```

### Vercel 자동 배포
- GitHub에 푸시하면 자동으로 배포됨
- 2-3분 후 웹사이트 확인

---

## 🎯 다음 업데이트 예정

### 사용자 피드백 반영
1. TopSummary 크기 조절 옵션 추가 (설정에서 선택)
2. 광고 위치 변경 (하단 또는 사이드)
3. 다크 모드 지원
4. 커스텀 테마

---

## 📞 문의 및 피드백

UI 개선 사항에 대한 의견이 있으시면:
- GitHub Issues
- 이메일: ysis0202@naver.com

---

## 📝 변경 이력

### v1.1.0 (2025-10-17)
- ✅ 광고 배너 숨김 (환경 변수로 제어)
- ✅ 앱 로고 헤더 제거
- ✅ TopSummary 컴팩트 모드 추가
- ✅ 월 전환 버튼 패딩 축소
- ✅ 캘린더 뷰 확대 (상단 120px 절약)

### v1.0.0 (2025-10-16)
- 초기 출시

---

**작성일**: 2025-10-17  
**버전**: 1.0  
**업데이트**: UI 최적화

