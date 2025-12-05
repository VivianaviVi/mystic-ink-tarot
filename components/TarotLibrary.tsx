import React, { useState, useMemo } from 'react';
import { ALL_CARDS, MAJOR_ARCANA, MINOR_ARCANA, SUITS, TarotCardInfo } from '../data/tarotData';
import { getTarotCardImagePath } from '../utils/tarotImageMap';

interface TarotLibraryProps {
  isOpen: boolean;
  onClose: () => void;
}

type FilterType = 'all' | 'major' | 'wands' | 'cups' | 'swords' | 'pentacles';

const TarotLibrary: React.FC<TarotLibraryProps> = ({ isOpen, onClose }) => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedCard, setSelectedCard] = useState<TarotCardInfo | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCards = useMemo(() => {
    let cards = ALL_CARDS;
    
    switch (filter) {
      case 'major':
        cards = MAJOR_ARCANA;
        break;
      case 'wands':
        cards = MINOR_ARCANA.filter(c => c.suit === 'Wands');
        break;
      case 'cups':
        cards = MINOR_ARCANA.filter(c => c.suit === 'Cups');
        break;
      case 'swords':
        cards = MINOR_ARCANA.filter(c => c.suit === 'Swords');
        break;
      case 'pentacles':
        cards = MINOR_ARCANA.filter(c => c.suit === 'Pentacles');
        break;
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      cards = cards.filter(c => 
        c.name.toLowerCase().includes(query) || 
        c.nameCN.includes(query)
      );
    }
    
    return cards;
  }, [filter, searchQuery]);

  if (!isOpen) return null;

  const filters: { id: FilterType; label: string; labelCN: string }[] = [
    { id: 'all', label: 'All', labelCN: 'All Cards' },
    { id: 'major', label: 'Major', labelCN: 'Major Arcana' },
    { id: 'wands', label: 'Wands', labelCN: 'Wands' },
    { id: 'cups', label: 'Cups', labelCN: 'Cups' },
    { id: 'swords', label: 'Swords', labelCN: 'Swords' },
    { id: 'pentacles', label: 'Pentacles', labelCN: 'Pentacles' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={onClose}></div>
      
      {/* Main Panel */}
      <div className="relative w-full h-full flex flex-col bg-gradient-to-b from-mystic-900 via-mystic-950 to-black overflow-hidden">
        
        {/* Header */}
        <div className="flex-shrink-0 p-6 border-b border-mystic-gold/20">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <h2 className="font-serif text-3xl text-mystic-gold">Tarot Library</h2>
              <p className="text-mystic-goldDim/60 text-sm mt-1">Complete 78-Card Collection</p>
            </div>
            <button 
              onClick={onClose}
              className="w-12 h-12 rounded-full bg-mystic-800/50 border border-mystic-gold/30 flex items-center justify-center text-mystic-gold hover:bg-mystic-gold hover:text-mystic-900 transition-all"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex-shrink-0 p-4 border-b border-mystic-gold/10 bg-mystic-950/50">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4">
            {/* Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {filters.map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all ${
                    filter === f.id
                      ? 'bg-mystic-gold text-mystic-900 font-bold'
                      : 'bg-mystic-800/50 text-mystic-goldDim hover:bg-mystic-800'
                  }`}
                >
                  {f.labelCN}
                </button>
              ))}
            </div>
            
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-mystic-goldDim/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search cards..."
                  className="w-full pl-10 pr-4 py-2 bg-mystic-800/50 border border-mystic-gold/20 rounded-lg text-white placeholder-mystic-goldDim/50 focus:outline-none focus:border-mystic-gold/50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {filteredCards.map((card) => {
                const imagePath = getTarotCardImagePath(card.name);
                return (
                  <button
                    key={card.id}
                    onClick={() => setSelectedCard(card)}
                    className="group flex flex-col items-center p-2 rounded-xl hover:bg-mystic-800/30 transition-all"
                  >
                    <div className="w-full aspect-[2/3] rounded-lg overflow-hidden border-2 border-mystic-gold/20 group-hover:border-mystic-gold/50 transition-all shadow-lg group-hover:shadow-[0_0_20px_rgba(255,215,0,0.2)]">
                      {imagePath ? (
                        <img src={imagePath} alt={card.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-mystic-900 flex items-center justify-center">
                          <svg className="w-6 h-6 text-mystic-gold" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0L14.59 8.41L24 12L14.59 15.59L12 24L9.41 15.59L0 12L9.41 8.41L12 0Z" /></svg>
                        </div>
                      )}
                    </div>
                    <p className="mt-2 text-xs text-center text-mystic-goldDim group-hover:text-mystic-gold transition-colors line-clamp-2">
                      {card.name}
                    </p>
                  </button>
                );
              })}
            </div>
            
            {filteredCards.length === 0 && (
              <div className="text-center py-12">
                <p className="text-mystic-goldDim/50">No cards found</p>
              </div>
            )}
          </div>
        </div>

        {/* Card Detail Modal */}
        {selectedCard && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in z-10">
            <div className="relative w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
              <button
                onClick={() => setSelectedCard(null)}
                className="absolute top-2 right-2 w-10 h-10 rounded-full bg-mystic-900 border border-mystic-gold/30 flex items-center justify-center text-mystic-gold hover:bg-mystic-gold hover:text-mystic-900 transition-all z-20"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="bg-gradient-to-b from-mystic-900 to-mystic-950 rounded-2xl border border-mystic-gold/30 p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Card Image */}
                  <div className="w-full md:w-1/3 flex-shrink-0">
                    <div className="aspect-[2/3] rounded-xl overflow-hidden border-2 border-mystic-gold/40 shadow-2xl">
                      {getTarotCardImagePath(selectedCard.name) ? (
                        <img 
                          src={getTarotCardImagePath(selectedCard.name)!} 
                          alt={selectedCard.name} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <div className="w-full h-full bg-mystic-900 flex flex-col items-center justify-center">
                          <svg className="w-10 h-10 text-mystic-gold mb-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0L14.59 8.41L24 12L14.59 15.59L12 24L9.41 15.59L0 12L9.41 8.41L12 0Z" /></svg>
                          <span className="text-mystic-gold font-serif">{selectedCard.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Card Info */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="font-serif text-3xl text-mystic-gold">{selectedCard.name}</h3>
                      <p className="text-mystic-goldDim/60 text-sm mt-1">{selectedCard.description}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="px-2 py-0.5 bg-mystic-gold/10 text-mystic-gold text-xs rounded-full border border-mystic-gold/30">
                          {selectedCard.arcana === 'Major' ? 'Major Arcana' : 'Minor Arcana'}
                        </span>
                        {selectedCard.suit && (
                          <span className="px-2 py-0.5 bg-mystic-accent/10 text-mystic-accent text-xs rounded-full border border-mystic-accent/30">
                            {selectedCard.suit}
                          </span>
                        )}
                        {selectedCard.element && (
                          <span className="px-2 py-0.5 bg-white/5 text-gray-400 text-xs rounded-full">
                            {selectedCard.element}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Keywords */}
                    <div className="flex flex-wrap gap-2">
                      {selectedCard.keywords.map((kw, idx) => (
                        <span key={idx} className="px-3 py-1 bg-mystic-800/50 text-gray-300 text-xs rounded-full">
                          {kw}
                        </span>
                      ))}
                    </div>
                    
                    {/* Meanings */}
                    <div className="space-y-3">
                      <div className="p-4 bg-green-900/20 rounded-lg border border-green-500/20">
                        <h4 className="text-green-400 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                          Upright Meaning
                        </h4>
                        <p className="text-gray-300 text-sm">{selectedCard.upright}</p>
                      </div>
                      
                      <div className="p-4 bg-red-900/20 rounded-lg border border-red-500/20">
                        <h4 className="text-red-400 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                          <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                          Reversed Meaning
                        </h4>
                        <p className="text-gray-300 text-sm">{selectedCard.reversed}</p>
                      </div>
                    </div>
                    
                    {/* Additional Info */}
                    {(selectedCard.zodiac || selectedCard.planet) && (
                      <div className="pt-4 border-t border-mystic-gold/10">
                        <div className="flex gap-4 text-sm">
                          {selectedCard.zodiac && (
                            <div>
                              <span className="text-mystic-goldDim/50">Zodiac: </span>
                              <span className="text-mystic-gold">{selectedCard.zodiac}</span>
                            </div>
                          )}
                          {selectedCard.planet && (
                            <div>
                              <span className="text-mystic-goldDim/50">Planet: </span>
                              <span className="text-mystic-gold">{selectedCard.planet}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TarotLibrary;

