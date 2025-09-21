// 로컬 스토리지 관리 유틸리티
export const storage = {
  // 포커스 세션 데이터
  setFocusSession: (data) => {
    chrome.storage.local.set({ focusSession: data });
  },
  
  getFocusSession: () => {
    return new Promise((resolve) => {
      chrome.storage.local.get(['focusSession'], (result) => {
        resolve(result.focusSession || null);
      });
    });
  },
  
  clearFocusSession: () => {
    chrome.storage.local.remove(['focusSession']);
  },
  
  // 설정 데이터
  setSettings: (settings) => {
    chrome.storage.local.set({ settings });
  },
  
  getSettings: () => {
    return new Promise((resolve) => {
      chrome.storage.local.get(['settings'], (result) => {
        resolve(result.settings || {
          focusDuration: 25, // 기본 25분
          blockedSites: [
            'youtube.com',
            'instagram.com',
            'twitter.com',
            'tiktok.com',
            'facebook.com',
            'reddit.com',
            'netflix.com'
          ]
        });
      });
    });
  },
  
  // 사용자 데이터
  setUserData: (userData) => {
    chrome.storage.local.set({ userData });
  },
  
  getUserData: () => {
    return new Promise((resolve) => {
      chrome.storage.local.get(['userData'], (result) => {
        resolve(result.userData || null);
      });
    });
  },
  
  clearUserData: () => {
    chrome.storage.local.remove(['userData']);
  }
};

// 공룡 진화 단계 정의
export const DINO_STAGES = [
  { stage: 1, name: '알', emoji: '🥚', xpRequired: 0, description: '새로운 시작!' },
  { stage: 2, name: '새끼 공룡', emoji: '🦕', xpRequired: 60, description: '첫 걸음!' },
  { stage: 3, name: '청소년 공룡', emoji: '🦖', xpRequired: 180, description: '성장 중!' },
  { stage: 4, name: '성인 공룡', emoji: '🦴', xpRequired: 360, description: '강해졌어!' },
  { stage: 5, name: '고대 공룡', emoji: '🦕', xpRequired: 720, description: '전설의 존재!' },
  { stage: 6, name: '신화 공룡', emoji: '🐉', xpRequired: 1440, description: '최고의 경지!' }
];

// XP 계산 함수
export const calculateXP = (minutes) => {
  return Math.floor(minutes * 2); // 1분당 2XP
};

// 현재 단계 계산
export const getCurrentStage = (totalXP) => {
  for (let i = DINO_STAGES.length - 1; i >= 0; i--) {
    if (totalXP >= DINO_STAGES[i].xpRequired) {
      return DINO_STAGES[i];
    }
  }
  return DINO_STAGES[0];
};

// 다음 단계까지 필요한 XP
export const getXPToNextStage = (totalXP) => {
  const currentStage = getCurrentStage(totalXP);
  const nextStage = DINO_STAGES.find(stage => stage.stage === currentStage.stage + 1);
  
  if (!nextStage) {
    return 0; // 최고 단계
  }
  
  return nextStage.xpRequired - totalXP;
};

// 현재 단계에서의 진행률
export const getStageProgress = (totalXP) => {
  const currentStage = getCurrentStage(totalXP);
  const nextStage = DINO_STAGES.find(stage => stage.stage === currentStage.stage + 1);
  
  if (!nextStage) {
    return 100; // 최고 단계
  }
  
  const currentStageXP = currentStage.xpRequired;
  const nextStageXP = nextStage.xpRequired;
  const progressXP = totalXP - currentStageXP;
  const totalNeeded = nextStageXP - currentStageXP;
  
  return Math.min(100, (progressXP / totalNeeded) * 100);
};
