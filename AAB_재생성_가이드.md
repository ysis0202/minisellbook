# AAB 재생성 가이드 (URL 수정)

## 🎯 문제 상황
- **잘못된 URL**: `minisellbook-ouuh.vercel.app` ❌
- **올바른 URL**: `minisellbook-oouth.vercel.app` ✅

## 📱 PWABuilder로 AAB 재생성하기

### Step 1: 사이트 접속
```
https://www.pwabuilder.com/
```

### Step 2: URL 입력
```
https://minisellbook-oouth.vercel.app
```
**주의**: `oouth`입니다! (ouuh 아님)

### Step 3: Generate 클릭
1. 사이트 분석 완료될 때까지 대기 (30초~1분)
2. "Package for Stores" 버튼 클릭

### Step 4: Android 선택
1. "Android" 탭 클릭
2. "Generate Package" 버튼 클릭

### Step 5: 앱 정보 입력

#### Package 정보
```
Package name: com.moneycells.app
App version: 1.0.0
Version code: 2 (⚠️ 중요: 1에서 2로!)
App name: 머니셀즈
Short name: 머니셀즈
```

#### 서명 키 업로드 (⚠️ 매우 중요!)
```
1. "Upload existing signing key" 선택
2. 파일 선택: google-play-keys/signing.keystore
3. 비밀번호 입력 (처음 생성 시 설정한 비밀번호)
```

**⚠️ 경고**: 새로운 키를 생성하면 안 됩니다! 기존 키를 반드시 사용해야 합니다!

#### 나머지 설정
```
- Display mode: standalone
- Orientation: portrait
- Theme color: #10b981
- Background color: #ffffff
```

### Step 6: AAB 생성
1. "Generate" 버튼 클릭
2. 생성 완료될 때까지 대기 (2-3분)
3. AAB 파일 다운로드

---

## 📤 Google Play Console 업로드

### Step 1: Google Play Console 접속
```
https://play.google.com/console
```

### Step 2: 앱 선택
```
머니셀즈 (MoneyCells) 선택
```

### Step 3: 내부 테스트 업데이트
```
1. 왼쪽 메뉴: "출시" → "내부 테스트"
2. "새 버전 만들기" 클릭
3. AAB 파일 업로드 (드래그 앤 드롭)
```

### Step 4: 출시 노트 작성
```
버전 1.0.0 (Build 2)

변경사항:
- 배포 URL 수정 (oouth로 수정)
- 앱 안정성 개선
- 404 에러 수정
```

### Step 5: 검토 및 출시
```
1. "검토" 버튼 클릭
2. 모든 내용 확인
3. "내부 테스트 시작" 클릭
```

### Step 6: 처리 대기
```
- 처리 시간: 5-10분
- 상태: "게시됨"으로 변경될 때까지 대기
```

---

## ✅ 테스트

### Step 1: Google Play Console에서 링크 복사
```
1. "내부 테스트" 탭
2. "테스터" 섹션에서 "링크 복사"
```

### Step 2: 핸드폰에서 테스트
```
1. 복사한 링크로 접속
2. "다운로드" 또는 "업데이트" 클릭
3. 앱 설치/업데이트
4. 앱 실행 → ✅ 정상 작동 확인!
```

---

## 🔑 서명 키 위치

### 키 파일 경로
```
C:\Users\mycom\Desktop\dev\minicellbook\google-play-keys\signing.keystore
```

### 키 정보 파일
```
C:\Users\mycom\Desktop\dev\minicellbook\google-play-keys\signing-key-info.txt
```

**⚠️ 주의**: 이 파일들을 절대 삭제하거나 잃어버리지 마세요!

---

## 📋 버전 관리

### 버전 코드 규칙
```
첫 번째 출시: 버전 코드 1
두 번째 출시 (이번): 버전 코드 2
세 번째 출시 (나중): 버전 코드 3
...
```

**중요**: 버전 코드는 항상 증가해야 합니다!

### 버전 이름 vs 버전 코드
```
버전 이름 (Version name): 1.0.0 (사용자에게 보이는 버전)
버전 코드 (Version code): 2 (내부 관리용 번호)
```

---

## 🚨 자주 하는 실수

### ❌ 실수 1: URL 오타
```
❌ minisellbook-ouuh.vercel.app
✅ minisellbook-oouth.vercel.app
```

### ❌ 실수 2: 새 서명 키 생성
```
❌ "Generate new signing key" 선택
✅ "Upload existing signing key" 선택
```

### ❌ 실수 3: 버전 코드 미증가
```
❌ Version code: 1 (동일)
✅ Version code: 2 (증가)
```

### ❌ 실수 4: 패키지명 변경
```
❌ com.something.else
✅ com.moneycells.app (동일하게 유지)
```

---

## 💡 팁

### PWABuilder에서 manifest 확인
```
분석 완료 후 다음 항목들이 초록색이면 OK:
✅ Web App Manifest
✅ Service Worker
✅ HTTPS
✅ Icons
```

### 업로드 시간 단축
```
- 안정적인 인터넷 연결 사용
- AAB 파일 크기 확인 (약 5-10MB)
- 한 번에 하나씩 업로드
```

---

## 🎯 완료 확인

### 체크리스트
```
☐ PWABuilder에서 올바른 URL로 AAB 생성 완료
☐ 기존 서명 키 사용 확인
☐ 버전 코드 2로 증가 확인
☐ Google Play Console 업로드 완료
☐ 내부 테스트 출시 완료
☐ 핸드폰에서 앱 업데이트 확인
☐ 앱 실행 시 404 에러 없음 ✅
☐ 로그인 기능 정상 작동 ✅
```

---

## 📞 문제 발생 시

### 여전히 404 에러가 나오면
```
1. 핸드폰에서 앱 완전 삭제
2. Play Store에서 재다운로드
3. 앱 실행
```

### 업데이트가 안 보이면
```
1. Play Store 앱 열기
2. "내 앱 및 게임" → "업데이트"
3. 머니셀즈 찾기 → "업데이트" 클릭
```

### 서명 키 비밀번호를 잊어버렸으면
```
signing-key-info.txt 파일에서 확인
```

---

## 🎉 성공!

앱이 정상적으로 실행되면:
```
✅ URL 수정 완료
✅ AAB 재생성 완료
✅ Google Play 업데이트 완료
✅ 404 에러 해결
```

이제 본격적인 테스트를 진행하세요! 😊

---

## 📚 참고 문서

- PWABuilder: https://www.pwabuilder.com/
- Google Play Console: https://play.google.com/console
- 전체 배포 가이드: `COMPLETE_DEPLOYMENT_GUIDE.md`
- 빠른 시작 가이드: `QUICK_START_CHECKLIST.md`

