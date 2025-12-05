import React from 'react';

export interface QuestionCategory {
  id: string;
  name: string;
  nameCN: string;
  icon: string;
  color: string;
  keywords: string[];
}

export const CATEGORIES: QuestionCategory[] = [
  {
    id: 'love',
    name: 'Love & Relationships',
    nameCN: 'Love',
    icon: 'heart',
    color: 'from-pink-500 to-rose-600',
    keywords: ['romance', 'partner', 'marriage', 'dating', 'soulmate'],
  },
  {
    id: 'career',
    name: 'Career & Work',
    nameCN: 'Career',
    icon: 'briefcase',
    color: 'from-blue-500 to-indigo-600',
    keywords: ['job', 'promotion', 'business', 'success', 'profession'],
  },
  {
    id: 'finance',
    name: 'Money & Finance',
    nameCN: 'Finance',
    icon: 'coin',
    color: 'from-yellow-500 to-amber-600',
    keywords: ['wealth', 'investment', 'prosperity', 'abundance'],
  },
  {
    id: 'health',
    name: 'Health & Wellness',
    nameCN: 'Health',
    icon: 'leaf',
    color: 'from-green-500 to-emerald-600',
    keywords: ['healing', 'vitality', 'wellbeing', 'energy'],
  },
  {
    id: 'spiritual',
    name: 'Spiritual Growth',
    nameCN: 'Spirit',
    icon: 'crystal',
    color: 'from-purple-500 to-violet-600',
    keywords: ['purpose', 'meaning', 'destiny', 'enlightenment'],
  },
  {
    id: 'general',
    name: 'General Guidance',
    nameCN: 'General',
    icon: 'star',
    color: 'from-mystic-gold to-amber-500',
    keywords: ['guidance', 'advice', 'direction'],
  },
];

// SVG Icon component for categories
const CategoryIcon: React.FC<{ icon: string; className?: string }> = ({ icon, className = "w-6 h-6" }) => {
  const icons: Record<string, React.ReactNode> = {
    heart: (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
    ),
    briefcase: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
      </svg>
    ),
    coin: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    ),
    leaf: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12.5c0-5 4-9.5 9.5-9.5C19 3 21 5 21 9.5c0 5.5-4.5 9.5-9.5 9.5-2.5 0-4.5-1-6-2.5M5 12.5c0 2.5 1 4.5 2.5 6M5 12.5L3 21l8.5-2.5"/>
      </svg>
    ),
    crystal: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L4 8l8 14 8-14-8-6zM12 2v20M4 8h16"/>
      </svg>
    ),
    star: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/>
      </svg>
    ),
  };
  
  return <>{icons[icon] || icons.star}</>;
};

interface CategorySelectorProps {
  selectedCategory: QuestionCategory | null;
  onSelect: (category: QuestionCategory) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ selectedCategory, onSelect }) => {
  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <p className="text-center text-mystic-goldDim/60 text-sm mb-4 uppercase tracking-widest">
        What area of life does your question concern?
      </p>
      
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat)}
            className={`p-3 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2 group ${
              selectedCategory?.id === cat.id
                ? 'border-mystic-gold bg-mystic-gold/10 shadow-[0_0_15px_rgba(255,215,0,0.2)] scale-105'
                : 'border-mystic-gold/10 hover:border-mystic-gold/40 bg-mystic-900/30 hover:bg-mystic-900/50'
            }`}
          >
            <span className={`transition-transform ${selectedCategory?.id === cat.id ? 'scale-110 text-mystic-gold' : 'text-gray-400 group-hover:scale-110 group-hover:text-white'}`}>
              <CategoryIcon icon={cat.icon} className="w-6 h-6" />
            </span>
            <span className={`text-xs font-medium ${
              selectedCategory?.id === cat.id ? 'text-mystic-gold' : 'text-gray-400 group-hover:text-white'
            }`}>
              {cat.nameCN}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;

