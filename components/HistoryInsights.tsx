import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  getMonthlyStats, 
  getYearlyStats, 
  MonthlyStats, 
  YearlyStats,
  CardFrequency 
} from '../utils/historyManager';
import { getTarotCardImagePath } from '../utils/tarotImageMap';
import { generatePeriodAnalysis, PeriodAnalysisResult } from '../services/geminiService';

interface HistoryInsightsProps {
  isOpen: boolean;
  onClose: () => void;
}

type ViewMode = 'monthly' | 'yearly';

const HistoryInsights: React.FC<HistoryInsightsProps> = ({ isOpen, onClose }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('monthly');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  
  // AI Analysis State
  const [aiAnalysis, setAiAnalysis] = useState<PeriodAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAiPanel, setShowAiPanel] = useState(false);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];

  const monthlyStats = useMemo(() => 
    getMonthlyStats(selectedYear, selectedMonth), [selectedYear, selectedMonth]);
  
  const yearlyStats = useMemo(() => 
    getYearlyStats(selectedYear), [selectedYear]);

  const stats = viewMode === 'monthly' ? monthlyStats : yearlyStats;

  // Generate years for selector (current year and 2 previous)
  const years = [selectedYear, selectedYear - 1, selectedYear - 2];

  // Get period label for display
  const periodLabel = viewMode === 'monthly' 
    ? `${monthNames[selectedMonth]} ${selectedYear}`
    : `${selectedYear}`;

  // Handle AI Analysis
  const handleGenerateAnalysis = async () => {
    if (stats.totalReadings === 0) return;
    
    setIsAnalyzing(true);
    setShowAiPanel(true);
    
    try {
      const categories = 'categories' in stats ? stats.categories : [];
      const analysis = await generatePeriodAnalysis(
        viewMode,
        periodLabel,
        stats.totalReadings,
        stats.topCards,
        stats.reversedPercentage,
        categories
      );
      setAiAnalysis(analysis);
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Reset AI analysis when changing period/view
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    setAiAnalysis(null);
    setShowAiPanel(false);
  };

  if (!isOpen) return null;

  const CardFrequencyItem: React.FC<{ card: CardFrequency; index: number }> = ({ card, index }) => {
    const imagePath = getTarotCardImagePath(card.name);
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
        className="flex items-center gap-3 p-3 bg-mystic-800/30 rounded-xl border border-mystic-gold/10 hover:border-mystic-gold/30 transition-all"
      >
        <div className="w-10 h-14 rounded overflow-hidden border border-mystic-gold/30 flex-shrink-0">
          {imagePath ? (
            <img src={imagePath} alt={card.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-mystic-900 flex items-center justify-center">
              <svg className="w-3 h-3 text-mystic-gold" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0L14.59 8.41L24 12L14.59 15.59L12 24L9.41 15.59L0 12L9.41 8.41L12 0Z" /></svg>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-serif truncate">{card.name}</p>
          <p className="text-mystic-goldDim/60 text-xs">{card.arcana}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-mystic-gold font-bold">{card.count}×</p>
          {card.reversedCount > 0 && (
            <p className="text-red-400/70 text-xs">{card.reversedCount} reversed</p>
          )}
        </div>
      </motion.div>
    );
  };

  // SVG Icon helper for stats
const StatIcon: React.FC<{ icon: string }> = ({ icon }) => {
    const icons: Record<string, React.ReactNode> = {
      star: <svg className="w-5 h-5 text-mystic-gold" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0L14.59 8.41L24 12L14.59 15.59L12 24L9.41 15.59L0 12L9.41 8.41L12 0Z" /></svg>,
      rotate: <svg className="w-5 h-5 text-mystic-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
      calendar: <svg className="w-5 h-5 text-mystic-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
      card: <svg className="w-5 h-5 text-mystic-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2zM8 4h12a2 2 0 012 2v10" /></svg>,
    };
    return <>{icons[icon] || icons.star}</>;
  };

  const StatCard: React.FC<{ label: string; value: string | number; icon: string; color?: string }> = 
    ({ label, value, icon, color = 'text-mystic-gold' }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-mystic-800/30 rounded-xl p-4 border border-mystic-gold/10"
    >
      <div className="flex items-center gap-2 mb-2">
        <StatIcon icon={icon} />
        <span className="text-mystic-goldDim/60 text-xs uppercase tracking-widest">{label}</span>
      </div>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </motion.div>
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md overflow-y-auto py-8"
      >
        <div className="absolute inset-0" onClick={onClose}></div>
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          className="relative w-full max-w-4xl mx-4 my-auto"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-mystic-900 border-2 border-mystic-gold/50 flex items-center justify-center text-mystic-gold hover:bg-mystic-gold hover:text-mystic-900 transition-all z-50"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="bg-gradient-to-b from-mystic-900 via-mystic-950 to-black rounded-2xl border border-mystic-gold/40 overflow-hidden">
            
            {/* Header */}
            <div className="p-6 border-b border-mystic-gold/20 text-center">
              <h2 className="font-serif text-3xl text-mystic-gold mb-2">Energy Insights</h2>
              <p className="text-mystic-goldDim/60 text-sm">Discover patterns in your spiritual journey</p>
            </div>

            {/* View Mode Toggle & Time Selector */}
            <div className="p-4 border-b border-mystic-gold/10 flex flex-col sm:flex-row gap-4 items-center justify-between">
              {/* View Mode Toggle */}
              <div className="flex bg-mystic-800/50 p-1 rounded-xl">
                <button
                  onClick={() => handleViewModeChange('monthly')}
                  className={`px-4 py-2 rounded-lg text-sm transition-all ${
                    viewMode === 'monthly' 
                      ? 'bg-mystic-gold text-mystic-900 font-bold' 
                      : 'text-mystic-goldDim hover:text-white'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => handleViewModeChange('yearly')}
                  className={`px-4 py-2 rounded-lg text-sm transition-all ${
                    viewMode === 'yearly' 
                      ? 'bg-mystic-gold text-mystic-900 font-bold' 
                      : 'text-mystic-goldDim hover:text-white'
                  }`}
                >
                  Yearly
                </button>
              </div>

              {/* Time Selector */}
              <div className="flex gap-2">
                {viewMode === 'monthly' && (
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    className="bg-mystic-800/50 border border-mystic-gold/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-mystic-gold"
                  >
                    {monthNames.map((month, idx) => (
                      <option key={month} value={idx}>{month}</option>
                    ))}
                  </select>
                )}
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="bg-mystic-800/50 border border-mystic-gold/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-mystic-gold"
                >
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {stats.totalReadings === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 rounded-full bg-mystic-800/30 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-mystic-gold" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0L14.59 8.41L24 12L14.59 15.59L12 24L9.41 15.59L0 12L9.41 8.41L12 0Z" /></svg>
                  </div>
                  <h3 className="font-serif text-xl text-mystic-goldDim mb-2">No Readings Yet</h3>
                  <p className="text-gray-500 text-sm">
                    Complete some tarot readings to see your energy patterns.
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-6">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard 
                      label="Total Readings" 
                      value={stats.totalReadings} 
                      icon="star"
                    />
                    <StatCard 
                      label="Reversed Rate" 
                      value={`${stats.reversedPercentage}%`} 
                      icon="rotate"
                      color={stats.reversedPercentage > 40 ? 'text-red-400' : 'text-mystic-gold'}
                    />
                    {viewMode === 'yearly' && 'mostActiveMonth' in stats && (
                      <StatCard 
                        label="Most Active" 
                        value={stats.mostActiveMonth} 
                        icon="calendar"
                      />
                    )}
                    <StatCard 
                      label="Top Card" 
                      value={stats.topCards[0]?.name || 'N/A'} 
                      icon="card"
                    />
                  </div>

                  {/* Yearly Chart (for yearly view) */}
                  {viewMode === 'yearly' && 'monthlyBreakdown' in stats && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-mystic-800/30 rounded-xl p-4 border border-mystic-gold/10"
                    >
                      <h4 className="text-mystic-gold text-sm font-bold uppercase tracking-widest mb-4">
                        Monthly Activity
                      </h4>
                      <div className="flex items-end gap-2 h-32">
                        {stats.monthlyBreakdown.map((month, idx) => {
                          const maxCount = Math.max(...stats.monthlyBreakdown.map(m => m.count));
                          const height = maxCount > 0 ? (month.count / maxCount) * 100 : 0;
                          return (
                            <div key={month.month} className="flex-1 flex flex-col items-center gap-1">
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${height}%` }}
                                transition={{ delay: idx * 0.05, type: 'spring' }}
                                className="w-full bg-gradient-to-t from-mystic-gold/50 to-mystic-gold rounded-t min-h-[4px]"
                              />
                              <span className="text-mystic-goldDim/60 text-[10px]">{month.month}</span>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* Top Cards */}
                  <div>
                    <h4 className="text-mystic-gold text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0L14.59 8.41L24 12L14.59 15.59L12 24L9.41 15.59L0 12L9.41 8.41L12 0Z" /></svg>
                      Most Frequent Cards
                    </h4>
                    <div className="grid gap-3">
                      {stats.topCards.slice(0, 5).map((card, idx) => (
                        <CardFrequencyItem key={card.name} card={card} index={idx} />
                      ))}
                    </div>
                  </div>

                  {/* Categories & Spreads */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Categories */}
                    {'categories' in stats && stats.categories.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-mystic-800/30 rounded-xl p-4 border border-mystic-gold/10"
                      >
                        <h4 className="text-mystic-gold text-sm font-bold uppercase tracking-widest mb-3">
                          Question Themes
                        </h4>
                        <div className="space-y-2">
                          {stats.categories.map((cat, idx) => (
                            <div key={cat.name} className="flex justify-between items-center">
                              <span className="text-gray-300 text-sm">{cat.name}</span>
                              <span className="text-mystic-goldDim text-sm">{cat.count}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Spreads */}
                    {viewMode === 'monthly' && 'spreads' in stats && stats.spreads.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-mystic-800/30 rounded-xl p-4 border border-mystic-gold/10"
                      >
                        <h4 className="text-mystic-gold text-sm font-bold uppercase tracking-widest mb-3">
                          Spreads Used
                        </h4>
                        <div className="space-y-2">
                          {(stats as MonthlyStats).spreads.map((spread, idx) => (
                            <div key={spread.name} className="flex justify-between items-center">
                              <span className="text-gray-300 text-sm">{spread.name}</span>
                              <span className="text-mystic-goldDim text-sm">{spread.count}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* AI Deep Analysis Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-mystic-gold/10 to-mystic-accent/10 rounded-xl p-5 border border-mystic-gold/20"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-mystic-gold font-serif text-lg flex items-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0L14.59 8.41L24 12L14.59 15.59L12 24L9.41 15.59L0 12L9.41 8.41L12 0Z" /></svg>
                        <span>{viewMode === 'monthly' ? 'Monthly' : 'Yearly'} Oracle Analysis</span>
                      </h4>
                      {!showAiPanel && (
                        <button
                          onClick={handleGenerateAnalysis}
                          disabled={isAnalyzing || stats.totalReadings === 0}
                          className="px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                          style={{
                            background: 'linear-gradient(135deg, var(--theme-gold), var(--theme-gold-dim, #D4AF37))',
                            color: '#1a0a2e'
                          }}
                        >
                          {isAnalyzing ? (
                            <>
                              <svg className="w-4 h-4 animate-spin" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0L14.59 8.41L24 12L14.59 15.59L12 24L9.41 15.59L0 12L9.41 8.41L12 0Z" /></svg>
                              <span>Consulting...</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0L14.59 8.41L24 12L14.59 15.59L12 24L9.41 15.59L0 12L9.41 8.41L12 0Z" /></svg>
                              <span>Deep Analysis</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    {/* Basic Insight (always shown) */}
                    {!showAiPanel && (
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {stats.reversedPercentage > 40 
                          ? "The high frequency of reversed cards suggests a period of introspection and internal transformation. Embrace this time for inner growth."
                          : stats.reversedPercentage < 20
                          ? "Your readings show predominantly upright energy, indicating aligned and flowing energies. You're moving in harmony with your path."
                          : "Your readings show a balanced mix of energies, reflecting life's natural ebb and flow. Trust your journey."}
                        {stats.topCards[0] && ` The ${stats.topCards[0].name} appearing most frequently suggests its themes are central to your current chapter.`}
                      </p>
                    )}

                    {/* AI Analysis Panel */}
                    <AnimatePresence>
                      {showAiPanel && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-4"
                        >
                          {isAnalyzing ? (
                            <div className="text-center py-8">
                              <div className="w-12 h-12 border-4 border-mystic-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                              <p className="text-mystic-goldDim animate-pulse">The Oracle is reading your patterns...</p>
                            </div>
                          ) : aiAnalysis ? (
                            <>
                              {/* Close Button */}
                              <div className="flex justify-end">
                                <button
                                  onClick={() => setShowAiPanel(false)}
                                  className="text-mystic-goldDim hover:text-mystic-gold text-sm flex items-center gap-1"
                                >
                                  <span>Hide Analysis</span>
                                  <span>×</span>
                                </button>
                              </div>

                              {/* Overall Theme */}
                              <div className="bg-black/20 rounded-lg p-4 border border-mystic-gold/10">
                                <h5 className="text-mystic-gold text-xs uppercase tracking-widest mb-2">
                                  Overall Theme
                                </h5>
                                <p className="text-white text-sm leading-relaxed">{aiAnalysis.overallTheme}</p>
                              </div>

                              {/* Dominant Energy */}
                              <div className="bg-black/20 rounded-lg p-4 border border-mystic-gold/10">
                                <h5 className="text-mystic-gold text-xs uppercase tracking-widest mb-2">
                                  Dominant Energy
                                </h5>
                                <p className="text-white text-sm leading-relaxed">{aiAnalysis.dominantEnergy}</p>
                              </div>

                              {/* Shadow Work */}
                              <div className="bg-black/20 rounded-lg p-4 border border-red-500/20">
                                <h5 className="text-red-400 text-xs uppercase tracking-widest mb-2">
                                  Shadow Work
                                </h5>
                                <p className="text-gray-300 text-sm leading-relaxed">{aiAnalysis.shadowWork}</p>
                              </div>

                              {/* Guidance */}
                              <div className="bg-black/20 rounded-lg p-4 border border-mystic-accent/20">
                                <h5 className="text-mystic-accent text-xs uppercase tracking-widest mb-2">
                                  Guidance
                                </h5>
                                <p className="text-white text-sm leading-relaxed">{aiAnalysis.guidance}</p>
                              </div>

                              {/* Affirmation */}
                              <div className="text-center py-4 bg-gradient-to-r from-mystic-gold/5 via-mystic-gold/10 to-mystic-gold/5 rounded-lg border border-mystic-gold/30">
                                <p className="text-xs uppercase tracking-widest text-mystic-goldDim mb-2">Your Affirmation</p>
                                <p className="text-mystic-gold font-serif text-lg italic">"{aiAnalysis.affirmation}"</p>
                              </div>
                            </>
                          ) : null}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default HistoryInsights;


