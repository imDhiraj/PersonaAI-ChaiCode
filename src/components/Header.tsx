import React from 'react';
import { Settings, Coffee, Terminal } from 'lucide-react';

interface HeaderProps {
  activePersona: 'hitesh' | 'piyush';
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activePersona,
  onOpenSettings,
}) => {
  return (
    <header className="chat-header">
      <div className="header-brand">
        <div className="brand-logo">
          {activePersona === 'hitesh' ? (
            <Coffee size={20} />
          ) : (
            <Terminal size={20} />
          )}
        </div>
        <div>
          <h1 className="brand-title">
            {activePersona === 'hitesh' ? 'Chai aur Code' : 'System Builder AI'}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.1rem' }}>
            <span 
              className="pulse-dot"
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: activePersona === 'hitesh' ? '#10b981' : '#06b6d4',
                display: 'inline-block',
                boxShadow: `0 0 8px ${activePersona === 'hitesh' ? 'rgba(16, 185, 129, 0.6)' : 'rgba(6, 182, 212, 0.6)'}`
              }}
            ></span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              {activePersona === 'hitesh' ? 'Hitesh is active' : 'Piyush is online'}
            </span>
          </div>
        </div>
      </div>

      <div className="header-actions">
        <button
          onClick={onOpenSettings}
          className="icon-btn"
          title="Open settings"
          aria-label="Settings"
        >
          <Settings size={18} />
        </button>
      </div>
    </header>
  );
};
