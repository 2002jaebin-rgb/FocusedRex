import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { DINO_STAGES } from '../utils/storage';

const DinoCollection = ({ onBack, userData }) => {
  if (!userData || !userData.dinos || userData.dinos.length === 0) {
    return (
      <div className="collection-screen">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={16} style={{ marginRight: '0.5rem' }} />
          뒤로 가기
        </button>
        
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div className="dino-emoji">🥚</div>
          <h2>아직 키운 공룡이 없어요!</h2>
          <p style={{ opacity: 0.8, marginBottom: '2rem' }}>
            집중 세션을 완료해서 첫 번째 공룡을 키워보세요!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="collection-screen">
      <button className="back-btn" onClick={onBack}>
        <ArrowLeft size={16} style={{ marginRight: '0.5rem' }} />
        뒤로 가기
      </button>
      
      <h2 style={{ marginBottom: '1rem' }}>내 공룡 컬렉션</h2>
      
      <div style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '15px' }}>
        <h3 style={{ marginBottom: '0.5rem' }}>전체 통계</h3>
        <p>총 XP: {userData.totalXP}</p>
        <p>현재 단계: {DINO_STAGES[userData.currentStage - 1]?.name}</p>
        <p>키운 공룡 수: {userData.dinos.length}마리</p>
      </div>

      <div>
        <h3 style={{ marginBottom: '1rem' }}>공룡들</h3>
        {userData.dinos.map((dino, index) => {
          const stageInfo = DINO_STAGES.find(s => s.stage === dino.stage);
          return (
            <div key={dino.id || index} className="dino-card">
              <div className="dino-emoji">{dino.emoji || stageInfo?.emoji}</div>
              <div className="dino-name">{dino.name || stageInfo?.name}</div>
              <div className="dino-stage">단계 {dino.stage}</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                XP: {dino.xp || 0}
              </div>
              {dino.createdAt && (
                <div style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: '0.5rem' }}>
                  {new Date(dino.createdAt).toLocaleDateString('ko-KR')}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '15px' }}>
        <h3 style={{ marginBottom: '0.5rem' }}>다음 진화 단계</h3>
        {DINO_STAGES.map((stage, index) => {
          const isCurrentStage = stage.stage === userData.currentStage;
          const isUnlocked = userData.totalXP >= stage.xpRequired;
          const isNextStage = stage.stage === userData.currentStage + 1;
          
          return (
            <div 
              key={stage.stage}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.5rem',
                margin: '0.25rem 0',
                background: isCurrentStage ? 'rgba(0,184,148,0.2)' : 
                           isUnlocked ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)',
                borderRadius: '8px',
                opacity: isUnlocked ? 1 : 0.5
              }}
            >
              <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>
                {stage.emoji}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: isCurrentStage ? 'bold' : 'normal' }}>
                  {stage.name} {isCurrentStage && '(현재)'}
                </div>
                <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                  {stage.xpRequired} XP 필요
                </div>
              </div>
              {isNextStage && (
                <div style={{ fontSize: '0.8rem', color: '#00b894' }}>
                  다음 목표!
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DinoCollection;
