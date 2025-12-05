import { ReadingResult, TarotCard } from '../types';

export interface ReadingHistory {
  id: string;
  date: string;
  timestamp: number;
  question: string;
  readings: ReadingResult[];
  synthesis: string;
  type: 'full' | 'daily';
  notes?: string; // User's personal notes/reflections
  spreadName?: string; // Name of the spread used
  categoryName?: string; // Question category
}

const STORAGE_KEY = 'mystic_ink_history';
const DAILY_CARD_KEY = 'mystic_ink_daily_card';

// Get all reading history
export const getHistory = (): ReadingHistory[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data) as ReadingHistory[];
  } catch (error) {
    console.error('Failed to load history:', error);
    return [];
  }
};

// Save a new reading to history
export const saveReading = (
  question: string,
  readings: ReadingResult[],
  synthesis: string,
  type: 'full' | 'daily' = 'full',
  spreadName?: string,
  categoryName?: string
): ReadingHistory => {
  const history = getHistory();
  
  const newEntry: ReadingHistory = {
    id: `reading_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    date: new Date().toISOString(),
    timestamp: Date.now(),
    question,
    readings,
    synthesis,
    type,
    spreadName,
    categoryName,
  };
  
  // Add to beginning of array (most recent first)
  history.unshift(newEntry);
  
  // Keep only the last 50 readings to manage storage
  const trimmedHistory = history.slice(0, 50);
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedHistory));
  } catch (error) {
    console.error('Failed to save reading:', error);
  }
  
  return newEntry;
};

// Update notes for a reading
export const updateReadingNotes = (id: string, notes: string): void => {
  const history = getHistory();
  const index = history.findIndex(entry => entry.id === id);
  if (index !== -1) {
    history[index].notes = notes;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }
};

// Get a single reading by ID
export const getReadingById = (id: string): ReadingHistory | null => {
  const history = getHistory();
  return history.find(entry => entry.id === id) || null;
};

// Delete a reading from history
export const deleteReading = (id: string): void => {
  const history = getHistory();
  const filtered = history.filter(entry => entry.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

// Clear all history
export const clearHistory = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

// Daily Card functions
interface DailyCardData {
  date: string; // YYYY-MM-DD format
  card: TarotCard;
  message: string;
  dateMeaning?: string; // Mystical significance of the date
}

export const getTodayDateString = (): string => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
};

export const getDailyCard = (): DailyCardData | null => {
  try {
    const data = localStorage.getItem(DAILY_CARD_KEY);
    if (!data) return null;
    
    const parsed = JSON.parse(data) as DailyCardData;
    
    // Check if it's from today
    if (parsed.date !== getTodayDateString()) {
      return null; // Card is from a previous day
    }
    
    return parsed;
  } catch (error) {
    return null;
  }
};

export const saveDailyCard = (card: TarotCard, message: string, dateMeaning?: string): void => {
  const dailyData: DailyCardData = {
    date: getTodayDateString(),
    card,
    message,
    dateMeaning,
  };
  
  localStorage.setItem(DAILY_CARD_KEY, JSON.stringify(dailyData));
};

export const hasDailyCardToday = (): boolean => {
  return getDailyCard() !== null;
};

// Format date for display
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDateShort = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

// ==========================================
// Analytics Functions
// ==========================================

export interface CardFrequency {
  name: string;
  count: number;
  reversedCount: number;
  arcana: string;
}

export interface MonthlyStats {
  month: string;
  year: number;
  totalReadings: number;
  cardFrequencies: CardFrequency[];
  topCards: CardFrequency[];
  reversedPercentage: number;
  categories: { name: string; count: number }[];
  spreads: { name: string; count: number }[];
}

export interface YearlyStats {
  year: number;
  totalReadings: number;
  monthlyBreakdown: { month: string; count: number }[];
  topCards: CardFrequency[];
  reversedPercentage: number;
  mostActiveMonth: string;
  categories: { name: string; count: number }[];
}

// Get readings for a specific month
export const getReadingsForMonth = (year: number, month: number): ReadingHistory[] => {
  const history = getHistory();
  return history.filter(entry => {
    const date = new Date(entry.date);
    return date.getFullYear() === year && date.getMonth() === month;
  });
};

// Get readings for a specific year
export const getReadingsForYear = (year: number): ReadingHistory[] => {
  const history = getHistory();
  return history.filter(entry => {
    const date = new Date(entry.date);
    return date.getFullYear() === year;
  });
};

// Calculate card frequencies from readings
const calculateCardFrequencies = (readings: ReadingHistory[]): CardFrequency[] => {
  const cardMap = new Map<string, CardFrequency>();
  
  readings.forEach(reading => {
    reading.readings.forEach(r => {
      const existing = cardMap.get(r.card.name);
      if (existing) {
        existing.count++;
        if (r.card.isReversed) existing.reversedCount++;
      } else {
        cardMap.set(r.card.name, {
          name: r.card.name,
          count: 1,
          reversedCount: r.card.isReversed ? 1 : 0,
          arcana: r.card.arcana,
        });
      }
    });
  });
  
  return Array.from(cardMap.values()).sort((a, b) => b.count - a.count);
};

// Calculate category breakdown
const calculateCategories = (readings: ReadingHistory[]): { name: string; count: number }[] => {
  const categoryMap = new Map<string, number>();
  
  readings.forEach(reading => {
    const cat = reading.categoryName || 'General';
    categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
  });
  
  return Array.from(categoryMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
};

// Calculate spread breakdown
const calculateSpreads = (readings: ReadingHistory[]): { name: string; count: number }[] => {
  const spreadMap = new Map<string, number>();
  
  readings.forEach(reading => {
    const spread = reading.spreadName || 'Classic';
    spreadMap.set(spread, (spreadMap.get(spread) || 0) + 1);
  });
  
  return Array.from(spreadMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
};

// Get monthly statistics
export const getMonthlyStats = (year: number, month: number): MonthlyStats => {
  const readings = getReadingsForMonth(year, month);
  const cardFrequencies = calculateCardFrequencies(readings);
  
  const totalCards = readings.reduce((sum, r) => sum + r.readings.length, 0);
  const reversedCards = readings.reduce((sum, r) => 
    sum + r.readings.filter(card => card.card.isReversed).length, 0);
  
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
  
  return {
    month: monthNames[month],
    year,
    totalReadings: readings.length,
    cardFrequencies,
    topCards: cardFrequencies.slice(0, 5),
    reversedPercentage: totalCards > 0 ? Math.round((reversedCards / totalCards) * 100) : 0,
    categories: calculateCategories(readings),
    spreads: calculateSpreads(readings),
  };
};

// Get yearly statistics
export const getYearlyStats = (year: number): YearlyStats => {
  const readings = getReadingsForYear(year);
  const cardFrequencies = calculateCardFrequencies(readings);
  
  const totalCards = readings.reduce((sum, r) => sum + r.readings.length, 0);
  const reversedCards = readings.reduce((sum, r) => 
    sum + r.readings.filter(card => card.card.isReversed).length, 0);
  
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const monthlyBreakdown = monthNames.map((month, idx) => ({
    month,
    count: getReadingsForMonth(year, idx).length,
  }));
  
  const mostActiveMonthIdx = monthlyBreakdown.reduce((maxIdx, curr, idx, arr) => 
    curr.count > arr[maxIdx].count ? idx : maxIdx, 0);
  
  return {
    year,
    totalReadings: readings.length,
    monthlyBreakdown,
    topCards: cardFrequencies.slice(0, 10),
    reversedPercentage: totalCards > 0 ? Math.round((reversedCards / totalCards) * 100) : 0,
    mostActiveMonth: monthNames[mostActiveMonthIdx],
    categories: calculateCategories(readings),
  };
};

