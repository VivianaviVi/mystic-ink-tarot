import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import { getHistory, ReadingHistory, formatDate } from '../utils/historyManager';
import { getTarotCardImagePath } from '../utils/tarotImageMap';

interface JournalExportProps {
  isOpen: boolean;
  onClose: () => void;
}

type ExportFormat = 'image' | 'text' | 'json';
type DateRange = 'all' | 'month' | 'week';

const JournalExport: React.FC<JournalExportProps> = ({ isOpen, onClose }) => {
  const [exportFormat, setExportFormat] = useState<ExportFormat>('image');
  const [dateRange, setDateRange] = useState<DateRange>('all');
  const [isExporting, setIsExporting] = useState(false);
  const [selectedReadings, setSelectedReadings] = useState<string[]>([]);
  const journalRef = useRef<HTMLDivElement>(null);

  const history = getHistory();

  // Filter readings based on date range
  const getFilteredReadings = (): ReadingHistory[] => {
    const now = new Date();
    return history.filter(reading => {
      const readingDate = new Date(reading.date);
      if (dateRange === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return readingDate >= weekAgo;
      } else if (dateRange === 'month') {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return readingDate >= monthAgo;
      }
      return true;
    });
  };

  const filteredReadings = getFilteredReadings();
  const readingsToExport = selectedReadings.length > 0 
    ? filteredReadings.filter(r => selectedReadings.includes(r.id))
    : filteredReadings;

  const toggleReading = (id: string) => {
    setSelectedReadings(prev => 
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedReadings.length === filteredReadings.length) {
      setSelectedReadings([]);
    } else {
      setSelectedReadings(filteredReadings.map(r => r.id));
    }
  };

  // Export as Image
  const exportAsImage = async () => {
    if (!journalRef.current) return;
    
    setIsExporting(true);
    try {
      const canvas = await html2canvas(journalRef.current, {
        backgroundColor: '#130424',
        scale: 2,
        useCORS: true,
        logging: false,
      });
      
      const link = document.createElement('a');
      link.download = `mystic-ink-journal-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // Export as Text/Markdown
  const exportAsText = () => {
    let content = `# Mystic Ink Tarot Journal\n`;
    content += `Exported on: ${new Date().toLocaleDateString()}\n\n`;
    content += `---\n\n`;

    readingsToExport.forEach((reading, idx) => {
      content += `## Reading ${idx + 1}: ${formatDate(reading.date)}\n\n`;
      content += `**Question:** ${reading.question}\n\n`;
      content += `### Cards Drawn:\n`;
      reading.readings.forEach((r, i) => {
        content += `${i + 1}. **${r.card.name}**${r.card.isReversed ? ' (Reversed)' : ''} - ${r.timeFrame}\n`;
        content += `   > ${r.card.meaning}\n\n`;
      });
      content += `### Oracle's Synthesis:\n`;
      content += `> ${reading.synthesis}\n\n`;
      if (reading.notes) {
        content += `### Personal Notes:\n`;
        content += `${reading.notes}\n\n`;
      }
      content += `---\n\n`;
    });

    const blob = new Blob([content], { type: 'text/markdown' });
    const link = document.createElement('a');
    link.download = `mystic-ink-journal-${new Date().toISOString().split('T')[0]}.md`;
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  // Export as JSON
  const exportAsJSON = () => {
    const data = {
      exportDate: new Date().toISOString(),
      totalReadings: readingsToExport.length,
      readings: readingsToExport,
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.download = `mystic-ink-journal-${new Date().toISOString().split('T')[0]}.json`;
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  const handleExport = () => {
    if (readingsToExport.length === 0) return;
    
    switch (exportFormat) {
      case 'image':
        exportAsImage();
        break;
      case 'text':
        exportAsText();
        break;
      case 'json':
        exportAsJSON();
        break;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md overflow-y-auto py-8"
      >
        <div className="absolute inset-0" onClick={onClose}></div>
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
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
            <div className="p-6 border-b border-mystic-gold/20">
              <h2 className="font-serif text-3xl text-mystic-gold mb-1">Export Journal</h2>
              <p className="text-mystic-goldDim/60 text-sm">Download your tarot reading history</p>
            </div>

            <div className="p-6 space-y-6">
              
              {/* Export Options */}
              <div className="grid md:grid-cols-2 gap-6">
                
                {/* Format Selection */}
                <div>
                  <label className="text-mystic-gold text-sm font-bold uppercase tracking-widest mb-3 block">
                    Export Format
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'image', label: '📷 Image', desc: 'Visual journal' },
                      { id: 'text', label: '📝 Markdown', desc: 'Text format' },
                      { id: 'json', label: '💾 JSON', desc: 'Data backup' },
                    ].map(format => (
                      <button
                        key={format.id}
                        onClick={() => setExportFormat(format.id as ExportFormat)}
                        className={`p-3 rounded-xl border-2 transition-all text-center ${
                          exportFormat === format.id
                            ? 'border-mystic-gold bg-mystic-gold/10'
                            : 'border-mystic-gold/20 hover:border-mystic-gold/40'
                        }`}
                      >
                        <p className="text-lg">{format.label.split(' ')[0]}</p>
                        <p className={`text-xs ${exportFormat === format.id ? 'text-mystic-gold' : 'text-gray-400'}`}>
                          {format.desc}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date Range */}
                <div>
                  <label className="text-mystic-gold text-sm font-bold uppercase tracking-widest mb-3 block">
                    Date Range
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'week', label: 'Past Week' },
                      { id: 'month', label: 'Past Month' },
                      { id: 'all', label: 'All Time' },
                    ].map(range => (
                      <button
                        key={range.id}
                        onClick={() => setDateRange(range.id as DateRange)}
                        className={`py-2 px-3 rounded-lg transition-all ${
                          dateRange === range.id
                            ? 'bg-mystic-gold text-mystic-900 font-bold'
                            : 'bg-mystic-800/50 text-gray-400 hover:bg-mystic-800'
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Reading Selection */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-mystic-gold text-sm font-bold uppercase tracking-widest">
                    Select Readings ({readingsToExport.length} selected)
                  </label>
                  <button
                    onClick={selectAll}
                    className="text-mystic-goldDim text-xs hover:text-mystic-gold transition-colors"
                  >
                    {selectedReadings.length === filteredReadings.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
                
                <div className="max-h-[200px] overflow-y-auto custom-scrollbar space-y-2 pr-2">
                  {filteredReadings.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No readings in this time range</p>
                  ) : (
                    filteredReadings.map(reading => (
                      <button
                        key={reading.id}
                        onClick={() => toggleReading(reading.id)}
                        className={`w-full p-3 rounded-lg border text-left transition-all flex items-center gap-3 ${
                          selectedReadings.includes(reading.id) || selectedReadings.length === 0
                            ? 'border-mystic-gold/30 bg-mystic-800/30'
                            : 'border-mystic-gold/10 bg-mystic-900/30 opacity-50'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                          selectedReadings.includes(reading.id) || selectedReadings.length === 0
                            ? 'border-mystic-gold bg-mystic-gold'
                            : 'border-gray-600'
                        }`}>
                          {(selectedReadings.includes(reading.id) || selectedReadings.length === 0) && (
                            <svg className="w-3 h-3 text-mystic-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm truncate">"{reading.question}"</p>
                          <p className="text-gray-500 text-xs">{formatDate(reading.date)}</p>
                        </div>
                        <div className="flex gap-1">
                          {reading.readings.slice(0, 3).map((r, idx) => (
                            <div 
                              key={idx}
                              className={`w-6 h-8 rounded overflow-hidden border ${
                                r.card.isReversed ? 'border-red-500/30' : 'border-mystic-gold/20'
                              }`}
                            >
                              {getTarotCardImagePath(r.card.name) ? (
                                <img 
                                  src={getTarotCardImagePath(r.card.name)!} 
                                  alt=""
                                  className={`w-full h-full object-cover ${r.card.isReversed ? 'rotate-180' : ''}`}
                                />
                              ) : (
                                <div className="w-full h-full bg-mystic-900" />
                              )}
                            </div>
                          ))}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Image Preview (only for image export) */}
              {exportFormat === 'image' && readingsToExport.length > 0 && (
                <div className="border border-mystic-gold/20 rounded-xl overflow-hidden">
                  <p className="text-mystic-goldDim/60 text-xs uppercase tracking-widest p-3 bg-mystic-800/30">
                    Image Preview
                  </p>
                  <div 
                    ref={journalRef}
                    className="bg-gradient-to-b from-mystic-900 via-mystic-950 to-black p-8 max-h-[300px] overflow-y-auto"
                  >
                    {/* Journal Header */}
                    <div className="text-center mb-8">
                      <h1 className="font-serif text-3xl text-mystic-gold tracking-widest">MYSTIC INK</h1>
                      <p className="text-mystic-goldDim/60 text-sm mt-2">Tarot Journal</p>
                      <p className="text-mystic-goldDim/40 text-xs mt-1">
                        {readingsToExport.length} Reading{readingsToExport.length > 1 ? 's' : ''} • {new Date().toLocaleDateString()}
                      </p>
                    </div>

                    {/* Readings */}
                    {readingsToExport.slice(0, 3).map((reading, idx) => (
                      <div key={reading.id} className="mb-6 pb-6 border-b border-mystic-gold/10 last:border-0">
                        <p className="text-mystic-gold text-sm mb-2">"{reading.question}"</p>
                        <div className="flex gap-2 mb-3">
                          {reading.readings.map((r, i) => (
                            <div key={i} className="text-center">
                              <div className="w-12 h-16 rounded overflow-hidden border border-mystic-gold/30 mx-auto mb-1">
                                {getTarotCardImagePath(r.card.name) ? (
                                  <img 
                                    src={getTarotCardImagePath(r.card.name)!}
                                    alt={r.card.name}
                                    className={`w-full h-full object-cover ${r.card.isReversed ? 'rotate-180' : ''}`}
                                  />
                                ) : (
                                  <div className="w-full h-full bg-mystic-800 flex items-center justify-center">
                                    <svg className="w-2 h-2 text-mystic-gold" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0L14.59 8.41L24 12L14.59 15.59L12 24L9.41 15.59L0 12L9.41 8.41L12 0Z" /></svg>
                                  </div>
                                )}
                              </div>
                              <p className="text-mystic-goldDim text-[8px]">{r.card.name}</p>
                            </div>
                          ))}
                        </div>
                        <p className="text-gray-400 text-xs italic">"{reading.synthesis.slice(0, 150)}..."</p>
                      </div>
                    ))}
                    {readingsToExport.length > 3 && (
                      <p className="text-center text-mystic-goldDim/40 text-xs">
                        +{readingsToExport.length - 3} more readings
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Export Button */}
              <div className="flex gap-4">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 border border-mystic-gold/30 text-mystic-goldDim rounded-xl hover:bg-mystic-gold/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExport}
                  disabled={readingsToExport.length === 0 || isExporting}
                  className="flex-1 py-3 bg-gradient-to-r from-mystic-gold to-yellow-600 text-mystic-900 font-bold rounded-xl hover:shadow-[0_0_30px_rgba(255,215,0,0.4)] transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isExporting ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Exporting...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Export Journal
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default JournalExport;


