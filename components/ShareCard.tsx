import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { ReadingResult } from '../types';
import { getTarotCardImagePath } from '../utils/tarotImageMap';

interface ShareCardProps {
  question: string;
  readings: ReadingResult[];
  synthesis: string;
  onClose: () => void;
}

const ShareCard: React.FC<ShareCardProps> = ({ question, readings, synthesis, onClose }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  const generateImage = async () => {
    if (!cardRef.current) return;
    
    setIsGenerating(true);
    
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#130424',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
      });
      
      const dataUrl = canvas.toDataURL('image/png');
      setShareUrl(dataUrl);
    } catch (error) {
      console.error('Failed to generate image:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = () => {
    if (!shareUrl) return;
    
    const link = document.createElement('a');
    link.download = `mystic-ink-reading-${Date.now()}.png`;
    link.href = shareUrl;
    link.click();
  };

  const shareToClipboard = async () => {
    if (!shareUrl) return;
    
    try {
      const response = await fetch(shareUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      alert('Image copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy:', error);
      // Fallback: download instead
      downloadImage();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-mystic-900/80 border border-mystic-gold/30 flex items-center justify-center text-mystic-gold hover:bg-mystic-gold hover:text-mystic-900 transition-all"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Shareable Card Design */}
        <div 
          ref={cardRef}
          className="bg-gradient-to-b from-mystic-900 via-mystic-950 to-black p-8 rounded-2xl border border-mystic-gold/30"
          style={{ minHeight: '600px' }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-mystic-gold/50"></div>
              <svg className="w-6 h-6 text-mystic-gold" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0L14.59 8.41L24 12L14.59 15.59L12 24L9.41 15.59L0 12L9.41 8.41L12 0Z" /></svg>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-mystic-gold/50"></div>
            </div>
            <h1 className="font-serif text-3xl text-mystic-gold tracking-widest mb-2">MYSTIC INK</h1>
            <p className="text-mystic-accent/60 text-xs uppercase tracking-[0.3em]">Tarot Reading</p>
          </div>

          {/* Question */}
          <div className="text-center mb-8 px-4">
            <p className="text-gray-400 text-sm uppercase tracking-widest mb-2">The Question</p>
            <p className="font-serif text-xl text-white italic">"{question}"</p>
          </div>

          {/* Three Cards */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {readings.map((reading, idx) => {
              const imagePath = getTarotCardImagePath(reading.card.name);
              return (
                <div key={idx} className="text-center">
                  <p className="text-mystic-accent text-[10px] uppercase tracking-widest mb-2">{reading.timeFrame}</p>
                  
                  {/* Card Image */}
                  <div className={`aspect-[2/3] rounded-lg overflow-hidden border-2 mx-auto mb-3 shadow-lg ${reading.card.isReversed ? 'border-red-500/50' : 'border-mystic-gold/40'}`}
                       style={{ maxWidth: '120px' }}>
                    {imagePath ? (
                      <img 
                        src={imagePath} 
                        alt={reading.card.name}
                        className={`w-full h-full object-cover ${reading.card.isReversed ? 'rotate-180' : ''}`}
                        crossOrigin="anonymous"
                      />
                    ) : (
                      <div className="w-full h-full bg-mystic-900 flex items-center justify-center">
                        <svg className="w-6 h-6 text-mystic-gold" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0L14.59 8.41L24 12L14.59 15.59L12 24L9.41 15.59L0 12L9.41 8.41L12 0Z" /></svg>
                      </div>
                    )}
                  </div>
                  
                  <h3 className={`font-serif text-sm font-bold ${reading.card.isReversed ? 'text-red-300' : 'text-mystic-gold'}`}>
                    {reading.card.name}
                  </h3>
                  {reading.card.isReversed && (
                    <span className="text-[8px] text-red-400 uppercase">Reversed</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Synthesis */}
          <div className="bg-black/40 rounded-xl p-6 border border-mystic-gold/10">
            <h3 className="text-mystic-gold text-center text-sm uppercase tracking-widest mb-4">The Prophecy</h3>
            <p className="font-serif text-gray-200 text-center leading-relaxed text-sm">
              {synthesis}
            </p>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 pt-6 border-t border-mystic-gold/10">
            <p className="text-mystic-goldDim/50 text-xs">
              {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            <p className="text-mystic-gold/30 text-[10px] mt-2 tracking-widest">MYSTIC INK TAROT</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center mt-6 pb-4">
          {!shareUrl ? (
            <button
              onClick={generateImage}
              disabled={isGenerating}
              className="px-8 py-3 bg-gradient-to-r from-mystic-gold to-yellow-600 text-mystic-900 font-serif font-bold rounded-lg hover:shadow-[0_0_30px_rgba(255,215,0,0.4)] transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </span>
              ) : (
                'Generate Shareable Image'
              )}
            </button>
          ) : (
            <>
              <button
                onClick={downloadImage}
                className="px-6 py-3 bg-mystic-800 border border-mystic-gold/50 text-mystic-gold font-serif rounded-lg hover:bg-mystic-gold hover:text-mystic-900 transition-all flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </button>
              <button
                onClick={shareToClipboard}
                className="px-6 py-3 bg-gradient-to-r from-mystic-gold to-yellow-600 text-mystic-900 font-serif font-bold rounded-lg hover:shadow-[0_0_30px_rgba(255,215,0,0.4)] transition-all flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy to Clipboard
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareCard;


