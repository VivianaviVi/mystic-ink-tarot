import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ALL_CARDS, TarotCardInfo } from '../data/tarotData';
import { getTarotCardImagePath } from '../utils/tarotImageMap';

interface TarotLearningProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LearningProgress {
  learnedCards: string[]; // Card IDs that have been studied
  currentStreak: number;
  lastStudyDate: string;
  totalStudySessions: number;
}

const STORAGE_KEY = 'mystic_ink_learning';

const getProgress = (): LearningProgress => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch {}
  return {
    learnedCards: [],
    currentStreak: 0,
    lastStudyDate: '',
    totalStudySessions: 0,
  };
};

const saveProgress = (progress: LearningProgress) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
};

const getTodayString = () => new Date().toISOString().split('T')[0];

// Meditation prompts for each arcana type
const MEDITATIONS = {
  Major: [
    "Close your eyes and visualize this card. What emotions arise?",
    "Imagine yourself as the figure in this card. What do you feel?",
    "What life lesson does this archetype hold for you today?",
    "Breathe deeply and let the card's energy wash over you.",
  ],
  Minor: [
    "How does this card's element (Fire/Water/Air/Earth) manifest in your life?",
    "What situation in your life reflects this card's energy?",
    "Visualize the scene on this card. What details stand out?",
    "How can you embody this card's wisdom today?",
  ],
};

// Practice exercises
const EXERCISES = [
  "Journal about a time when you experienced this card's energy",
  "Draw a quick sketch inspired by this card's imagery",
  "Find three objects in your space that remind you of this card",
  "Share this card's meaning with someone in your own words",
  "Notice when this card's themes appear in your day",
];

const TarotLearning: React.FC<TarotLearningProps> = ({ isOpen, onClose }) => {
  const [progress, setProgress] = useState<LearningProgress>(getProgress);
  const [currentCard, setCurrentCard] = useState<TarotCardInfo | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [mode, setMode] = useState<'daily' | 'quiz' | 'browse'>('daily');
  const [quizScore, setQuizScore] = useState({ correct: 0, total: 0 });
  const [quizOptions, setQuizOptions] = useState<string[]>([]);
  
  // Get today's card deterministically based on date
  const todaysCard = useMemo(() => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    const cardIndex = dayOfYear % ALL_CARDS.length;
    return ALL_CARDS[cardIndex];
  }, []);

  // Check if already studied today
  const studiedToday = progress.lastStudyDate === getTodayString();

  useEffect(() => {
    if (isOpen && mode === 'daily') {
      setCurrentCard(todaysCard);
    }
  }, [isOpen, mode, todaysCard]);

  // Generate quiz
  const generateQuiz = () => {
    const randomCard = ALL_CARDS[Math.floor(Math.random() * ALL_CARDS.length)];
    setCurrentCard(randomCard);
    
    // Generate 4 options including the correct one
    const options = [randomCard.name];
    while (options.length < 4) {
      const rand = ALL_CARDS[Math.floor(Math.random() * ALL_CARDS.length)];
      if (!options.includes(rand.name)) {
        options.push(rand.name);
      }
    }
    // Shuffle options
    setQuizOptions(options.sort(() => Math.random() - 0.5));
    setShowAnswer(false);
  };

  const handleQuizAnswer = (answer: string) => {
    if (!currentCard) return;
    
    const isCorrect = answer === currentCard.name;
    setQuizScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));
    setShowAnswer(true);
    
    if (isCorrect && !progress.learnedCards.includes(currentCard.id)) {
      const newProgress = {
        ...progress,
        learnedCards: [...progress.learnedCards, currentCard.id],
      };
      setProgress(newProgress);
      saveProgress(newProgress);
    }
  };

  const markAsStudied = () => {
    const today = getTodayString();
    const isConsecutive = progress.lastStudyDate === new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    const newProgress: LearningProgress = {
      learnedCards: progress.learnedCards.includes(currentCard?.id || '') 
        ? progress.learnedCards 
        : [...progress.learnedCards, currentCard?.id || ''],
      currentStreak: isConsecutive ? progress.currentStreak + 1 : 1,
      lastStudyDate: today,
      totalStudySessions: progress.totalStudySessions + 1,
    };
    
    setProgress(newProgress);
    saveProgress(newProgress);
  };

  const getMeditation = () => {
    if (!currentCard) return '';
    const prompts = currentCard.arcana === 'Major' ? MEDITATIONS.Major : MEDITATIONS.Minor;
    return prompts[Math.floor(Math.random() * prompts.length)];
  };

  const getExercise = () => EXERCISES[Math.floor(Math.random() * EXERCISES.length)];

  if (!isOpen) return null;

  const imagePath = currentCard ? getTarotCardImagePath(currentCard.name) : null;
  const progressPercent = Math.round((progress.learnedCards.length / ALL_CARDS.length) * 100);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md overflow-y-auto py-8"
      >
        <div className="absolute inset-0" onClick={onClose}></div>
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-4xl mx-4 my-auto"
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
                  <h2 className="font-serif text-3xl text-mystic-gold mb-1">Tarot Academy</h2>
                  <p className="text-mystic-goldDim/60 text-sm">Master the 78 cards of wisdom</p>
                </div>
                
                {/* Progress Stats */}
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-mystic-gold text-2xl font-bold">{progress.currentStreak}</p>
                    <p className="text-mystic-goldDim/50 text-[10px] uppercase">Day Streak</p>
                  </div>
                  <div className="text-center">
                    <p className="text-mystic-gold text-2xl font-bold">{progress.learnedCards.length}/78</p>
                    <p className="text-mystic-goldDim/50 text-[10px] uppercase">Cards Learned</p>
                  </div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-4 h-2 bg-mystic-800/50 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  className="h-full bg-gradient-to-r from-mystic-gold to-yellow-500"
                />
              </div>
              <p className="text-mystic-goldDim/50 text-xs mt-1 text-right">{progressPercent}% Complete</p>
            </div>

            {/* Mode Tabs */}
            <div className="flex border-b border-mystic-gold/10">
              {[
                { id: 'daily', label: 'Daily Card', desc: "Today's lesson" },
                { id: 'quiz', label: 'Quiz Mode', desc: 'Test your knowledge' },
                { id: 'browse', label: 'Browse All', desc: 'Explore freely' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setMode(tab.id as typeof mode);
                    if (tab.id === 'quiz') generateQuiz();
                    if (tab.id === 'daily') setCurrentCard(todaysCard);
                  }}
                  className={`flex-1 px-4 py-3 text-center transition-all ${
                    mode === tab.id 
                      ? 'bg-mystic-gold/10 border-b-2 border-mystic-gold' 
                      : 'hover:bg-mystic-800/30'
                  }`}
                >
                  <p className={`text-sm ${mode === tab.id ? 'text-mystic-gold' : 'text-gray-400'}`}>
                    {tab.label}
                  </p>
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
              
              {/* Daily Mode */}
              {mode === 'daily' && currentCard && (
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Card Display */}
                  <div className="md:w-1/3 flex-shrink-0">
                    <div className="aspect-[2/3] rounded-xl overflow-hidden border-2 border-mystic-gold/40 shadow-2xl mx-auto max-w-[200px]">
                      {imagePath ? (
                        <img src={imagePath} alt={currentCard.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-mystic-900 flex items-center justify-center">
                          <svg className="w-10 h-10 text-mystic-gold" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0L14.59 8.41L24 12L14.59 15.59L12 24L9.41 15.59L0 12L9.41 8.41L12 0Z" /></svg>
                        </div>
                      )}
                    </div>
                    
                    {/* Study Status */}
                    <div className="mt-4 text-center">
                      {studiedToday ? (
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-900/30 text-green-400 rounded-full text-sm">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Studied Today!
                        </span>
                      ) : (
                        <button
                          onClick={markAsStudied}
                          className="px-6 py-2 bg-mystic-gold/20 border border-mystic-gold/50 text-mystic-gold rounded-full text-sm hover:bg-mystic-gold hover:text-mystic-900 transition-all"
                        >
                          ✓ Mark as Studied
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Card Info */}
                  <div className="md:w-2/3 space-y-6">
                    <div>
                      <h3 className="font-serif text-3xl text-mystic-gold">{currentCard.name}</h3>
                      <p className="text-mystic-goldDim/60 text-sm mt-1">
                        {currentCard.arcana === 'Major' ? 'Major Arcana' : `${currentCard.suit} • Minor Arcana`}
                      </p>
                    </div>

                    {/* Keywords */}
                    <div className="flex flex-wrap gap-2">
                      {currentCard.keywords.map((kw, idx) => (
                        <span key={idx} className="px-3 py-1 bg-mystic-800/50 text-gray-300 text-xs rounded-full">
                          {kw}
                        </span>
                      ))}
                    </div>

                    {/* Meanings */}
                    <div className="grid gap-4">
                      <div className="p-4 bg-green-900/20 rounded-xl border border-green-500/20">
                        <h4 className="text-green-400 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-1"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg> Upright</h4>
                        <p className="text-gray-300 text-sm">{currentCard.upright}</p>
                      </div>
                      <div className="p-4 bg-red-900/20 rounded-xl border border-red-500/20">
                        <h4 className="text-red-400 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-1"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg> Reversed</h4>
                        <p className="text-gray-300 text-sm">{currentCard.reversed}</p>
                      </div>
                    </div>

                    {/* Meditation & Exercise */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 bg-mystic-accent/10 rounded-xl border border-mystic-accent/20">
                        <h4 className="text-mystic-accent text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5c-2.485 0-4.5 2.015-4.5 4.5v1.5H6v3h1.5v6h9v-6H18v-3h-1.5V9c0-2.485-2.015-4.5-4.5-4.5zm-1.5 6V9a1.5 1.5 0 113 0v1.5h-3z" /></svg> Meditation</h4>
                        <p className="text-gray-400 text-sm italic">{getMeditation()}</p>
                      </div>
                      <div className="p-4 bg-mystic-gold/10 rounded-xl border border-mystic-gold/20">
                        <h4 className="text-mystic-gold text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg> Practice</h4>
                        <p className="text-gray-400 text-sm italic">{getExercise()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Quiz Mode */}
              {mode === 'quiz' && currentCard && (
                <div className="text-center space-y-6">
                  <div className="mb-4">
                    <p className="text-mystic-goldDim/60 text-sm">Score: {quizScore.correct}/{quizScore.total}</p>
                  </div>

                  {/* Card Image (hidden name) */}
                  <div className="aspect-[2/3] max-w-[200px] mx-auto rounded-xl overflow-hidden border-2 border-mystic-gold/40 shadow-2xl">
                    {imagePath ? (
                      <img src={imagePath} alt="?" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-mystic-900 flex items-center justify-center">
                        <span className="text-mystic-gold text-4xl">?</span>
                      </div>
                    )}
                  </div>

                  <h3 className="font-serif text-xl text-mystic-goldDim">What card is this?</h3>

                  {/* Options */}
                  {!showAnswer ? (
                    <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                      {quizOptions.map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleQuizAnswer(option)}
                          className="px-4 py-3 bg-mystic-800/50 border border-mystic-gold/20 rounded-xl text-white hover:border-mystic-gold/50 hover:bg-mystic-800 transition-all"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className={`text-xl font-serif ${quizOptions.includes(currentCard.name) ? 'text-green-400' : 'text-red-400'}`}>
                        {currentCard.name}
                      </p>
                      <p className="text-gray-400 text-sm">{currentCard.upright}</p>
                      <button
                        onClick={generateQuiz}
                        className="px-8 py-3 bg-mystic-gold/20 border border-mystic-gold/50 text-mystic-gold rounded-xl hover:bg-mystic-gold hover:text-mystic-900 transition-all"
                      >
                        Next Card →
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Browse Mode */}
              {mode === 'browse' && (
                <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                  {ALL_CARDS.map(card => {
                    const cardImage = getTarotCardImagePath(card.name);
                    const isLearned = progress.learnedCards.includes(card.id);
                    
                    return (
                      <button
                        key={card.id}
                        onClick={() => {
                          setCurrentCard(card);
                          setMode('daily');
                        }}
                        className={`relative aspect-[2/3] rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                          isLearned ? 'border-green-500/50' : 'border-mystic-gold/20'
                        }`}
                      >
                        {cardImage ? (
                          <img src={cardImage} alt={card.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-mystic-900 flex items-center justify-center">
                            <svg className="w-3 h-3 text-mystic-gold" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0L14.59 8.41L24 12L14.59 15.59L12 24L9.41 15.59L0 12L9.41 8.41L12 0Z" /></svg>
                          </div>
                        )}
                        {isLearned && (
                          <div className="absolute top-1 right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TarotLearning;


