export interface TarotCardInfo {
  id: string;
  name: string;
  nameCN: string;
  arcana: 'Major' | 'Minor';
  suit?: 'Wands' | 'Cups' | 'Swords' | 'Pentacles';
  number?: number;
  keywords: string[];
  keywordsCN: string[];
  upright: string;
  reversed: string;
  uprightCN: string;
  reversedCN: string;
  description: string;
  element?: string;
  zodiac?: string;
  planet?: string;
}

// Major Arcana (22 cards)
export const MAJOR_ARCANA: TarotCardInfo[] = [
  {
    id: '00',
    name: 'The Fool',
    nameCN: '愚者',
    arcana: 'Major',
    keywords: ['New beginnings', 'Innocence', 'Adventure', 'Freedom'],
    keywordsCN: ['新开始', '纯真', '冒险', '自由'],
    upright: 'New beginnings, innocence, spontaneity, a free spirit',
    reversed: 'Recklessness, taken advantage of, inconsideration',
    uprightCN: '新的开始、纯真、自发性、自由的灵魂',
    reversedCN: '鲁莽、被利用、考虑不周',
    description: 'The Fool represents new beginnings and having faith in the future.',
    planet: 'Uranus',
  },
  {
    id: '01',
    name: 'The Magician',
    nameCN: '魔术师',
    arcana: 'Major',
    keywords: ['Manifestation', 'Power', 'Action', 'Resourcefulness'],
    keywordsCN: ['显化', '力量', '行动', '足智多谋'],
    upright: 'Willpower, desire, creation, manifestation',
    reversed: 'Trickery, illusions, out of touch',
    uprightCN: '意志力、欲望、创造、显化',
    reversedCN: '欺骗、幻觉、脱离现实',
    description: 'The Magician represents the power to manifest your desires.',
    planet: 'Mercury',
  },
  {
    id: '02',
    name: 'The High Priestess',
    nameCN: '女祭司',
    arcana: 'Major',
    keywords: ['Intuition', 'Mystery', 'Subconscious', 'Inner voice'],
    keywordsCN: ['直觉', '神秘', '潜意识', '内心的声音'],
    upright: 'Intuition, sacred knowledge, divine feminine, the subconscious mind',
    reversed: 'Secrets, disconnected from intuition, withdrawal',
    uprightCN: '直觉、神圣知识、神圣女性、潜意识',
    reversedCN: '秘密、与直觉脱节、退缩',
    description: 'The High Priestess represents intuition and hidden knowledge.',
    planet: 'Moon',
  },
  {
    id: '03',
    name: 'The Empress',
    nameCN: '女皇',
    arcana: 'Major',
    keywords: ['Abundance', 'Fertility', 'Nature', 'Nurturing'],
    keywordsCN: ['丰盛', '繁殖力', '自然', '滋养'],
    upright: 'Femininity, beauty, nature, nurturing, abundance',
    reversed: 'Creative block, dependence on others',
    uprightCN: '女性气质、美丽、自然、滋养、丰盛',
    reversedCN: '创作障碍、依赖他人',
    description: 'The Empress represents fertility, abundance and the natural world.',
    planet: 'Venus',
  },
  {
    id: '04',
    name: 'The Emperor',
    nameCN: '皇帝',
    arcana: 'Major',
    keywords: ['Authority', 'Structure', 'Control', 'Fatherhood'],
    keywordsCN: ['权威', '结构', '控制', '父性'],
    upright: 'Authority, establishment, structure, a father figure',
    reversed: 'Domination, excessive control, lack of discipline',
    uprightCN: '权威、建立、结构、父亲形象',
    reversedCN: '支配、过度控制、缺乏纪律',
    description: 'The Emperor represents structure, authority and stability.',
    zodiac: 'Aries',
  },
  {
    id: '05',
    name: 'The Hierophant',
    nameCN: '教皇',
    arcana: 'Major',
    keywords: ['Tradition', 'Conformity', 'Morality', 'Ethics'],
    keywordsCN: ['传统', '服从', '道德', '伦理'],
    upright: 'Spiritual wisdom, religious beliefs, conformity, tradition',
    reversed: 'Personal beliefs, freedom, challenging the status quo',
    uprightCN: '精神智慧、宗教信仰、服从、传统',
    reversedCN: '个人信念、自由、挑战现状',
    description: 'The Hierophant represents spiritual wisdom and religious beliefs.',
    zodiac: 'Taurus',
  },
  {
    id: '06',
    name: 'The Lovers',
    nameCN: '恋人',
    arcana: 'Major',
    keywords: ['Love', 'Harmony', 'Relationships', 'Choices'],
    keywordsCN: ['爱', '和谐', '关系', '选择'],
    upright: 'Love, harmony, relationships, values alignment, choices',
    reversed: 'Self-love, disharmony, imbalance, misalignment',
    uprightCN: '爱、和谐、关系、价值观一致、选择',
    reversedCN: '自爱、不和谐、失衡、不一致',
    description: 'The Lovers represents love, choices and harmony.',
    zodiac: 'Gemini',
  },
  {
    id: '07',
    name: 'The Chariot',
    nameCN: '战车',
    arcana: 'Major',
    keywords: ['Control', 'Willpower', 'Success', 'Determination'],
    keywordsCN: ['控制', '意志力', '成功', '决心'],
    upright: 'Control, willpower, success, action, determination',
    reversed: 'Self-discipline, opposition, lack of direction',
    uprightCN: '控制、意志力、成功、行动、决心',
    reversedCN: '自律、对立、缺乏方向',
    description: 'The Chariot represents triumph through determination.',
    zodiac: 'Cancer',
  },
  {
    id: '08',
    name: 'Strength',
    nameCN: '力量',
    arcana: 'Major',
    keywords: ['Courage', 'Patience', 'Influence', 'Compassion'],
    keywordsCN: ['勇气', '耐心', '影响力', '慈悲'],
    upright: 'Strength, courage, patience, influence, compassion',
    reversed: 'Inner strength, self-doubt, low energy',
    uprightCN: '力量、勇气、耐心、影响力、慈悲',
    reversedCN: '内在力量、自我怀疑、精力不足',
    description: 'Strength represents inner power and courage.',
    zodiac: 'Leo',
  },
  {
    id: '09',
    name: 'The Hermit',
    nameCN: '隐士',
    arcana: 'Major',
    keywords: ['Soul-searching', 'Introspection', 'Guidance', 'Solitude'],
    keywordsCN: ['灵魂探索', '内省', '指引', '独处'],
    upright: 'Soul-searching, introspection, being alone, inner guidance',
    reversed: 'Isolation, loneliness, withdrawal',
    uprightCN: '灵魂探索、内省、独处、内在指引',
    reversedCN: '孤立、孤独、退缩',
    description: 'The Hermit represents contemplation and soul-searching.',
    zodiac: 'Virgo',
  },
  {
    id: '10',
    name: 'Wheel of Fortune',
    nameCN: '命运之轮',
    arcana: 'Major',
    keywords: ['Change', 'Cycles', 'Fate', 'Turning point'],
    keywordsCN: ['变化', '循环', '命运', '转折点'],
    upright: 'Good luck, karma, life cycles, destiny, a turning point',
    reversed: 'Bad luck, resistance to change, breaking cycles',
    uprightCN: '好运、业力、生命周期、命运、转折点',
    reversedCN: '厄运、抗拒变化、打破循环',
    description: 'The Wheel of Fortune represents cycles of change.',
    planet: 'Jupiter',
  },
  {
    id: '11',
    name: 'Justice',
    nameCN: '正义',
    arcana: 'Major',
    keywords: ['Justice', 'Fairness', 'Truth', 'Law'],
    keywordsCN: ['正义', '公平', '真相', '法律'],
    upright: 'Justice, fairness, truth, cause and effect, law',
    reversed: 'Unfairness, lack of accountability, dishonesty',
    uprightCN: '正义、公平、真相、因果、法律',
    reversedCN: '不公平、缺乏责任感、不诚实',
    description: 'Justice represents fairness, truth and law.',
    zodiac: 'Libra',
  },
  {
    id: '12',
    name: 'The Hanged Man',
    nameCN: '倒吊人',
    arcana: 'Major',
    keywords: ['Pause', 'Surrender', 'New perspective', 'Sacrifice'],
    keywordsCN: ['暂停', '臣服', '新视角', '牺牲'],
    upright: 'Pause, surrender, letting go, new perspectives',
    reversed: 'Delays, resistance, stalling, indecision',
    uprightCN: '暂停、臣服、放下、新视角',
    reversedCN: '延迟、抗拒、拖延、优柔寡断',
    description: 'The Hanged Man represents suspension and seeing things differently.',
    planet: 'Neptune',
  },
  {
    id: '13',
    name: 'Death',
    nameCN: '死神',
    arcana: 'Major',
    keywords: ['Endings', 'Change', 'Transformation', 'Transition'],
    keywordsCN: ['结束', '变化', '转变', '过渡'],
    upright: 'Endings, change, transformation, transition',
    reversed: 'Resistance to change, personal transformation, inner purging',
    uprightCN: '结束、变化、转变、过渡',
    reversedCN: '抗拒变化、个人转变、内心净化',
    description: 'Death represents transformation and endings leading to new beginnings.',
    zodiac: 'Scorpio',
  },
  {
    id: '14',
    name: 'Temperance',
    nameCN: '节制',
    arcana: 'Major',
    keywords: ['Balance', 'Moderation', 'Patience', 'Purpose'],
    keywordsCN: ['平衡', '节制', '耐心', '目标'],
    upright: 'Balance, moderation, patience, purpose',
    reversed: 'Imbalance, excess, self-healing, re-alignment',
    uprightCN: '平衡、节制、耐心、目标',
    reversedCN: '失衡、过度、自我疗愈、重新调整',
    description: 'Temperance represents balance and moderation.',
    zodiac: 'Sagittarius',
  },
  {
    id: '15',
    name: 'The Devil',
    nameCN: '恶魔',
    arcana: 'Major',
    keywords: ['Shadow self', 'Attachment', 'Addiction', 'Materialism'],
    keywordsCN: ['阴暗面', '执着', '成瘾', '物质主义'],
    upright: 'Shadow self, attachment, addiction, restriction, sexuality',
    reversed: 'Releasing limiting beliefs, exploring dark thoughts, detachment',
    uprightCN: '阴暗面、执着、成瘾、限制、性欲',
    reversedCN: '释放限制性信念、探索黑暗想法、超脱',
    description: 'The Devil represents bondage and materialism.',
    zodiac: 'Capricorn',
  },
  {
    id: '16',
    name: 'The Tower',
    nameCN: '塔',
    arcana: 'Major',
    keywords: ['Sudden change', 'Upheaval', 'Revelation', 'Awakening'],
    keywordsCN: ['突变', '剧变', '启示', '觉醒'],
    upright: 'Sudden change, upheaval, chaos, revelation, awakening',
    reversed: 'Personal transformation, fear of change, averting disaster',
    uprightCN: '突变、剧变、混乱、启示、觉醒',
    reversedCN: '个人转变、惧怕变化、避免灾难',
    description: 'The Tower represents sudden change and revelation.',
    planet: 'Mars',
  },
  {
    id: '17',
    name: 'The Star',
    nameCN: '星星',
    arcana: 'Major',
    keywords: ['Hope', 'Faith', 'Renewal', 'Inspiration'],
    keywordsCN: ['希望', '信念', '更新', '灵感'],
    upright: 'Hope, faith, purpose, renewal, spirituality',
    reversed: 'Lack of faith, despair, self-trust, disconnection',
    uprightCN: '希望、信念、目标、更新、灵性',
    reversedCN: '缺乏信念、绝望、自信、脱节',
    description: 'The Star represents hope, faith and renewal.',
    zodiac: 'Aquarius',
  },
  {
    id: '18',
    name: 'The Moon',
    nameCN: '月亮',
    arcana: 'Major',
    keywords: ['Illusion', 'Fear', 'Anxiety', 'Subconscious'],
    keywordsCN: ['幻觉', '恐惧', '焦虑', '潜意识'],
    upright: 'Illusion, fear, anxiety, subconscious, intuition',
    reversed: 'Release of fear, repressed emotion, inner confusion',
    uprightCN: '幻觉、恐惧、焦虑、潜意识、直觉',
    reversedCN: '释放恐惧、压抑的情感、内心困惑',
    description: 'The Moon represents illusion and the unconscious mind.',
    zodiac: 'Pisces',
  },
  {
    id: '19',
    name: 'The Sun',
    nameCN: '太阳',
    arcana: 'Major',
    keywords: ['Joy', 'Success', 'Celebration', 'Vitality'],
    keywordsCN: ['喜悦', '成功', '庆祝', '活力'],
    upright: 'Positivity, fun, warmth, success, vitality',
    reversed: 'Inner child, feeling down, overly optimistic',
    uprightCN: '积极、快乐、温暖、成功、活力',
    reversedCN: '内在小孩、情绪低落、过度乐观',
    description: 'The Sun represents joy, success and vitality.',
    planet: 'Sun',
  },
  {
    id: '20',
    name: 'Judgement',
    nameCN: '审判',
    arcana: 'Major',
    keywords: ['Judgement', 'Rebirth', 'Inner calling', 'Absolution'],
    keywordsCN: ['审判', '重生', '内在召唤', '赦免'],
    upright: 'Judgement, rebirth, inner calling, absolution',
    reversed: 'Self-doubt, inner critic, ignoring the call',
    uprightCN: '审判、重生、内在召唤、赦免',
    reversedCN: '自我怀疑、内在批评者、忽视召唤',
    description: 'Judgement represents rebirth and answering your calling.',
    planet: 'Pluto',
  },
  {
    id: '21',
    name: 'The World',
    nameCN: '世界',
    arcana: 'Major',
    keywords: ['Completion', 'Integration', 'Accomplishment', 'Travel'],
    keywordsCN: ['完成', '整合', '成就', '旅行'],
    upright: 'Completion, integration, accomplishment, travel',
    reversed: 'Seeking personal closure, short-cuts, delays',
    uprightCN: '完成、整合、成就、旅行',
    reversedCN: '寻求个人结束、捷径、延迟',
    description: 'The World represents completion and accomplishment.',
    planet: 'Saturn',
  },
];

// Minor Arcana suits info
export const SUITS = {
  Wands: { element: 'Fire', keywords: ['passion', 'creativity', 'action', 'energy'] },
  Cups: { element: 'Water', keywords: ['emotions', 'relationships', 'feelings', 'intuition'] },
  Swords: { element: 'Air', keywords: ['thoughts', 'communication', 'conflict', 'truth'] },
  Pentacles: { element: 'Earth', keywords: ['material', 'money', 'career', 'physical'] },
};

// Number names for Minor Arcana (must match tarotImageMap.ts)
const NUMBER_NAMES: Record<number, string> = {
  1: 'Ace',
  2: 'Two',
  3: 'Three',
  4: 'Four',
  5: 'Five',
  6: 'Six',
  7: 'Seven',
  8: 'Eight',
  9: 'Nine',
  10: 'Ten',
};

// Generate Minor Arcana cards
const generateMinorArcana = (suit: 'Wands' | 'Cups' | 'Swords' | 'Pentacles'): TarotCardInfo[] => {
  const suitCN = { Wands: '权杖', Cups: '圣杯', Swords: '宝剑', Pentacles: '星币' };
  const numberCN = ['', '王牌', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
  const courtCards = ['Page', 'Knight', 'Queen', 'King'];
  const courtCN = { Page: '侍从', Knight: '骑士', Queen: '王后', King: '国王' };
  
  const cards: TarotCardInfo[] = [];
  
  // Ace to 10 - Use word names like "Two of Wands" to match image mapping
  for (let i = 1; i <= 10; i++) {
    const name = `${NUMBER_NAMES[i]} of ${suit}`;
    const nameCN = i === 1 ? `${suitCN[suit]}王牌` : `${suitCN[suit]}${numberCN[i]}`;
    cards.push({
      id: `${suit.toLowerCase()}${i.toString().padStart(2, '0')}`,
      name,
      nameCN,
      arcana: 'Minor',
      suit,
      number: i,
      keywords: SUITS[suit].keywords,
      keywordsCN: [],
      upright: `${suit} energy at level ${i}`,
      reversed: `Blocked ${suit.toLowerCase()} energy`,
      uprightCN: `${suitCN[suit]}能量`,
      reversedCN: `${suitCN[suit]}能量受阻`,
      description: `The ${name} represents ${SUITS[suit].element} energy.`,
      element: SUITS[suit].element,
    });
  }
  
  // Court cards
  courtCards.forEach((court, idx) => {
    cards.push({
      id: `${suit.toLowerCase()}${(11 + idx).toString()}`,
      name: `${court} of ${suit}`,
      nameCN: `${suitCN[suit]}${courtCN[court as keyof typeof courtCN]}`,
      arcana: 'Minor',
      suit,
      number: 11 + idx,
      keywords: SUITS[suit].keywords,
      keywordsCN: [],
      upright: `${court} qualities with ${suit} energy`,
      reversed: `Immature ${court.toLowerCase()} qualities`,
      uprightCN: `${courtCN[court as keyof typeof courtCN]}特质`,
      reversedCN: `不成熟的${courtCN[court as keyof typeof courtCN]}特质`,
      description: `The ${court} of ${suit} represents ${SUITS[suit].element} personality.`,
      element: SUITS[suit].element,
    });
  });
  
  return cards;
};

export const MINOR_ARCANA: TarotCardInfo[] = [
  ...generateMinorArcana('Wands'),
  ...generateMinorArcana('Cups'),
  ...generateMinorArcana('Swords'),
  ...generateMinorArcana('Pentacles'),
];

export const ALL_CARDS: TarotCardInfo[] = [...MAJOR_ARCANA, ...MINOR_ARCANA];

