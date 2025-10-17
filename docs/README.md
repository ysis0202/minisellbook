# 📚 MoneyCells 문서 가이드

> **모든 문서를 한 곳에서!**

---

## 🎯 어디서부터 시작하나요?

### 처음 시작하는 경우
👉 **[../PROJECT_MASTER.md](../PROJECT_MASTER.md)** - 프로젝트 전체 개요

### 개발 환경 설정하는 경우
👉 **[../PROJECT_MASTER.md#개발-환경-설정](../PROJECT_MASTER.md#-개발-환경-설정)** - 설정 가이드

### 앱 스토어 출시하는 경우
👉 **[../QUICK_START_CHECKLIST.md](../QUICK_START_CHECKLIST.md)** - 30분 체크리스트

### 자세한 정보가 필요한 경우
👉 **[../COMPLETE_DEPLOYMENT_GUIDE.md](../COMPLETE_DEPLOYMENT_GUIDE.md)** - 상세 가이드

---

## 📂 문서 구조

```
minicellbook/
├── PROJECT_MASTER.md           ⭐ 마스터 문서 (전체 개요)
├── README.md                   프로젝트 소개
│
├── 배포 관련
│   ├── QUICK_START_CHECKLIST.md      30분 체크리스트
│   ├── COMPLETE_DEPLOYMENT_GUIDE.md  전체 배포 가이드
│   ├── SCREENSHOT_GUIDE.md           스크린샷 촬영
│   └── 시작하기.md                   한글 가이드
│
├── 스토어별 가이드
│   └── APPLE_APP_STORE_GUIDE.md      iOS 배포
│
├── 기능 & 업데이트
│   ├── UI_UPDATE_GUIDE.md            UI 변경 내역
│   └── SCHEMA_UPDATE_GUIDE.md        DB 스키마 업데이트
│
└── docs/
    ├── README.md                 이 파일!
    └── archive/                  오래된 문서
```

---

## 📖 문서별 용도

### 필수 문서 (꼭 읽어야 함)

| 문서 | 용도 | 소요 시간 |
|------|------|----------|
| **PROJECT_MASTER.md** | 프로젝트 전체 파악 | 10분 |
| **README.md** | GitHub 소개 | 5분 |
| **QUICK_START_CHECKLIST.md** | 앱 스토어 출시 | 30분 |

### 상황별 문서

| 상황 | 문서 |
|------|------|
| 🚀 **Google Play 출시** | QUICK_START_CHECKLIST.md |
| 🍎 **iOS 출시** | APPLE_APP_STORE_GUIDE.md |
| 📸 **스크린샷 필요** | SCREENSHOT_GUIDE.md |
| 🔄 **앱 업데이트** | COMPLETE_DEPLOYMENT_GUIDE.md → "앱 업데이트 방법" |
| 🎨 **UI 변경** | UI_UPDATE_GUIDE.md |
| 🗄️ **DB 수정** | SCHEMA_UPDATE_GUIDE.md |

---

## 🗂️ 아카이브 문서

오래되거나 중복된 문서들은 `archive/` 폴더로 이동했습니다.

**보관된 문서**:
- DEPLOYMENT_GUIDE.md (→ COMPLETE_DEPLOYMENT_GUIDE.md로 통합)
- DEPLOYMENT_CHECKLIST.md (→ QUICK_START_CHECKLIST.md로 통합)
- GOOGLE_PLAY_DEPLOYMENT.md (→ COMPLETE_로 통합)
- STORE_LISTING_GUIDE.md (→ COMPLETE_로 통합)
- WORK_STATUS.md (오래됨)
- FINAL_REVIEW_2025-10-16.md (오래됨)
- PROJECT_SUMMARY.md (PROJECT_MASTER로 대체)
- DETAILED_PLAN.md (완료됨)
- SETUP.md (PROJECT_MASTER로 통합)

---

## 🎯 빠른 참조

### 배포 URL
```
웹: https://minisellbook-ouuh-ir1vd25q-jjinhyuks-projects.vercel.app
GitHub: https://github.com/ysis0202/minisellbook
```

### 주요 명령어
```bash
npm run dev      # 개발 서버
npm run build    # 빌드
git push         # 배포
```

### 중요 정보
```
Package ID: com.moneycells.app
서명 키: google-play-keys/signing.keystore
비밀번호: bpH5h5gjw874
```

---

## 📞 도움말

### 문서 관련 질문
- **어떤 문서를 읽어야 하나요?**
  → PROJECT_MASTER.md부터 시작하세요!

- **배포 가이드가 너무 많아요**
  → QUICK_START_CHECKLIST.md만 보시면 됩니다!

- **옛날 문서는 어디 갔나요?**
  → docs/archive/ 폴더에 있습니다.

### 기술 지원
- GitHub Issues
- 이메일: ysis0202@naver.com

---

**문서 정리일**: 2025-10-17  
**버전**: 1.0

