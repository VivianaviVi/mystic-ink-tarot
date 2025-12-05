import React, { useState, useMemo } from 'react';

// Moon Phase Icon Component
const MoonIcon: React.FC<{ phase: string; className?: string }> = ({ phase, className = "w-8 h-8" }) => {
  const baseClass = `${className} text-mystic-gold`;
  switch (phase) {
    case 'new':
      return <svg className={baseClass} viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" opacity="0.3" /><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1" /></svg>;
    case 'full':
      return <svg className={baseClass} viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" /></svg>;
    case 'first-quarter':
      return <svg className={baseClass} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 1 0 20V2z" /><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1" /></svg>;
    case 'last-quarter':
      return <svg className={baseClass} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0 0 20V2z" /><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1" /></svg>;
    case 'waxing-crescent':
      return <svg className={baseClass} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 1 0 20 8 8 0 0 0 0-20z" /><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1" /></svg>;
    case 'waxing-gibbous':
      return <svg className={baseClass} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 1 0 20 4 4 0 0 1 0-20z" /><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1" /></svg>;
    case 'waning-gibbous':
      return <svg className={baseClass} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0 0 20 4 4 0 0 0 0-20z" /><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1" /></svg>;
    case 'waning-crescent':
      return <svg className={baseClass} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0 0 20 8 8 0 0 1 0-20z" /><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1" /></svg>;
    default:
      return <svg className={baseClass} viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" /></svg>;
  }
};

// Zodiac Icon Component  
const ZodiacIcon: React.FC<{ sign: string; className?: string }> = ({ sign, className = "w-8 h-8" }) => {
  const baseClass = `${className} text-mystic-gold`;
  // Using simple geometric representations for zodiac signs
  return (
    <svg className={baseClass} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1" />
      <text x="12" y="16" textAnchor="middle" fontSize="10" fill="currentColor" fontFamily="serif">
        {sign.substring(0, 2).toUpperCase()}
      </text>
    </svg>
  );
};

interface MysticalCalendarProps {
  isOpen: boolean;
  onClose: () => void;
}

// Moon phase calculation
const getMoonPhase = (date: Date): { phase: string; emoji: string; energy: string } => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  // Simplified moon phase calculation
  const c = Math.floor(365.25 * year);
  const e = Math.floor(30.6 * month);
  const jd = c + e + day - 694039.09;
  const phase = jd / 29.53058867;
  const phaseIndex = Math.floor((phase - Math.floor(phase)) * 8);
  
  const phases = [
    { phase: 'New Moon', emoji: 'new', energy: 'New beginnings, setting intentions, introspection' },
    { phase: 'Waxing Crescent', emoji: 'waxing-crescent', energy: 'Taking action, building momentum, hope' },
    { phase: 'First Quarter', emoji: 'first-quarter', energy: 'Decision making, overcoming challenges, determination' },
    { phase: 'Waxing Gibbous', emoji: 'waxing-gibbous', energy: 'Refinement, patience, trust the process' },
    { phase: 'Full Moon', emoji: 'full', energy: 'Manifestation, clarity, heightened emotions' },
    { phase: 'Waning Gibbous', emoji: 'waning-gibbous', energy: 'Gratitude, sharing wisdom, reflection' },
    { phase: 'Last Quarter', emoji: 'last-quarter', energy: 'Release, forgiveness, letting go' },
    { phase: 'Waning Crescent', emoji: 'waning-crescent', energy: 'Rest, surrender, spiritual insight' },
  ];
  
  return phases[phaseIndex];
};

// Zodiac sign calculation
const getZodiacSign = (date: Date): { sign: string; emoji: string; element: string } => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  const signs = [
    { sign: 'Capricorn', emoji: 'capricorn', element: 'Earth', start: [12, 22], end: [1, 19] },
    { sign: 'Aquarius', emoji: 'aquarius', element: 'Air', start: [1, 20], end: [2, 18] },
    { sign: 'Pisces', emoji: 'pisces', element: 'Water', start: [2, 19], end: [3, 20] },
    { sign: 'Aries', emoji: 'aries', element: 'Fire', start: [3, 21], end: [4, 19] },
    { sign: 'Taurus', emoji: 'taurus', element: 'Earth', start: [4, 20], end: [5, 20] },
    { sign: 'Gemini', emoji: 'gemini', element: 'Air', start: [5, 21], end: [6, 20] },
    { sign: 'Cancer', emoji: 'cancer', element: 'Water', start: [6, 21], end: [7, 22] },
    { sign: 'Leo', emoji: 'leo', element: 'Fire', start: [7, 23], end: [8, 22] },
    { sign: 'Virgo', emoji: 'virgo', element: 'Earth', start: [8, 23], end: [9, 22] },
    { sign: 'Libra', emoji: 'libra', element: 'Air', start: [9, 23], end: [10, 22] },
    { sign: 'Scorpio', emoji: 'scorpio', element: 'Water', start: [10, 23], end: [11, 21] },
    { sign: 'Sagittarius', emoji: 'sagittarius', element: 'Fire', start: [11, 22], end: [12, 21] },
  ];
  
  for (const s of signs) {
    const [startMonth, startDay] = s.start;
    const [endMonth, endDay] = s.end;
    
    if (startMonth === 12 && endMonth === 1) {
      if ((month === 12 && day >= startDay) || (month === 1 && day <= endDay)) {
        return s;
      }
    } else if ((month === startMonth && day >= startDay) || (month === endMonth && day <= endDay)) {
      return s;
    }
  }
  
  return signs[0];
};

// Special mystical dates
const SPECIAL_DATES: Record<string, { name: string; description: string; type: 'solstice' | 'equinox' | 'sabbat' | 'portal' }> = {
  '12-21': { name: 'Winter Solstice', description: 'Longest night, rebirth of the sun', type: 'solstice' },
  '3-20': { name: 'Spring Equinox', description: 'Balance, new growth, Ostara', type: 'equinox' },
  '6-21': { name: 'Summer Solstice', description: 'Peak of light, abundance, Litha', type: 'solstice' },
  '9-22': { name: 'Autumn Equinox', description: 'Harvest, gratitude, Mabon', type: 'equinox' },
  '10-31': { name: 'Samhain', description: 'Veil is thin, ancestor connection', type: 'sabbat' },
  '2-1': { name: 'Imbolc', description: 'First stirrings of spring, Brigid', type: 'sabbat' },
  '5-1': { name: 'Beltane', description: 'Fertility, passion, fire festivals', type: 'sabbat' },
  '8-1': { name: 'Lughnasadh', description: 'First harvest, gratitude', type: 'sabbat' },
  '11-11': { name: '11:11 Portal', description: 'Manifestation gateway, synchronicity', type: 'portal' },
  '12-12': { name: '12:12 Portal', description: 'Completion, spiritual alignment', type: 'portal' },
};

const MysticalCalendar: React.FC<MysticalCalendarProps> = ({ isOpen, onClose }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMonth, setViewMonth] = useState(new Date());

  const moonPhase = useMemo(() => getMoonPhase(selectedDate), [selectedDate]);
  const zodiac = useMemo(() => getZodiacSign(selectedDate), [selectedDate]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const { firstDay, daysInMonth } = useMemo(() => getDaysInMonth(viewMonth), [viewMonth]);

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() && 
           viewMonth.getMonth() === today.getMonth() && 
           viewMonth.getFullYear() === today.getFullYear();
  };

  const isSelected = (day: number) => {
    return day === selectedDate.getDate() && 
           viewMonth.getMonth() === selectedDate.getMonth() && 
           viewMonth.getFullYear() === selectedDate.getFullYear();
  };

  const getSpecialDate = (day: number) => {
    const key = `${viewMonth.getMonth() + 1}-${day}`;
    return SPECIAL_DATES[key];
  };

  const prevMonth = () => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1));
  const nextMonth = () => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto py-8">
      <div className="absolute inset-0" onClick={onClose}></div>
      
      <div className="relative w-full max-w-4xl mx-4 my-auto">
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
          <div className="p-6 border-b border-mystic-gold/20 text-center">
            <h2 className="font-serif text-3xl text-mystic-gold mb-2">Mystical Calendar</h2>
            <p className="text-mystic-goldDim/60 text-sm">Moon phases, zodiac energies & sacred dates</p>
          </div>

          <div className="flex flex-col lg:flex-row">
            
            {/* Calendar Grid */}
            <div className="flex-1 p-6">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-6">
                <button onClick={prevMonth} className="p-2 text-mystic-goldDim hover:text-mystic-gold transition-colors">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h3 className="font-serif text-xl text-white">
                  {viewMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h3>
                <button onClick={nextMonth} className="p-2 text-mystic-goldDim hover:text-mystic-gold transition-colors">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Weekday Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-mystic-goldDim/50 text-xs uppercase py-2">{day}</div>
                ))}
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-1">
                {[...Array(firstDay)].map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square"></div>
                ))}
                {[...Array(daysInMonth)].map((_, i) => {
                  const day = i + 1;
                  const special = getSpecialDate(day);
                  const dayMoon = getMoonPhase(new Date(viewMonth.getFullYear(), viewMonth.getMonth(), day));
                  const isFullOrNew = dayMoon.phase === 'Full Moon' || dayMoon.phase === 'New Moon';
                  
                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDate(new Date(viewMonth.getFullYear(), viewMonth.getMonth(), day))}
                      className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm transition-all relative ${
                        isSelected(day)
                          ? 'bg-mystic-gold text-mystic-900 font-bold'
                          : isToday(day)
                          ? 'bg-mystic-accent/30 text-white ring-2 ring-mystic-accent'
                          : 'hover:bg-mystic-800/50 text-gray-300'
                      }`}
                    >
                      <span>{day}</span>
                      {isFullOrNew && !isSelected(day) && (
                        <span className="absolute bottom-0.5"><MoonIcon phase={dayMoon.emoji} className="w-3 h-3" /></span>
                      )}
                      {special && (
                        <span className={`absolute top-1 right-1 w-1.5 h-1.5 rounded-full ${
                          special.type === 'portal' ? 'bg-purple-400' : 'bg-mystic-gold'
                        }`}></span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Date Info */}
            <div className="w-full lg:w-80 p-6 bg-mystic-900/50 border-t lg:border-t-0 lg:border-l border-mystic-gold/20">
              <div className="text-center mb-6">
                <p className="text-mystic-goldDim/60 text-sm">
                  {selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}
                </p>
                <p className="font-serif text-2xl text-white">
                  {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>

              {/* Moon Phase */}
              <div className="bg-black/30 rounded-xl p-4 mb-4 border border-mystic-gold/10">
                <div className="flex items-center gap-3 mb-2">
                  <MoonIcon phase={moonPhase.emoji} className="w-10 h-10" />
                  <div>
                    <h4 className="text-mystic-gold font-bold">{moonPhase.phase}</h4>
                    <p className="text-mystic-goldDim/60 text-xs uppercase">Lunar Energy</p>
                  </div>
                </div>
                <p className="text-gray-400 text-sm">{moonPhase.energy}</p>
              </div>

              {/* Zodiac */}
              <div className="bg-black/30 rounded-xl p-4 mb-4 border border-mystic-gold/10">
                <div className="flex items-center gap-3 mb-2">
                  <ZodiacIcon sign={zodiac.sign} className="w-10 h-10" />
                  <div>
                    <h4 className="text-mystic-gold font-bold">{zodiac.sign} Season</h4>
                    <p className="text-mystic-goldDim/60 text-xs uppercase">{zodiac.element} Element</p>
                  </div>
                </div>
              </div>

              {/* Special Date */}
              {getSpecialDate(selectedDate.getDate()) && (() => {
                const special = getSpecialDate(selectedDate.getDate())!;
                return (
                  <div className={`rounded-xl p-4 border ${
                    special.type === 'portal' 
                      ? 'bg-purple-900/30 border-purple-500/30' 
                      : 'bg-mystic-gold/10 border-mystic-gold/30'
                  }`}>
                    <h4 className={`font-bold mb-1 ${special.type === 'portal' ? 'text-purple-300' : 'text-mystic-gold'}`}>
                      {special.name}
                    </h4>
                    <p className="text-gray-400 text-sm">{special.description}</p>
                  </div>
                );
              })()}

              {/* Reading Recommendation */}
              <div className="mt-6 p-4 bg-mystic-800/30 rounded-xl border border-mystic-gold/10">
                <p className="text-mystic-goldDim text-xs uppercase tracking-widest mb-2">Best For Today</p>
                <p className="text-gray-300 text-sm">
                  {moonPhase.phase === 'New Moon' ? 'Setting intentions, new beginnings readings' :
                   moonPhase.phase === 'Full Moon' ? 'Clarity readings, manifestation check-ins' :
                   moonPhase.phase.includes('Waxing') ? 'Growth and opportunity readings' :
                   'Release and reflection readings'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MysticalCalendar;


