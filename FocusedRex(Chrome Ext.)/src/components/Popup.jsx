import React, { useState, useEffect } from 'react';
import { auth, signInWithGoogle, signOutUser, getUserData, updateUserData } from '../firebase';
import { storage, calculateXP, getCurrentStage, getXPToNextStage, getStageProgress } from '../utils/storage';
import Timer from './Timer';
import Settings from './Settings';
import DinoCollection from './DinoCollection';
import { User, Settings as SettingsIcon, Trophy } from 'lucide-react';

const Popup = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [currentView, setCurrentView] = useState('main');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 인증 상태 확인
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        try {
          const data = await getUserData(user.uid);
          setUserData(data);
          await storage.setUserData(data);
        } catch (error) {
          console.error('사용자 데이터 로드 실패:', error);
        }
      } else {
        setUser(null);
        setUserData(null);
        await storage.clearUserData();
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      const user = await signInWithGoogle();
      const data = await getUserData(user.uid);
      setUserData(data);
      await storage.setUserData(data);
    } catch (error) {
      console.error('로그인 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      setUser(null);
      setUserData(null);
      await storage.clearUserData();
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  const handleSessionComplete = async (minutes) => {
    if (!user || !userData) return;

    const xpGained = calculateXP(minutes);
    const newTotalXP = userData.totalXP + xpGained;
    const newStage = getCurrentStage(newTotalXP);
    
    // 새로운 공룡 생성 (진화한 경우)
    let newDinos = [...(userData.dinos || [])];
    if (newStage.stage > userData.currentStage) {
      newDinos.push({
        id: Date.now(),
        stage: newStage.stage,
        name: newStage.name,
        emoji: newStage.emoji,
        xp: newTotalXP,
        createdAt: new Date()
      });
    }

    const updatedData = {
      totalXP: newTotalXP,
      currentStage: newStage.stage,
      dinos: newDinos
    };

    try {
      await updateUserData(user.uid, updatedData);
      setUserData(updatedData);
      await storage.setUserData(updatedData);
    } catch (error) {
      console.error('사용자 데이터 업데이트 실패:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div className="dino-emoji">🦕</div>
          <p>로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div className="dino-emoji">🦕</div>
          <h1 style={{ marginBottom: '1rem' }}>FocusedRex에 오신 것을 환영합니다!</h1>
          <p style={{ marginBottom: '2rem', opacity: 0.8 }}>
            집중력을 높이고 공룡을 키워보세요!
          </p>
          <button 
            className="btn btn-primary" 
            onClick={handleSignIn}
            disabled={isLoading}
          >
            <User size={20} style={{ marginRight: '0.5rem' }} />
            Google로 로그인
          </button>
        </div>
      </div>
    );
  }

  if (currentView === 'settings') {
    return <Settings onBack={() => setCurrentView('main')} />;
  }

  if (currentView === 'collection') {
    return <DinoCollection onBack={() => setCurrentView('main')} userData={userData} />;
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '1.5rem', margin: 0 }}>FocusedRex</h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            className="btn" 
            onClick={() => setCurrentView('collection')}
            style={{ padding: '0.5rem' }}
          >
            <Trophy size={16} />
          </button>
          <button 
            className="btn" 
            onClick={() => setCurrentView('settings')}
            style={{ padding: '0.5rem' }}
          >
            <SettingsIcon size={16} />
          </button>
        </div>
      </div>

      {userData && (
        <div className="dino-status">
          <div className="dino-emoji">{getCurrentStage(userData.totalXP).emoji}</div>
          <h3>{getCurrentStage(userData.totalXP).name}</h3>
          <div className="xp-bar">
            <div 
              className="xp-fill" 
              style={{ width: `${getStageProgress(userData.totalXP)}%` }}
            />
          </div>
          <div className="level-info">
            Level {getCurrentStage(userData.totalXP).stage} • {userData.totalXP} XP
            {getXPToNextStage(userData.totalXP) > 0 && (
              <span> • 다음 단계까지 {getXPToNextStage(userData.totalXP)} XP</span>
            )}
          </div>
        </div>
      )}

      <Timer onSessionComplete={handleSessionComplete} />

      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <button 
          className="btn" 
          onClick={handleSignOut}
          style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
        >
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default Popup;
