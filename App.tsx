
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StarBackground from './components/StarBackground';
import DrawingCanvas from './components/DrawingCanvas';
import FlipCard from './components/FlipCard';
import ParticleBurst from './components/ParticleBurst';
import ShareCard from './components/ShareCard';
import HistoryPanel from './components/HistoryPanel';
import DailyCard from './components/DailyCard';
import SpreadSelector, { SpreadType, SPREADS, SpreadIcon } from './components/SpreadSelector';
import CategorySelector, { QuestionCategory, CATEGORIES } from './components/CategorySelector';
import TarotLibrary from './components/TarotLibrary';
import OnboardingTutorial from './components/OnboardingTutorial';
import MysticalCalendar from './components/MysticalCalendar';
import ThemeSelector, { ThemeProvider, useTheme } from './components/ThemeSelector';
import { AudioProvider, AudioControls, useAudio } from './components/AudioManager';
import HistoryInsights from './components/HistoryInsights';
import FollowUpChat from './components/FollowUpChat';
import ReadingNotes from './components/ReadingNotes';
import TarotLearning from './components/TarotLearning';
import JournalExport from './components/JournalExport';
import { AppState, ReadingResult, TimeFrame, TarotCard } from './types';
import { interpretDrawing, getFinalSynthesis, generateDrawingPrompts } from './services/geminiService';
import { getTarotCardImagePath, CARD_BACK_IMAGE } from './utils/tarotImageMap';
import { saveReading, ReadingHistory, hasDailyCardToday } from './utils/historyManager';

// Animation variants for reuse
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

// --- Mystical Loading Component ---
const MYSTICAL_PHRASES = [
  "The stars are aligning...",
  "Peering into the void...",
  "Your energy is taking shape...",
  "The arcana whispers...",
  "Consulting the ancient records...",
  "Weaving the threads of fate...",
  "The mists are clearing...",
  "Sensing your vibration...",
  "Channeling the oracle..."
];

const PREPARING_PHRASES = [
  "Consulting the spirits for guidance...",
  "Forming the path...",
  "Listening to your intent...",
  "Opening the gateway..."
];

const LoadingOracle: React.FC<{ mode?: 'analyzing' | 'preparing' }> = ({ mode = 'analyzing' }) => {
  const phrases = mode === 'preparing' ? PREPARING_PHRASES : MYSTICAL_PHRASES;
  const [phrase, setPhrase] = useState(phrases[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhrase(prev => {
        const idx = Math.floor(Math.random() * phrases.length);
        return phrases[idx];
      });
    }, 2500);
    return () => clearInterval(interval);
  }, [phrases]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-4xl mx-auto animate-float-subtle px-6">
      <div className="relative w-32 h-32 mb-10">
         {/* Outer Rings - Updated Colors (Gold/Violet) */}
         <div className="absolute inset-0 rounded-full border-2 border-t-mystic-gold border-r-transparent border-b-mystic-gold border-l-transparent animate-spin duration-[3s]"></div>
         <div className="absolute inset-2 rounded-full border border-r-mystic-accent border-b-transparent border-l-mystic-accent border-t-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '4s' }}></div>
         <div className="absolute inset-4 rounded-full border border-t-white/30 border-b-white/30 border-l-transparent border-r-transparent animate-pulse" style={{ animationDuration: '2s' }}></div>
         
         {/* Central Glowing Core (No Emoji) */}
         <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 bg-mystic-gold rounded-full shadow-[0_0_25px_5px_rgba(244,215,155,0.8)] animate-pulse"></div>
         </div>
      </div>
      <h2 className="font-serif text-2xl md:text-3xl text-mystic-gold animate-pulse-slow tracking-widest leading-relaxed">{phrase}</h2>
      <p className="mt-6 text-mystic-goldDim font-serif text-xs uppercase tracking-[0.3em] opacity-70">Focus your intent...</p>
    </div>
  );
};

// --- Tarot Card Image Component ---
const TarotCardDisplay: React.FC<{ cardName: string; arcana: string; meaning: string; isReversed?: boolean }> = ({ cardName, arcana, meaning, isReversed = false }) => {
  const [imageError, setImageError] = useState(false);
  
  // Use the mapping utility to get the correct image path
  const imagePath = getTarotCardImagePath(cardName); 

  // Show fallback if no image path found or image failed to load
  const showFallback = !imagePath || imageError;

  return (
    <div className={`aspect-[2/3] bg-mystic-950 rounded-lg border-2 relative overflow-hidden group shadow-2xl transition-all duration-700 hover:scale-[1.02] ${isReversed ? 'border-red-500/50 rotate-180' : 'border-mystic-gold/50'}`}>
      {/* Reversed Badge - positioned outside rotation */}
      {isReversed && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 rotate-180">
          <span className="bg-red-900/90 text-red-200 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-red-500/50 shadow-lg">
            Reversed
          </span>
        </div>
      )}
      
      {!showFallback ? (
        <img 
          src={imagePath!} 
          alt={cardName}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover opacity-90 transition-opacity duration-500 hover:opacity-100"
        />
      ) : (
        // Fallback CSS Card
        <div className="w-full h-full relative p-4 flex flex-col items-center justify-center bg-gradient-to-b from-mystic-900 to-black">
           <div className={`absolute inset-2 border rounded-sm ${isReversed ? 'border-red-500/30' : 'border-mystic-gold/30'}`}></div>
           <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
           
           <div className={`mb-6 drop-shadow-[0_0_10px_rgba(244,215,155,0.5)] ${isReversed ? 'text-red-400/80' : 'text-mystic-gold/80'}`}>
             {arcana.includes('Major') ? (
               <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L14.39 8.26L21 9.27L16.5 14.14L17.82 21L12 17.77L6.18 21L7.5 14.14L3 9.27L9.61 8.26L12 2Z" /></svg>
             ) : (
               <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7zm2.5 11.5l-2.5 1.5-2.5-1.5V12h5v1.5zM14 22h-4v-2h4v2z"/></svg>
             )}
           </div>
           
           <h4 className={`font-serif text-2xl font-bold text-center leading-tight mb-2 drop-shadow-md ${isReversed ? 'text-red-300' : 'text-mystic-gold'}`}>
             {cardName}
           </h4>
           <div className={`w-12 h-px my-2 ${isReversed ? 'bg-red-500/50' : 'bg-mystic-gold/50'}`}></div>
           <p className={`text-[10px] uppercase tracking-widest text-center ${isReversed ? 'text-red-300/70' : 'text-mystic-goldDim'}`}>{arcana}</p>
        </div>
      )}
      
      {/* Overlay gradient for text readability if image exists */}
      {!showFallback && (
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80">
           <div className="absolute bottom-4 left-0 right-0 text-center px-2">
             <h4 className={`font-serif text-lg md:text-2xl font-bold drop-shadow-md leading-tight ${isReversed ? 'text-red-300' : 'text-mystic-gold'}`}>{cardName}</h4>
           </div>
        </div>
      )}
    </div>
  );
};


const AppContent: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.INTRO);
  const [question, setQuestion] = useState('');
  const [currentRound, setCurrentRound] = useState(0); // 0=Past, 1=Present, 2=Future
  const [readings, setReadings] = useState<ReadingResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [synthesis, setSynthesis] = useState<string>('');
  
  // New state for contextual prompts
  const [contextPrompts, setContextPrompts] = useState<string[]>([]);
  
  // New feature states
  const [showShareCard, setShowShareCard] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showDailyCard, setShowDailyCard] = useState(false);
  const [showSpreadSelector, setShowSpreadSelector] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hasNewDailyCard, setHasNewDailyCard] = useState(!hasDailyCardToday());
  
  // New enhanced features
  const [showInsights, setShowInsights] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [currentReadingId, setCurrentReadingId] = useState<string>('');
  const [showLearning, setShowLearning] = useState(false);
  const [showExport, setShowExport] = useState(false);

  // Check for first-time user
  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('mystic-ink-tutorial-complete');
    if (!hasSeenTutorial) {
      setShowOnboarding(true);
    }
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('mystic-ink-tutorial-complete', 'true');
    setShowOnboarding(false);
  };

  const handleOnboardingSkip = () => {
    localStorage.setItem('mystic-ink-tutorial-complete', 'true');
    setShowOnboarding(false);
  };
  
  // Spread and Category states
  const [selectedSpread, setSelectedSpread] = useState<SpreadType>(SPREADS[0]); // Default: Past-Present-Future
  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory | null>(null);

  const { playSound } = useAudio();

  // Dynamic timeFrames based on selected spread
  const getTimeFrames = () => {
    if (selectedSpread.id === 'past-present-future') {
      return [TimeFrame.PAST, TimeFrame.PRESENT, TimeFrame.FUTURE];
    }
    // For other spreads, use the position names
    return selectedSpread.positions.map(p => p as TimeFrame);
  };
  
  const timeFrames = getTimeFrames();

  const handleStart = async () => {
    if (!question.trim()) return;
    
    playSound('magic');
    
    // 1. Enter Preparation State
    setAppState(AppState.PREPARING);
    
    // 2. Generate Contextual Prompts based on Question and Spread
    try {
      const categoryContext = selectedCategory ? `Category: ${selectedCategory.name}` : '';
      const spreadContext = `Spread: ${selectedSpread.name} with ${selectedSpread.cardCount} cards`;
      const prompts = await generateDrawingPrompts(question, selectedSpread.cardCount, selectedSpread.positions, categoryContext);
      setContextPrompts(prompts);
      setAppState(AppState.DRAWING);
    } catch (e) {
      console.error("Failed to generate prompts", e);
      // Fallback based on spread
      const fallbackPrompts = selectedSpread.positions.map((pos, idx) => `Draw ${pos.toLowerCase()}`);
      setContextPrompts(fallbackPrompts.length > 0 ? fallbackPrompts : ["Draw the roots", "Draw the present state", "Draw the outcome"]);
      setAppState(AppState.DRAWING);
    }
  };

  const handleSpreadSelect = (spread: SpreadType, customCount?: number) => {
    if (customCount) {
      spread = { ...spread, cardCount: customCount, positions: Array.from({ length: customCount }, (_, i) => `Position ${i + 1}`) };
    }
    setSelectedSpread(spread);
    setShowSpreadSelector(false);
  };

  const handleDrawingCapture = async (base64: string) => {
    setIsProcessing(true);
    setAppState(AppState.ANALYZING);
    playSound('whoosh');

    const currentTimeFrame = timeFrames[currentRound];
    const currentPrompt = contextPrompts[currentRound];
    const existingCardNames = readings.map(r => r.card.name);

    try {
      // Simulate min wait time for the "experience"
      const [card] = await Promise.all([
        interpretDrawing(base64, question, currentTimeFrame, currentPrompt, existingCardNames),
        new Promise(resolve => setTimeout(resolve, 3000)) 
      ]);
      
      const newReading: ReadingResult = {
        timeFrame: currentTimeFrame,
        prompt: currentPrompt,
        card,
        drawingBase64: base64
      };

      setReadings(prev => [...prev, newReading]);
      setAppState(AppState.READING_SINGLE);
      setIsProcessing(false);
      playSound('reveal');
      
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
      setAppState(AppState.DRAWING); 
    }
  };

  const nextStep = async () => {
    playSound('flip');
    
    const totalCards = selectedSpread.cardCount;
    
    if (currentRound < totalCards - 1) {
      setCurrentRound(prev => prev + 1);
      setAppState(AppState.DRAWING);
    } else {
      setAppState(AppState.ANALYZING); 
      const finalSummary = await getFinalSynthesis(question, readings, selectedSpread.name, selectedCategory?.name);
      setSynthesis(finalSummary);
      
      // Auto-save to history with spread and category info
      const savedReading = saveReading(
        question, 
        readings, 
        finalSummary, 
        'full',
        selectedSpread.name,
        selectedCategory?.name
      );
      setCurrentReadingId(savedReading.id);
      
      setAppState(AppState.FINAL_SUMMARY);
      playSound('magic');
    }
  };

  const resetApp = () => {
    setAppState(AppState.INTRO);
    setQuestion('');
    setCurrentRound(0);
    setReadings([]);
    setSynthesis('');
    setContextPrompts([]);
    setSelectedSpread(SPREADS[0]);
    setSelectedCategory(null);
  };

  // Handle viewing a past reading from history
  const handleViewHistoryReading = (historyEntry: ReadingHistory) => {
    setQuestion(historyEntry.question);
    setReadings(historyEntry.readings);
    setSynthesis(historyEntry.synthesis);
    setShowHistory(false);
    setAppState(AppState.FINAL_SUMMARY);
  };

  // Render Helpers
  const renderIntro = () => (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 max-w-4xl mx-auto"
    >
      <motion.div 
        variants={fadeInUp}
        className="mb-10 p-8 rounded-full border border-mystic-gold/20 bg-mystic-900/60 backdrop-blur-md shadow-[0_0_50px_rgba(67,44,122,0.4)] relative group"
      >
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-full border border-mystic-gold/30"
        />
        <motion.svg 
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          xmlns="http://www.w3.org/2000/svg" 
          className="h-24 w-24 text-mystic-gold drop-shadow-[0_0_15px_rgba(244,215,155,0.6)]" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </motion.svg>
      </motion.div>
      
      <motion.h1 
        variants={fadeInUp}
        className="font-serif text-5xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-b from-mystic-gold to-mystic-goldDim mb-6 drop-shadow-sm tracking-widest"
      >
        MYSTIC INK
      </motion.h1>
      
      <motion.p 
        variants={fadeInUp}
        className="font-serif text-xl md:text-2xl text-mystic-accent/80 max-w-2xl mb-8 leading-relaxed tracking-wide"
      >
        Focus your energy on a burning question. <br/>
        The cards will reveal the path through your art.
      </motion.p>

      {/* Category Selector */}
      <motion.div variants={fadeInUp}>
        <CategorySelector 
          selectedCategory={selectedCategory} 
          onSelect={setSelectedCategory} 
        />
      </motion.div>

      {/* Spread Selector Button */}
      <motion.button
        variants={fadeInUp}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowSpreadSelector(true)}
        className="mb-6 px-6 py-2 border border-mystic-gold/30 rounded-full text-mystic-goldDim hover:text-mystic-gold hover:border-mystic-gold/50 transition-all flex items-center gap-3 text-sm"
      >
        <SpreadIcon icon={selectedSpread.icon || 'cards'} className="w-5 h-5" />
        <span>{selectedSpread.name}</span>
        <span className="text-mystic-gold/50">•</span>
        <span className="text-mystic-gold">{selectedSpread.cardCount} cards</span>
        <svg className="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </motion.button>
      
      <motion.div 
        variants={fadeInUp}
        className="w-full max-w-lg relative group transition-all duration-500 focus-within:scale-105"
      >
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="What seeks an answer?"
          className="w-full bg-mystic-950/50 backdrop-blur border-b-2 border-mystic-gold/30 py-4 px-6 text-2xl text-center text-white placeholder-mystic-goldDim/50 focus:outline-none focus:border-mystic-gold transition-all font-serif"
          onKeyDown={(e) => e.key === 'Enter' && handleStart()}
        />
      </motion.div>
      
      <motion.button
        variants={fadeInUp}
        whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(197,160,89,0.5)" }}
        whileTap={{ scale: 0.98 }}
        onClick={handleStart}
        disabled={!question.trim()}
        className="mt-10 px-16 py-4 bg-gradient-to-r from-mystic-goldDim to-mystic-gold text-mystic-950 font-serif font-bold text-xl rounded-sm shadow-[0_0_30px_rgba(197,160,89,0.2)] transition-all duration-500 disabled:opacity-30 disabled:cursor-not-allowed uppercase tracking-[0.2em]"
      >
        Begin Divination
      </motion.button>

    </motion.div>
  );

  const renderSingleReading = () => {
    const currentReading = readings[readings.length - 1];
    if (!currentReading) return null;

    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-8 animate-fade-in">
        <div className="text-center mb-10 animate-float-subtle">
          <h3 className="text-mystic-goldDim uppercase tracking-[0.4em] text-xs mb-3">The Revelation of the {currentReading.timeFrame}</h3>
          <h2 className="font-serif text-3xl md:text-4xl text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] italic">"{currentReading.prompt}"</h2>
        </div>

        <div className="bg-mystic-900/40 backdrop-blur-md border border-mystic-gold/20 rounded-2xl p-8 md:p-12 shadow-2xl flex flex-col md:flex-row gap-12 items-center">
          
          {/* Card Display with Flip Animation */}
          <div className="w-full md:w-1/3 flex flex-col gap-6">
             <FlipCard 
               cardName={currentReading.card.name} 
               arcana={currentReading.card.arcana}
               isReversed={currentReading.card.isReversed}
               autoFlip={true}
               flipDelay={800}
             />
             
             <div className="text-center opacity-70 hover:opacity-100 transition-opacity">
                <p className="text-[10px] uppercase tracking-widest text-mystic-goldDim/70 mb-2">Your Energy Imprint</p>
                <img src={`data:image/png;base64,${currentReading.drawingBase64}`} alt="User drawing" className="w-20 h-20 object-cover mx-auto rounded-lg border border-mystic-gold/30 bg-mystic-950 p-1" />
             </div>
          </div>

          {/* Text Interpretation */}
          <div className="w-full md:w-2/3 text-left space-y-6">
            <div>
              <h3 className={`font-serif text-4xl mb-2 ${currentReading.card.isReversed ? 'text-red-300' : 'text-mystic-gold'}`}>
                {currentReading.card.name}
                {currentReading.card.isReversed && (
                  <span className="ml-3 text-lg bg-red-900/50 text-red-200 px-3 py-1 rounded-full border border-red-500/30 align-middle">
                    Reversed
                  </span>
                )}
              </h3>
              <p className={`text-sm uppercase tracking-widest ${currentReading.card.isReversed ? 'text-red-300/70' : 'text-mystic-goldDim'}`}>{currentReading.card.arcana}</p>
            </div>
            
            <div className="h-px w-32 bg-gradient-to-r from-mystic-gold to-transparent"></div>
            
            <p className="font-serif text-xl leading-relaxed text-mystic-goldDim italic opacity-90">
              "{currentReading.card.meaning}"
            </p>
            
            <div className="bg-black/30 p-6 rounded-lg border border-white/5 mt-4">
              <p className="text-xs text-mystic-goldDim font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                 Visual Resonance
              </p>
              <p className="text-sm text-mystic-goldDim/80 leading-relaxed font-sans">{currentReading.card.visualDescription}</p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <button 
            onClick={nextStep}
            className="px-12 py-4 border border-mystic-gold text-mystic-gold font-serif font-bold text-lg rounded-sm hover:bg-mystic-gold hover:text-mystic-900 shadow-[0_0_20px_rgba(244,215,155,0.1)] hover:shadow-[0_0_40px_rgba(244,215,155,0.4)] transition-all duration-500 uppercase tracking-widest"
          >
            {currentRound < 2 ? 'Proceed' : 'Reveal Prophecy'}
          </button>
        </div>
      </div>
    );
  };

  const renderFinalSummary = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-7xl mx-auto px-4 py-8 flex flex-col h-full min-h-[85vh]"
    >
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <h2 className="font-serif text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-b from-mystic-gold to-amber-700 mb-4 drop-shadow-sm">The Prophecy</h2>
        <p className="text-2xl text-mystic-goldDim/80 font-serif italic">"{question}"</p>
      </motion.div>

      {/* Three Cards Layout with Staggered Flip Animations */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 px-4 md:px-12"
      >
        {readings.map((reading, idx) => (
          <motion.div 
            key={idx} 
            variants={fadeInUp}
            whileHover={{ y: -8, boxShadow: "0 4px 30px rgba(67,44,122,0.3)" }}
            className="bg-mystic-900/60 backdrop-blur-sm border border-mystic-gold/10 rounded-xl p-6 text-center group transition-all duration-500 flex flex-col h-full shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
          >
             <div className="text-mystic-accent text-[10px] font-bold uppercase tracking-[0.2em] mb-1">{reading.timeFrame}</div>
             <div className="text-mystic-goldDim/60 text-xs italic mb-4 font-serif">"{reading.prompt}"</div>
             
             {/* Card with Flip Animation */}
             <div className="w-32 mx-auto mb-6 shadow-xl flex-shrink-0">
                <FlipCard 
                  cardName={reading.card.name} 
                  arcana={reading.card.arcana} 
                  isReversed={reading.card.isReversed}
                  autoFlip={true}
                  flipDelay={500 + idx * 400}
                />
             </div>

             {/* Fixed Height Title Container for Alignment */}
             <div className="h-20 flex flex-col items-center justify-center mb-4">
                <h3 className={`font-serif text-2xl leading-tight ${reading.card.isReversed ? 'text-red-300' : 'text-mystic-gold'}`}>
                  {reading.card.name}
                </h3>
                {reading.card.isReversed && (
                  <span className="mt-2 text-[10px] bg-red-900/50 text-red-200 px-2 py-0.5 rounded-full border border-red-500/30">
                    Reversed
                  </span>
                )}
             </div>
             
             {/* Text Area - Expands to fill space, scrollable if too long */}
             <div className="text-sm text-mystic-goldDim/90 leading-relaxed overflow-y-auto custom-scrollbar px-2 flex-grow text-justify border-t border-white/5 pt-4 max-h-[200px]">
                {reading.card.meaning}
             </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Final Synthesis */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="mt-auto bg-gradient-to-b from-mystic-900/80 to-mystic-950 border-y border-mystic-gold/30 p-10 md:p-16 shadow-2xl relative overflow-hidden max-w-5xl mx-auto rounded-3xl w-full"
      >
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        
        <h3 className="font-serif text-3xl text-center text-mystic-gold mb-8 relative z-10 tracking-widest uppercase">Synthesis of the Oracle</h3>
        
        <p className="font-serif text-xl md:text-2xl text-mystic-goldDim leading-loose text-center relative z-10 drop-shadow-md">
          {synthesis}
        </p>
        
        <motion.div 
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="flex justify-center gap-4 mt-12 text-mystic-gold relative z-10"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0L14.59 8.41L24 12L14.59 15.59L12 24L9.41 15.59L0 12L9.41 8.41L12 0Z" /></svg>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0L14.59 8.41L24 12L14.59 15.59L12 24L9.41 15.59L0 12L9.41 8.41L12 0Z" /></svg>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0L14.59 8.41L24 12L14.59 15.59L12 24L9.41 15.59L0 12L9.41 8.41L12 0Z" /></svg>
        </motion.div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="mt-16 text-center pb-12 flex flex-wrap gap-4 justify-center"
      >
        {/* Ask Oracle Follow-up */}
        <motion.button 
          variants={fadeInUp}
          onClick={() => setShowFollowUp(true)}
          className="px-8 py-3 bg-gradient-to-r from-mystic-accent to-purple-600 text-white font-serif font-bold rounded-lg hover:shadow-[0_0_30px_rgba(157,78,221,0.4)] transition-all flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Ask Follow-up
        </motion.button>

        {/* Add Notes */}
        <motion.button 
          variants={fadeInUp}
          onClick={() => setShowNotes(true)}
          className="px-8 py-3 bg-mystic-800 border border-mystic-gold/40 text-mystic-gold font-serif font-bold rounded-lg hover:bg-mystic-gold/10 hover:shadow-[0_0_20px_rgba(255,215,0,0.2)] transition-all flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Add Notes
        </motion.button>

        {/* Share */}
        <motion.button 
          variants={fadeInUp}
          onClick={() => setShowShareCard(true)}
          className="px-8 py-3 bg-gradient-to-r from-mystic-gold to-yellow-600 text-mystic-900 font-serif font-bold rounded-lg hover:shadow-[0_0_30px_rgba(255,215,0,0.4)] transition-all flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share Reading
        </motion.button>
        
        <motion.button 
          variants={fadeInUp}
          onClick={resetApp}
          className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-serif font-medium tracking-tighter text-white bg-transparent rounded-lg border border-mystic-gold/30 hover:border-mystic-gold/50"
        >
          <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-mystic-gold rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
          <span className="relative text-mystic-goldDim group-hover:text-white transition-colors duration-300 uppercase tracking-widest text-sm">Ask Another Question</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="min-h-screen text-white relative overflow-x-hidden font-sans selection:bg-mystic-gold selection:text-black">
      <StarBackground />
      
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-[60] p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo/Home */}
          <button 
            onClick={resetApp}
            className="font-serif text-mystic-gold/80 hover:text-mystic-gold transition-colors tracking-widest text-sm flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0L14.59 8.41L24 12L14.59 15.59L12 24L9.41 15.59L0 12L9.41 8.41L12 0Z" /></svg>
            <span className="hidden sm:inline">MYSTIC INK</span>
          </button>
          
          {/* Nav Actions */}
          <div className="flex items-center gap-2">
            {/* Daily Card Button */}
            <button
              onClick={() => { setShowDailyCard(true); setHasNewDailyCard(false); }}
              className="relative w-10 h-10 rounded-full bg-mystic-900/60 backdrop-blur border border-mystic-gold/20 flex items-center justify-center text-mystic-goldDim hover:text-mystic-gold hover:border-mystic-gold/40 transition-all group"
              title="Daily Oracle"
            >
              <svg className="w-5 h-5 group-hover:rotate-45 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0L14.59 8.41L24 12L14.59 15.59L12 24L9.41 15.59L0 12L9.41 8.41L12 0Z" />
              </svg>
              {hasNewDailyCard && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-mystic-accent rounded-full animate-pulse"></span>
              )}
            </button>

            {/* Calendar Button */}
            <button
              onClick={() => setShowCalendar(true)}
              className="w-10 h-10 rounded-full bg-mystic-900/60 backdrop-blur border border-mystic-gold/20 flex items-center justify-center text-mystic-goldDim hover:text-mystic-gold hover:border-mystic-gold/40 transition-all"
              title="Mystic Calendar"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 7.5V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h3.5M21 7.5H3m18 0v3M12 17a5 5 0 100-10 5 5 0 000 10z" />
              </svg>
            </button>
            
            {/* Library Button */}
            <button
              onClick={() => setShowLibrary(true)}
              className="w-10 h-10 rounded-full bg-mystic-900/60 backdrop-blur border border-mystic-gold/20 flex items-center justify-center text-mystic-goldDim hover:text-mystic-gold hover:border-mystic-gold/40 transition-all"
              title="Tarot Library"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </button>
            
            {/* History Button */}
            <button
              onClick={() => setShowHistory(true)}
              className="w-10 h-10 rounded-full bg-mystic-900/60 backdrop-blur border border-mystic-gold/20 flex items-center justify-center text-mystic-goldDim hover:text-mystic-gold hover:border-mystic-gold/40 transition-all"
              title="Reading History"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </button>

            {/* Insights Button */}
            <button
              onClick={() => setShowInsights(true)}
              className="w-10 h-10 rounded-full bg-mystic-900/60 backdrop-blur border border-mystic-gold/20 flex items-center justify-center text-mystic-goldDim hover:text-mystic-gold hover:border-mystic-gold/40 transition-all"
              title="Energy Insights"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </button>

            {/* Learning Mode Button */}
            <button
              onClick={() => setShowLearning(true)}
              className="w-10 h-10 rounded-full bg-mystic-900/60 backdrop-blur border border-mystic-gold/20 flex items-center justify-center text-mystic-goldDim hover:text-mystic-gold hover:border-mystic-gold/40 transition-all"
              title="Tarot Academy"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </button>

            {/* Export Button */}
            <button
              onClick={() => setShowExport(true)}
              className="w-10 h-10 rounded-full bg-mystic-900/60 backdrop-blur border border-mystic-gold/20 flex items-center justify-center text-mystic-goldDim hover:text-mystic-gold hover:border-mystic-gold/40 transition-all"
              title="Export Journal"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>

            {/* Theme Button */}
            <button
              onClick={() => setShowThemeSelector(true)}
              className="w-10 h-10 rounded-full bg-mystic-900/60 backdrop-blur border border-mystic-gold/20 flex items-center justify-center text-mystic-goldDim hover:text-mystic-gold hover:border-mystic-gold/40 transition-all"
              title="Change Theme"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </button>

            {/* Help Button */}
            <button
              onClick={() => setShowOnboarding(true)}
              className="w-10 h-10 rounded-full bg-mystic-900/60 backdrop-blur border border-mystic-gold/20 flex items-center justify-center text-mystic-goldDim hover:text-mystic-gold hover:border-mystic-gold/40 transition-all"
              title="Tutorial"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </div>
      </nav>
      
      {/* Main Content Area */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen w-full pt-16">
        {appState === AppState.INTRO && renderIntro()}
        
        {appState === AppState.PREPARING && <LoadingOracle mode="preparing" />}

        {appState === AppState.DRAWING && (
          <div className="w-full max-w-4xl mx-auto px-4 animate-fade-in flex flex-col items-center">
            
            {/* Improved Header Layout for Prompts */}
            <div className="text-center mb-8 relative w-full">
               <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-mystic-gold/20 to-transparent -z-10"></div>
               
               <div className="inline-block bg-mystic-950 px-6 py-2 relative">
                  <span className="text-mystic-accent/60 text-[10px] font-serif uppercase tracking-[0.3em] block mb-2">
                    {selectedSpread.positions[currentRound] || timeFrames[currentRound]} • Step {currentRound + 1}/{selectedSpread.cardCount}
                  </span>
                  <h2 className="font-serif text-2xl md:text-3xl text-mystic-gold leading-relaxed drop-shadow-[0_0_15px_rgba(244,215,155,0.3)] max-w-2xl mx-auto">
                    "{contextPrompts[currentRound]}"
                  </h2>
               </div>
            </div>
            
            <DrawingCanvas 
              onCapture={handleDrawingCapture} 
              isProcessing={isProcessing}
              timeFrame={contextPrompts[currentRound]} 
            />
          </div>
        )}

        {appState === AppState.ANALYZING && <LoadingOracle mode="analyzing" />}

        {appState === AppState.READING_SINGLE && renderSingleReading()}

        {appState === AppState.FINAL_SUMMARY && renderFinalSummary()}
      </main>

      {/* Audio Controls */}
      <AudioControls />

      {/* Modals */}
      {showShareCard && readings.length > 0 && (
        <ShareCard
          question={question}
          readings={readings}
          synthesis={synthesis}
          onClose={() => setShowShareCard(false)}
        />
      )}

      {showHistory && (
        <HistoryPanel
          isOpen={showHistory}
          onClose={() => setShowHistory(false)}
          onViewReading={handleViewHistoryReading}
          onOpenNotes={(id) => { setCurrentReadingId(id); setShowNotes(true); }}
        />
      )}

      {showDailyCard && (
        <DailyCard
          onClose={() => setShowDailyCard(false)}
          playSound={playSound}
        />
      )}

      {showSpreadSelector && (
        <SpreadSelector
          onSelect={handleSpreadSelect}
          onClose={() => setShowSpreadSelector(false)}
        />
      )}

      {showLibrary && (
        <TarotLibrary
          isOpen={showLibrary}
          onClose={() => setShowLibrary(false)}
        />
      )}

      {showCalendar && (
        <MysticalCalendar
          isOpen={showCalendar}
          onClose={() => setShowCalendar(false)}
        />
      )}

      {showThemeSelector && (
        <ThemeSelector
          isOpen={showThemeSelector}
          onClose={() => setShowThemeSelector(false)}
        />
      )}

      {showOnboarding && (
        <OnboardingTutorial
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
      )}

      {/* History Insights Modal */}
      <HistoryInsights
        isOpen={showInsights}
        onClose={() => setShowInsights(false)}
      />

      {/* Follow-up Chat Modal */}
      <FollowUpChat
        isOpen={showFollowUp}
        onClose={() => setShowFollowUp(false)}
        question={question}
        readings={readings}
        synthesis={synthesis}
      />

      {/* Reading Notes Modal */}
      <ReadingNotes
        isOpen={showNotes}
        onClose={() => setShowNotes(false)}
        readingId={currentReadingId}
        onSave={(notes) => console.log('Notes saved:', notes)}
      />

      {/* Tarot Learning Modal */}
      <TarotLearning
        isOpen={showLearning}
        onClose={() => setShowLearning(false)}
      />

      {/* Journal Export Modal */}
      <JournalExport
        isOpen={showExport}
        onClose={() => setShowExport(false)}
      />

      {/* Decorative Overlay Vignette - Lighter Vignette */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(19,9,36,0.6)_100%)] z-50"></div>
    </div>
  );
};

// Wrap with AudioProvider and ThemeProvider
const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AudioProvider>
        <AppContent />
      </AudioProvider>
    </ThemeProvider>
  );
};

export default App;
