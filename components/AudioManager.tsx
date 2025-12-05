import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';

interface AudioContextType {
  isMusicPlaying: boolean;
  isSoundEnabled: boolean;
  musicVolume: number;
  soundVolume: number;
  toggleMusic: () => void;
  toggleSound: () => void;
  setMusicVolume: (volume: number) => void;
  setSoundVolume: (volume: number) => void;
  playSound: (sound: 'flip' | 'reveal' | 'magic' | 'draw' | 'whoosh') => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

// Audio URLs - using free sound effects (online fallback)
const SOUNDS = {
  flip: 'https://assets.mixkit.co/active_storage/sfx/2073/2073-preview.mp3',
  reveal: 'https://assets.mixkit.co/active_storage/sfx/1111/1111-preview.mp3',
  magic: 'https://assets.mixkit.co/active_storage/sfx/2579/2579-preview.mp3',
  draw: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  whoosh: 'https://assets.mixkit.co/active_storage/sfx/2574/2574-preview.mp3',
};

// Local music file path
const LOCAL_BGM = '/audio/tarot music.mp3';

// Check if local BGM exists
const checkLocalBGM = async (): Promise<boolean> => {
  try {
    const response = await fetch(LOCAL_BGM, { method: 'HEAD' });
    const contentType = response.headers.get('content-type') || '';
    return response.ok && contentType.includes('audio');
  } catch {
    return false;
  }
};

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [musicVolume, setMusicVolumeState] = useState(() => {
    const saved = localStorage.getItem('mystic-music-volume');
    return saved ? parseFloat(saved) : 0.2; // Default lower volume
  });
  const [soundVolume, setSoundVolumeState] = useState(() => {
    const saved = localStorage.getItem('mystic-sound-volume');
    return saved ? parseFloat(saved) : 0.3; // Default lower volume
  });
  
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const soundCache = useRef<Map<string, HTMLAudioElement>>(new Map());

  // Initialize music
  useEffect(() => {
    let isMounted = true;
    
    const initMusic = async () => {
      if (!isMounted) return;
      
      const hasLocalBGM = await checkLocalBGM();
      
      if (hasLocalBGM) {
        console.log('🎵 Found local BGM:', LOCAL_BGM);
        musicRef.current = new Audio(LOCAL_BGM);
        musicRef.current.loop = true;
        musicRef.current.volume = musicVolume;
      } else {
        console.log('🎵 No local BGM found. Add your music to /public/audio/bgm.mp3');
        musicRef.current = new Audio();
      }
    };
    
    initMusic();
    
    // Preload sounds with lower default volume
    Object.entries(SOUNDS).forEach(([key, url]) => {
      const audio = new Audio(url);
      audio.preload = 'auto';
      audio.volume = soundVolume;
      soundCache.current.set(key, audio);
    });

    return () => {
      isMounted = false;
      if (musicRef.current) {
        musicRef.current.pause();
        musicRef.current = null;
      }
    };
  }, []);

  // Update music volume when changed
  useEffect(() => {
    if (musicRef.current) {
      musicRef.current.volume = musicVolume;
    }
    localStorage.setItem('mystic-music-volume', musicVolume.toString());
  }, [musicVolume]);

  // Update sound effects volume when changed
  useEffect(() => {
    soundCache.current.forEach(audio => {
      audio.volume = soundVolume;
    });
    localStorage.setItem('mystic-sound-volume', soundVolume.toString());
  }, [soundVolume]);

  const toggleMusic = useCallback(() => {
    if (!musicRef.current) return;

    if (isMusicPlaying) {
      musicRef.current.pause();
    } else {
      musicRef.current.play().catch(console.error);
    }
    setIsMusicPlaying(!isMusicPlaying);
  }, [isMusicPlaying]);

  const toggleSound = useCallback(() => {
    setIsSoundEnabled(!isSoundEnabled);
  }, [isSoundEnabled]);

  const setMusicVolume = useCallback((volume: number) => {
    setMusicVolumeState(Math.max(0, Math.min(1, volume)));
  }, []);

  const setSoundVolume = useCallback((volume: number) => {
    setSoundVolumeState(Math.max(0, Math.min(1, volume)));
  }, []);

  const playSound = useCallback((sound: keyof typeof SOUNDS) => {
    if (!isSoundEnabled) return;

    const audio = soundCache.current.get(sound);
    if (audio) {
      audio.currentTime = 0;
      audio.volume = soundVolume; // Ensure current volume
      audio.play().catch(console.error);
    }
  }, [isSoundEnabled, soundVolume]);

  return (
    <AudioContext.Provider value={{ 
      isMusicPlaying, 
      isSoundEnabled, 
      musicVolume,
      soundVolume,
      toggleMusic, 
      toggleSound,
      setMusicVolume,
      setSoundVolume,
      playSound 
    }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

// Audio Control Component with Volume Sliders
export const AudioControls: React.FC = () => {
  const { 
    isMusicPlaying, 
    isSoundEnabled, 
    musicVolume,
    soundVolume,
    toggleMusic, 
    toggleSound,
    setMusicVolume,
    setSoundVolume 
  } = useAudio();
  
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-2">
      {/* Expanded Volume Panel - Theme aware */}
      {isExpanded && (
        <div 
          className="backdrop-blur-xl rounded-2xl p-4 mb-2 shadow-2xl animate-fade-in w-56"
          style={{ 
            backgroundColor: 'var(--theme-bg-light, #2a0a4a)ee',
            borderColor: 'var(--theme-gold, #c5a059)4d',
            borderWidth: '1px',
            borderStyle: 'solid'
          }}
        >
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xs uppercase tracking-widest font-bold" style={{ color: 'var(--theme-gold)' }}>Volume</h4>
            <button 
              onClick={() => setIsExpanded(false)}
              className="transition-colors"
              style={{ color: 'var(--theme-text-dim)' }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Music Volume */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" style={{ color: 'var(--theme-gold)' }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                </svg>
                <span className="text-xs" style={{ color: 'var(--theme-text-dim)' }}>Music</span>
              </div>
              <span className="text-xs font-bold" style={{ color: 'var(--theme-gold)' }}>{Math.round(musicVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={musicVolume}
              onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer
                [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110"
              style={{ 
                background: 'var(--theme-bg-lighter)',
                accentColor: 'var(--theme-gold)'
              }}
            />
          </div>
          
          {/* Sound Effects Volume */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" style={{ color: 'var(--theme-gold)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
                <span className="text-xs" style={{ color: 'var(--theme-text-dim)' }}>Effects</span>
              </div>
              <span className="text-xs font-bold" style={{ color: 'var(--theme-gold)' }}>{Math.round(soundVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={soundVolume}
              onChange={(e) => setSoundVolume(parseFloat(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer
                [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110"
              style={{ 
                background: 'var(--theme-bg-lighter)',
                accentColor: 'var(--theme-gold)'
              }}
            />
          </div>
        </div>
      )}

      {/* Control Buttons - Theme aware */}
      <div className="flex flex-col gap-2">
        {/* Settings/Expand Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-12 h-12 rounded-full backdrop-blur-md shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
          style={{
            backgroundColor: isExpanded ? 'color-mix(in srgb, var(--theme-gold) 20%, transparent)' : 'var(--theme-bg-light)cc',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: isExpanded ? 'var(--theme-gold)' : 'color-mix(in srgb, var(--theme-gold) 20%, transparent)',
            color: isExpanded ? 'var(--theme-gold)' : 'var(--theme-text-dim)',
          }}
          title="Volume Settings"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
        </button>

        {/* Music Toggle */}
        <button
          onClick={toggleMusic}
          className="w-12 h-12 rounded-full backdrop-blur-md shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
          style={{
            backgroundColor: isMusicPlaying ? 'color-mix(in srgb, var(--theme-gold) 20%, transparent)' : 'var(--theme-bg-light)cc',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: isMusicPlaying ? 'var(--theme-gold)' : 'color-mix(in srgb, var(--theme-gold) 20%, transparent)',
            color: isMusicPlaying ? 'var(--theme-gold)' : 'color-mix(in srgb, var(--theme-text-dim) 30%, transparent)',
            boxShadow: isMusicPlaying ? '0 0 15px color-mix(in srgb, var(--theme-gold) 30%, transparent)' : 'none',
          }}
          title={isMusicPlaying ? 'Music On' : 'Music Off'}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
          </svg>
        </button>

        {/* Sound Effects Toggle */}
        <button
          onClick={toggleSound}
          className="w-12 h-12 rounded-full backdrop-blur-md shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
          style={{
            backgroundColor: isSoundEnabled ? 'color-mix(in srgb, var(--theme-gold) 20%, transparent)' : 'var(--theme-bg-light)cc',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: isSoundEnabled ? 'var(--theme-gold)' : 'color-mix(in srgb, var(--theme-gold) 20%, transparent)',
            color: isSoundEnabled ? 'var(--theme-gold)' : 'color-mix(in srgb, var(--theme-text-dim) 30%, transparent)',
            boxShadow: isSoundEnabled ? '0 0 15px color-mix(in srgb, var(--theme-gold) 30%, transparent)' : 'none',
          }}
          title={isSoundEnabled ? 'Sound On' : 'Sound Off'}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AudioControls;
