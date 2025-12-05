/**
 * Maps Tarot card names to their image filenames
 */

// Major Arcana mapping (name -> filename)
const MAJOR_ARCANA: Record<string, string> = {
  'the fool': '00-TheFool.jpg',
  'the magician': '01-TheMagician.jpg',
  'the high priestess': '02-TheHighPriestess.jpg',
  'the empress': '03-TheEmpress.jpg',
  'the emperor': '04-TheEmperor.jpg',
  'the hierophant': '05-TheHierophant.jpg',
  'the lovers': '06-TheLovers.jpg',
  'the chariot': '07-TheChariot.jpg',
  'strength': '08-Strength.jpg',
  'the hermit': '09-TheHermit.jpg',
  'wheel of fortune': '10-WheelOfFortune.jpg',
  'justice': '11-Justice.jpg',
  'the hanged man': '12-TheHangedMan.jpg',
  'death': '13-Death.jpg',
  'temperance': '14-Temperance.jpg',
  'the devil': '15-TheDevil.jpg',
  'the tower': '16-TheTower.jpg',
  'the star': '17-TheStar.jpg',
  'the moon': '18-TheMoon.jpg',
  'the sun': '19-TheSun.jpg',
  'judgement': '20-Judgement.jpg',
  'judgment': '20-Judgement.jpg', // Alternative spelling
  'the world': '21-TheWorld.jpg',
};

// Number words to digits
const NUMBER_MAP: Record<string, string> = {
  'ace': '01',
  'one': '01',
  'two': '02',
  'three': '03',
  'four': '04',
  'five': '05',
  'six': '06',
  'seven': '07',
  'eight': '08',
  'nine': '09',
  'ten': '10',
  'page': '11',
  'knight': '12',
  'queen': '13',
  'king': '14',
};

// Suit mapping
const SUIT_MAP: Record<string, string> = {
  'cups': 'Cups',
  'cup': 'Cups',
  'pentacles': 'Pentacles',
  'pentacle': 'Pentacles',
  'coins': 'Pentacles',
  'swords': 'Swords',
  'sword': 'Swords',
  'wands': 'Wands',
  'wand': 'Wands',
  'rods': 'Wands',
  'staves': 'Wands',
};

/**
 * Get the image path for a tarot card by name
 * @param cardName - The name of the card (e.g., "The Fool", "Three of Cups", "Queen of Swords")
 * @returns The path to the card image, or null if not found
 */
export function getTarotCardImagePath(cardName: string): string | null {
  const normalizedName = cardName.toLowerCase().trim();
  
  // Check Major Arcana first
  if (MAJOR_ARCANA[normalizedName]) {
    return `/tarot/${MAJOR_ARCANA[normalizedName]}`;
  }
  
  // Try to parse Minor Arcana (e.g., "Three of Cups", "Ace of Wands")
  // Pattern: [Number/Court] of [Suit]
  const minorMatch = normalizedName.match(/^(\w+)\s+of\s+(\w+)$/);
  if (minorMatch) {
    const [, rank, suit] = minorMatch;
    const number = NUMBER_MAP[rank];
    const suitName = SUIT_MAP[suit];
    
    if (number && suitName) {
      return `/tarot/${suitName}${number}.jpg`;
    }
  }
  
  // Try alternative patterns
  // Pattern: [Suit] [Number] (e.g., "Cups Three")
  const altMatch = normalizedName.match(/^(\w+)\s+(\w+)$/);
  if (altMatch) {
    const [, first, second] = altMatch;
    
    // Check if first word is suit
    if (SUIT_MAP[first] && NUMBER_MAP[second]) {
      return `/tarot/${SUIT_MAP[first]}${NUMBER_MAP[second]}.jpg`;
    }
    
    // Check if second word is suit
    if (SUIT_MAP[second] && NUMBER_MAP[first]) {
      return `/tarot/${SUIT_MAP[second]}${NUMBER_MAP[first]}.jpg`;
    }
  }
  
  // Fallback: try fuzzy matching for Major Arcana
  for (const [key, value] of Object.entries(MAJOR_ARCANA)) {
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      return `/tarot/${value}`;
    }
  }
  
  return null;
}

/**
 * Get all available tarot card names for reference
 */
export function getAllTarotCardNames(): string[] {
  const majorArcana = Object.keys(MAJOR_ARCANA).map(name => 
    name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  );
  
  const minorArcana: string[] = [];
  const ranks = ['Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Page', 'Knight', 'Queen', 'King'];
  const suits = ['Cups', 'Pentacles', 'Swords', 'Wands'];
  
  for (const suit of suits) {
    for (const rank of ranks) {
      minorArcana.push(`${rank} of ${suit}`);
    }
  }
  
  return [...majorArcana, ...minorArcana];
}

export const CARD_BACK_IMAGE = '/tarot/CardBacks.jpg';


