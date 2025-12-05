import React, { useState, useEffect } from 'react';
import { TarotCard } from '../types';
import { getDailyCard, saveDailyCard, hasDailyCardToday } from '../utils/historyManager';
import { getTarotCardImagePath, CARD_BACK_IMAGE } from '../utils/tarotImageMap';
import { getDailyCardReading } from '../services/geminiService';
import ParticleBurst from './ParticleBurst';

interface DailyCardProps {
  onClose: () => void;
  playSound?: (sound: 'flip' | 'reveal' | 'magic') => void;
}

const DailyCard: React.FC<DailyCardProps> = ({ onClose, playSound }) => {
  const [card, setCard] = useState<TarotCard | null>(null);
  const [message, setMessage] = useState<string>('');
  const [dateMeaning, setDateMeaning] = useState<string>('');
  const [isRevealed, setIsRevealed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [hasDrawnToday, setHasDrawnToday] = useState(false);

  const today = new Date();
  const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
  const monthDay = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  useEffect(() => {
    // Check if already drawn today
    const existingCard = getDailyCard();
    if (existingCard) {
      setCard(existingCard.card);
      setMessage(existingCard.message);
      setDateMeaning(existingCard.dateMeaning || '');
      setIsRevealed(true);
      setHasDrawnToday(true);
    }
  }, []);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const drawCard = async () => {
    if (hasDrawnToday) return;
    
    setIsLoading(true);
    
    try {
      const result = await getDailyCardReading();
      setCard(result.card);
      setMessage(result.message);
      setDateMeaning(result.dateMeaning);
      
      // Save to localStorage
      saveDailyCard(result.card, result.message, result.dateMeaning);
      setHasDrawnToday(true);
      
      // Delay reveal for animation
      setTimeout(() => {
        setIsRevealed(true);
        setShowParticles(true);
        playSound?.('reveal');
      }, 500);
      
    } catch (error) {
      console.error('Failed to draw daily card:', error);
      // Fallback card
      const fallbackCard: TarotCard = {
        name: 'The Star',
        arcana: 'Major Arcana',
        meaning: 'Hope shines bright today. Trust in the universe and your path.',
        visualDescription: 'A figure pours water under a starlit sky.',
        isReversed: false,
      };
      const fallbackDateMeaning = 'Today carries mystical energy of renewal and hope.';
      setCard(fallbackCard);
      setMessage('The cosmos whispers of hope and renewal. Let your inner light guide you through this day.');
      setDateMeaning(fallbackDateMeaning);
      saveDailyCard(fallbackCard, 'The cosmos whispers of hope and renewal.', fallbackDateMeaning);
      setHasDrawnToday(true);
      setTimeout(() => {
        setIsRevealed(true);
        setShowParticles(true);
      }, 500);
    } finally {
      setIsLoading(false);
    }
  };

  const imagePath = card ? getTarotCardImagePath(card.name) : null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto py-8">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose}></div>
      
      <div className="relative w-full max-w-lg mx-4 my-auto">
        
        {/* Close Button - More Visible */}
        <button 
          onClick={onClose}
          className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-mystic-900 border-2 border-mystic-gold/50 flex items-center justify-center text-mystic-gold hover:bg-mystic-gold hover:text-mystic-900 transition-all z-50 shadow-lg group"
          title="Close (ESC)"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="bg-gradient-to-b from-mystic-900 via-mystic-950 to-black rounded-2xl border border-mystic-gold/40 p-6 md:p-8 shadow-2xl relative overflow-hidden">
          
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
          
          {/* Header */}
          <div className="text-center mb-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-mystic-gold/10 rounded-full border border-mystic-gold/30 mb-4">
              {/* Star icon instead of sun emoji */}
              <svg className="w-5 h-5 text-mystic-gold" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0L14.59 8.41L24 12L14.59 15.59L12 24L9.41 15.59L0 12L9.41 8.41L12 0Z" />
              </svg>
              <span className="text-mystic-gold text-xs uppercase tracking-widest font-bold">Daily Oracle</span>
            </div>
            <h2 className="font-serif text-2xl md:text-3xl text-white mb-2">
              {isRevealed ? "Today's Guidance" : "Draw Your Daily Card"}
            </h2>
            <p className="text-mystic-gold/80 text-sm font-serif">
              {dayName}, {monthDay}
            </p>
          </div>

          {/* Date Meaning Section */}
          {isRevealed && dateMeaning && (
            <div className="bg-mystic-800/30 rounded-xl p-4 mb-6 border border-mystic-gold/10 animate-fade-in relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-mystic-accent" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span className="text-mystic-accent text-[10px] uppercase tracking-widest font-bold">Today's Mystical Energy</span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed font-serif italic">
                {dateMeaning}
              </p>
            </div>
          )}

          {/* Card Display */}
          <div className="relative flex justify-center mb-6 z-10">
            <div 
              className={`relative w-40 md:w-48 aspect-[2/3] cursor-pointer transition-all duration-700 ${!isRevealed && !hasDrawnToday ? 'hover:scale-105 hover:shadow-[0_0_40px_rgba(255,215,0,0.3)]' : ''}`}
              style={{ perspective: '1000px' }}
              onClick={() => !isRevealed && !hasDrawnToday && !isLoading && drawCard()}
            >
              <div
                className="w-full h-full"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: isRevealed ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  transition: 'transform 0.8s cubic-bezier(0.4, 0.2, 0.2, 1)',
                }}
              >
                {/* Card Back */}
                <div
                  className="absolute inset-0 rounded-xl overflow-hidden border-2 border-mystic-gold/40 shadow-2xl"
                  style={{
                    backfaceVisibility: 'hidden',
                  }}
                >
                  <img 
                    src={CARD_BACK_IMAGE} 
                    alt="Card Back" 
                    className="w-full h-full object-cover"
                  />
                  {!hasDrawnToday && !isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <div className="text-center">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-full border-2 border-mystic-gold/50 flex items-center justify-center animate-pulse">
                          <svg className="w-6 h-6 text-mystic-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                          </svg>
                        </div>
                        <span className="text-mystic-gold text-sm font-serif tracking-widest uppercase">
                          Tap to Reveal
                        </span>
                      </div>
                    </div>
                  )}
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                      <div className="text-center">
                        <div className="w-10 h-10 border-2 border-mystic-gold border-t-transparent rounded-full animate-spin mb-3"></div>
                        <span className="text-mystic-gold/70 text-xs">Consulting the stars...</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Front */}
                <div
                  className={`absolute inset-0 rounded-xl overflow-hidden border-2 shadow-2xl ${card?.isReversed ? 'border-red-500/50' : 'border-mystic-gold/50'}`}
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: card?.isReversed ? 'rotateY(180deg) rotateZ(180deg)' : 'rotateY(180deg)',
                  }}
                >
                  {imagePath ? (
                    <img 
                      src={imagePath} 
                      alt={card?.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-b from-mystic-900 to-black flex flex-col items-center justify-center p-4">
                      <svg className="w-12 h-12 text-mystic-gold mb-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0L14.59 8.41L24 12L14.59 15.59L12 24L9.41 15.59L0 12L9.41 8.41L12 0Z" />
                      </svg>
                      <span className="font-serif text-mystic-gold text-center">{card?.name}</span>
                    </div>
                  )}
                  
                  {/* Card name overlay */}
                  {imagePath && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent">
                      <div className="absolute bottom-3 left-0 right-0 text-center">
                        <h4 className={`font-serif text-lg font-bold ${card?.isReversed ? 'text-red-300' : 'text-mystic-gold'}`}>
                          {card?.name}
                        </h4>
                        {card?.isReversed && (
                          <span className="text-[10px] text-red-400 uppercase tracking-wider">Reversed</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Particle Effect */}
              <ParticleBurst trigger={showParticles} onComplete={() => setShowParticles(false)} />
            </div>
          </div>

          {/* Message */}
          {isRevealed && card && (
            <div className="animate-fade-in space-y-4 relative z-10">
              <div className="text-center">
                <h3 className={`font-serif text-2xl md:text-3xl ${card.isReversed ? 'text-red-300' : 'text-mystic-gold'}`}>
                  {card.name}
                </h3>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <p className="text-mystic-goldDim/60 text-xs uppercase tracking-widest">{card.arcana}</p>
                  {card.isReversed && (
                    <span className="text-xs bg-red-900/50 text-red-200 px-2 py-0.5 rounded-full border border-red-500/30">
                      Reversed
                    </span>
                  )}
                </div>
              </div>
              
              <div className="h-px w-24 mx-auto bg-gradient-to-r from-transparent via-mystic-gold/50 to-transparent"></div>
              
              <p className="font-serif text-gray-200 text-center leading-relaxed italic text-lg">
                "{message}"
              </p>
              
              <div className="bg-black/30 rounded-lg p-4 mt-4 border border-white/5">
                <p className="text-[10px] text-mystic-goldDim/50 uppercase tracking-widest text-center mb-2">Card Imagery</p>
                <p className="text-xs text-mystic-goldDim/70 text-center leading-relaxed">
                  {card.visualDescription}
                </p>
              </div>
            </div>
          )}

          {/* Already drawn message */}
          {hasDrawnToday && !isRevealed && (
            <div className="text-center text-mystic-goldDim/60 text-sm animate-fade-in relative z-10">
              <p>Revealing your card...</p>
            </div>
          )}

          {/* Footer with close hint */}
          <div className="mt-6 pt-4 border-t border-mystic-gold/10 text-center relative z-10">
            <button
              onClick={onClose}
              className="text-mystic-goldDim/50 hover:text-mystic-gold text-xs uppercase tracking-widest transition-colors"
            >
              Press ESC or click outside to close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyCard;
