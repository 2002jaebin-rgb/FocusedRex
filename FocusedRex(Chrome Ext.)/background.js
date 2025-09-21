// 백그라운드 스크립트 - 웹사이트 차단 및 알림 관리
let currentSession = null;
let blockedSites = [];

// 설치 시 알림 권한 요청
chrome.runtime.onInstalled.addListener(() => {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icon-128.png',
    title: 'FocusedRex 설치 완료!',
    message: '집중력을 높이고 공룡을 키워보세요! 🦕'
  });
});

// 메시지 리스너
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'startSession':
      startSession(request.data);
      break;
    case 'stopSession':
      stopSession();
      break;
    case 'completeSession':
      completeSession();
      break;
    case 'updateSettings':
      updateSettings(request.settings);
      break;
  }
});

// 웹 요청 차단
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    if (!currentSession || !currentSession.isActive) {
      return;
    }

    const url = new URL(details.url);
    const hostname = url.hostname.toLowerCase();
    
    // 차단된 사이트 확인
    const isBlocked = blockedSites.some(site => 
      hostname.includes(site.toLowerCase()) || 
      hostname.endsWith('.' + site.toLowerCase())
    );

    if (isBlocked) {
      // 세션 실패 처리
      failSession();
      return { redirectUrl: chrome.runtime.getURL('blocked.html') };
    }
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);

function startSession(sessionData) {
  currentSession = sessionData;
  blockedSites = sessionData.settings.blockedSites || [];
  
  console.log('포커스 세션 시작:', sessionData);
}

function stopSession() {
  if (currentSession) {
    currentSession.isActive = false;
    console.log('포커스 세션 중지');
  }
}

function completeSession() {
  if (currentSession) {
    currentSession.isActive = false;
    
    // 완료 알림
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icon-128.png',
      title: '세션 완료! 🎉',
      message: '훌륭한 집중력이었어요! 공룡이 성장했어요! 🦕'
    });
    
    console.log('포커스 세션 완료');
  }
}

function failSession() {
  if (currentSession) {
    currentSession.isActive = false;
    
    // 실패 알림
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icon-128.png',
      title: '세션 실패 😔',
      message: '차단된 사이트에 접근했습니다. 다음에는 더 집중해보세요!'
    });
    
    console.log('포커스 세션 실패');
  }
}

function updateSettings(settings) {
  blockedSites = settings.blockedSites || [];
  console.log('설정 업데이트:', settings);
}

// 탭 업데이트 감지
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && currentSession && currentSession.isActive) {
    const url = new URL(tab.url);
    const hostname = url.hostname.toLowerCase();
    
    const isBlocked = blockedSites.some(site => 
      hostname.includes(site.toLowerCase()) || 
      hostname.endsWith('.' + site.toLowerCase())
    );

    if (isBlocked) {
      failSession();
      chrome.tabs.update(tabId, { url: chrome.runtime.getURL('blocked.html') });
    }
  }
});
