import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check } from 'lucide-react';
import type { ChatMessage as ChatMessageType } from '../utils/gemini';

interface ChatMessageProps {
  message: ChatMessageType;
  persona: 'hitesh' | 'piyush';
}

const CodeBlock: React.FC<{ children: string; className?: string }> = ({ children, className }) => {
  const [copied, setCopied] = useState(false);
  const lang = className ? className.replace('language-', '') : 'code';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  return (
    <div className="code-block-wrapper">
      <div className="code-block-header">
        <span className="code-block-lang">{lang}</span>
        <button onClick={handleCopy} className="code-block-copy-btn">
          {copied ? (
            <>
              <Check size={12} />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="code-block-content">
        <code>{children.trim()}</code>
      </pre>
    </div>
  );
};

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, persona }) => {
  const isUser = message.role === 'user';

  const avatarSrc = isUser 
    ? 'https://api.dicebear.com/7.x/bottts/svg?seed=user' 
    : persona === 'hitesh' 
      ? '/hitesh.png' 
      : '/piyush.png';

  const nameLabel = isUser 
    ? 'You' 
    : persona === 'hitesh' 
      ? 'Hitesh Choudhary' 
      : 'Piyush Garg';

  return (
    <div className={`message-row ${isUser ? 'user' : 'model'}`}>
      <img
        src={avatarSrc}
        alt={nameLabel}
        className="message-avatar"
      />
      <div className="message-bubble">
        {isUser ? (
          <p style={{ whiteSpace: 'pre-wrap' }}>{message.content}</p>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return match ? (
                  <CodeBlock className={className}>
                    {String(children).replace(/\n$/, '')}
                  </CodeBlock>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              }
            }}
          >
            {message.content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
};
