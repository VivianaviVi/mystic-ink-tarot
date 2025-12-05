import React, { useState, useEffect, useMemo } from 'react';

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
  return (
    <svg className={baseClass} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1" />
      <text x="12" y="16" textAnchor="middle" fontSize="10" fill="currentColor" fontFamily="serif">
        {sign.substring(0, 2).toUpperCase()}
      </text>
    </svg>
  );
};

interface MysticCalendarProps {
  isOpen: boolean;
  onClose: () => void;
}

// Moon phase calculation
const getMoonPhase = (date: Date): { phase: string; emoji: string; illumination: number; description: string } => {
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
    { phase: 'New Moon', emoji: 'new', illumination: 0, description: 'A time for new beginnings, setting intentions, and planting seeds for the future.' },
    { phase: 'Waxing Crescent', emoji: 'waxing-crescent', illumination: 25, description: 'Energy builds. Take action on your intentions. Momentum is growing.' },
    { phase: 'First Quarter', emoji: 'first-quarter', illumination: 50, description: 'Decision time. Face challenges head-on. Overcome obstacles.' },
    { phase: 'Waxing Gibbous', emoji: 'waxing-gibbous', illumination: 75, description: 'Refine and adjust. Trust the process. Almost there.' },
    { phase: 'Full Moon', emoji: 'full', illumination: 100, description: 'Peak energy! Manifestation, clarity, and emotional revelations. Ideal for readings.' },
    { phase: 'Waning Gibbous', emoji: 'waning-gibbous', illumination: 75, description: 'Gratitude and sharing. Reflect on what you\'ve learned.' },
    { phase: 'Last Quarter', emoji: 'last-quarter', illumination: 50, description: 'Release and let go. Forgive. Clear space for the new.' },
    { phase: 'Waning Crescent', emoji: 'waning-crescent', illumination: 25, description: 'Rest and restore. Surrender. Prepare for rebirth.' },
  ];
  
  return phases[phaseIndex];
};

// Zodiac sign calculation
const getZodiacSign = (date: Date): { sign: string; symbol: string; element: string; description: string } => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  const zodiacSigns = [
    { sign: 'Capricorn', symbol: 'capricorn', dates: [12, 22, 1, 19], element: 'Earth', description: 'Discipline, ambition, and practical wisdom guide you.' },
    { sign: 'Aquarius', symbol: 'aquarius', dates: [1, 20, 2, 18], element: 'Air', description: 'Innovation, independence, and humanitarian ideals shine.' },
    { sign: 'Pisces', symbol: 'pisces', dates: [2, 19, 3, 20], element: 'Water', description: 'Intuition, creativity, and spiritual connection deepen.' },
    { sign: 'Aries', symbol: 'aries', dates: [3, 21, 4, 19], element: 'Fire', description: 'Bold action, courage, and new beginnings are favored.' },
    { sign: 'Taurus', symbol: 'taurus', dates: [4, 20, 5, 20], element: 'Earth', description: 'Stability, sensuality, and material matters take focus.' },
    { sign: 'Gemini', symbol: 'gemini', dates: [5, 21, 6, 20], element: 'Air', description: 'Communication, curiosity, and adaptability flourish.' },
    { sign: 'Cancer', symbol: 'cancer', dates: [6, 21, 7, 22], element: 'Water', description: 'Home, emotions, and nurturing energy prevail.' },
    { sign: 'Leo', symbol: 'leo', dates: [7, 23, 8, 22], element: 'Fire', description: 'Creativity, self-expression, and leadership call.' },
    { sign: 'Virgo', symbol: 'virgo', dates: [8, 23, 9, 22], element: 'Earth', description: 'Analysis, health, and service to others matter.' },
    { sign: 'Libra', symbol: 'libra', dates: [9, 23, 10, 22], element: 'Air', description: 'Balance, relationships, and beauty seek harmony.' },
    { sign: 'Scorpio', symbol: 'scorpio', dates: [10, 23, 11, 21], element: 'Water', description: 'Transformation, depth, and hidden truths emerge.' },
    { sign: 'Sagittarius', symbol: 'sagittarius', dates: [11, 22, 12, 21], element: 'Fire', description: 'Adventure, philosophy, and expansion beckon.' },
  ];
  
  for (const z of zodiacSigns) {
    const [m1, d1, m2, d2] = z.dates;
    if ((month === m1 && day >= d1) || (month === m2 && day <= d2)) {
      return z;
    }
  }
  return zodiacSigns[0]; // Capricorn as default
};

// Special dates
const SPECIAL_DATES: Record<string, { name: string; type: 'solstice' | 'equinox' | 'sabbat' | 'eclipse' }> = {
  '03-20': { name: 'Spring Equinox (Ostara)', type: 'equinox' },
  '06-21': { name: 'Summer Solstice (Litha)', type: 'solstice' },
  '09-22': { name: 'Autumn Equinox (Mabon)', type: 'equinox' },
  '12-21': { name: 'Winter Solstice (Yule)', type: 'solstice' },
  '02-01': { name: 'Imbolc', type: 'sabbat' },
  '05-01': { name: 'Beltane', type: 'sabbat' },
  '08-01': { name: 'Lammas', type: 'sabbat' },
  '10-31': { name: 'Samhain (Veil Thinnest)', type: 'sabbat' },
};

const MysticCalendar: React.FC<MysticCalendarProps> = ({ isOpen, onClose }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const today = useMemo(() => new Date(), []);
  const moonPhase = useMemo(() => getMoonPhase(selectedDate), [selectedDate]);
  const zodiac = useMemo(() => getZodiacSign(selectedDate), [selectedDate]);

  // Check for special date
  const dateKey = `${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
  const specialDate = SPECIAL_DATES[dateKey];

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPadding = firstDay.getDay();
    const days: (Date | null)[] = [];
    
    for (let i = 0; i < startPadding; i++) days.push(null);
    for (let i = 1; i <= lastDay.getDate(); i++) days.push(new Date(year, month, i));
    
    return days;
  }, [currentMonth]);

  const isToday = (date: Date | null) => {
    if (!date) return false;
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date | null) => {
    if (!date) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const hasSpecialDate = (date: Date | null) => {
    if (!date) return false;
    const key = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    return SPECIAL_DATES[key];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto py-8">
      <div className="absolute inset-0" onClick={onClose}></div>
      
      <div className="relative w-full max-w-4xl mx-4 my-auto">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-mystic-900 border-2 border-mystic-gold/50 flex items-center justify-center text-mystic-gold hover:bg-mystic-gold hover:text-mystic-900 transition-all z-50 shadow-lg"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="bg-gradient-to-b from-mystic-900 via-mystic-950 to-black rounded-2xl border border-mystic-gold/30 shadow-2xl overflow-hidden">
          
          {/* Header */}
          <div className="p-6 border-b border-mystic-gold/20 text-center">
            <h2 className="font-serif text-3xl text-mystic-gold mb-1">Mystic Calendar</h2>
            <p className="text-mystic-goldDim/60 text-sm">Celestial Guidance & Sacred Dates</p>
          </div>

          <div className="flex flex-col lg:flex-row">
            {/* Calendar */}
            <div className="flex-1 p-6 border-r border-mystic-gold/10">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-6">
                <button 
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                  className="p-2 hover:bg-mystic-gold/10 rounded-lg transition-colors text-mystic-goldDim"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h3 className="font-serif text-xl text-white">
                  {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h3>
                <button 
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                  className="p-2 hover:bg-mystic-gold/10 rounded-lg transition-colors text-mystic-goldDim"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((date, idx) => (
                  <button
                    key={idx}
                    onClick={() => date && setSelectedDate(date)}
                    disabled={!date}
                    className={`aspect-square rounded-lg text-sm relative transition-all ${
                      !date ? 'opacity-0' :
                      isSelected(date) ? 'bg-mystic-gold text-mystic-900 font-bold' :
                      isToday(date) ? 'bg-mystic-accent/30 text-white border border-mystic-accent' :
                      'text-gray-400 hover:bg-mystic-800/50'
                    }`}
                  >
                    {date?.getDate()}
                    {hasSpecialDate(date) && !isSelected(date) && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-mystic-gold rounded-full"></span>
                    )}
                  </button>
                ))}
              </div>

              {/* Legend */}
              <div className="mt-4 flex gap-4 text-xs text-mystic-goldDim/50">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-mystic-accent rounded-full"></span> Today
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-mystic-gold rounded-full"></span> Special Date
                </span>
              </div>
            </div>

            {/* Selected Date Info */}
            <div className="w-full lg:w-80 p-6 bg-mystic-950/50">
              <p className="text-mystic-goldDim/50 text-xs uppercase tracking-widest mb-2">
                {selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}
              </p>
              <h3 className="font-serif text-2xl text-white mb-6">
                {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </h3>

              {/* Special Date Alert */}
              {specialDate && (
                <div className={`mb-6 p-4 rounded-xl border ${
                  specialDate.type === 'solstice' ? 'bg-amber-900/20 border-amber-500/30' :
                  specialDate.type === 'equinox' ? 'bg-green-900/20 border-green-500/30' :
                  'bg-purple-900/20 border-purple-500/30'
                }`}>
                  <p className="text-xs uppercase tracking-widest mb-1 opacity-70">Sacred Date</p>
                  <p className="font-serif text-lg text-white">{specialDate.name}</p>
                </div>
              )}

              {/* Moon Phase */}
              <div className="mb-6 p-4 bg-mystic-800/30 rounded-xl border border-mystic-gold/10">
                <div className="flex items-center gap-3 mb-3">
                  <MoonIcon phase={moonPhase.emoji} className="w-12 h-12" />
                  <div>
                    <p className="text-mystic-gold font-serif text-lg">{moonPhase.phase}</p>
                    <p className="text-mystic-goldDim/50 text-xs">{moonPhase.illumination}% illumination</p>
                  </div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{moonPhase.description}</p>
              </div>

              {/* Zodiac */}
              <div className="p-4 bg-mystic-800/30 rounded-xl border border-mystic-gold/10">
                <div className="flex items-center gap-3 mb-3">
                  <ZodiacIcon sign={zodiac.sign} className="w-12 h-12" />
                  <div>
                    <p className="text-mystic-gold font-serif text-lg">{zodiac.sign}</p>
                    <p className="text-mystic-goldDim/50 text-xs">{zodiac.element} Sign</p>
                  </div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{zodiac.description}</p>
              </div>

              {/* Reading Recommendation */}
              <div className="mt-6 text-center">
                <p className="text-mystic-goldDim/50 text-xs mb-2">Best for readings:</p>
                <p className="text-mystic-gold text-sm">
                  {moonPhase.phase === 'Full Moon' ? 'IDEAL - Peak intuition!' :
                   moonPhase.phase === 'New Moon' ? 'Great for setting intentions' :
                   moonPhase.illumination >= 50 ? 'Good energy for insights' :
                   'Focus on introspection'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MysticCalendar;

