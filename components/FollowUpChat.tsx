import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ReadingResult } from '../types';
import { askFollowUp } from '../services/geminiService';

interface Message {
  id: string;
  role: 'user' | 'oracle';
  content: string;
  timestamp: Date;
}

interface FollowUpChatProps {
  isOpen: boolean;
  onClose: () => void;
  question: string;
  readings: ReadingResult[];
  synthesis: string;
}

const FollowUpChat: React.FC<FollowUpChatProps> = ({
  isOpen,
  onClose,
  question,
  readings,
  synthesis,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Suggested questions
  const suggestedQuestions = [
    "What should I focus on first?",
    "How can I overcome the challenges shown?",
    "What does the reversed card mean for me?",
    "How do these cards connect to each other?",
    "What action should I take today?",
  ];

  const handleSend = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Get oracle response
      const readingsForAI = readings.map(r => ({
        timeFrame: r.timeFrame,
        card: {
          name: r.card.name,
          meaning: r.card.meaning,
          isReversed: r.card.isReversed,
        },
      }));

      const response = await askFollowUp(question, readingsForAI, synthesis, text);

      const oracleMessage: Message = {
        id: `oracle_${Date.now()}`,
        role: 'oracle',
        content: response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, oracleMessage]);
    } catch (error) {
      console.error('Follow-up error:', error);
      const errorMessage: Message = {
        id: `oracle_${Date.now()}`,
        role: 'oracle',
        content: 'The mystical connection wavers... Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm"
      >
        <div className="absolute inset-0" onClick={onClose}></div>
        
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          className="relative w-full max-w-xl mx-4 mb-4 sm:mb-0 max-h-[80vh] flex flex-col"
        >
          {/* Chat Container */}
          <div className="bg-gradient-to-b from-mystic-900 via-mystic-950 to-black rounded-2xl border border-mystic-gold/40 overflow-hidden flex flex-col h-[70vh]">
            
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-mystic-gold/20 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-mystic-gold/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-mystic-gold" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                </div>
                <div>
                  <h3 className="font-serif text-lg text-mystic-gold">Ask the Oracle</h3>
                  <p className="text-mystic-goldDim/60 text-xs">Deepen your understanding</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-mystic-800/50 flex items-center justify-center text-mystic-goldDim hover:text-mystic-gold transition-all"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {/* Initial Context */}
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-6"
                >
                  <div className="w-16 h-16 rounded-full bg-mystic-gold/10 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-mystic-gold" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0L14.59 8.41L24 12L14.59 15.59L12 24L9.41 15.59L0 12L9.41 8.41L12 0Z" /></svg>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">
                    The Oracle awaits your questions about your reading.
                  </p>
                  <div className="bg-mystic-800/30 rounded-xl p-3 text-left border border-mystic-gold/10 max-w-sm mx-auto">
                    <p className="text-mystic-goldDim/60 text-[10px] uppercase tracking-widest mb-1">Your Question</p>
                    <p className="text-white text-sm italic">"{question}"</p>
                  </div>
                </motion.div>
              )}

              {/* Chat Messages */}
              {messages.map((message, idx) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${
                    message.role === 'user'
                      ? 'bg-mystic-gold/20 border-mystic-gold/30'
                      : 'bg-mystic-800/50 border-mystic-gold/10'
                  } rounded-2xl p-4 border`}>
                    {message.role === 'oracle' && (
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-4 h-4 text-mystic-gold" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0L14.59 8.41L24 12L14.59 15.59L12 24L9.41 15.59L0 12L9.41 8.41L12 0Z" /></svg>
                        <span className="text-mystic-gold text-xs font-bold uppercase tracking-widest">Oracle</span>
                      </div>
                    )}
                    <p className={`text-sm leading-relaxed ${
                      message.role === 'user' ? 'text-white' : 'text-gray-300'
                    }`}>
                      {message.content}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-mystic-800/50 rounded-2xl p-4 border border-mystic-gold/10">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-mystic-gold" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0L14.59 8.41L24 12L14.59 15.59L12 24L9.41 15.59L0 12L9.41 8.41L12 0Z" /></svg>
                      <span className="text-mystic-gold text-xs font-bold uppercase tracking-widest">Oracle</span>
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      <motion.div
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                        className="w-2 h-2 bg-mystic-gold/50 rounded-full"
                      />
                      <motion.div
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                        className="w-2 h-2 bg-mystic-gold/50 rounded-full"
                      />
                      <motion.div
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                        className="w-2 h-2 bg-mystic-gold/50 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions (when no messages) */}
            {messages.length === 0 && (
              <div className="px-4 pb-2 flex-shrink-0">
                <p className="text-mystic-goldDim/60 text-[10px] uppercase tracking-widest mb-2">Suggested Questions</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.slice(0, 3).map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(q)}
                      className="px-3 py-1.5 bg-mystic-800/50 border border-mystic-gold/20 rounded-full text-xs text-mystic-goldDim hover:text-mystic-gold hover:border-mystic-gold/40 transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t border-mystic-gold/20 flex-shrink-0">
              <div className="flex gap-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about your reading..."
                  disabled={isLoading}
                  className="flex-1 bg-mystic-800/50 border border-mystic-gold/20 rounded-xl px-4 py-3 text-white placeholder-mystic-goldDim/50 focus:outline-none focus:border-mystic-gold/50 transition-all disabled:opacity-50"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isLoading}
                  className="w-12 h-12 rounded-xl bg-mystic-gold/20 border border-mystic-gold/50 flex items-center justify-center text-mystic-gold hover:bg-mystic-gold hover:text-mystic-900 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FollowUpChat;


