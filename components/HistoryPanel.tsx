import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ReadingHistory, getHistory, deleteReading, clearHistory, formatDate, formatDateShort, updateReadingNotes } from '../utils/historyManager';
import { getTarotCardImagePath } from '../utils/tarotImageMap';

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onViewReading: (reading: ReadingHistory) => void;
  onOpenNotes?: (readingId: string) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ isOpen, onClose, onViewReading, onOpenNotes }) => {
  const [history, setHistory] = useState<ReadingHistory[]>([]);
  const [selectedReading, setSelectedReading] = useState<ReadingHistory | null>(null);

  useEffect(() => {
    if (isOpen) {
      setHistory(getHistory());
    }
  }, [isOpen]);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this reading?')) {
      deleteReading(id);
      setHistory(getHistory());
      if (selectedReading?.id === id) {
        setSelectedReading(null);
      }
    }
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all reading history? This cannot be undone.')) {
      clearHistory();
      setHistory([]);
      setSelectedReading(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Panel */}
      <div className="relative ml-auto w-full max-w-lg h-full bg-gradient-to-b from-mystic-900 to-mystic-950 border-l border-mystic-gold/20 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-mystic-gold/20">
          <div>
            <h2 className="font-serif text-2xl text-mystic-gold">Reading History</h2>
            <p className="text-mystic-goldDim/60 text-xs mt-1">{history.length} readings saved</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-mystic-800/50 border border-mystic-gold/30 flex items-center justify-center text-mystic-gold hover:bg-mystic-gold hover:text-mystic-900 transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="w-20 h-20 rounded-full bg-mystic-800/30 flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-mystic-goldDim/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="font-serif text-xl text-mystic-goldDim mb-2">No Readings Yet</h3>
              <p className="text-gray-500 text-sm">Your tarot readings will appear here after you complete them.</p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {history.map((entry) => (
                <motion.div 
                  key={entry.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => onViewReading(entry)}
                  className="group bg-mystic-800/30 hover:bg-mystic-800/50 border border-mystic-gold/10 hover:border-mystic-gold/30 rounded-xl p-4 cursor-pointer transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        {entry.type === 'daily' && (
                          <span className="px-2 py-0.5 bg-mystic-accent/20 text-mystic-accent text-[10px] uppercase rounded-full">Daily</span>
                        )}
                        {entry.notes && (
                          <span className="px-2 py-0.5 bg-mystic-gold/20 text-mystic-gold text-[10px] uppercase rounded-full flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Notes
                          </span>
                        )}
                        {entry.spreadName && (
                          <span className="text-mystic-goldDim/40 text-[10px]">{entry.spreadName}</span>
                        )}
                        <span className="text-mystic-goldDim/60 text-xs">{formatDateShort(entry.date)}</span>
                      </div>
                      <p className="font-serif text-white text-sm truncate pr-4">"{entry.question}"</p>
                    </div>
                    <div className="flex gap-1">
                      {/* Notes Button */}
                      {onOpenNotes && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); onOpenNotes(entry.id); }}
                          className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-lg bg-mystic-gold/10 flex items-center justify-center text-mystic-gold hover:bg-mystic-gold/20 transition-all"
                          title="View/Edit Notes"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      )}
                      {/* Delete Button */}
                      <button 
                        onClick={(e) => handleDelete(entry.id, e)}
                        className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-lg bg-red-900/30 flex items-center justify-center text-red-400 hover:bg-red-900/50 transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  {/* Mini Card Preview */}
                  <div className="flex gap-2">
                    {entry.readings.map((reading, idx) => {
                      const imagePath = getTarotCardImagePath(reading.card.name);
                      return (
                        <div 
                          key={idx}
                          className={`w-10 h-14 rounded overflow-hidden border ${reading.card.isReversed ? 'border-red-500/30' : 'border-mystic-gold/20'}`}
                        >
                          {imagePath ? (
                            <img 
                              src={imagePath} 
                              alt={reading.card.name}
                              className={`w-full h-full object-cover ${reading.card.isReversed ? 'rotate-180' : ''}`}
                            />
                          ) : (
                            <div className="w-full h-full bg-mystic-900 flex items-center justify-center">
                              <svg className="w-2 h-2 text-mystic-gold" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0L14.59 8.41L24 12L14.59 15.59L12 24L9.41 15.59L0 12L9.41 8.41L12 0Z" /></svg>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="p-4 border-t border-mystic-gold/10">
            <button
              onClick={handleClearAll}
              className="w-full py-2 text-sm text-red-400/70 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
            >
              Clear All History
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPanel;

