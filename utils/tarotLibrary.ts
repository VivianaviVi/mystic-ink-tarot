import { TarotCardInfo } from '../types';

// Complete 78 Tarot Card Library
export const TAROT_LIBRARY: TarotCardInfo[] = [
  // ========== MAJOR ARCANA (22 cards) ==========
  {
    id: '00-fool',
    name: 'The Fool',
    number: 0,
    arcana: 'Major',
    keywords: ['New beginnings', 'Innocence', 'Spontaneity', 'Free spirit'],
    uprightMeaning: 'New beginnings, innocence, spontaneity, a free spirit. Taking a leap of faith into the unknown with optimism and trust.',
    reversedMeaning: 'Recklessness, risk-taking, holding back, naivety. Fear of the unknown or acting without thinking.',
    description: 'A young person stands at the edge of a cliff, looking up at the sky, a small dog at their heels. They carry a small bundle, representing untapped potential.',
  },
  {
    id: '01-magician',
    name: 'The Magician',
    number: 1,
    arcana: 'Major',
    keywords: ['Manifestation', 'Willpower', 'Creation', 'Skill'],
    uprightMeaning: 'Manifestation, resourcefulness, power, inspired action. You have all the tools you need to succeed.',
    reversedMeaning: 'Manipulation, poor planning, untapped talents. Trickery or using skills for wrong purposes.',
    description: 'A figure stands before a table with the symbols of all four suits. One hand points to heaven, the other to earth. An infinity symbol hovers above.',
  },
  {
    id: '02-high-priestess',
    name: 'The High Priestess',
    number: 2,
    arcana: 'Major',
    keywords: ['Intuition', 'Mystery', 'Inner knowledge', 'Subconscious'],
    uprightMeaning: 'Intuition, sacred knowledge, divine feminine, the subconscious mind. Trust your inner voice.',
    reversedMeaning: 'Secrets, disconnection from intuition, withdrawal. Ignoring your inner guidance.',
    description: 'A serene woman sits between two pillars, one black (Boaz) and one white (Jachin). She holds a scroll and wears a crescent moon crown.',
  },
  {
    id: '03-empress',
    name: 'The Empress',
    number: 3,
    arcana: 'Major',
    keywords: ['Fertility', 'Abundance', 'Nature', 'Nurturing'],
    uprightMeaning: 'Femininity, beauty, nature, nurturing, abundance. A time of growth and creative expression.',
    reversedMeaning: 'Creative block, dependence, smothering. Neglecting self-care or being overly controlling.',
    description: 'A beautiful woman reclines in nature, surrounded by wheat and a flowing river. She wears a crown of stars and holds a scepter.',
  },
  {
    id: '04-emperor',
    name: 'The Emperor',
    number: 4,
    arcana: 'Major',
    keywords: ['Authority', 'Structure', 'Leadership', 'Father figure'],
    uprightMeaning: 'Authority, structure, control, fatherhood. Establishing order and taking charge of your life.',
    reversedMeaning: 'Tyranny, rigidity, coldness. Abuse of power or excessive control.',
    description: 'A stern ruler sits on a stone throne decorated with ram heads. He holds an ankh and orb, symbols of life and dominion.',
  },
  {
    id: '05-hierophant',
    name: 'The Hierophant',
    number: 5,
    arcana: 'Major',
    keywords: ['Tradition', 'Spirituality', 'Conformity', 'Teaching'],
    uprightMeaning: 'Spiritual wisdom, religious beliefs, conformity, tradition. Seeking guidance from established institutions.',
    reversedMeaning: 'Personal beliefs, freedom, challenging the status quo. Breaking from tradition.',
    description: 'A religious figure sits between two pillars, raising one hand in blessing. Two acolytes kneel before him.',
  },
  {
    id: '06-lovers',
    name: 'The Lovers',
    number: 6,
    arcana: 'Major',
    keywords: ['Love', 'Harmony', 'Relationships', 'Choices'],
    uprightMeaning: 'Love, harmony, relationships, value alignment, choices. A significant relationship or important decision.',
    reversedMeaning: 'Disharmony, imbalance, misalignment of values. Difficult choices or relationship conflicts.',
    description: 'A man and woman stand beneath an angel, representing divine blessing. The tree of knowledge and tree of life frame the scene.',
  },
  {
    id: '07-chariot',
    name: 'The Chariot',
    number: 7,
    arcana: 'Major',
    keywords: ['Willpower', 'Determination', 'Victory', 'Control'],
    uprightMeaning: 'Control, willpower, success, determination. Overcoming obstacles through confidence and persistence.',
    reversedMeaning: 'Lack of control, aggression, obstacles. Feeling pulled in different directions.',
    description: 'A warrior stands in a chariot pulled by two sphinxes, one black and one white. Stars crown his canopy.',
  },
  {
    id: '08-strength',
    name: 'Strength',
    number: 8,
    arcana: 'Major',
    keywords: ['Courage', 'Patience', 'Compassion', 'Inner strength'],
    uprightMeaning: 'Inner strength, bravery, compassion, focus. Gentle control and courage from within.',
    reversedMeaning: 'Self-doubt, weakness, insecurity. Lack of inner strength or raw emotion.',
    description: 'A woman gently closes a lion\'s mouth, symbolizing the power of inner strength over brute force. An infinity symbol hovers above.',
  },
  {
    id: '09-hermit',
    name: 'The Hermit',
    number: 9,
    arcana: 'Major',
    keywords: ['Soul-searching', 'Introspection', 'Solitude', 'Guidance'],
    uprightMeaning: 'Soul-searching, introspection, being alone, inner guidance. Time for reflection and seeking inner truth.',
    reversedMeaning: 'Isolation, loneliness, withdrawal. Excessive solitude or refusing guidance.',
    description: 'An old man stands alone on a mountain peak, holding a lantern with a six-pointed star. He carries a staff.',
  },
  {
    id: '10-wheel',
    name: 'Wheel of Fortune',
    number: 10,
    arcana: 'Major',
    keywords: ['Change', 'Cycles', 'Fate', 'Luck'],
    uprightMeaning: 'Good luck, karma, life cycles, destiny. Change is coming - embrace the turning wheel.',
    reversedMeaning: 'Bad luck, resistance to change, breaking cycles. Feeling out of control.',
    description: 'A great wheel turns with mythical creatures at each corner. Symbols of the elements and zodiac adorn its surface.',
  },
  {
    id: '11-justice',
    name: 'Justice',
    number: 11,
    arcana: 'Major',
    keywords: ['Fairness', 'Truth', 'Law', 'Cause and effect'],
    uprightMeaning: 'Justice, fairness, truth, law. Karmic consequences and fair outcomes.',
    reversedMeaning: 'Unfairness, lack of accountability, dishonesty. Avoiding responsibility.',
    description: 'A figure sits on a throne holding a sword in one hand and scales in the other, representing balanced judgment.',
  },
  {
    id: '12-hanged-man',
    name: 'The Hanged Man',
    number: 12,
    arcana: 'Major',
    keywords: ['Surrender', 'New perspective', 'Letting go', 'Sacrifice'],
    uprightMeaning: 'Pause, surrender, letting go, new perspectives. Voluntary sacrifice for greater understanding.',
    reversedMeaning: 'Delays, resistance, stalling. Unwillingness to make necessary sacrifices.',
    description: 'A man hangs upside down from a tree by one foot, his face peaceful. A halo of light surrounds his head.',
  },
  {
    id: '13-death',
    name: 'Death',
    number: 13,
    arcana: 'Major',
    keywords: ['Endings', 'Transformation', 'Transition', 'Change'],
    uprightMeaning: 'Endings, change, transformation, transition. The end of one chapter and the beginning of another.',
    reversedMeaning: 'Resistance to change, inability to move on. Fear of endings or stagnation.',
    description: 'A skeletal figure in armor rides a white horse. A sun rises between two towers in the background.',
  },
  {
    id: '14-temperance',
    name: 'Temperance',
    number: 14,
    arcana: 'Major',
    keywords: ['Balance', 'Moderation', 'Patience', 'Purpose'],
    uprightMeaning: 'Balance, moderation, patience, purpose. Finding middle ground and maintaining harmony.',
    reversedMeaning: 'Imbalance, excess, lack of long-term vision. Disharmony or impatience.',
    description: 'An angel pours water between two cups, one foot on land and one in water. A path leads to mountains.',
  },
  {
    id: '15-devil',
    name: 'The Devil',
    number: 15,
    arcana: 'Major',
    keywords: ['Shadow self', 'Attachment', 'Addiction', 'Bondage'],
    uprightMeaning: 'Shadow self, attachment, addiction, restriction. Feeling trapped by material desires.',
    reversedMeaning: 'Releasing limiting beliefs, exploring dark thoughts. Breaking free from bondage.',
    description: 'A horned devil figure sits above two chained humans. The chains are loose enough to remove.',
  },
  {
    id: '16-tower',
    name: 'The Tower',
    number: 16,
    arcana: 'Major',
    keywords: ['Sudden change', 'Upheaval', 'Revelation', 'Awakening'],
    uprightMeaning: 'Sudden change, upheaval, chaos, revelation. Destruction of false beliefs or structures.',
    reversedMeaning: 'Fear of change, avoiding disaster. Delaying inevitable transformation.',
    description: 'Lightning strikes a tall tower, sending figures falling. Flames burst from the windows.',
  },
  {
    id: '17-star',
    name: 'The Star',
    number: 17,
    arcana: 'Major',
    keywords: ['Hope', 'Faith', 'Renewal', 'Inspiration'],
    uprightMeaning: 'Hope, faith, purpose, renewal, spirituality. A time of healing and optimism.',
    reversedMeaning: 'Lack of faith, despair, discouragement. Losing hope or feeling uninspired.',
    description: 'A naked woman kneels by a pool, pouring water onto land and water. Eight stars shine above.',
  },
  {
    id: '18-moon',
    name: 'The Moon',
    number: 18,
    arcana: 'Major',
    keywords: ['Illusion', 'Intuition', 'Subconscious', 'Dreams'],
    uprightMeaning: 'Illusion, fear, anxiety, subconscious. Things may not be as they seem.',
    reversedMeaning: 'Release of fear, repressed emotion. Confusion clearing or secrets revealed.',
    description: 'A full moon shines over a path between two towers. A dog and wolf howl as a crayfish emerges from water.',
  },
  {
    id: '19-sun',
    name: 'The Sun',
    number: 19,
    arcana: 'Major',
    keywords: ['Joy', 'Success', 'Vitality', 'Positivity'],
    uprightMeaning: 'Positivity, fun, warmth, success, vitality. A time of joy and accomplishment.',
    reversedMeaning: 'Inner child, feeling down, overly optimistic. Temporary setbacks.',
    description: 'A child rides a white horse beneath a bright sun. Sunflowers bloom behind a wall.',
  },
  {
    id: '20-judgement',
    name: 'Judgement',
    number: 20,
    arcana: 'Major',
    keywords: ['Reflection', 'Reckoning', 'Awakening', 'Rebirth'],
    uprightMeaning: 'Judgement, rebirth, inner calling, absolution. Time of reflection and self-evaluation.',
    reversedMeaning: 'Self-doubt, refusal of self-examination. Ignoring the call to change.',
    description: 'An angel blows a trumpet as figures rise from coffins with arms raised. A mountain range forms the backdrop.',
  },
  {
    id: '21-world',
    name: 'The World',
    number: 21,
    arcana: 'Major',
    keywords: ['Completion', 'Integration', 'Accomplishment', 'Travel'],
    uprightMeaning: 'Completion, integration, accomplishment, travel. A cycle ends successfully.',
    reversedMeaning: 'Lack of closure, lack of achievement. Seeking shortcuts or incomplete efforts.',
    description: 'A dancing figure is surrounded by a wreath. The four creatures of the evangelists occupy the corners.',
  },

  // ========== MINOR ARCANA - WANDS (14 cards) ==========
  ...generateSuit('Wands', 'Fire element representing passion, creativity, and ambition'),
  
  // ========== MINOR ARCANA - CUPS (14 cards) ==========
  ...generateSuit('Cups', 'Water element representing emotions, relationships, and intuition'),
  
  // ========== MINOR ARCANA - SWORDS (14 cards) ==========
  ...generateSuit('Swords', 'Air element representing intellect, conflict, and truth'),
  
  // ========== MINOR ARCANA - PENTACLES (14 cards) ==========
  ...generateSuit('Pentacles', 'Earth element representing material aspects, career, and health'),
];

function generateSuit(suit: 'Wands' | 'Cups' | 'Swords' | 'Pentacles', suitDescription: string): TarotCardInfo[] {
  const suitMeanings: Record<string, { keywords: string[], upright: string, reversed: string, desc: string }[]> = {
    Wands: [
      { keywords: ['New opportunity', 'Inspiration', 'Potential'], upright: 'New beginnings, inspiration, potential. A spark of creative energy.', reversed: 'Delays, lack of direction. Creative blocks.', desc: 'A hand emerges from a cloud holding a sprouting wand.' },
      { keywords: ['Planning', 'Future', 'Progress'], upright: 'Future planning, progress, decisions. The world is your oyster.', reversed: 'Fear of unknown, lack of planning. Staying in comfort zone.', desc: 'A figure holds a globe and wand, looking out over the sea.' },
      { keywords: ['Expansion', 'Foresight', 'Leadership'], upright: 'Expansion, foresight, overseas opportunities. Your ships are coming in.', reversed: 'Playing small, lack of foresight. Delays in plans.', desc: 'A figure watches ships sail from a cliff, holding wands.' },
      { keywords: ['Celebration', 'Harmony', 'Home'], upright: 'Celebration, harmony, homecoming. A time of joy and stability.', reversed: 'Lack of support, instability. Feeling unwelcome.', desc: 'People dance holding wands aloft, a wreath-covered castle behind.' },
      { keywords: ['Competition', 'Conflict', 'Tension'], upright: 'Competition, rivalry, conflict. Healthy competition leads to growth.', reversed: 'Avoiding conflict, inner conflict. Overwhelming competition.', desc: 'Five figures brandish wands in struggle or sport.' },
      { keywords: ['Victory', 'Recognition', 'Pride'], upright: 'Victory, success, public recognition. You have triumphed.', reversed: 'Ego, fall from grace. Seeking external validation.', desc: 'A victor on horseback receives acclaim, wand held high.' },
      { keywords: ['Courage', 'Challenge', 'Perseverance'], upright: 'Challenge, competition, perseverance. Stand your ground.', reversed: 'Overwhelmed, giving up. Feeling attacked from all sides.', desc: 'A figure defends their position against six wands.' },
      { keywords: ['Speed', 'Movement', 'Swift action'], upright: 'Speed, action, swift change. Things are moving quickly.', reversed: 'Delays, frustration. Waiting for results.', desc: 'Eight wands fly through the air toward their target.' },
      { keywords: ['Resilience', 'Persistence', 'Boundaries'], upright: 'Resilience, grit, boundaries. Defending what matters.', reversed: 'Exhaustion, giving up. Overwhelmed by challenges.', desc: 'A bandaged figure guards their wands, battered but standing.' },
      { keywords: ['Burden', 'Responsibility', 'Hard work'], upright: 'Burden, responsibility, hard work. Carrying too much alone.', reversed: 'Delegation, release. Learning to share the load.', desc: 'A figure struggles under the weight of ten wands.' },
      { keywords: ['Exploration', 'Enthusiasm', 'Discovery'], upright: 'Enthusiasm, exploration, free spirit. Adventure calls.', reversed: 'Lack of direction, frustration. Unfocused energy.', desc: 'A youth holds a wand, gazing at distant mountains.' },
      { keywords: ['Action', 'Passion', 'Adventure'], upright: 'Energy, passion, adventure. Charging forward fearlessly.', reversed: 'Haste, impatience. Acting without thinking.', desc: 'A knight charges forward on horseback, wand raised.' },
      { keywords: ['Courage', 'Confidence', 'Independence'], upright: 'Courage, determination, independence. Bold and self-assured.', reversed: 'Selfishness, jealousy. Domineering behavior.', desc: 'A queen sits on her throne, sunflowers and a black cat beside her.' },
      { keywords: ['Vision', 'Leadership', 'Honor'], upright: 'Leadership, vision, entrepreneur. Bold and inspiring.', reversed: 'Overbearing, impulsive. Poor leadership.', desc: 'A king sits on a throne decorated with salamanders, holding a wand.' },
    ],
    Cups: [
      { keywords: ['New feelings', 'Intuition', 'Creativity'], upright: 'New feelings, intuition, creativity. Emotional new beginning.', reversed: 'Emotional loss, blocked creativity. Repressed feelings.', desc: 'A hand holds a cup from which water overflows with lotus flowers.' },
      { keywords: ['Unity', 'Partnership', 'Connection'], upright: 'Unified love, partnership, mutual attraction. Deep connection.', reversed: 'Imbalance, broken communication. Disharmony in relationships.', desc: 'Two figures exchange cups beneath a winged lion head.' },
      { keywords: ['Friendship', 'Celebration', 'Community'], upright: 'Celebration, friendship, creativity. Joyful gatherings.', reversed: 'Overindulgence, gossip. Superficial connections.', desc: 'Three figures dance and raise cups in celebration.' },
      { keywords: ['Meditation', 'Apathy', 'Contemplation'], upright: 'Meditation, contemplation, apathy. Need for inner reflection.', reversed: 'Retreat, withdrawal. Missing opportunities due to passivity.', desc: 'A figure sits beneath a tree, ignoring an offered cup.' },
      { keywords: ['Loss', 'Grief', 'Regret'], upright: 'Regret, failure, disappointment. Focusing on what is lost.', reversed: 'Acceptance, moving on. Learning from loss.', desc: 'A cloaked figure mourns three spilled cups, two remain upright.' },
      { keywords: ['Nostalgia', 'Memories', 'Innocence'], upright: 'Nostalgia, childhood memories, innocence. Looking to the past.', reversed: 'Stuck in past, unrealistic. Inability to move forward.', desc: 'A child offers cups of flowers to another child.' },
      { keywords: ['Choices', 'Fantasy', 'Illusion'], upright: 'Choices, fantasy, wishful thinking. Many options, but choose wisely.', reversed: 'Alignment, personal values. Making grounded decisions.', desc: 'A figure gazes at cups floating in clouds, filled with various images.' },
      { keywords: ['Walking away', 'Seeking truth', 'Disillusionment'], upright: 'Walking away, seeking truth, disillusionment. Leaving behind what no longer serves.', reversed: 'Avoidance, fear of change. Staying in comfortable misery.', desc: 'A cloaked figure walks away from stacked cups toward mountains.' },
      { keywords: ['Contentment', 'Satisfaction', 'Gratitude'], upright: 'Contentment, satisfaction, gratitude. Wishes fulfilled.', reversed: 'Greed, dissatisfaction. Taking blessings for granted.', desc: 'A satisfied figure sits with arms crossed, nine cups behind them.' },
      { keywords: ['Happiness', 'Fulfillment', 'Family'], upright: 'Happiness, fulfillment, harmony. Emotional and familial bliss.', reversed: 'Broken family, misalignment. Discord in relationships.', desc: 'A couple with children beneath a rainbow of cups.' },
      { keywords: ['Creativity', 'Romance', 'Intuition'], upright: 'Creative opportunity, intuition, romance. Messages of the heart.', reversed: 'Emotional immaturity, creative blocks. Unrealistic expectations.', desc: 'A youth contemplates a cup with a fish emerging from it.' },
      { keywords: ['Romance', 'Charm', 'Imagination'], upright: 'Romance, charm, imagination. A dreamer and romantic.', reversed: 'Moodiness, jealousy. Unrealistic idealism.', desc: 'A knight rides slowly, bearing a cup, focused on inner vision.' },
      { keywords: ['Compassion', 'Calm', 'Comfort'], upright: 'Compassion, calm, comfort. Nurturing and emotionally secure.', reversed: 'Martyrdom, insecurity. Giving too much of yourself.', desc: 'A queen gazes at an ornate cup on her throne by the sea.' },
      { keywords: ['Emotional balance', 'Diplomacy', 'Generosity'], upright: 'Emotional balance, diplomacy, generosity. Wise and compassionate.', reversed: 'Emotional manipulation, moodiness. Using feelings against others.', desc: 'A king holds a cup and scepter on a throne surrounded by sea.' },
    ],
    Swords: [
      { keywords: ['Breakthrough', 'Clarity', 'Truth'], upright: 'Breakthrough, new ideas, mental clarity. Truth revealed.', reversed: 'Confusion, chaos. Using intellect harmfully.', desc: 'A hand grasps a sword crowned with a wreath.' },
      { keywords: ['Difficult choices', 'Stalemate', 'Avoidance'], upright: 'Difficult choices, stalemate, avoidance. Refusing to see.', reversed: 'Indecision, confusion. Feeling trapped between options.', desc: 'A blindfolded figure balances two swords, water behind.' },
      { keywords: ['Heartbreak', 'Sorrow', 'Grief'], upright: 'Heartbreak, emotional pain, sorrow. Processing grief.', reversed: 'Recovery, forgiveness. Moving past pain.', desc: 'Three swords pierce a heart amid rain clouds.' },
      { keywords: ['Rest', 'Recovery', 'Contemplation'], upright: 'Rest, restoration, contemplation. Time to recharge.', reversed: 'Restlessness, burnout. Difficulty finding peace.', desc: 'A figure lies in repose beneath three swords on the wall.' },
      { keywords: ['Conflict', 'Tension', 'Competition'], upright: 'Conflict, disagreements, competition. Win at all costs mentality.', reversed: 'Reconciliation, resolution. Moving past conflict.', desc: 'A victor gathers swords while others walk away.' },
      { keywords: ['Transition', 'Change', 'Moving on'], upright: 'Transition, change, rite of passage. Moving toward calmer waters.', reversed: 'Resistance to change, unfinished business. Stuck in turbulent times.', desc: 'A figure guides a boat with six swords through water.' },
      { keywords: ['Deception', 'Strategy', 'Cunning'], upright: 'Deception, trickery, strategy. Acting behind the scenes.', reversed: 'Coming clean, conscience. Secrets about to be revealed.', desc: 'A figure sneaks away from a camp carrying swords.' },
      { keywords: ['Restriction', 'Imprisonment', 'Victim mentality'], upright: 'Restriction, imprisonment, self-limiting beliefs. Feeling trapped.', reversed: 'Self-acceptance, new perspective. Finding a way out.', desc: 'A bound and blindfolded figure surrounded by swords.' },
      { keywords: ['Anxiety', 'Worry', 'Fear'], upright: 'Anxiety, worry, fear. Nightmares and mental anguish.', reversed: 'Hope, reaching out. Beginning to see the light.', desc: 'A figure sits up in bed, head in hands, nine swords on wall.' },
      { keywords: ['Painful ending', 'Loss', 'Betrayal'], upright: 'Painful ending, deep wounds, betrayal. Rock bottom.', reversed: 'Recovery, regeneration. The worst is over.', desc: 'A figure lies face down, ten swords in their back.' },
      { keywords: ['Curiosity', 'Vigilance', 'New ideas'], upright: 'Curiosity, new ideas, thirst for knowledge. Alert and watchful.', reversed: 'Deception, rumors. All talk, no action.', desc: 'A youth holds a sword aloft, gazing at the sky.' },
      { keywords: ['Action', 'Ambition', 'Single-minded'], upright: 'Ambitious, action-oriented, driven. Charging into battle.', reversed: 'Impulsive, burnout. Acting without planning.', desc: 'A knight charges forward at full speed, sword raised.' },
      { keywords: ['Independence', 'Logic', 'Boundaries'], upright: 'Clear boundaries, independent, unbiased judgment. Sharp mind.', reversed: 'Cold, cruel. Using intelligence to hurt.', desc: 'A queen sits on a throne decorated with butterflies, sword raised.' },
      { keywords: ['Authority', 'Truth', 'Discipline'], upright: 'Mental clarity, intellectual power, authority, truth. Wise judgment.', reversed: 'Manipulation, tyranny. Abuse of power.', desc: 'A king sits on a throne with sword raised, clouds behind.' },
    ],
    Pentacles: [
      { keywords: ['Opportunity', 'Manifestation', 'New venture'], upright: 'New financial opportunity, manifestation, abundance. Seeds planted.', reversed: 'Lost opportunity, lack of planning. Poor investment.', desc: 'A hand holds a golden pentacle over a lush garden.' },
      { keywords: ['Balance', 'Adaptability', 'Time management'], upright: 'Multiple priorities, time management, adaptability. Juggling life.', reversed: 'Overwhelmed, disorganized. Dropping the ball.', desc: 'A figure juggles two pentacles connected by an infinity symbol.' },
      { keywords: ['Teamwork', 'Skill', 'Collaboration'], upright: 'Teamwork, collaboration, learning. Building something together.', reversed: 'Lack of teamwork, disregard for skills. Poor collaboration.', desc: 'An architect reviews plans with two craftsmen.' },
      { keywords: ['Security', 'Control', 'Stability'], upright: 'Saving, security, conservatism. Protecting what you have.', reversed: 'Greed, materialism. Excessive attachment to possessions.', desc: 'A figure clings to pentacles, city behind, more underfoot.' },
      { keywords: ['Hardship', 'Loss', 'Isolation'], upright: 'Financial loss, poverty, isolation. Hard times.', reversed: 'Recovery, spiritual growth. Finding what truly matters.', desc: 'Two figures walk through snow past a lit church window.' },
      { keywords: ['Generosity', 'Charity', 'Sharing'], upright: 'Generosity, charity, sharing wealth. Giving and receiving.', reversed: 'Debt, greed. Unfair distribution of resources.', desc: 'A wealthy merchant gives coins to beggars.' },
      { keywords: ['Investment', 'Patience', 'Long-term view'], upright: 'Long-term view, sustainable results, perseverance. Hard work pays off.', reversed: 'Lack of growth, impatience. Short-term thinking.', desc: 'A farmer gazes at pentacles growing on a bush.' },
      { keywords: ['Apprenticeship', 'Skill development', 'Diligence'], upright: 'Apprenticeship, skill development, passion. Mastering your craft.', reversed: 'Lack of focus, uninspired. Going through the motions.', desc: 'An artisan carefully crafts pentacles at a workbench.' },
      { keywords: ['Luxury', 'Independence', 'Refinement'], upright: 'Abundance, luxury, self-sufficiency. Enjoying the fruits of labor.', reversed: 'Over-investment in work, superficiality. Neglecting relationships.', desc: 'A wealthy woman stands in a garden full of pentacles.' },
      { keywords: ['Legacy', 'Inheritance', 'Family'], upright: 'Legacy, inheritance, family. Generational wealth and wisdom.', reversed: 'Family disputes, bankruptcy. Lost inheritance.', desc: 'An elderly couple sits with family beneath an archway of pentacles.' },
      { keywords: ['New skills', 'Study', 'Opportunity'], upright: 'Manifestation, new skills, opportunity. Student of life.', reversed: 'Lack of focus, procrastination. Missed opportunities.', desc: 'A youth studies a pentacle with mountains behind.' },
      { keywords: ['Hard work', 'Routine', 'Methodical'], upright: 'Hard work, routine, responsibility. Steady progress.', reversed: 'Workaholic, burnout. Losing sight of goals.', desc: 'A knight rides slowly, focused on the pentacle he holds.' },
      { keywords: ['Nurturing', 'Abundance', 'Security'], upright: 'Nurturing, abundance, financial security. Provider and caretaker.', reversed: 'Self-care neglect, smothering. Codependency.', desc: 'A queen sits surrounded by nature and a rabbit, holding a pentacle.' },
      { keywords: ['Wealth', 'Security', 'Success'], upright: 'Wealth, business, leadership, security. Material success achieved.', reversed: 'Greed, materialism. Obsession with wealth.', desc: 'A king sits on a throne decorated with bulls, surrounded by pentacles.' },
    ],
  };

  const courtNames = ['Page', 'Knight', 'Queen', 'King'];
  const meanings = suitMeanings[suit];
  
  return meanings.map((m, i) => {
    const isCourtCard = i >= 10;
    const number = isCourtCard ? courtNames[i - 10] : (i + 1).toString();
    const name = isCourtCard ? `${courtNames[i - 10]} of ${suit}` : `${getNumberWord(i + 1)} of ${suit}`;
    
    return {
      id: `${suit.toLowerCase()}-${String(i + 1).padStart(2, '0')}`,
      name,
      number,
      arcana: 'Minor' as const,
      suit,
      keywords: m.keywords,
      uprightMeaning: m.upright,
      reversedMeaning: m.reversed,
      description: m.desc,
    };
  });
}

function getNumberWord(n: number): string {
  const words = ['', 'Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];
  return words[n] || n.toString();
}

// Get Major Arcana only
export const getMajorArcana = () => TAROT_LIBRARY.filter(c => c.arcana === 'Major');

// Get Minor Arcana only  
export const getMinorArcana = () => TAROT_LIBRARY.filter(c => c.arcana === 'Minor');

// Get cards by suit
export const getCardsBySuit = (suit: 'Wands' | 'Cups' | 'Swords' | 'Pentacles') => 
  TAROT_LIBRARY.filter(c => c.suit === suit);

// Find card by name
export const findCardByName = (name: string) => 
  TAROT_LIBRARY.find(c => c.name.toLowerCase().includes(name.toLowerCase()));

