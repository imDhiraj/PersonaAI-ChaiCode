import React, { useState } from 'react';
import { X, Key, Trash2, Eye, EyeOff } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveKey: (key: string) => void;
  onClearHistory: () => void;
  useProxy?: boolean;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  onSaveKey,
  onClearHistory,
  useProxy = false,
}) => {
  const [keyInput, setKeyInput] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveKey(keyInput.trim());
    onClose();
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to clear chat history for both personas? This cannot be undone.")) {
      onClearHistory();
      alert("Chat history cleared!");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">Settings & API Key</h3>
          <button onClick={onClose} className="close-btn" aria-label="Close settings">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="apiKeyInput">
              Google Gemini API Key
            </label>
            {useProxy && (
              <div 
                style={{ 
                  backgroundColor: 'rgba(16, 185, 129, 0.1)', 
                  border: '1px solid rgba(16, 185, 129, 0.2)', 
                  borderRadius: '6px', 
                  padding: '0.75rem', 
                  marginBottom: '1rem',
                  fontSize: '0.85rem',
                  color: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
                <span>Secure server-side API Key is active. You do not need to provide a custom key.</span>
              </div>
            )}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                id="apiKeyInput"
                type={showKey ? 'text' : 'password'}
                className="form-input"
                style={{ paddingRight: '2.5rem' }}
                placeholder="AIzaSy..."
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="form-help">
              Your API Key is saved locally in your browser's <code>localStorage</code> and never sent to any external server other than Google's Gemini API. 
              <br />
              <a
                href="https://aistudio.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--accent)', textDecoration: 'underline' }}
              >
                Get a free API Key from Google AI Studio
              </a>
            </p>
          </div>

          <div className="form-group" style={{ marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
            <label className="form-label">Data Management</label>
            <button
              type="button"
              onClick={handleClear}
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)' }}
            >
              <Trash2 size={16} />
              Clear Conversation History
            </button>
            <p className="form-help">Reset all messages for both Hitesh and Piyush.</p>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Key size={16} />
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
