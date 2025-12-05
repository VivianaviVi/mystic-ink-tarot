import React, { useState, useEffect } from 'react';
import { getTarotCardImagePath, CARD_BACK_IMAGE } from '../utils/tarotImageMap';
import ParticleBurst from './ParticleBurst';

interface FlipCardProps {
  cardName: string;
  arcana: string;
  isReversed?: boolean;
  autoFlip?: boolean;
  flipDelay?: number;
  onFlipComplete?: () => void;
}

const FlipCard: React.FC<FlipCardProps> = ({ 
  cardName, 
  arcana, 
  isReversed = false,
  autoFlip = true,
  flipDelay = 500,
  onFlipComplete
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const imagePath = getTarotCardImagePath(cardName);
  const showFallback = !imagePath || imageError;

  useEffect(() => {
    if (autoFlip) {
      const timer = setTimeout(() => {
        setIsFlipped(true);
        setShowParticles(true);
        onFlipComplete?.();
      }, flipDelay);
      return () => clearTimeout(timer);
    }
  }, [autoFlip, flipDelay, onFlipComplete]);

  const handleClick = () => {
    if (!isFlipped) {
      setIsFlipped(true);
      setShowParticles(true);
      onFlipComplete?.();
    }
  };

  return (
    <div 
      className="relative w-full cursor-pointer group"
      style={{ perspective: '1000px' }}
      onClick={handleClick}
    >
      {/* Floating animation wrapper */}
      <div className={`${isFlipped ? 'animate-float-card hover:scale-105' : 'hover:scale-110'} transition-transform duration-500`}>
        
        {/* 3D Flip Container */}
        <div 
          className="relative w-full aspect-[2/3]"
          style={{ 
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transition: 'transform 0.8s cubic-bezier(0.4, 0.2, 0.2, 1)',
          }}
        >
          {/* Card Back - faces viewer initially */}
          <div 
            className="absolute inset-0 rounded-xl overflow-hidden shadow-2xl border-2 border-mystic-gold/30"
            style={{ 
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          >
            <img 
              src={CARD_BACK_IMAGE} 
              alt="Card Back" 
              className="w-full h-full object-cover"
            />
            {/* Shimmer effect on card back */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" 
                 style={{ backgroundSize: '200% 100%' }} />
            
            {/* Glow effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 bg-mystic-gold/10 animate-pulse" />
            </div>
            
            {/* Click hint */}
            {!isFlipped && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <span className="text-mystic-gold text-sm font-serif animate-pulse tracking-widest uppercase drop-shadow-lg">
                  Click to Reveal
                </span>
              </div>
            )}
          </div>

          {/* Card Front - initially hidden (rotated 180deg) */}
          <div 
            className={`absolute inset-0 rounded-xl overflow-hidden shadow-2xl border-2 ${isReversed ? 'border-red-500/50' : 'border-mystic-gold/50'}`}
            style={{ 
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: isReversed ? 'rotateY(180deg) rotateZ(180deg)' : 'rotateY(180deg)',
            }}
          >
            {!showFallback ? (
              <img 
                src={imagePath!} 
                alt={cardName}
                onError={() => setImageError(true)}
                className="w-full h-full object-cover"
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
                
                <h4 className={`font-serif text-xl font-bold text-center leading-tight mb-2 drop-shadow-md ${isReversed ? 'text-red-300' : 'text-mystic-gold'}`}>
                  {cardName}
                </h4>
                <div className={`w-12 h-px my-2 ${isReversed ? 'bg-red-500/50' : 'bg-mystic-gold/50'}`}></div>
                <p className={`text-[10px] uppercase tracking-widest text-center ${isReversed ? 'text-red-300/70' : 'text-mystic-goldDim'}`}>{arcana}</p>
              </div>
            )}
            
            {/* Card name overlay */}
            {!showFallback && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent">
                <div className="absolute bottom-4 left-0 right-0 text-center px-2">
                  <h4 className={`font-serif text-lg font-bold drop-shadow-lg ${isReversed ? 'text-red-300' : 'text-mystic-gold'}`}>
                    {cardName}
                  </h4>
                  {isReversed && (
                    <span className="inline-block mt-1 text-[10px] bg-red-900/80 text-red-200 px-2 py-0.5 rounded-full border border-red-500/50">
                      Reversed
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Particle Burst Effect */}
      <ParticleBurst trigger={showParticles} onComplete={() => setShowParticles(false)} />
      
      {/* Glow ring when flipped */}
      {isFlipped && (
        <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-mystic-gold/0 via-mystic-gold/20 to-mystic-gold/0 animate-pulse opacity-50 -z-10" />
      )}
    </div>
  );
};

export default FlipCard;

