import React, { useState } from 'react';

export interface SpreadType {
  id: string;
  name: string;
  nameCN: string;
  description: string;
  cardCount: number;
  positions: string[];
  icon: string;
}

export const SPREADS: SpreadType[] = [
  {
    id: 'past-present-future',
    name: 'Past-Present-Future',
    nameCN: 'Timeline',
    description: 'Classic 3-card spread for timeline insights',
    cardCount: 3,
    positions: ['Past', 'Present', 'Future'],
    icon: 'hourglass',
  },
  {
    id: 'yes-no',
    name: 'Yes or No',
    nameCN: 'Quick Answer',
    description: 'Single card for quick decisions',
    cardCount: 1,
    positions: ['Answer'],
    icon: 'scale',
  },
  {
    id: 'love',
    name: 'Love Triangle',
    nameCN: 'Romance',
    description: 'Explore romantic connections',
    cardCount: 3,
    positions: ['You', 'Partner', 'Relationship'],
    icon: 'heart',
  },
  {
    id: 'celtic-cross',
    name: 'Celtic Cross',
    nameCN: 'Deep Reading',
    description: 'Deep 10-card comprehensive reading',
    cardCount: 10,
    positions: [
      'Present Situation',
      'Challenge',
      'Past Foundation',
      'Recent Past',
      'Best Outcome',
      'Near Future',
      'Your Approach',
      'External Influences',
      'Hopes & Fears',
      'Final Outcome'
    ],
    icon: 'cross',
  },
  {
    id: 'career',
    name: 'Career Path',
    nameCN: 'Work Guidance',
    description: '5-card spread for work decisions',
    cardCount: 5,
    positions: ['Current Position', 'Obstacles', 'Hidden Factors', 'Advice', 'Outcome'],
    icon: 'briefcase',
  },
  {
    id: 'custom',
    name: 'Custom Spread',
    nameCN: 'Custom',
    description: 'Choose your own card count',
    cardCount: 0,
    positions: [],
    icon: 'cards',
  },
];

// SVG Icon component for spreads
const SpreadIcon: React.FC<{ icon: string; className?: string }> = ({ icon, className = "w-6 h-6" }) => {
  const icons: Record<string, React.ReactNode> = {
    hourglass: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3h14M5 21h14M7 3v3a5 5 0 005 5 5 5 0 005-5V3M7 21v-3a5 5 0 015-5 5 5 0 015 5v3"/>
      </svg>
    ),
    scale: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M3 6l3 9h6l3-9M15 6l3 9h3M3 15h6M15 15h6"/>
      </svg>
    ),
    heart: (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
    ),
    cross: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v20M8 6h8M5 12h14"/>
      </svg>
    ),
    briefcase: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
      </svg>
    ),
    cards: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2zM8 4h12a2 2 0 012 2v10"/>
      </svg>
    ),
  };
  
  return <>{icons[icon] || icons.cards}</>;
};

interface SpreadSelectorProps {
  onSelect: (spread: SpreadType, customCount?: number) => void;
  onClose: () => void;
}

const SpreadSelector: React.FC<SpreadSelectorProps> = ({ onSelect, onClose }) => {
  const [selectedSpread, setSelectedSpread] = useState<SpreadType | null>(null);
  const [customCount, setCustomCount] = useState(3);
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleSelect = (spread: SpreadType) => {
    if (spread.id === 'custom') {
      setShowCustomInput(true);
      setSelectedSpread(spread);
    } else {
      setSelectedSpread(spread);
    }
  };

  const handleConfirm = () => {
    if (!selectedSpread) return;
    
    if (selectedSpread.id === 'custom') {
      const customSpread: SpreadType = {
        ...selectedSpread,
        cardCount: customCount,
        positions: Array.from({ length: customCount }, (_, i) => `Card ${i + 1}`),
      };
      onSelect(customSpread, customCount);
    } else {
      onSelect(selectedSpread);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto py-8">
      <div className="absolute inset-0" onClick={onClose}></div>
      
      <div className="relative w-full max-w-2xl mx-4 my-auto">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-mystic-900 border-2 border-mystic-gold/50 flex items-center justify-center text-mystic-gold hover:bg-mystic-gold hover:text-mystic-900 transition-all z-50 shadow-lg"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="bg-gradient-to-b from-mystic-900 via-mystic-950 to-black rounded-2xl border border-mystic-gold/40 p-6 md:p-8 shadow-2xl">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="font-serif text-3xl text-mystic-gold mb-2">Choose Your Spread</h2>
            <p className="text-mystic-goldDim/60 text-sm">Select a reading layout</p>
          </div>

          {/* Spread Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {SPREADS.map((spread) => (
              <button
                key={spread.id}
                onClick={() => handleSelect(spread)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 text-left group ${
                  selectedSpread?.id === spread.id
                    ? 'border-mystic-gold bg-mystic-gold/10 shadow-[0_0_20px_rgba(255,215,0,0.2)]'
                    : 'border-mystic-gold/20 hover:border-mystic-gold/50 bg-mystic-900/50'
                }`}
              >
                <div className="mb-2 text-mystic-goldDim"><SpreadIcon icon={spread.icon} className="w-6 h-6" /></div>
                <h3 className={`font-serif text-lg mb-1 ${
                  selectedSpread?.id === spread.id ? 'text-mystic-gold' : 'text-white'
                }`}>
                  {spread.name}
                </h3>
                <p className="text-mystic-goldDim/50 text-xs mb-2">{spread.nameCN}</p>
                <p className="text-gray-400 text-xs leading-relaxed">{spread.description}</p>
                {spread.cardCount > 0 && (
                  <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 bg-mystic-800/50 rounded-full">
                    <span className="text-mystic-gold text-xs">{spread.cardCount}</span>
                    <span className="text-gray-500 text-xs">cards</span>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Custom Count Input */}
          {showCustomInput && selectedSpread?.id === 'custom' && (
            <div className="mb-8 p-4 bg-mystic-800/30 rounded-xl border border-mystic-gold/20 animate-fade-in">
              <label className="block text-mystic-goldDim text-sm mb-3">
                How many cards would you like to draw?
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={customCount}
                  onChange={(e) => setCustomCount(Number(e.target.value))}
                  className="flex-1 h-2 bg-mystic-800 rounded-lg appearance-none cursor-pointer accent-mystic-gold"
                />
                <div className="w-16 h-12 flex items-center justify-center bg-mystic-900 rounded-lg border border-mystic-gold/30">
                  <span className="text-mystic-gold text-xl font-bold">{customCount}</span>
                </div>
              </div>
            </div>
          )}

          {/* Selected Spread Details */}
          {selectedSpread && selectedSpread.id !== 'custom' && (
            <div className="mb-6 p-4 bg-mystic-800/30 rounded-xl border border-mystic-gold/20 animate-fade-in">
              <h4 className="text-mystic-gold text-sm font-bold mb-3 uppercase tracking-widest">Card Positions</h4>
              <div className="flex flex-wrap gap-2">
                {selectedSpread.positions.map((pos, idx) => (
                  <span 
                    key={idx}
                    className="px-3 py-1 bg-mystic-900/80 rounded-full text-xs text-gray-300 border border-mystic-gold/10"
                  >
                    {idx + 1}. {pos}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Confirm Button */}
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 py-3 border border-mystic-gold/30 text-mystic-goldDim rounded-lg hover:bg-mystic-gold/10 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedSpread}
              className="flex-1 py-3 bg-gradient-to-r from-mystic-gold to-yellow-600 text-mystic-900 font-bold rounded-lg hover:shadow-[0_0_30px_rgba(255,215,0,0.4)] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Begin Reading
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { SpreadIcon };
export default SpreadSelector;

