'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User as UserIcon, Loader2, RotateCcw } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatbotModal({ isOpen, onClose }: ChatbotModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your AI coding assistant. I can help you with:\n\n• Algorithm explanations\n• Code debugging\n• Time/space complexity analysis\n• Problem-solving hints\n• Concept clarification\n\nWhat would you like to learn about?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollPositionRef = useRef<number>(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      scrollPositionRef.current = window.scrollY;
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPositionRef.current}px`;
      document.body.style.width = '100%';
      
      inputRef.current?.focus();
    } else {
      // Restore body scroll
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      
      // Restore scroll position
      window.scrollTo(0, scrollPositionRef.current);
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const resetChat = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: "Hi! I'm your AI coding assistant. I can help you with:\n\n• Algorithm explanations\n• Code debugging\n• Time/space complexity analysis\n• Problem-solving hints\n• Concept clarification\n\nWhat would you like to learn about?",
        timestamp: new Date(),
      },
    ]);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        onWheel={(e) => e.preventDefault()}
        onTouchMove={(e) => e.preventDefault()}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          zIndex: 9998,
        }}
      />

      {/* Modal - RIGHT SIDE OF SCREEN */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'fixed',
          top: '80px',
          right: '24px',
          width: '380px',
          height: 'calc(100vh - 120px)',
          maxHeight: '650px',
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          zIndex: 9999,
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(to right, #2563eb, #9333ea)',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Bot style={{ width: '20px', height: '20px', color: 'white' }} />
            </div>
            <div>
              <h3 style={{ fontWeight: 600, color: 'white', fontSize: '14px', margin: 0 }}>
                AlgoBuddy AI
              </h3>
              <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.9)', margin: 0 }}>
                Your coding assistant
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button
              onClick={resetChat}
              style={{
                padding: '8px',
                borderRadius: '8px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="New Chat"
            >
              <RotateCcw style={{ width: '16px', height: '16px', color: 'white' }} />
            </button>
            <button
              onClick={onClose}
              style={{
                padding: '8px',
                borderRadius: '8px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X style={{ width: '20px', height: '20px', color: 'white' }} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            backgroundColor: '#f8fafc',
          }}
        >
          {messages.map((message) => (
            <div
              key={message.id}
              style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '16px',
                justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              {message.role === 'assistant' && (
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(to bottom right, #2563eb, #9333ea)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Bot style={{ width: '20px', height: '20px', color: 'white' }} />
                </div>
              )}
              <div>
                <div
                  style={{
                    maxWidth: '260px',
                    padding: '10px 14px',
                    borderRadius: '16px',
                    fontSize: '14px',
                    backgroundColor: message.role === 'user' ? '#2563eb' : 'white',
                    color: message.role === 'user' ? 'white' : '#0f172a',
                    boxShadow: message.role === 'assistant' ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)' : 'none',
                    border: message.role === 'assistant' ? '1px solid #e2e8f0' : 'none',
                    borderBottomRightRadius: message.role === 'user' ? '4px' : '16px',
                    borderBottomLeftRadius: message.role === 'assistant' ? '4px' : '16px',
                  }}
                >
                  <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {message.content}
                  </div>
                  <div
                    style={{
                      fontSize: '11px',
                      marginTop: '4px',
                      opacity: message.role === 'user' ? 0.7 : 0.5,
                      color: message.role === 'user' ? 'white' : '#64748b',
                    }}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
              {message.role === 'user' && (
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <UserIcon style={{ width: '20px', height: '20px', color: '#475569' }} />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(to bottom right, #2563eb, #9333ea)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Bot style={{ width: '20px', height: '20px', color: 'white' }} />
              </div>
              <div
                style={{
                  padding: '12px 14px',
                  borderRadius: '16px',
                  borderBottomLeftRadius: '4px',
                  backgroundColor: 'white',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                  border: '1px solid #e2e8f0',
                }}
              >
                <Loader2 style={{ width: '20px', height: '20px', color: '#2563eb', animation: 'spin 1s linear infinite' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div
          style={{
            padding: '16px',
            borderTop: '1px solid #e2e8f0',
            backgroundColor: 'white',
          }}
        >
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything..."
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: '12px',
                border: '1px solid #cbd5e1',
                backgroundColor: 'white',
                color: '#0f172a',
                fontSize: '14px',
                outline: 'none',
              }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              style={{
                padding: '10px 16px',
                borderRadius: '12px',
                background: 'linear-gradient(to right, #2563eb, #9333ea)',
                color: 'white',
                border: 'none',
                cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
                opacity: input.trim() && !isLoading ? 1 : 0.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Send style={{ width: '20px', height: '20px' }} />
            </button>
          </div>
          <p
            style={{
              fontSize: '11px',
              color: '#64748b',
              textAlign: 'center',
              margin: '8px 0 0 0',
            }}
          >
            AI can make mistakes. Verify important information.
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}

