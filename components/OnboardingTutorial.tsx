import React, { useState, useEffect } from 'react';

interface OnboardingTutorialProps {
  onComplete: () => void;
  onSkip: () => void;
}

const TUTORIAL_STEPS = [
  {
    id: 1,
    title: "Welcome to Mystic Ink",
    subtitle: "Where Art Meets Divination",
    description: "This is not your ordinary tarot reading. Here, YOU become the channel for mystical energy through the power of your own drawings.",
    icon: "✦",
    visual: "intro",
  },
  {
    id: 2,
    title: "Ask Your Question",
    subtitle: "Focus Your Intent",
    description: "Begin by typing a question that weighs on your heart. Choose a category (Love, Career, etc.) and select your preferred spread layout.",
    icon: "❓",
    visual: "question",
    tips: ["Be specific but open-ended", "Focus on 'what' or 'how', not 'when'", "Trust your intuition"],
  },
  {
    id: 3,
    title: "Draw Your Energy",
    subtitle: "Channel Through Art",
    description: "For each card position, you'll receive a metaphorical prompt. Draw whatever comes to mind - abstract shapes, symbols, or scenes. There's no wrong way to draw!",
    icon: "🎨",
    visual: "drawing",
    tips: ["Don't overthink it", "Let your hand move freely", "Colors carry meaning too"],
  },
  {
    id: 4,
    title: "The Three Timeframes",
    subtitle: "Past • Present • Future",
    description: "In a classic 3-card spread, each drawing represents a different aspect of your journey:",
    icon: "⏳",
    visual: "timeframes",
    timeframes: [
      { name: "Past", desc: "What has shaped your current situation", color: "text-blue-400" },
      { name: "Present", desc: "Where you are right now", color: "text-mystic-gold" },
      { name: "Future", desc: "What's unfolding ahead", color: "text-purple-400" },
    ],
  },
  {
    id: 5,
    title: "Receive Your Reading",
    subtitle: "The Cards Speak",
    description: "Our AI oracle analyzes your drawings - the strokes, colors, and energy - to select the perfect tarot card for each position. Watch as your cards are revealed!",
    icon: "🔮",
    visual: "reveal",
    tips: ["Cards may appear reversed (upside-down)", "Reversed cards show blocked or shadow energy", "The final synthesis weaves all cards together"],
  },
  {
    id: 6,
    title: "You're Ready!",
    subtitle: "Begin Your Journey",
    description: "Trust the process, embrace the mystery, and let the cards guide you. Remember: the wisdom was within you all along.",
    icon: "🌟",
    visual: "ready",
  },
];

const OnboardingTutorial: React.FC<OnboardingTutorialProps> = ({ onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const step = TUTORIAL_STEPS[currentStep];
  const isLastStep = currentStep === TUTORIAL_STEPS.length - 1;

  const goNext = () => {
    if (isLastStep) {
      onComplete();
      return;
    }
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep(prev => prev + 1);
      setIsAnimating(false);
    }, 300);
  };

  const goPrev = () => {
    if (currentStep > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev - 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') goNext();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'Escape') onSkip();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep]);

  return (
    <div className="fixed inset-0 z-[200] bg-mystic-950 flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(147,51,234,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,215,0,0.1),transparent_50%)]"></div>
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-mystic-gold/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Skip Button */}
      <button
        onClick={onSkip}
        className="absolute top-6 right-6 text-mystic-goldDim/50 hover:text-mystic-gold text-sm uppercase tracking-widest transition-colors z-50"
      >
        Skip Tutorial →
      </button>

      {/* Progress Indicator */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-2">
        {TUTORIAL_STEPS.map((_, idx) => (
          <div
            key={idx}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              idx === currentStep ? 'w-8 bg-mystic-gold' : idx < currentStep ? 'w-4 bg-mystic-gold/50' : 'w-4 bg-mystic-gold/20'
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <div className={`relative max-w-2xl w-full mx-6 transition-all duration-300 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        
        {/* Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-mystic-900/80 border-2 border-mystic-gold/30 shadow-[0_0_40px_rgba(255,215,0,0.2)]">
            <span className="text-5xl">{step.icon}</span>
          </div>
        </div>

        {/* Text Content */}
        <div className="text-center mb-8">
          <p className="text-mystic-accent text-xs uppercase tracking-[0.3em] mb-2">{step.subtitle}</p>
          <h2 className="font-serif text-4xl md:text-5xl text-mystic-gold mb-6">{step.title}</h2>
          <p className="text-gray-300 text-lg leading-relaxed max-w-xl mx-auto">{step.description}</p>
        </div>

        {/* Dynamic Content Based on Step */}
        {step.tips && (
          <div className="bg-mystic-900/50 rounded-xl p-6 mb-8 border border-mystic-gold/10">
            <p className="text-mystic-goldDim text-xs uppercase tracking-widest mb-4">Pro Tips</p>
            <ul className="space-y-2">
              {step.tips.map((tip, idx) => (
                <li key={idx} className="flex items-center gap-3 text-gray-400">
                  <span className="text-mystic-gold">✦</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {step.timeframes && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {step.timeframes.map((tf, idx) => (
              <div key={idx} className="bg-mystic-900/50 rounded-xl p-4 border border-mystic-gold/10 text-center">
                <h4 className={`font-serif text-xl mb-2 ${tf.color}`}>{tf.name}</h4>
                <p className="text-gray-500 text-sm">{tf.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={goPrev}
            className={`px-6 py-3 text-mystic-goldDim hover:text-mystic-gold transition-colors ${currentStep === 0 ? 'invisible' : ''}`}
          >
            ← Back
          </button>

          <button
            onClick={goNext}
            className="px-10 py-4 bg-gradient-to-r from-mystic-gold to-yellow-600 text-mystic-900 font-bold rounded-lg hover:shadow-[0_0_30px_rgba(255,215,0,0.4)] transition-all"
          >
            {isLastStep ? "Begin Reading" : "Continue"}
          </button>

          <div className="w-20"></div>
        </div>

        {/* Keyboard hint */}
        <p className="text-center text-mystic-goldDim/30 text-xs mt-8">
          Use arrow keys to navigate • ESC to skip
        </p>
      </div>
    </div>
  );
};

export default OnboardingTutorial;
