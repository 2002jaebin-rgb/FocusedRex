import React, { useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { Play, Square, CheckCircle, XCircle } from 'lucide-react';

const Timer = ({ onSessionComplete }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [sessionStatus, setSessionStatus] = useState(null); // 'success', 'failed', null
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    loadSettings();
    checkActiveSession();
  }, []);

  useEffect(() => {
    let interval = null;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1000) {
            // 세션 완료
            completeSession();
            return 0;
          }
          return time - 1000;
        });
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      completeSession();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  const loadSettings = async () => {
    const settingsData = await storage.getSettings();
    setSettings(settingsData);
  };

  const checkActiveSession = async () => {
    const session = await storage.getFocusSession();
    if (session && session.isActive) {
      const now = Date.now();
      const elapsed = now - session.startTime;
      const remaining = Math.max(0, session.duration - elapsed);
      
      if (remaining > 0) {
        setTimeLeft(remaining);
        setIsRunning(true);
      } else {
        // 세션이 이미 완료됨
        completeSession();
      }
    }
  };

  const startSession = async () => {
    if (!settings) return;
    
    const duration = settings.focusDuration * 60 * 1000; // 분을 밀리초로 변환
    const sessionData = {
      isActive: true,
      startTime: Date.now(),
      duration: duration,
      settings: settings
    };
    
    await storage.setFocusSession(sessionData);
    setTimeLeft(duration);
    setIsRunning(true);
    setSessionStatus(null);
    
    // 백그라운드 스크립트에 세션 시작 알림
    chrome.runtime.sendMessage({ action: 'startSession', data: sessionData });
  };

  const stopSession = async () => {
    await storage.clearFocusSession();
    setIsRunning(false);
    setTimeLeft(0);
    setSessionStatus('failed');
    
    // 백그라운드 스크립트에 세션 중지 알림
    chrome.runtime.sendMessage({ action: 'stopSession' });
  };

  const completeSession = async () => {
    const session = await storage.getFocusSession();
    if (session) {
      const minutes = Math.floor(session.duration / 60000);
      onSessionComplete(minutes);
    }
    
    await storage.clearFocusSession();
    setIsRunning(false);
    setTimeLeft(0);
    setSessionStatus('success');
    
    // 백그라운드 스크립트에 세션 완료 알림
    chrome.runtime.sendMessage({ action: 'completeSession' });
    
    // 알림 표시
    if (Notification.permission === 'granted') {
      new Notification('FocusedRex', {
        body: `축하합니다! ${Math.floor(session.duration / 60000)}분 집중 세션을 완료했습니다! 🦕`,
        icon: '/icon-128.png'
      });
    }
  };

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const resetSession = () => {
    setSessionStatus(null);
    setTimeLeft(0);
    setIsRunning(false);
  };

  if (sessionStatus === 'success') {
    return (
      <div className="session-status status-success">
        <CheckCircle size={48} style={{ marginBottom: '1rem' }} />
        <h3>세션 완료!</h3>
        <p>훌륭한 집중력이었어요! 🦕</p>
        <button className="btn btn-primary" onClick={resetSession}>
          새 세션 시작
        </button>
      </div>
    );
  }

  if (sessionStatus === 'failed') {
    return (
      <div className="session-status status-failed">
        <XCircle size={48} style={{ marginBottom: '1rem' }} />
        <h3>세션 실패</h3>
        <p>다음에는 더 집중해보세요! 🦖</p>
        <button className="btn btn-primary" onClick={resetSession}>
          다시 시도
        </button>
      </div>
    );
  }

  if (isRunning) {
    return (
      <div className="session-status status-running">
        <div className="timer-display">{formatTime(timeLeft)}</div>
        <p style={{ marginBottom: '1rem' }}>집중하고 있어요! 🦕</p>
        <button className="btn btn-danger" onClick={stopSession}>
          <Square size={20} style={{ marginRight: '0.5rem' }} />
          세션 중지
        </button>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <div className="timer-display">
        {settings ? `${settings.focusDuration}:00` : '25:00'}
      </div>
      <p style={{ marginBottom: '1rem', opacity: 0.8 }}>
        {settings ? `${settings.focusDuration}분` : '25분'} 집중 세션을 시작하세요!
      </p>
      <button 
        className="btn btn-success" 
        onClick={startSession}
        disabled={!settings}
      >
        <Play size={20} style={{ marginRight: '0.5rem' }} />
        세션 시작
      </button>
    </div>
  );
};

export default Timer;
