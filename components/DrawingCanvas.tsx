
import React, { useRef, useState, useEffect } from 'react';
import { COLORS, Stroke, Point, BrushStyle } from '../types';
import { useTheme } from './ThemeSelector';
import HandDivination from './HandDivination';

// Theme-specific canvas backgrounds
const THEME_CANVAS_BG: Record<string, { void: string; light: string }> = {
  'mystic-purple': { 
    void: 'radial-gradient(circle at center, #2e0b52 0%, #130424 100%)', 
    light: '#f0e6d2' 
  },
  'midnight-ocean': { 
    void: 'radial-gradient(circle at center, #0f2847 0%, #0a1628 100%)', 
    light: '#e6f2f8' 
  },
  'blood-moon': { 
    void: 'radial-gradient(circle at center, #3d1515 0%, #1a0a0a 100%)', 
    light: '#f8e6e6' 
  },
  'enchanted-forest': { 
    void: 'radial-gradient(circle at center, #1a3d1a 0%, #0a1f0a 100%)', 
    light: '#e6f8e6' 
  },
};

interface DrawingCanvasProps {
  onCapture: (base64: string) => void;
  isProcessing: boolean;
  timeFrame: string; // Now contains the Metaphor Prompt
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ onCapture, isProcessing, timeFrame }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { currentTheme } = useTheme();
  
  // State
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#FFD700'); // Default to new Gold
  const [lineWidth, setLineWidth] = useState(5);
  const [opacity, setOpacity] = useState(1);
  const [brushStyle, setBrushStyle] = useState<BrushStyle>('solid');
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentPoints, setCurrentPoints] = useState<Point[]>([]);
  const [backgroundMode, setBackgroundMode] = useState<'void' | 'parchment'>('void');

  // "Hold to Reveal" State
  const [holdProgress, setHoldProgress] = useState(0);
  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Hand Divination State
  const [showHandDivination, setShowHandDivination] = useState(false);

  // Initialize and Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        canvasRef.current.width = width;
        canvasRef.current.height = height;
        redraw();
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strokes]); 

  const redraw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Clear the canvas completely
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const drawLine = (stroke: Stroke) => {
      if (stroke.points.length < 2) return;

      // Wrap each stroke in save/restore to prevent state bleeding
      ctx.save();
      
      ctx.beginPath();
      ctx.lineWidth = stroke.width;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      if (stroke.tool === 'eraser') {
        // Eraser logic: Cut a hole in the canvas
        ctx.globalCompositeOperation = 'destination-out';
        ctx.strokeStyle = '#ffffff'; // Color doesn't matter for destination-out, but defines the stroke shape
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1; 
      } else {
        // Pen logic
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = stroke.color;
        ctx.globalAlpha = stroke.opacity;

        // Apply brush style effects - 3 distinct styles
        switch (stroke.style) {
          case 'glow':
            // Intense neon glow effect - very visible
            ctx.shadowBlur = 30;
            ctx.shadowColor = stroke.color;
            ctx.globalAlpha = stroke.opacity;
            // Draw multiple times for stronger glow
            ctx.lineWidth = stroke.width * 0.9;
            break;
            
          case 'ethereal':
            // Soft, dreamy, semi-transparent effect with purple aura
            ctx.shadowBlur = 45;
            ctx.shadowColor = '#9370DB'; // Mystical purple glow
            ctx.globalAlpha = stroke.opacity * 0.6; // More transparent
            ctx.lineWidth = stroke.width * 1.8; // Much wider
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            break;
            
          default: // 'solid'
            // Clean, sharp lines with no effects
            ctx.shadowBlur = 0;
            ctx.globalAlpha = stroke.opacity;
            ctx.lineWidth = stroke.width;
            break;
        }
      }

      // Helper function to draw the path
      const tracePath = () => {
        ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
        for (let i = 1; i < stroke.points.length - 2; i++) {
          const xc = (stroke.points[i].x + stroke.points[i + 1].x) / 2;
          const yc = (stroke.points[i].y + stroke.points[i + 1].y) / 2;
          ctx.quadraticCurveTo(stroke.points[i].x, stroke.points[i].y, xc, yc);
        }
        if (stroke.points.length > 2) {
          const last = stroke.points[stroke.points.length - 1];
          const secondLast = stroke.points[stroke.points.length - 2];
          ctx.quadraticCurveTo(secondLast.x, secondLast.y, last.x, last.y);
        } else {
          ctx.lineTo(stroke.points[1].x, stroke.points[1].y);
        }
      };

      tracePath();
      ctx.stroke();
      
      // Add extra glow passes for 'glow' style to make it more prominent
      if (stroke.style === 'glow' && stroke.tool === 'pen') {
        // Second pass with larger blur for outer glow
        ctx.beginPath();
        ctx.shadowBlur = 50;
        ctx.globalAlpha = stroke.opacity * 0.5;
        ctx.lineWidth = stroke.width * 1.5;
        tracePath();
        ctx.stroke();
        
        // Third pass with core brightness
        ctx.beginPath();
        ctx.shadowBlur = 15;
        ctx.strokeStyle = '#ffffff';
        ctx.globalAlpha = stroke.opacity * 0.3;
        ctx.lineWidth = stroke.width * 0.5;
        tracePath();
        ctx.stroke();
      }
      
      // Add particles for 'ethereal' style
      if (stroke.style === 'ethereal' && stroke.tool === 'pen' && stroke.points.length > 5) {
        ctx.shadowBlur = 0;
        const particleCount = Math.floor(stroke.points.length / 8);
        for (let i = 0; i < particleCount; i++) {
          const idx = Math.floor(Math.random() * stroke.points.length);
          const point = stroke.points[idx];
          const offsetX = (Math.random() - 0.5) * stroke.width * 3;
          const offsetY = (Math.random() - 0.5) * stroke.width * 3;
          
          ctx.beginPath();
          ctx.fillStyle = stroke.color;
          ctx.globalAlpha = stroke.opacity * Math.random() * 0.6;
          ctx.arc(point.x + offsetX, point.y + offsetY, Math.random() * 3 + 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      ctx.restore();
    };

    // Draw all saved strokes
    strokes.forEach(drawLine);

    // Draw current active stroke
    if (currentPoints.length > 0) {
      drawLine({ 
        points: currentPoints, 
        color, 
        width: lineWidth, 
        tool,
        style: brushStyle,
        opacity
      });
    }
  };

  const clearCanvas = () => {
    // Immediate action, no confirm dialog to disrupt flow
    setStrokes([]);
    setCurrentPoints([]);
    
    // Force immediate clear of the canvas element
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  useEffect(() => {
    redraw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strokes, currentPoints]);

  // --- Input Handling ---
  const getCoordinates = (e: React.MouseEvent | React.TouchEvent): Point | null => {
    if (!canvasRef.current) return null;
    const rect = canvasRef.current.getBoundingClientRect();
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (isProcessing) return;
    const coords = getCoordinates(e);
    if (coords) {
      setIsDrawing(true);
      setCurrentPoints([coords]);
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || isProcessing) return;
    const coords = getCoordinates(e);
    if (coords) {
      setCurrentPoints(prev => [...prev, coords]);
      // Haptic feedback if supported
      if (navigator.vibrate && Math.random() > 0.8) {
         navigator.vibrate(2);
      }
    }
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (currentPoints.length > 0) {
      setStrokes(prev => [...prev, {
        points: currentPoints,
        color,
        width: lineWidth,
        tool,
        style: brushStyle,
        opacity
      }]);
    }
    setCurrentPoints([]);
  };

  // --- Submission Logic with "Hold" ---
  const startHold = () => {
    if (isProcessing || strokes.length === 0) return;
    setHoldProgress(0);
    if (navigator.vibrate) navigator.vibrate(20);
    
    holdIntervalRef.current = setInterval(() => {
      setHoldProgress(prev => {
        if (prev >= 100) {
          if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
          return 100;
        }
        if (navigator.vibrate && prev % 10 === 0) navigator.vibrate(5);
        return prev + 2; 
      });
    }, 20);
  };

  const endHold = () => {
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    if (holdProgress >= 100) {
      handleSubmit();
      if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
    }
    setHoldProgress(0);
  };

  const handleSubmit = () => {
    if (!canvasRef.current) return;
    
    // Create temp canvas for composition
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvasRef.current.width;
    tempCanvas.height = canvasRef.current.height;
    const tCtx = tempCanvas.getContext('2d');
    if (!tCtx) return;

    // Theme-specific background colors for export
    const themeExportBg: Record<string, string> = {
      'mystic-purple': '#130424',
      'midnight-ocean': '#0a1628',
      'blood-moon': '#1a0a0a',
      'enchanted-forest': '#0a1f0a',
    };

    // 1. Fill background on temp canvas
    if (backgroundMode === 'void') {
       tCtx.fillStyle = themeExportBg[currentTheme.id] || '#130424';
       tCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    } else {
       tCtx.fillStyle = themeCanvasBg.light;
       tCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    }

    // 2. Draw the transparent drawing canvas on top
    tCtx.drawImage(canvasRef.current, 0, 0);

    const dataUrl = tempCanvas.toDataURL('image/png');
    const base64 = dataUrl.split(',')[1];
    onCapture(base64);
  };

  useEffect(() => {
    if (holdProgress >= 100) {
        handleSubmit();
        if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
        setHoldProgress(0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [holdProgress]);

  // Dynamic Background Styles - Theme-aware
  const themeCanvasBg = THEME_CANVAS_BG[currentTheme.id] || THEME_CANVAS_BG['mystic-purple'];
  const backgroundStyle = backgroundMode === 'void' 
    ? { background: themeCanvasBg.void }
    : { background: themeCanvasBg.light };

  return (
    <div className="relative w-full h-[75vh] flex flex-col md:flex-row animate-fade-in">
      
      {/* Main Drawing Area */}
      <div 
        ref={containerRef} 
        className="absolute inset-0 z-0 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(46,11,82,0.3)] transition-colors duration-500"
        style={{ 
          touchAction: 'none', 
          cursor: tool === 'eraser' ? 'cell' : 'crosshair',
          border: `1px solid var(--theme-gold, #c5a059)33`,
          ...backgroundStyle
        }}
      >
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-full relative z-10"
        />
        
        {/* Decorative Corner Borders - Theme aware */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 rounded-tl-xl pointer-events-none z-20" style={{ borderColor: `var(--theme-gold, #c5a059)66` }}></div>
        <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 rounded-tr-xl pointer-events-none z-20" style={{ borderColor: `var(--theme-gold, #c5a059)66` }}></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 rounded-bl-xl pointer-events-none z-20" style={{ borderColor: `var(--theme-gold, #c5a059)66` }}></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 rounded-br-xl pointer-events-none z-20" style={{ borderColor: `var(--theme-gold, #c5a059)66` }}></div>

      </div>

      {/* Floating Tools - Left Side - Theme aware */}
      <div className="absolute top-4 left-4 right-4 md:right-auto md:top-6 md:bottom-6 md:w-20 z-30 flex md:flex-col gap-4 pointer-events-none">
        
        {/* Main Tools */}
        <div 
          className="backdrop-blur-xl p-3 rounded-2xl shadow-2xl pointer-events-auto flex md:flex-col gap-6 items-center justify-center min-h-[100px] relative"
          style={{ 
            backgroundColor: 'var(--theme-bg-light, #2a0a4a)cc',
            border: '1px solid color-mix(in srgb, var(--theme-gold) 20%, transparent)'
          }}
        >
          
          {/* Pen */}
          <div className="flex flex-col items-center gap-1 group">
            <button 
               onClick={() => setTool('pen')}
               className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300"
               style={{
                 background: tool === 'pen' ? 'linear-gradient(135deg, var(--theme-gold), var(--theme-gold-dim))' : 'transparent',
                 color: tool === 'pen' ? 'var(--theme-bg)' : 'var(--theme-text-dim)',
                 boxShadow: tool === 'pen' ? '0 0 15px color-mix(in srgb, var(--theme-gold) 50%, transparent)' : 'none',
                 transform: tool === 'pen' ? 'scale(1.1)' : 'scale(1)',
               }}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            </button>
            <span className="text-[9px] uppercase tracking-widest" style={{ color: 'var(--theme-text-dim)' }}>Draw</span>
          </div>
          
          {/* Eraser */}
          <div className="flex flex-col items-center gap-1 group">
            <button 
               onClick={() => setTool('eraser')}
               className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300"
               style={{
                 background: tool === 'eraser' ? 'linear-gradient(135deg, var(--theme-secondary), var(--theme-bg-lighter))' : 'transparent',
                 color: tool === 'eraser' ? 'white' : 'var(--theme-text-dim)',
                 boxShadow: tool === 'eraser' ? '0 0 15px color-mix(in srgb, var(--theme-secondary) 50%, transparent)' : 'none',
                 border: tool === 'eraser' ? '1px solid rgba(255,255,255,0.2)' : 'none',
                 transform: tool === 'eraser' ? 'scale(1.1)' : 'scale(1)',
               }}
            >
               <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                 <path d="M16.24 3.56l4.95 4.94c.78.79.78 2.05 0 2.84L12 20.53a4.008 4.008 0 0 1-5.66 0L2.81 17c-.78-.79-.78-2.05 0-2.84l10.6-10.6c.79-.78 2.05-.78 2.83 0zM4.22 15.58l3.54 3.53c.78.79 2.04.79 2.83 0l8.48-8.48-6.37-6.37L4.22 12.75c-.78.78-.78 2.05 0 2.83z" />
               </svg>
            </button>
            <span className="text-[9px] uppercase tracking-widest" style={{ color: 'var(--theme-text-dim)' }}>Erase</span>
          </div>

          {/* Hand Drawing */}
          <div className="flex flex-col items-center gap-1 group">
            <button 
               onClick={() => setShowHandDivination(true)}
               className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
               style={{
                 background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                 color: 'white',
                 boxShadow: '0 0 15px rgba(139, 92, 246, 0.4)',
               }}
               title="Draw with your hand gestures"
            >
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
               </svg>
            </button>
            <span className="text-[9px] uppercase tracking-widest" style={{ color: 'var(--theme-text-dim)' }}>Hand</span>
          </div>
          
          <div className="w-px h-8 bg-white/10 md:w-8 md:h-px"></div>

          {/* Undo */}
          <div className="flex flex-col items-center gap-1 group">
            <button 
              onClick={() => setStrokes(prev => prev.slice(0, -1))} 
              className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-xl transition-colors"
              style={{ color: 'var(--theme-text-dim)' }}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
            </button>
            <span className="text-[9px] uppercase tracking-widest" style={{ color: 'var(--theme-text-dim)' }}>Undo</span>
          </div>

          {/* Clear */}
          <div className="flex flex-col items-center gap-1 group">
            <button 
              onClick={clearCanvas}
              className="w-10 h-10 flex items-center justify-center text-red-400 hover:text-red-200 hover:bg-red-900/30 rounded-xl transition-colors" 
              title="Reset Drawing"
            >
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
            <span className="text-[9px] uppercase tracking-widest" style={{ color: 'var(--theme-text-dim)' }}>Reset</span>
          </div>

        </div>

        {/* Background Toggle */}
        <div 
          className="backdrop-blur-xl p-2 rounded-2xl shadow-lg pointer-events-auto flex md:flex-col gap-2 mt-auto items-center justify-center"
          style={{ 
            backgroundColor: 'var(--theme-bg-light, #2a0a4a)cc',
            border: '1px solid color-mix(in srgb, var(--theme-gold) 20%, transparent)'
          }}
        >
           <button 
            onClick={() => setBackgroundMode(prev => prev === 'void' ? 'parchment' : 'void')}
            className="w-10 h-10 rounded-full overflow-hidden relative group hover:scale-110 transition-transform"
            style={{ border: '1px solid var(--theme-gold)80' }}
            title="Toggle Background"
           >
             <div className="absolute inset-0 transition-transform duration-500" style={{ backgroundColor: 'var(--theme-bg)', transform: backgroundMode === 'void' ? 'none' : 'translateY(100%)' }}></div>
             <div className="absolute inset-0 bg-[#f0e6d2] transition-transform duration-500" style={{ transform: backgroundMode === 'void' ? 'translateY(-100%)' : 'none' }}></div>
             <span className="relative z-10 text-[8px] font-bold mix-blend-difference text-white uppercase">Mode</span>
           </button>
        </div>
      </div>

      {/* Floating Settings Panel - Right Side - Theme aware */}
      <div className="absolute bottom-20 md:bottom-6 right-4 left-4 md:left-auto md:top-6 md:w-72 z-30 flex flex-col gap-4 pointer-events-none">
        <div 
          className="backdrop-blur-xl p-5 rounded-2xl shadow-2xl pointer-events-auto space-y-6"
          style={{ 
            backgroundColor: 'var(--theme-bg-light, #2a0a4a)cc',
            border: '1px solid color-mix(in srgb, var(--theme-gold) 20%, transparent)'
          }}
        >
           
           {/* Brush Style - 3 Distinct Styles */}
           <div>
             <label className="text-[10px] uppercase tracking-widest font-bold mb-2 flex items-center gap-2" style={{ color: 'var(--theme-text-dim)' }}>
               <span className="w-1 h-1 rounded-full" style={{ backgroundColor: 'var(--theme-gold)' }}></span> Ink Style
             </label>
             <div className="grid grid-cols-3 gap-2 bg-black/40 p-2 rounded-xl">
               {([
                 { id: 'solid', label: '—', name: 'Solid', desc: 'Clean lines' },
                 { id: 'glow', label: '◈', name: 'Glow', desc: 'Neon effect' },
                 { id: 'ethereal', label: '◎', name: 'Ethereal', desc: 'Dreamy aura' },
               ] as { id: BrushStyle; label: string; name: string; desc: string }[]).map(brush => (
                 <button
                    key={brush.id}
                    onClick={() => { setBrushStyle(brush.id); setTool('pen'); }}
                    title={brush.desc}
                    className="py-3 px-2 text-center rounded-xl transition-all duration-300 flex flex-col items-center gap-1"
                    style={{
                      background: brushStyle === brush.id && tool === 'pen' 
                        ? 'linear-gradient(180deg, var(--theme-gold), var(--theme-gold-dim))' 
                        : 'transparent',
                      color: brushStyle === brush.id && tool === 'pen' 
                        ? 'var(--theme-bg)' 
                        : 'var(--theme-text-dim)',
                      fontWeight: brushStyle === brush.id && tool === 'pen' ? 'bold' : 'normal',
                      boxShadow: brushStyle === brush.id && tool === 'pen' 
                        ? '0 4px 15px color-mix(in srgb, var(--theme-gold) 40%, transparent)' 
                        : 'none',
                      transform: brushStyle === brush.id && tool === 'pen' ? 'scale(1.05)' : 'scale(1)',
                      border: brushStyle === brush.id && tool === 'pen' ? 'none' : '1px solid transparent',
                    }}
                 >
                   <span className="text-xl">{brush.label}</span>
                   <span className="text-[10px] uppercase tracking-widest font-bold">{brush.name}</span>
                   <span className="text-[8px] opacity-60">{brush.desc}</span>
                 </button>
               ))}
             </div>
           </div>

           {/* Colors */}
           <div>
             <label className="text-[10px] uppercase tracking-widest font-bold mb-2 flex items-center gap-2" style={{ color: 'var(--theme-text-dim)' }}>
               <span className="w-1 h-1 rounded-full" style={{ backgroundColor: 'var(--theme-gold)' }}></span> Essence Colors
             </label>
             <div className="grid grid-cols-5 gap-2 max-h-[140px] overflow-y-auto custom-scrollbar pr-1">
                {COLORS.map((c, idx) => (
                  <button
                    key={c}
                    onClick={() => { setColor(c); setTool('pen'); }}
                    title={['Gold', 'Silver', 'White', 'Black', 'Passion', 'Power', 'Love', 'Creativity', 'Intuition', 'Healing', 'Spirituality', 'Wisdom', 'Growth', 'Grounding', 'Abundance', 'Stability', 'Peace', 'Freedom', 'Light', 'Dreams'][idx]}
                    className="w-7 h-7 rounded-full transition-all duration-300 relative group"
                    style={{ 
                      backgroundColor: c, 
                      border: c === '#FFFFFF' || c === '#E6E6FA' || c === '#F0E68C' ? '1px solid rgba(0,0,0,0.2)' : '1px solid rgba(255,255,255,0.1)',
                      boxShadow: color === c && tool === 'pen' ? `0 0 12px ${c}` : 'none',
                      transform: color === c && tool === 'pen' ? 'scale(1.1)' : 'scale(1)',
                      outline: color === c && tool === 'pen' ? '2px solid var(--theme-gold)' : 'none',
                      outlineOffset: '2px',
                      opacity: color === c && tool === 'pen' ? 1 : 0.8,
                    }}
                  >
                    {color === c && tool === 'pen' && <div className="absolute inset-0 rounded-full animate-ping bg-white opacity-20"></div>}
                  </button>
                ))}
             </div>
           </div>

           {/* Sliders - Theme aware */}
           <div className="space-y-5">
             <div>
                <div className="flex justify-between text-[10px] uppercase font-bold mb-2" style={{ color: 'var(--theme-text-dim)' }}>
                  <span>Stroke Width</span>
                  <span>{lineWidth}px</span>
                </div>
                <input 
                  type="range" min="1" max="40" value={lineWidth}
                  onChange={(e) => setLineWidth(Number(e.target.value))}
                  className="w-full h-1 rounded-lg appearance-none cursor-pointer"
                  style={{ background: 'var(--theme-bg-lighter)', accentColor: 'var(--theme-gold)' }}
                />
             </div>
             <div>
                <div className="flex justify-between text-[10px] uppercase font-bold mb-2" style={{ color: 'var(--theme-text-dim)' }}>
                  <span>Intensity (Opacity)</span>
                  <span>{Math.round(opacity * 100)}%</span>
                </div>
                <input 
                  type="range" min="0.1" max="1" step="0.1" value={opacity}
                  onChange={(e) => setOpacity(Number(e.target.value))}
                  className="w-full h-1 rounded-lg appearance-none cursor-pointer"
                  style={{ background: 'var(--theme-bg-lighter)', accentColor: 'var(--theme-gold)' }}
                />
             </div>
           </div>
           
           <div className="h-px bg-white/5 w-full my-2"></div>

           {/* "Hold to Channel" Button - Elegant Glass Style */}
           <div className="relative">
             <button 
              onMouseDown={startHold}
              onMouseUp={endHold}
              onMouseLeave={endHold}
              onTouchStart={startHold}
              onTouchEnd={endHold}
              disabled={isProcessing || strokes.length === 0}
              className="w-full py-4 rounded-xl font-serif text-base tracking-widest transition-all duration-300 relative overflow-hidden group select-none active:scale-95"
              style={{
                background: isProcessing || strokes.length === 0 
                  ? 'rgba(55, 65, 81, 0.5)' 
                  : holdProgress > 0 
                    ? 'linear-gradient(135deg, var(--theme-gold), var(--theme-gold-dim))' 
                    : 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                color: isProcessing || strokes.length === 0 
                  ? '#6b7280' 
                  : holdProgress > 0 
                    ? 'var(--theme-bg)' 
                    : 'var(--theme-text)',
                border: isProcessing || strokes.length === 0 
                  ? '1px solid rgba(255,255,255,0.08)' 
                  : holdProgress > 0 
                    ? '1px solid var(--theme-gold)' 
                    : '1px solid color-mix(in srgb, var(--theme-gold) 40%, transparent)',
                boxShadow: isProcessing || strokes.length === 0 
                  ? 'none' 
                  : holdProgress > 0 
                    ? '0 0 30px var(--theme-gold), 0 0 60px color-mix(in srgb, var(--theme-gold) 50%, transparent), inset 0 1px 0 rgba(255,255,255,0.2)' 
                    : 'inset 0 1px 0 rgba(255,255,255,0.05), 0 4px 15px rgba(0,0,0,0.3)',
                cursor: isProcessing || strokes.length === 0 ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease-out',
                backdropFilter: 'blur(10px)',
              }}
            >
              {/* Progress Fill */}
              {!isProcessing && strokes.length > 0 && holdProgress > 0 && (
                <div 
                  className="absolute inset-0 transition-all duration-75 ease-linear"
                  style={{ 
                    background: 'linear-gradient(90deg, rgba(255,255,255,0.4), rgba(255,255,255,0.15))',
                    width: `${holdProgress}%` 
                  }}
                ></div>
              )}
              
              <span className="relative z-20 flex items-center justify-center gap-2">
                {isProcessing ? (
                  <span className="animate-pulse">DIVINING...</span>
                ) : holdProgress > 0 ? (
                  <>
                    <span className="animate-pulse" style={{ color: 'var(--theme-gold)' }}>◈</span>
                    <span>CHANNELING... {Math.round(holdProgress)}%</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" style={{ color: 'var(--theme-gold)', opacity: 0.7 }} fill="currentColor" viewBox="0 0 24 24"><path d="M12 0L14.59 8.41L24 12L14.59 15.59L12 24L9.41 15.59L0 12L9.41 8.41L12 0Z" /></svg>
                    <span>HOLD TO REVEAL</span>
                    <svg className="w-4 h-4" style={{ color: 'var(--theme-gold)', opacity: 0.7 }} fill="currentColor" viewBox="0 0 24 24"><path d="M12 0L14.59 8.41L24 12L14.59 15.59L12 24L9.41 15.59L0 12L9.41 8.41L12 0Z" /></svg>
                  </>
                )} 
              </span>
            </button>
            {!isProcessing && strokes.length > 0 && (
              <p className="text-center text-[9px] mt-2 uppercase tracking-widest" style={{ color: 'color-mix(in srgb, var(--theme-text-dim) 50%, transparent)' }}>Hold to infuse energy</p>
            )}
           </div>
        </div>
      </div>

      {/* Hand Divination Modal */}
      <HandDivination
        isOpen={showHandDivination}
        onClose={() => setShowHandDivination(false)}
        onUseDivination={(gestureImage) => {
          // Use the hand-drawn gesture as the canvas image
          setShowHandDivination(false);
          // Directly trigger capture with the hand-drawn image
          onCapture(gestureImage);
        }}
      />

    </div>
  );
};

export default DrawingCanvas;
