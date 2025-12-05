import React, { useState, useEffect, createContext, useContext } from 'react';

export interface Theme {
  id: string;
  name: string;
  description: string;
  bgGradient: string;
  cardBg: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  gold: string;
  borderColor: string;
  starColor: string;
}

export const THEMES: Theme[] = [
  {
    id: 'mystic-purple',
    name: 'Mystic Purple',
    description: 'Classic mystical experience',
    bgGradient: 'from-[#130924] via-[#1a0a2e] to-[#0d0618]',
    cardBg: 'bg-purple-950/40',
    textPrimary: 'text-purple-100',
    textSecondary: 'text-purple-300/70',
    accent: '#9333ea',
    gold: '#FFD700',
    borderColor: 'border-purple-500/30',
    starColor: '#FFD700',
  },
  {
    id: 'midnight-ocean',
    name: 'Midnight Ocean',
    description: 'Deep sea mysteries',
    bgGradient: 'from-[#0a1628] via-[#0f2847] to-[#061224]',
    cardBg: 'bg-blue-950/40',
    textPrimary: 'text-blue-100',
    textSecondary: 'text-blue-300/70',
    accent: '#22d3ee',
    gold: '#60a5fa',
    borderColor: 'border-blue-500/30',
    starColor: '#60a5fa',
  },
  {
    id: 'blood-moon',
    name: 'Blood Moon',
    description: 'Intense and powerful',
    bgGradient: 'from-[#1a0a0a] via-[#2d1010] to-[#0f0505]',
    cardBg: 'bg-red-950/40',
    textPrimary: 'text-red-100',
    textSecondary: 'text-red-300/70',
    accent: '#dc2626',
    gold: '#fbbf24',
    borderColor: 'border-red-500/30',
    starColor: '#fbbf24',
  },
  {
    id: 'enchanted-forest',
    name: 'Enchanted Forest',
    description: 'Ancient woodland magic',
    bgGradient: 'from-[#0a1f0a] via-[#133413] to-[#051005]',
    cardBg: 'bg-green-950/40',
    textPrimary: 'text-green-100',
    textSecondary: 'text-green-300/70',
    accent: '#4ade80',
    gold: '#a3e635',
    borderColor: 'border-green-500/30',
    starColor: '#a3e635',
  },
];

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (themeId: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('mystic-ink-theme');
    if (saved) {
      const found = THEMES.find(t => t.id === saved);
      if (found) return found;
    }
    return THEMES[0];
  });

  useEffect(() => {
    localStorage.setItem('mystic-ink-theme', currentTheme.id);
    
    const root = document.documentElement;
    
    // Complete theme color palettes
    const themeColors: Record<string, {
      gold: string;
      goldDim: string;
      accent: string;
      secondary: string;
      bg: string;
      bgLight: string;
      bgLighter: string;
      text: string;
      textDim: string;
    }> = {
      'mystic-purple': {
        gold: '#FFD700',
        goldDim: '#D4AF37',
        accent: '#9333ea',
        secondary: '#9333ea',
        bg: '#130424',
        bgLight: '#2a0a4a',
        bgLighter: '#321054',
        text: '#e2d9f3',
        textDim: '#b8a5d4',
      },
      'midnight-ocean': {
        gold: '#60a5fa',
        goldDim: '#3b82f6',
        accent: '#22d3ee',
        secondary: '#22d3ee',
        bg: '#0a1628',
        bgLight: '#0f2847',
        bgLighter: '#1e3a5f',
        text: '#e0f2fe',
        textDim: '#93c5fd',
      },
      'blood-moon': {
        gold: '#fbbf24',
        goldDim: '#f59e0b',
        accent: '#dc2626',
        secondary: '#f97316',
        bg: '#1a0a0a',
        bgLight: '#2d1010',
        bgLighter: '#4a1c1c',
        text: '#fef2f2',
        textDim: '#fca5a5',
      },
      'enchanted-forest': {
        gold: '#a3e635',
        goldDim: '#84cc16',
        accent: '#4ade80',
        secondary: '#22c55e',
        bg: '#0a1f0a',
        bgLight: '#133413',
        bgLighter: '#1a4d1a',
        text: '#ecfccb',
        textDim: '#bef264',
      },
    };
    
    const colors = themeColors[currentTheme.id] || themeColors['mystic-purple'];
    
    // Apply all CSS variables
    root.style.setProperty('--theme-gold', colors.gold);
    root.style.setProperty('--theme-gold-dim', colors.goldDim);
    root.style.setProperty('--theme-accent', colors.accent);
    root.style.setProperty('--theme-secondary', colors.secondary);
    root.style.setProperty('--theme-bg', colors.bg);
    root.style.setProperty('--theme-bg-light', colors.bgLight);
    root.style.setProperty('--theme-bg-lighter', colors.bgLighter);
    root.style.setProperty('--theme-text', colors.text);
    root.style.setProperty('--theme-text-dim', colors.textDim);
    root.style.setProperty('--theme-border', colors.gold);
    root.style.setProperty('--theme-star', currentTheme.starColor);
  }, [currentTheme]);

  const setTheme = (themeId: string) => {
    const theme = THEMES.find(t => t.id === themeId);
    if (theme) setCurrentTheme(theme);
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

interface ThemeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ isOpen, onClose }) => {
  const { currentTheme, setTheme } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="absolute inset-0" onClick={onClose}></div>
      
      <div className="relative w-full max-w-lg mx-4 rounded-2xl border border-mystic-gold/30 bg-gradient-to-b from-mystic-900 via-mystic-950 to-black overflow-hidden">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-mystic-900 border border-mystic-gold/30 flex items-center justify-center text-mystic-gold hover:bg-mystic-gold hover:text-mystic-900 transition-all z-50"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="p-6 border-b border-mystic-gold/20 text-center">
          <h2 className="font-serif text-2xl text-mystic-gold">Choose Your Theme</h2>
          <p className="text-mystic-goldDim/60 text-sm mt-1">Select a color scheme</p>
        </div>

        {/* Theme Options */}
        <div className="p-6 space-y-3">
          {THEMES.map((theme) => (
            <button
              key={theme.id}
              onClick={() => {
                setTheme(theme.id);
                onClose();
              }}
              className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                currentTheme.id === theme.id 
                  ? 'border-mystic-gold bg-mystic-gold/10' 
                  : 'border-mystic-gold/20 hover:border-mystic-gold/50 hover:bg-mystic-800/30'
              }`}
            >
              {/* Color Preview Circle */}
              <div 
                className={`w-12 h-12 rounded-full bg-gradient-to-br ${theme.bgGradient} border-2 flex-shrink-0`}
                style={{ borderColor: theme.gold }}
              >
                <div className="w-full h-full rounded-full flex items-center justify-center">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: theme.accent }}
                  />
                </div>
              </div>
              
              {/* Theme Info */}
              <div className="flex-1 text-left">
                <h4 className="font-serif text-lg text-white">{theme.name}</h4>
                <p className="text-mystic-goldDim/60 text-sm">{theme.description}</p>
              </div>

              {/* Selected Indicator */}
              {currentTheme.id === theme.id && (
                <div className="w-6 h-6 rounded-full bg-mystic-gold flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-mystic-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;
