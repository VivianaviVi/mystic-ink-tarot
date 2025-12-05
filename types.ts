export enum AppState {
  INTRO = 'INTRO',
  SPREAD_SELECT = 'SPREAD_SELECT', // New: Select spread type
  PREPARING = 'PREPARING',
  DRAWING = 'DRAWING',
  ANALYZING = 'ANALYZING',
  READING_SINGLE = 'READING_SINGLE',
  FINAL_SUMMARY = 'FINAL_SUMMARY',
  TAROT_LIBRARY = 'TAROT_LIBRARY' // New: View tarot card library
}

export enum TimeFrame {
  PAST = 'Past',
  PRESENT = 'Present',
  FUTURE = 'Future'
}

// Question Categories
export type QuestionCategory = 'love' | 'career' | 'wealth' | 'health' | 'general';

export interface CategoryInfo {
  id: QuestionCategory;
  name: string;
  icon: string;
  description: string;
  color: string;
}

export const QUESTION_CATEGORIES: CategoryInfo[] = [
  { id: 'love', name: 'Love & Relationships', icon: 'heart', description: 'Matters of the heart', color: 'from-pink-500 to-rose-600' },
  { id: 'career', name: 'Career & Purpose', icon: 'briefcase', description: 'Work and life path', color: 'from-amber-500 to-orange-600' },
  { id: 'wealth', name: 'Wealth & Abundance', icon: 'coin', description: 'Financial guidance', color: 'from-emerald-500 to-teal-600' },
  { id: 'health', name: 'Health & Wellness', icon: 'leaf', description: 'Mind, body, spirit', color: 'from-green-500 to-emerald-600' },
  { id: 'general', name: 'General Guidance', icon: 'crystal', description: 'Open reading', color: 'from-purple-500 to-indigo-600' },
];

// Spread Types
export type SpreadType = 'three-card' | 'yes-no' | 'love' | 'celtic-cross' | 'custom';

export interface SpreadPosition {
  name: string;
  description: string;
}

export interface SpreadConfig {
  id: SpreadType;
  name: string;
  description: string;
  cardCount: number;
  positions: SpreadPosition[];
  icon: string;
}

export const SPREAD_CONFIGS: SpreadConfig[] = [
  {
    id: 'three-card',
    name: 'Past-Present-Future',
    description: 'Classic three-card spread for timeline insight',
    cardCount: 3,
    icon: 'hourglass',
    positions: [
      { name: 'Past', description: 'What has led you here' },
      { name: 'Present', description: 'Your current situation' },
      { name: 'Future', description: 'Where you are heading' },
    ]
  },
  {
    id: 'yes-no',
    name: 'Yes or No',
    description: 'Quick single-card answer to your question',
    cardCount: 1,
    icon: 'scale',
    positions: [
      { name: 'Answer', description: 'The universe responds' },
    ]
  },
  {
    id: 'love',
    name: 'Love Triangle',
    description: 'Explore the dynamics of your relationship',
    cardCount: 3,
    icon: 'heart',
    positions: [
      { name: 'You', description: 'Your energy in the relationship' },
      { name: 'Partner', description: 'Their energy and perspective' },
      { name: 'Connection', description: 'The bond between you' },
    ]
  },
  {
    id: 'celtic-cross',
    name: 'Celtic Cross',
    description: 'Deep dive into complex situations (6 cards)',
    cardCount: 6,
    icon: 'cross',
    positions: [
      { name: 'Present', description: 'The heart of the matter' },
      { name: 'Challenge', description: 'What crosses you' },
      { name: 'Foundation', description: 'The root cause' },
      { name: 'Past', description: 'Recent influences' },
      { name: 'Crown', description: 'Best possible outcome' },
      { name: 'Future', description: 'What is coming' },
    ]
  },
  {
    id: 'custom',
    name: 'Custom Spread',
    description: 'Choose your own number of cards (1-10)',
    cardCount: 3, // Default, user can change
    icon: 'cards',
    positions: [] // Will be generated dynamically
  },
];

export interface TarotCard {
  name: string;
  arcana: string;
  meaning: string;
  visualDescription: string;
  isReversed: boolean;
}

export interface ReadingResult {
  timeFrame: TimeFrame | string; // Can be custom position name
  prompt: string;
  card: TarotCard;
  drawingBase64: string;
}

export interface Point {
  x: number;
  y: number;
}

// Simplified brush styles with distinct visual effects
export type BrushStyle = 'solid' | 'glow' | 'ethereal';

export interface Stroke {
  points: Point[];
  color: string;
  width: number;
  tool: 'pen' | 'eraser';
  style: BrushStyle;
  opacity: number;
}

// Mystical Color Palette - 20 colors organized by energy
export const COLORS = [
  // Core Mystical
  '#FFD700', // Gold - Divine energy
  '#C0C0C0', // Silver - Moon energy
  '#FFFFFF', // White - Purity
  '#000000', // Black - Mystery
  
  // Fire Element
  '#FF4500', // Orange Red - Passion
  '#DC143C', // Crimson - Power
  '#FF69B4', // Hot Pink - Love
  '#FFA500', // Orange - Creativity
  
  // Water Element  
  '#4169E1', // Royal Blue - Intuition
  '#00CED1', // Dark Turquoise - Healing
  '#9370DB', // Medium Purple - Spirituality
  '#8A2BE2', // Blue Violet - Wisdom
  
  // Earth Element
  '#228B22', // Forest Green - Growth
  '#8B4513', // Saddle Brown - Grounding
  '#DAA520', // Goldenrod - Abundance
  '#2F4F4F', // Dark Slate - Stability
  
  // Air Element
  '#E6E6FA', // Lavender - Peace
  '#87CEEB', // Sky Blue - Freedom
  '#F0E68C', // Khaki - Light
  '#DDA0DD', // Plum - Dreams
];

// Tarot Library Card Info (for knowledge base)
export interface TarotCardInfo {
  id: string;
  name: string;
  number: number | string;
  arcana: 'Major' | 'Minor';
  suit?: 'Wands' | 'Cups' | 'Swords' | 'Pentacles';
  keywords: string[];
  uprightMeaning: string;
  reversedMeaning: string;
  description: string;
  imagePath?: string;
}
