import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { updateReadingNotes, getReadingById, ReadingHistory } from '../utils/historyManager';

interface ReadingNotesProps {
  isOpen: boolean;
  onClose: () => void;
  readingId: string;
  initialNotes?: string;
  onSave?: (notes: string) => void;
}

const ReadingNotes: React.FC<ReadingNotesProps> = ({
  isOpen,
  onClose,
  readingId,
  initialNotes = '',
  onSave,
}) => {
  const [notes, setNotes] = useState(initialNotes);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [reading, setReading] = useState<ReadingHistory | null>(null);

  useEffect(() => {
    if (isOpen && readingId) {
      const readingData = getReadingById(readingId);
      if (readingData) {
        setReading(readingData);
        setNotes(readingData.notes || '');
      }
    }
  }, [isOpen, readingId]);

  // Auto-save debounce
  useEffect(() => {
    if (!notes && notes === (reading?.notes || '')) return;
    
    setSaveStatus('saving');
    const timer = setTimeout(() => {
      updateReadingNotes(readingId, notes);
      setSaveStatus('saved');
      onSave?.(notes);
      
      // Reset status after 2 seconds
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1000);

    return () => clearTimeout(timer);
  }, [notes, readingId, onSave, reading?.notes]);

  // Reflection prompts
  const reflectionPrompts = [
    "What emotions arose when you saw these cards?",
    "How do these cards relate to your current situation?",
    "What message resonates with you the most?",
    "What action will you take based on this reading?",
    "What are you grateful for after this reading?",
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md overflow-y-auto py-8"
      >
        <div className="absolute inset-0" onClick={onClose}></div>
        
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          className="relative w-full max-w-2xl mx-4 my-auto"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-mystic-900 border-2 border-mystic-gold/50 flex items-center justify-center text-mystic-gold hover:bg-mystic-gold hover:text-mystic-900 transition-all z-50"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="bg-gradient-to-b from-mystic-900 via-mystic-950 to-black rounded-2xl border border-mystic-gold/40 overflow-hidden">
            
            {/* Header */}
            <div className="p-6 border-b border-mystic-gold/20">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-2xl text-mystic-gold mb-1">Personal Reflections</h2>
                  <p className="text-mystic-goldDim/60 text-sm">Record your insights and feelings</p>
                </div>
                
                {/* Save Status */}
                <AnimatePresence mode="wait">
                  {saveStatus === 'saving' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 text-mystic-goldDim/60 text-sm"
                    >
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </motion.div>
                  )}
                  {saveStatus === 'saved' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-2 text-green-400 text-sm"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Saved
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Reading Context */}
              {reading && (
                <div className="mt-4 bg-mystic-800/30 rounded-xl p-4 border border-mystic-gold/10">
                  <p className="text-mystic-goldDim/60 text-[10px] uppercase tracking-widest mb-1">Reading Question</p>
                  <p className="text-white text-sm italic">"{reading.question}"</p>
                  <div className="flex gap-2 mt-3">
                    {reading.readings.slice(0, 3).map((r, idx) => (
                      <span 
                        key={idx} 
                        className={`px-2 py-1 text-[10px] rounded-full ${
                          r.card.isReversed 
                            ? 'bg-red-900/30 text-red-300 border border-red-500/30'
                            : 'bg-mystic-gold/10 text-mystic-gold border border-mystic-gold/30'
                        }`}
                      >
                        {r.card.name}
                      </span>
                    ))}
                    {reading.readings.length > 3 && (
                      <span className="px-2 py-1 text-[10px] text-mystic-goldDim/50">
                        +{reading.readings.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Notes Area */}
            <div className="p-6 space-y-6">
              {/* Main Textarea */}
              <div>
                <label className="block text-mystic-goldDim text-sm font-bold uppercase tracking-widest mb-3">
                  Your Thoughts
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Write your reflections, insights, and feelings about this reading..."
                  rows={6}
                  className="w-full bg-mystic-800/50 border border-mystic-gold/20 rounded-xl p-4 text-white placeholder-mystic-goldDim/40 focus:outline-none focus:border-mystic-gold/50 resize-none transition-all font-serif leading-relaxed"
                />
                <p className="text-right text-mystic-goldDim/40 text-xs mt-2">
                  {notes.length} characters • Auto-saves as you type
                </p>
              </div>

              {/* Reflection Prompts */}
              <div>
                <p className="text-mystic-goldDim text-sm font-bold uppercase tracking-widest mb-3">
                  Reflection Prompts
                </p>
                <div className="grid gap-2">
                  {reflectionPrompts.map((prompt, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ x: 5 }}
                      onClick={() => setNotes(prev => prev + (prev ? '\n\n' : '') + `${prompt}\n`)}
                      className="text-left px-4 py-3 bg-mystic-800/30 rounded-lg border border-mystic-gold/10 text-sm text-gray-400 hover:text-white hover:border-mystic-gold/30 transition-all flex items-center gap-3"
                    >
                      <svg className="w-3 h-3 text-mystic-gold/50" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0L14.59 8.41L24 12L14.59 15.59L12 24L9.41 15.59L0 12L9.41 8.41L12 0Z" /></svg>
                      {prompt}
                      <svg className="w-4 h-4 ml-auto opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Journaling Tips */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-r from-mystic-gold/5 to-mystic-accent/5 rounded-xl p-4 border border-mystic-gold/10"
              >
                <h4 className="text-mystic-gold text-sm font-bold mb-2 flex items-center gap-2">
                  <span>💡</span>
                  Journaling Tips
                </h4>
                <ul className="text-gray-400 text-xs space-y-1 list-disc list-inside">
                  <li>Note your first emotional reaction to each card</li>
                  <li>Connect the cards to specific events in your life</li>
                  <li>Write what you plan to do differently</li>
                  <li>Return to this reading in a week to see if insights hold true</li>
                </ul>
              </motion.div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-mystic-gold/10 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2 text-mystic-goldDim hover:text-white transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  updateReadingNotes(readingId, notes);
                  setSaveStatus('saved');
                  onSave?.(notes);
                  setTimeout(onClose, 500);
                }}
                className="px-6 py-2 bg-mystic-gold/20 border border-mystic-gold/50 text-mystic-gold rounded-lg hover:bg-mystic-gold hover:text-mystic-900 transition-all"
              >
                Save & Close
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ReadingNotes;


