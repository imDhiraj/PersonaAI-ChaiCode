import React from 'react';
import { X, Trash2 } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClearHistory: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onClearHistory,
}) => {
  if (!isOpen) return null;

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
          <h3 className="modal-title">Settings</h3>
          <button onClick={onClose} className="close-btn" aria-label="Close settings">
            <X size={20} />
          </button>
        </div>

        <div className="form-group">
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
          <button type="button" onClick={onClose} className="btn btn-primary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
