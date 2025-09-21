# FocusedRex 🦕

집중력을 높이고 공룡을 키우는 Chrome Extension입니다!

## 기능

### 🎯 핵심 기능
- **타이머 시스템**: 사용자가 설정한 시간 동안 집중 세션 진행
- **웹사이트 차단**: 집중 시간 동안 방해가 되는 웹사이트 자동 차단
- **공룡 성장 시스템**: 집중 세션 완료 시 XP 획득 및 공룡 진화
- **Google 로그인**: 사용자 데이터 동기화 및 저장
- **공룡 컬렉션**: 키운 공룡들을 확인할 수 있는 컬렉션 화면

### 🦖 공룡 진화 단계
1. **알** (🥚) - 0 XP
2. **새끼 공룡** (🦕) - 60 XP
3. **청소년 공룡** (🦖) - 180 XP
4. **성인 공룡** (🦴) - 360 XP
5. **고대 공룡** (🦕) - 720 XP
6. **신화 공룡** (🐉) - 1440 XP

### ⚙️ 설정
- 집중 시간 조정 (1-120분)
- 차단할 웹사이트 목록 관리
- 기본 차단 사이트: YouTube, Instagram, Twitter, TikTok, Facebook, Reddit, Netflix

## 설치 방법

### 1. 프로젝트 설정
```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build
```

### 2. Firebase 설정
1. [Firebase Console](https://console.firebase.google.com/)에서 새 프로젝트 생성
2. Authentication에서 Google 로그인 활성화
3. Firestore 데이터베이스 생성
4. `src/firebase.js`에서 Firebase 설정 정보 업데이트

### 3. Chrome Extension 설치
1. Chrome에서 `chrome://extensions/` 접속
2. "개발자 모드" 활성화
3. "압축해제된 확장 프로그램을 로드합니다" 클릭
4. 빌드된 `dist` 폴더 선택

## 사용법

### 1. 로그인
- 확장 프로그램 아이콘 클릭
- "Google로 로그인" 버튼 클릭
- Google 계정으로 로그인

### 2. 집중 세션 시작
- 원하는 집중 시간 설정 (기본 25분)
- "세션 시작" 버튼 클릭
- 집중 시간 동안 차단된 사이트 접근 시 세션 실패

### 3. 공룡 키우기
- 집중 세션 완료 시 XP 획득
- XP가 충분하면 공룡이 다음 단계로 진화
- "내 공룡 컬렉션"에서 키운 공룡들 확인

### 4. 설정 관리
- 차단할 웹사이트 목록 수정
- 집중 시간 조정
- 설정은 자동으로 저장됨

## 기술 스택

- **Frontend**: React 18 + Vite
- **Backend**: Firebase (Authentication + Firestore)
- **Extension**: Chrome Extension Manifest V3
- **Icons**: Lucide React
- **Storage**: Chrome Storage API + Firebase

## 프로젝트 구조

```
FocusedRex/
├── manifest.json          # Chrome Extension 매니페스트
├── popup.html            # 팝업 HTML
├── blocked.html          # 차단 페이지 HTML
├── background.js         # 백그라운드 스크립트
├── content.js           # 컨텐츠 스크립트
├── src/
│   ├── components/      # React 컴포넌트
│   │   ├── Popup.jsx
│   │   ├── Timer.jsx
│   │   ├── Settings.jsx
│   │   └── DinoCollection.jsx
│   ├── utils/          # 유틸리티 함수
│   │   └── storage.js
│   ├── firebase.js     # Firebase 설정
│   ├── popup.jsx       # 팝업 진입점
│   └── index.css       # 스타일
└── package.json
```

## 개발 가이드

### 새로운 기능 추가
1. `src/components/`에 새 컴포넌트 생성
2. `src/utils/`에 필요한 유틸리티 함수 추가
3. `background.js`에 백그라운드 로직 추가
4. `content.js`에 페이지 상호작용 로직 추가

### 스타일 수정
- `src/index.css`에서 전역 스타일 수정
- 각 컴포넌트에서 인라인 스타일 또는 CSS 클래스 사용

### 데이터베이스 스키마
```javascript
// Firestore 사용자 문서
{
  uid: string,
  email: string,
  displayName: string,
  photoURL: string,
  totalXP: number,
  currentStage: number,
  dinos: Array<{
    id: number,
    stage: number,
    name: string,
    emoji: string,
    xp: number,
    createdAt: Date
  }>,
  createdAt: Date
}
```

## 라이선스

MIT License

## 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해주세요.

---

**FocusedRex와 함께 집중력을 높이고 멋진 공룡을 키워보세요! 🦕✨**
