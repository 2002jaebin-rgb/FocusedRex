# FocusedRex 설치 가이드 🦕

## 1. 프로젝트 설정

### 필수 요구사항
- Node.js 16.0 이상
- npm 또는 yarn
- Chrome 브라우저
- Google 계정

### 의존성 설치
```bash
cd FocusedRex
npm install
```

## 2. Firebase 설정

### 2.1 Firebase 프로젝트 생성
1. [Firebase Console](https://console.firebase.google.com/) 접속
2. "프로젝트 추가" 클릭
3. 프로젝트 이름: `focusedrex` (또는 원하는 이름)
4. Google Analytics 활성화 (선택사항)

### 2.2 Authentication 설정
1. Firebase Console에서 "Authentication" 메뉴 클릭
2. "시작하기" 클릭
3. "Sign-in method" 탭에서 "Google" 활성화
4. 프로젝트 지원 이메일 설정
5. "저장" 클릭

### 2.3 Firestore 데이터베이스 설정
1. "Firestore Database" 메뉴 클릭
2. "데이터베이스 만들기" 클릭
3. "테스트 모드에서 시작" 선택 (개발용)
4. 위치 선택 (asia-northeast3 권장)

### 2.4 Firebase 설정 정보 복사
1. 프로젝트 설정 (⚙️) → "일반" 탭
2. "내 앱" 섹션에서 "웹" 아이콘 클릭
3. 앱 등록 정보 복사

### 2.5 코드에 Firebase 설정 적용
`src/firebase.js` 파일을 열고 다음 정보를 업데이트:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

## 3. Chrome Extension 빌드 및 설치

### 3.1 프로덕션 빌드
```bash
npm run build
```

### 3.2 Chrome Extension 설치
1. Chrome 브라우저에서 `chrome://extensions/` 접속
2. 우측 상단의 "개발자 모드" 토글 활성화
3. "압축해제된 확장 프로그램을 로드합니다" 클릭
4. `FocusedRex/dist` 폴더 선택
5. 확장 프로그램이 설치됨

### 3.3 권한 확인
설치 후 다음 권한들이 요청됩니다:
- 모든 웹사이트의 데이터 읽기 및 변경
- 알림 표시
- 탭 정보 읽기
- Google 계정으로 로그인

## 4. 사용법

### 4.1 첫 실행
1. Chrome 툴바에서 FocusedRex 아이콘 클릭
2. "Google로 로그인" 클릭
3. Google 계정 선택 및 권한 승인

### 4.2 집중 세션 시작
1. 원하는 집중 시간 설정 (기본 25분)
2. "세션 시작" 버튼 클릭
3. 집중 시간 동안 차단된 사이트 접근 시 세션 실패

### 4.3 공룡 키우기
- 집중 세션 완료 시 XP 획득
- XP가 충분하면 공룡이 진화
- "내 공룡 컬렉션"에서 확인

## 5. 개발 모드

### 5.1 개발 서버 실행
```bash
npm run dev
```

### 5.2 확장 프로그램 다시 로드
코드 수정 후:
1. `chrome://extensions/` 접속
2. FocusedRex의 "새로고침" 버튼 클릭

### 5.3 디버깅
- 팝업: 확장 프로그램 아이콘 우클릭 → "검사"
- 백그라운드: `chrome://extensions/` → "service worker" 클릭
- 컨텐츠: 웹페이지에서 F12 → Console 탭

## 6. 문제 해결

### 6.1 로그인 실패
- Firebase Authentication 설정 확인
- Google OAuth 클라이언트 ID 확인
- 브라우저 쿠키 및 캐시 삭제

### 6.2 웹사이트 차단 안됨
- 확장 프로그램 권한 확인
- 차단된 사이트 목록 확인
- 백그라운드 스크립트 실행 상태 확인

### 6.3 데이터 동기화 안됨
- 인터넷 연결 확인
- Firebase Firestore 규칙 확인
- 브라우저 콘솔에서 오류 메시지 확인

## 7. 커스터마이징

### 7.1 차단할 웹사이트 추가
1. 확장 프로그램 팝업에서 설정 아이콘 클릭
2. "차단할 웹사이트" 섹션에서 추가
3. 도메인만 입력 (예: youtube.com)

### 7.2 집중 시간 변경
1. 설정에서 "집중 시간" 조정
2. 1-120분 사이에서 선택 가능

### 7.3 공룡 진화 단계 수정
`src/utils/storage.js`의 `DINO_STAGES` 배열 수정

## 8. 배포

### 8.1 Chrome Web Store 배포 준비
1. `npm run build` 실행
2. `dist` 폴더를 ZIP으로 압축
3. Chrome Web Store Developer Dashboard에서 업로드

### 8.2 아이콘 준비
- 16x16, 32x32, 48x48, 128x128 PNG 파일 필요
- `public/icon.svg`를 참고하여 생성

## 9. 지원

문제가 발생하면:
1. 브라우저 콘솔에서 오류 메시지 확인
2. GitHub Issues에 문제 보고
3. README.md의 기술 스택 섹션 참고

---

**FocusedRex와 함께 생산적인 하루를 보내세요! 🦕✨**
