import { GoogleGenAI, Schema, Type } from "@google/genai";
import { TarotCard, TimeFrame } from "../types";

// The API key is obtained from environment variable
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });

const cardSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: "Name of the Tarot card (e.g., The Fool, Three of Cups)" },
    arcana: { type: Type.STRING, description: "Major Arcana or Minor Arcana" },
    meaning: { type: Type.STRING, description: "Interpretation of the card specifically related to the user's drawing energy and the timeframe. If reversed, reflect the reversed meaning." },
    visualDescription: { type: Type.STRING, description: "A brief visual description of the traditional card imagery." },
    isReversed: { type: Type.BOOLEAN, description: "Whether the card appears reversed (upside-down). Reversed cards have shadow or blocked meanings." }
  },
  required: ["name", "arcana", "meaning", "visualDescription", "isReversed"]
};

const promptsSchema: Schema = {
  type: Type.ARRAY,
  items: { type: Type.STRING },
  description: "Three metaphorical drawing prompts corresponding to Past, Present, and Future."
};

export const generateDrawingPrompts = async (
  question: string, 
  cardCount: number = 3, 
  positions: string[] = ['Past', 'Present', 'Future'],
  categoryContext: string = ''
): Promise<string[]> => {
  const positionDescriptions = positions.map((pos, idx) => `${idx + 1}. "${pos}"`).join('\n');
  
  const prompt = `
    The user wants a Tarot reading for the question: "${question}".
    ${categoryContext ? `Question category: ${categoryContext}` : ''}
    
    The spread uses ${cardCount} cards with these positions:
    ${positionDescriptions}
    
    Create ${cardCount} distinct, metaphorical drawing instructions (MAX 10 words each) that abstractly represent each position based on their question.
    
    The prompts should:
    - Be evocative and mystical
    - Relate to the specific position meaning
    - Connect to the user's question theme
    - NOT directly use the position names
    
    Example for a 3-card "Past-Present-Future" spread about "Love life":
    ["Draw the heartbreak you carry", "Draw the wall around your heart", "Draw the gate opening"]
    
    Return exactly ${cardCount} prompts as a JSON array of strings.
  `;

  const dynamicSchema: Schema = {
    type: Type.ARRAY,
    items: { type: Type.STRING },
    description: `${cardCount} metaphorical drawing prompts.`
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts: [{ text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: dynamicSchema,
        temperature: 1.0,
      }
    });

    const text = response.text;
    if (!text) return positions.map(p => `Draw ${p.toLowerCase()}`);
    
    const parsed = JSON.parse(text) as string[];
    if (parsed.length !== cardCount) return positions.map(p => `Draw ${p.toLowerCase()}`);
    return parsed;

  } catch (error) {
    console.error("Prompt generation error:", error);
    return positions.map(p => `Draw ${p.toLowerCase()}`);
  }
};

export const interpretDrawing = async (
  base64Image: string, 
  question: string, 
  timeFrame: TimeFrame, 
  promptUsed: string,
  existingCards: string[]
): Promise<TarotCard> => {
  
  const prompt = `
    You are a mystical Tarot Master. The user has a question: "${question}".
    They were asked to: "${promptUsed}" (which represents the ${timeFrame.toUpperCase()}).
    
    Analyze the brushstrokes, chaos, order, and lines in the attached image.
    Assign a Tarot card that best matches this energy.
    
    Do NOT use these cards as they have already been drawn: ${existingCards.join(', ')}.
    
    IMPORTANT - CARD ORIENTATION:
    ${Math.random() < 0.35 ? 
      `This card MUST be REVERSED (isReversed: true). 
       The meaning should reflect the shadow/blocked aspect of the card.
       Reversed meanings: obstacles, delays, internal struggles, blocked energy, or introspection needed.` : 
      `This card should be UPRIGHT (isReversed: false).
       The meaning should reflect the positive, flowing aspect of the card.`
    }
    
    Provide a deep, mystical interpretation connecting the visual energy of the drawing to the card's meaning for the ${timeFrame}.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          { text: prompt },
          { 
            inlineData: {
              mimeType: "image/png",
              data: base64Image
            }
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: cardSchema,
        temperature: 0.7, // Slightly creative
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Oracle.");
    
    return JSON.parse(text) as TarotCard;

  } catch (error) {
    console.error("Oracle error:", error);
    // Fallback for demo purposes if API fails or key is missing
    return {
      name: "The Mystery",
      arcana: "Unknown",
      meaning: "The mists obscure the vision. Ensure your API key is valid.",
      visualDescription: "A clouded mirror.",
      isReversed: false
    };
  }
};

export const getFinalSynthesis = async (
  question: string,
  readings: { timeFrame: string, card: TarotCard, prompt: string }[],
  spreadName?: string,
  categoryName?: string
): Promise<string> => {
  const readingsText = readings.map((r, idx) => 
    `${idx + 1}. ${r.timeFrame.toUpperCase()} (User drew: "${r.prompt}"): ${r.card.name}${r.card.isReversed ? ' (REVERSED)' : ''} - ${r.card.meaning}`
  ).join('\n');

  const prompt = `
    The user asked: "${question}".
    ${spreadName ? `Spread type: ${spreadName}` : ''}
    ${categoryName ? `Question category: ${categoryName}` : ''}
    
    The reading results are:
    ${readingsText}
    
    Provide a holistic summary (max ${readings.length > 5 ? 250 : 150} words) synthesizing all ${readings.length} cards into a final answer for the user.
    
    Consider:
    - How the cards relate to each other
    - The overall narrative arc
    - If any cards are reversed, acknowledge the blocked or shadow energy
    - Provide practical wisdom and guidance
    
    Speak like a wise, compassionate mystic.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text || "The spirits are silent.";
  } catch (e) {
    return "The connection to the ether was interrupted.";
  }
};

// Daily Card Reading
const dailyCardSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    card: cardSchema,
    message: { type: Type.STRING, description: "A brief, inspiring message for the day based on this card (max 50 words)." },
    dateMeaning: { type: Type.STRING, description: "The mystical significance of today's date in tarot/numerology (max 40 words)." }
  },
  required: ["card", "message", "dateMeaning"]
};

export interface DailyCardResult {
  card: TarotCard;
  message: string;
  dateMeaning: string;
}

// Follow-up question after reading
export const askFollowUp = async (
  originalQuestion: string,
  readings: { timeFrame: string; card: { name: string; meaning: string; isReversed: boolean } }[],
  synthesis: string,
  followUpQuestion: string
): Promise<string> => {
  const readingsContext = readings.map((r, idx) => 
    `${idx + 1}. ${r.timeFrame}: ${r.card.name}${r.card.isReversed ? ' (Reversed)' : ''} - ${r.card.meaning}`
  ).join('\n');

  const prompt = `
    You are a wise and compassionate Tarot reader continuing a conversation with a seeker.
    
    ORIGINAL READING CONTEXT:
    Question: "${originalQuestion}"
    
    Cards Drawn:
    ${readingsContext}
    
    Original Synthesis: "${synthesis}"
    
    The seeker now asks a follow-up question: "${followUpQuestion}"
    
    Provide a thoughtful, mystical response that:
    1. Directly addresses their follow-up question
    2. References the cards already drawn when relevant
    3. Offers practical, grounded wisdom
    4. Maintains the mystical tone but remains helpful
    5. Keep response under 150 words
    
    Speak as an experienced oracle who cares deeply about the seeker's journey.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.8,
      }
    });
    return response.text || "The spirits require more focus to answer this question.";
  } catch (e) {
    console.error("Follow-up error:", e);
    return "The connection to the ether wavers. Please try again.";
  }
};

// AI-Powered Monthly/Yearly Analysis
export interface PeriodAnalysisResult {
  overallTheme: string;
  dominantEnergy: string;
  shadowWork: string;
  guidance: string;
  affirmation: string;
}

const periodAnalysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    overallTheme: { type: Type.STRING, description: "The dominant spiritual theme of this period based on the cards drawn (max 50 words)" },
    dominantEnergy: { type: Type.STRING, description: "The prevailing energy or archetype that has been guiding the seeker (max 40 words)" },
    shadowWork: { type: Type.STRING, description: "Based on reversed cards, what shadow aspects or challenges need attention (max 50 words)" },
    guidance: { type: Type.STRING, description: "Practical mystical guidance for moving forward based on the patterns (max 60 words)" },
    affirmation: { type: Type.STRING, description: "A personalized affirmation or mantra based on the reading patterns (max 20 words)" }
  },
  required: ["overallTheme", "dominantEnergy", "shadowWork", "guidance", "affirmation"]
};

export const generatePeriodAnalysis = async (
  period: 'monthly' | 'yearly',
  periodLabel: string,
  totalReadings: number,
  topCards: { name: string; count: number; reversedCount: number }[],
  reversedPercentage: number,
  categories: { name: string; count: number }[]
): Promise<PeriodAnalysisResult> => {
  const topCardsText = topCards.slice(0, 5).map((c, i) => 
    `${i + 1}. ${c.name} (appeared ${c.count} times${c.reversedCount > 0 ? `, ${c.reversedCount} reversed` : ''})`
  ).join('\n');
  
  const categoriesText = categories.length > 0 
    ? categories.map(c => `${c.name}: ${c.count} readings`).join(', ')
    : 'Various topics';

  const prompt = `
    You are a wise Tarot Oracle providing a ${period} spiritual analysis.
    
    PERIOD: ${periodLabel}
    TOTAL READINGS: ${totalReadings}
    REVERSED CARD RATE: ${reversedPercentage}%
    
    MOST FREQUENT CARDS:
    ${topCardsText}
    
    QUESTION THEMES: ${categoriesText}
    
    Based on these patterns, provide a deep mystical analysis:
    
    1. What overall spiritual theme or lesson is emerging from these card appearances?
    2. What energy or archetype is most prominently guiding this seeker?
    3. Based on the reversed cards (${reversedPercentage}% reversed rate), what shadow work or challenges need attention?
    4. What practical guidance would you offer for the coming ${period === 'monthly' ? 'weeks' : 'year'}?
    5. Create a personalized affirmation based on these patterns.
    
    Speak as a compassionate and wise oracle who sees the deeper patterns.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts: [{ text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: periodAnalysisSchema,
        temperature: 0.85,
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Oracle.");
    
    return JSON.parse(text) as PeriodAnalysisResult;

  } catch (error) {
    console.error("Period analysis error:", error);
    return {
      overallTheme: "The threads of fate are still weaving. Continue your journey and the patterns will reveal themselves.",
      dominantEnergy: `The ${topCards[0]?.name || 'Fool'}'s energy guides your path.`,
      shadowWork: reversedPercentage > 30 
        ? "The reversed energies suggest inner work is needed. Embrace introspection."
        : "Your energies flow well. Stay mindful of balance.",
      guidance: "Trust the cards that appear repeatedly—they carry messages your soul needs to hear.",
      affirmation: "I trust my journey and embrace each lesson."
    };
  }
};

export const getDailyCardReading = async (): Promise<DailyCardResult> => {
  const today = new Date();
  const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
  const monthName = today.toLocaleDateString('en-US', { month: 'long' });
  const dayOfMonth = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  
  // Calculate numerology number for the day
  const dateDigits = `${month}${dayOfMonth}${year}`.split('').map(Number);
  const lifePathSum = dateDigits.reduce((a, b) => a + b, 0);
  const numerologyNumber = lifePathSum > 9 ? Math.floor(lifePathSum / 10) + (lifePathSum % 10) : lifePathSum;
  
  const prompt = `
    Today is ${dayName}, ${monthName} ${dayOfMonth}, ${year}.
    The numerology number for today is ${numerologyNumber} (sum of digits: ${lifePathSum}).
    
    1. First, explain the mystical/tarot significance of today's date:
       - What does ${monthName} ${dayOfMonth} mean in numerology?
       - What energy does the number ${numerologyNumber} carry?
       - Any astrological or seasonal significance?
    
    2. Then draw a Tarot card that resonates with today's energy.
       Consider:
       - The energy of ${dayName} (${dayName === 'Sunday' ? 'Sun - vitality, success' : dayName === 'Monday' ? 'Moon - intuition, emotions' : dayName === 'Tuesday' ? 'Mars - action, courage' : dayName === 'Wednesday' ? 'Mercury - communication, intellect' : dayName === 'Thursday' ? 'Jupiter - expansion, luck' : dayName === 'Friday' ? 'Venus - love, beauty' : 'Saturn - discipline, karma'})
       - The numerology vibration of ${numerologyNumber}
       - The season (late November - introspection, preparation for winter)
    
    IMPORTANT - CARD ORIENTATION:
    ${Math.random() < 0.30 ? 
      `This card MUST be REVERSED (isReversed: true). 
       The message should reflect the shadow aspect or blocked energy that needs attention today.` : 
      `This card should be UPRIGHT (isReversed: false).
       The message should reflect the positive, flowing energy of the day.`
    }
    
    Provide wisdom for navigating this specific day.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts: [{ text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: dailyCardSchema,
        temperature: 0.9,
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Oracle.");
    
    return JSON.parse(text) as DailyCardResult;

  } catch (error) {
    console.error("Daily card error:", error);
    // Fallback
    return {
      card: {
        name: "The Star",
        arcana: "Major Arcana",
        meaning: "Hope and inspiration guide your path today.",
        visualDescription: "A figure pours water under a starlit sky, representing renewal and hope.",
        isReversed: false
      },
      message: "Today brings clarity and renewed hope. Trust in the journey ahead.",
      dateMeaning: `${monthName} ${dayOfMonth} carries the energy of number ${numerologyNumber}, a day for reflection and inner wisdom.`
    };
  }
};
