import React, { useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { ArrowLeft, Plus, X } from 'lucide-react';

const Settings = ({ onBack }) => {
  const [settings, setSettings] = useState({
    focusDuration: 25,
    blockedSites: []
  });
  const [newSite, setNewSite] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const settingsData = await storage.getSettings();
    setSettings(settingsData);
  };

  const saveSettings = async () => {
    await storage.setSettings(settings);
    // 백그라운드 스크립트에 설정 업데이트 알림
    chrome.runtime.sendMessage({ action: 'updateSettings', settings });
  };

  const handleDurationChange = (e) => {
    const duration = parseInt(e.target.value);
    if (duration >= 1 && duration <= 120) {
      setSettings(prev => ({ ...prev, focusDuration: duration }));
    }
  };

  const addSite = () => {
    if (newSite.trim() && !settings.blockedSites.includes(newSite.trim())) {
      setSettings(prev => ({
        ...prev,
        blockedSites: [...prev.blockedSites, newSite.trim()]
      }));
      setNewSite('');
    }
  };

  const removeSite = (siteToRemove) => {
    setSettings(prev => ({
      ...prev,
      blockedSites: prev.blockedSites.filter(site => site !== siteToRemove)
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addSite();
    }
  };

  return (
    <div className="collection-screen">
      <button className="back-btn" onClick={onBack}>
        <ArrowLeft size={16} style={{ marginRight: '0.5rem' }} />
        뒤로 가기
      </button>
      
      <h2 style={{ marginBottom: '1rem' }}>설정</h2>
      
      <div className="settings-section">
        <div className="settings-title">집중 시간</div>
        <div className="input-group">
          <label>세션 시간 (분)</label>
          <input
            type="number"
            min="1"
            max="120"
            value={settings.focusDuration}
            onChange={handleDurationChange}
            onBlur={saveSettings}
          />
        </div>
      </div>

      <div className="settings-section">
        <div className="settings-title">차단할 웹사이트</div>
        <div className="blocked-sites">
          {settings.blockedSites.map((site, index) => (
            <div key={index} className="site-item">
              <span className="site-url">{site}</span>
              <button 
                className="remove-btn"
                onClick={() => removeSite(site)}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
        
        <div className="add-site">
          <input
            type="text"
            placeholder="웹사이트 도메인 입력 (예: youtube.com)"
            value={newSite}
            onChange={(e) => setNewSite(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className="btn" onClick={addSite}>
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button className="btn btn-primary" onClick={saveSettings}>
          설정 저장
        </button>
      </div>
    </div>
  );
};

export default Settings;
