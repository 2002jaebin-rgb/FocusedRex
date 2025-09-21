// 컨텐츠 스크립트 - 페이지에서 실행되는 스크립트
console.log('FocusedRex 컨텐츠 스크립트 로드됨');

// 페이지 로드 시 포커스 세션 상태 확인
window.addEventListener('load', () => {
  checkFocusSession();
});

// 포커스 세션 상태 확인
function checkFocusSession() {
  chrome.storage.local.get(['focusSession'], (result) => {
    if (result.focusSession && result.focusSession.isActive) {
      const session = result.focusSession;
      const now = Date.now();
      const elapsed = now - session.startTime;
      const remaining = Math.max(0, session.duration - elapsed);
      
      if (remaining <= 0) {
        // 세션 완료
        completeSession();
      } else {
        // 세션 진행 중 - 차단된 사이트인지 확인
        checkIfBlocked(session.settings.blockedSites);
      }
    }
  });
}

// 차단된 사이트인지 확인
function checkIfBlocked(blockedSites) {
  const hostname = window.location.hostname.toLowerCase();
  
  const isBlocked = blockedSites.some(site => 
    hostname.includes(site.toLowerCase()) || 
    hostname.endsWith('.' + site.toLowerCase())
  );

  if (isBlocked) {
    // 차단된 사이트로 리다이렉트
    window.location.href = chrome.runtime.getURL('blocked.html');
  }
}

// 세션 완료 처리
function completeSession() {
  chrome.runtime.sendMessage({ action: 'completeSession' });
}

// 스토리지 변경 감지
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.focusSession) {
    const newSession = changes.focusSession.newValue;
    
    if (newSession && newSession.isActive) {
      checkIfBlocked(newSession.settings.blockedSites);
    }
  }
});

// 페이지 가시성 변경 감지 (사용자가 탭을 전환할 때)
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    // 페이지가 다시 보이게 되었을 때 세션 상태 확인
    checkFocusSession();
  }
});
