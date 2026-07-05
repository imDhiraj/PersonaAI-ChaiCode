import React, { useRef, useEffect, useState } from 'react';
import { Send, Coffee, Terminal } from 'lucide-react';
import type { ChatMessage as ChatMessageType } from '../utils/gemini';
import { ChatMessage } from './ChatMessage';

interface ChatContainerProps {
  messages: ChatMessageType[];
  activePersona: 'hitesh' | 'piyush';
  onSendMessage: (text: string) => void;
  isGenerating: boolean;
}

const HITESH_SUGGESTIONS = [
  "Explain JavaScript closures like we are having chai",
  "How do I structure my first backend project step-by-step?",
  "Why do you keep saying consistency is a developer's superpower?",
  "Explain the difference between React and vanilla JavaScript simply"
];

const PIYUSH_SUGGESTIONS = [
  "How do I containerize a React/Express application using Docker?",
  "Walk me through the system design of a real-time chat app",
  "What is Developer Experience (DX) and how can I improve it?",
  "How do WebSockets differ from standard HTTP for live data?"
];

export const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  activePersona,
  onSendMessage,
  isGenerating,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const suggestions = activePersona === 'hitesh' ? HITESH_SUGGESTIONS : PIYUSH_SUGGESTIONS;

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  // Auto-resize input textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '44px';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 120)}px`;
    }
  }, [inputText]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || isGenerating) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="main-chat-area">
      {/* Messages Stream */}
      <div className="chat-messages-container">
        {messages.length === 0 ? (
          <div className="welcome-container">
            <div className="welcome-icon">
              {activePersona === 'hitesh' ? <Coffee size={32} /> : <Terminal size={32} />}
            </div>
            <h2 className="welcome-title">
              {activePersona === 'hitesh' 
                ? "Chai aur Code ke session me aapka swagat hai!" 
                : "Let's build devs, not just apps."}
            </h2>
            <p className="welcome-desc">
              {activePersona === 'hitesh'
                ? "Hello everyone, my name is Hitesh. Ask me anything about web development, coding standards, or software careers. Let's make it simple over some tea!"
                : "Hey guys, Piyush here. Ask me about system architecture, Docker, production scaling, DevOps, or building custom engines. Let's write code from scratch!"}
            </p>
            
            <div className="suggestion-grid">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => onSendMessage(suggestion)}
                  className="suggestion-card"
                >
                  <p className="suggestion-card-text">{suggestion}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} persona={activePersona} />
          ))
        )}

        {isGenerating && (
          <div className="message-row model">
            <img
              src={activePersona === 'hitesh' ? '/hitesh.png' : '/piyush.png'}
              alt={activePersona === 'hitesh' ? 'Hitesh Choudhary' : 'Piyush Garg'}
              className="message-avatar"
            />
            <div className="message-bubble" style={{ minWidth: '80px' }}>
              <div className="typing-indicator">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input container */}
      <div className="chat-input-container">

        <form onSubmit={handleSend} className="chat-input-form">
          <div className="input-wrapper">
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                activePersona === 'hitesh'
                  ? "Chai ready hai, code likhna shuru karein?..."
                  : "Let's build something awesome from scratch. Ask here..."
              }
              className="chat-textarea"
              disabled={isGenerating}
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isGenerating}
              className="send-btn"
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
