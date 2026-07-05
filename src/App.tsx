import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PersonaSelector } from './components/PersonaSelector';
import { ChatContainer } from './components/ChatContainer';
import { SettingsModal } from './components/SettingsModal';
import { streamChatResponse, streamChatResponseProxy, type ChatMessage } from './utils/gemini';

function App() {
  // Load state from localStorage if available
  const [activePersona, setActivePersona] = useState<'hitesh' | 'piyush'>(() => {
    const saved = localStorage.getItem('teacher_chat_active_persona');
    return (saved === 'hitesh' || saved === 'piyush') ? saved : 'hitesh';
  });

  const [hiteshHistory, setHiteshHistory] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('teacher_chat_history_hitesh');
    return saved ? JSON.parse(saved) : [];
  });

  const [piyushHistory, setPiyushHistory] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('teacher_chat_history_piyush');
    return saved ? JSON.parse(saved) : [];
  });

  const [apiKey, setApiKey] = useState<string>(() => {
    // Check localStorage first, then fallback to environmental variable
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) return savedKey;
    return import.meta.env.VITE_GEMINI_API_KEY || '';
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [useProxy, setUseProxy] = useState<boolean>(false);

  // Check if server-side proxy is available
  useEffect(() => {
    async function checkProxyConfig() {
      try {
        const response = await fetch('/api/config');
        if (response.ok) {
          const data = await response.json();
          setUseProxy(!!data.useProxy);
        }
      } catch (err) {
        console.log("No serverless proxy detected, falling back to client-side API calls.");
      }
    }
    checkProxyConfig();
  }, []);

  // Sync active persona to localStorage
  useEffect(() => {
    localStorage.setItem('teacher_chat_active_persona', activePersona);
  }, [activePersona]);

  // Sync histories to localStorage
  useEffect(() => {
    localStorage.setItem('teacher_chat_history_hitesh', JSON.stringify(hiteshHistory));
  }, [hiteshHistory]);

  useEffect(() => {
    localStorage.setItem('teacher_chat_history_piyush', JSON.stringify(piyushHistory));
  }, [piyushHistory]);

  // Sync theme class to body element
  useEffect(() => {
    document.body.className = `theme-${activePersona}`;
  }, [activePersona]);

  // Save API key
  const handleSaveKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('gemini_api_key', key);
  };

  // Clear chat history
  const handleClearHistory = () => {
    setHiteshHistory([]);
    setPiyushHistory([]);
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Check if API Key is missing and proxy is not enabled
    if (!useProxy && !apiKey) {
      setIsSettingsOpen(true);
      return;
    }

    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    // Update active history with user message
    if (activePersona === 'hitesh') {
      setHiteshHistory(prev => [...prev, newMessage]);
    } else {
      setPiyushHistory(prev => [...prev, newMessage]);
    }

    setIsGenerating(true);

    const modelMessageId = crypto.randomUUID();
    const tempModelMessage: ChatMessage = {
      id: modelMessageId,
      role: 'model',
      content: '',
      timestamp: Date.now(),
    };

    // Add empty model message to history to stream into
    if (activePersona === 'hitesh') {
      setHiteshHistory(prev => [...prev, tempModelMessage]);
    } else {
      setPiyushHistory(prev => [...prev, tempModelMessage]);
    }

    // Get snapshot of current history *before* the user's new message is processed
    const currentHistorySnapshot = activePersona === 'hitesh' ? hiteshHistory : piyushHistory;

    try {
      let currentText = '';
      const onChunkCallback = (chunk: string) => {
        currentText += chunk;
        if (activePersona === 'hitesh') {
          setHiteshHistory(prev => 
            prev.map(m => m.id === modelMessageId ? { ...m, content: currentText } : m)
          );
        } else {
          setPiyushHistory(prev => 
            prev.map(m => m.id === modelMessageId ? { ...m, content: currentText } : m)
          );
        }
      };

      if (apiKey) {
        // Use user-provided API key directly from the browser
        await streamChatResponse(
          apiKey,
          activePersona,
          currentHistorySnapshot,
          text,
          onChunkCallback
        );
      } else if (useProxy) {
        // Use secure serverless backend proxy
        await streamChatResponseProxy(
          activePersona,
          currentHistorySnapshot,
          text,
          onChunkCallback
        );
      }
    } catch (error: any) {
      console.error(error);
      const errorText = `\n\n*(Error: ${error.message || "Something went wrong. Please check your API key."})*`;
      if (activePersona === 'hitesh') {
        setHiteshHistory(prev => 
          prev.map(m => m.id === modelMessageId ? { ...m, content: m.content + errorText } : m)
        );
      } else {
        setPiyushHistory(prev => 
          prev.map(m => m.id === modelMessageId ? { ...m, content: m.content + errorText } : m)
        );
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const activeMessages = activePersona === 'hitesh' ? hiteshHistory : piyushHistory;

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          <div 
            style={{ 
              width: '36px', 
              height: '36px', 
              borderRadius: '8px', 
              backgroundColor: 'var(--accent)', 
              color: 'var(--bg-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '1.1rem'
            }}
          >
            AI
          </div>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Teacher AI</h2>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Hitesh & Piyush Personas</span>
          </div>
        </div>

        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
            Select Teacher Persona
          </span>
          <PersonaSelector
            activePersona={activePersona}
            onPersonaChange={setActivePersona}
          />
        </div>

        <div className="sidebar-footer">
          <div className="footer-credit">
            <p>Dedicated to my teachers</p>
            <p style={{ fontWeight: 600, color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Hitesh Choudhary & Piyush Garg
            </p>
            <p style={{ fontSize: '0.65rem', marginTop: '0.4rem', color: 'var(--text-muted)' }}>
              Built as a tribute project
            </p>
          </div>
        </div>
      </aside>

      {/* Main chat window */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        <Header
          activePersona={activePersona}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
        
        <ChatContainer
          messages={activeMessages}
          activePersona={activePersona}
          onSendMessage={handleSendMessage}
          isGenerating={isGenerating}
          apiKeyMissing={!useProxy && !apiKey}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        onSaveKey={handleSaveKey}
        onClearHistory={handleClearHistory}
        useProxy={useProxy}
      />
    </div>
  );
}

export default App;
