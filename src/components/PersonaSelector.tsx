import React from 'react';
import { Coffee, Terminal } from 'lucide-react';

interface PersonaSelectorProps {
  activePersona: 'hitesh' | 'piyush';
  onPersonaChange: (persona: 'hitesh' | 'piyush') => void;
}

export const PersonaSelector: React.FC<PersonaSelectorProps> = ({
  activePersona,
  onPersonaChange,
}) => {
  return (
    <div className="persona-list">
      <button
        onClick={() => onPersonaChange('hitesh')}
        className={`persona-card ${activePersona === 'hitesh' ? 'active' : ''}`}
        style={{ textAlign: 'left', width: '100%', cursor: 'pointer' }}
      >
        <div className="persona-avatar-wrapper">
          <img
            src="/hitesh.png"
            alt="Hitesh Choudhary"
            className="persona-avatar"
          />
          <div className="persona-badge" style={{ backgroundColor: '#d97706' }}>
            <Coffee size={10} color="#fff" />
          </div>
        </div>
        <div className="persona-info">
          <h4 className="persona-name">Hitesh Choudhary</h4>
          <p className="persona-tagline">Chai aur Code • Mentor</p>
        </div>
      </button>

      <button
        onClick={() => onPersonaChange('piyush')}
        className={`persona-card ${activePersona === 'piyush' ? 'active' : ''}`}
        style={{ textAlign: 'left', width: '100%', cursor: 'pointer' }}
      >
        <div className="persona-avatar-wrapper">
          <img
            src="/piyush.png"
            alt="Piyush Garg"
            className="persona-avatar"
          />
          <div className="persona-badge" style={{ backgroundColor: '#06b6d4' }}>
            <Terminal size={10} color="#fff" />
          </div>
        </div>
        <div className="persona-info">
          <h4 className="persona-name">Piyush Garg</h4>
          <p className="persona-tagline">System Architect • Builder</p>
        </div>
      </button>
    </div>
  );
};
