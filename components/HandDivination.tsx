import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './ThemeSelector';

// Declare ml5 as a global since it's loaded via script tag
declare global {
  interface Window {
    ml5: any;
  }
}

interface HandDivinationProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: (gestureImage: string) => void;
  onUseDivination?: (gestureImage: string) => void;
}

interface Point {
  x: number;
  y: number;
}

const HandDivination: React.FC<HandDivinationProps> = ({ isOpen, onClose, onComplete, onUseDivination }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailCanvasRef = useRef<HTMLCanvasElement>(null);
  const { currentTheme } = useTheme();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hands, setHands] = useState<any[]>([]);
  const [gestureTrail, setGestureTrail] = useState<Point[]>([]);
  const [holdProgress, setHoldProgress] = useState(0);
  const [capturedGesture, setCapturedGesture] = useState<string | null>(null);
  const [gestureMessage, setGestureMessage] = useState<string>('Position your hand in frame');
  
  const handPoseRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number>();
  const holdTimerRef = useRef<NodeJS.Timeout>();
  const lastPointRef = useRef<Point | null>(null);
  const mountedRef = useRef(true);

  // ESC key to close
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Callback when hands are detected
  const gotHands = useCallback((results: any) => {
    if (mountedRef.current) {
      setHands(results || []);
    }
  }, []);

  // Initialize handpose
  useEffect(() => {
    if (!isOpen) return;
    
    mountedRef.current = true;

    const initHandPose = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Check if ml5 is loaded
        if (typeof window.ml5 === 'undefined') {
          throw new Error('ML5 library not loaded. Please refresh the page.');
        }

        console.log('ML5 loaded:', window.ml5);

        // Step 1: Get camera access first
        console.log('Requesting camera access...');
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user'
          }
        });

        if (!mountedRef.current) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        streamRef.current = stream;
        console.log('Camera access granted');

        // Step 2: Set up video element
        const video = videoRef.current;
        if (!video) {
          throw new Error('Video element not found');
        }

        video.srcObject = stream;
        
        // Wait for video to be ready
        await new Promise<void>((resolve, reject) => {
          video.onloadedmetadata = () => {
            console.log('Video metadata loaded');
            video.play()
              .then(() => {
                console.log('Video playing:', video.videoWidth, 'x', video.videoHeight);
                resolve();
              })
              .catch(reject);
          };
          video.onerror = () => reject(new Error('Video error'));
          setTimeout(() => resolve(), 5000); // Timeout fallback
        });

        if (!mountedRef.current) return;

        // Step 3: Create handpose model
        console.log('Creating handPose model...');
        
        // ml5 v1 returns the model object directly
        // but the model needs time to load internally
        const handPoseResult = window.ml5.handPose({ maxHands: 1 });
        console.log('handPose() returned:', handPoseResult);
        
        // If it's a Promise, await it
        if (handPoseResult && typeof handPoseResult.then === 'function') {
          console.log('Result is Promise, awaiting...');
          handPoseRef.current = await handPoseResult;
        } else {
          handPoseRef.current = handPoseResult;
        }

        // If there's a ready promise, await it
        if (handPoseRef.current && handPoseRef.current.ready) {
          console.log('Awaiting model.ready...');
          await handPoseRef.current.ready;
          console.log('Model ready!');
        } else {
          // Give the model time to initialize
          console.log('No ready promise, waiting 2s...');
          await new Promise(r => setTimeout(r, 2000));
        }

        if (!mountedRef.current) return;

        console.log('Model should be ready now');
        console.log('detectStart:', typeof handPoseRef.current?.detectStart);

        // Step 4: Start detection
        if (handPoseRef.current && video) {
          if (typeof handPoseRef.current.detectStart === 'function') {
            console.log('Calling detectStart...');
            handPoseRef.current.detectStart(video, gotHands);
            console.log('detectStart called!');
            setIsLoading(false);
            setGestureMessage('✋ Move your hand to draw in the mystical space');
          } else if (typeof handPoseRef.current.detect === 'function') {
            console.log('Using detect() loop...');
            setIsLoading(false);
            setGestureMessage('✋ Move your hand to draw in the mystical space');
            
            const runDetection = async () => {
              if (!mountedRef.current || !video || !handPoseRef.current) return;
              try {
                const results = await handPoseRef.current.detect(video);
                gotHands(results);
              } catch (e) {
                console.error('Detection error:', e);
              }
              if (mountedRef.current) {
                setTimeout(runDetection, 100);
              }
            };
            runDetection();
          } else {
            // Log all available things on the model
            console.log('Model properties:', Object.keys(handPoseRef.current || {}));
            const proto = Object.getPrototypeOf(handPoseRef.current);
            if (proto) {
              console.log('Prototype methods:', Object.getOwnPropertyNames(proto));
            }
            throw new Error('No detection method found');
          }
        } else {
          throw new Error('Model or video not ready');
        }

      } catch (err: any) {
        console.error('Handpose init error:', err);
        if (mountedRef.current) {
          setError(err.message || 'Failed to initialize hand tracking');
          setIsLoading(false);
        }
      }
    };

    initHandPose();

    return () => {
      mountedRef.current = false;
      
      // Stop detection
      if (handPoseRef.current && typeof handPoseRef.current.detectStop === 'function') {
        try {
          handPoseRef.current.detectStop();
        } catch (e) {
          console.log('Error stopping detection:', e);
        }
      }
      
      // Stop camera
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      
      // Cancel animation
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      // Clear timer
      if (holdTimerRef.current) {
        clearInterval(holdTimerRef.current);
      }
    };
  }, [isOpen, gotHands]);

  // Draw hand landmarks and trail
  useEffect(() => {
    if (!isOpen || isLoading) return;

    const drawFrame = () => {
      const canvas = canvasRef.current;
      const trailCanvas = trailCanvasRef.current;
      const video = videoRef.current;
      
      if (!canvas || !trailCanvas || !video) {
        animationRef.current = requestAnimationFrame(drawFrame);
        return;
      }
      
      const ctx = canvas.getContext('2d');
      const trailCtx = trailCanvas.getContext('2d');
      
      if (!ctx || !trailCtx) {
        animationRef.current = requestAnimationFrame(drawFrame);
        return;
      }

      // Clear main canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw mirrored video
      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
      ctx.restore();
      
      // Add mystical overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw hands
      if (hands.length > 0) {
        const hand = hands[0];
        
        // ml5 v1 keypoints structure: array of {x, y, confidence, name}
        // Index finger tip is at index 8
        if (hand.keypoints && hand.keypoints.length > 8) {
          const indexTip = hand.keypoints[8];
          
          if (indexTip) {
            // Mirror the x coordinate
            const mirroredX = canvas.width - indexTip.x;
            const currentPoint = { x: mirroredX, y: indexTip.y };

            // Get middle finger tip for gesture detection
            const middleTip = hand.keypoints[12];
            
            // Simple gesture detection: if index is higher (lower y value) than middle, we're "pointing"
            const isPointing = middleTip ? indexTip.y < middleTip.y : true;
            
            if (isPointing) {
              setGestureMessage('Drawing your energy pattern...');
              
              // Add to trail
              if (lastPointRef.current) {
                const dx = currentPoint.x - lastPointRef.current.x;
                const dy = currentPoint.y - lastPointRef.current.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist > 3) {
                  setGestureTrail(prev => [...prev, currentPoint].slice(-200));
                }
              }
              lastPointRef.current = currentPoint;
            } else {
              setGestureMessage('Point with your index finger to draw');
            }

            // Draw fingertip indicator
            ctx.beginPath();
            ctx.fillStyle = isPointing 
              ? `color-mix(in srgb, ${currentTheme.gold} 80%, transparent)` 
              : 'rgba(255,255,255,0.5)';
            ctx.arc(mirroredX, indexTip.y, isPointing ? 15 : 8, 0, Math.PI * 2);
            ctx.fill();
            
            // Add glow effect
            if (isPointing) {
              ctx.beginPath();
              ctx.strokeStyle = currentTheme.gold;
              ctx.lineWidth = 2;
              ctx.shadowBlur = 20;
              ctx.shadowColor = currentTheme.gold;
              ctx.arc(mirroredX, indexTip.y, 20, 0, Math.PI * 2);
              ctx.stroke();
              ctx.shadowBlur = 0;
            }
            
            // Draw all keypoints (faded)
            hand.keypoints.forEach((kp: any, idx: number) => {
              const mx = canvas.width - kp.x;
              ctx.beginPath();
              ctx.fillStyle = idx === 8 ? currentTheme.gold : 'rgba(255,255,255,0.3)';
              ctx.arc(mx, kp.y, idx === 8 ? 6 : 3, 0, Math.PI * 2);
              ctx.fill();
            });

            // Draw skeleton lines
            const connections = [
              [0, 1], [1, 2], [2, 3], [3, 4], // thumb
              [0, 5], [5, 6], [6, 7], [7, 8], // index
              [0, 9], [9, 10], [10, 11], [11, 12], // middle
              [0, 13], [13, 14], [14, 15], [15, 16], // ring
              [0, 17], [17, 18], [18, 19], [19, 20], // pinky
              [5, 9], [9, 13], [13, 17] // palm
            ];

            ctx.strokeStyle = 'rgba(255,255,255,0.2)';
            ctx.lineWidth = 1;
            connections.forEach(([i, j]) => {
              if (hand.keypoints[i] && hand.keypoints[j]) {
                ctx.beginPath();
                ctx.moveTo(canvas.width - hand.keypoints[i].x, hand.keypoints[i].y);
                ctx.lineTo(canvas.width - hand.keypoints[j].x, hand.keypoints[j].y);
                ctx.stroke();
              }
            });
          }
        }
      } else {
        setGestureMessage('✋ Show your hand to the camera');
        lastPointRef.current = null;
      }

      // Draw trail on trail canvas
      if (gestureTrail.length > 1) {
        trailCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
        
        trailCtx.beginPath();
        trailCtx.strokeStyle = currentTheme.gold;
        trailCtx.lineWidth = 4;
        trailCtx.lineCap = 'round';
        trailCtx.lineJoin = 'round';
        trailCtx.shadowBlur = 20;
        trailCtx.shadowColor = currentTheme.gold;
        
        trailCtx.moveTo(gestureTrail[0].x, gestureTrail[0].y);
        for (let i = 1; i < gestureTrail.length; i++) {
          const xc = (gestureTrail[i].x + gestureTrail[i - 1].x) / 2;
          const yc = (gestureTrail[i].y + gestureTrail[i - 1].y) / 2;
          trailCtx.quadraticCurveTo(gestureTrail[i - 1].x, gestureTrail[i - 1].y, xc, yc);
        }
        trailCtx.stroke();
        
        // Add glow particles
        gestureTrail.forEach((point, idx) => {
          const opacity = idx / gestureTrail.length;
          trailCtx.beginPath();
          trailCtx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.5})`;
          trailCtx.arc(point.x, point.y, 2 + opacity * 3, 0, Math.PI * 2);
          trailCtx.fill();
        });
      }

      animationRef.current = requestAnimationFrame(drawFrame);
    };

    animationRef.current = requestAnimationFrame(drawFrame);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isOpen, isLoading, hands, gestureTrail, currentTheme]);

  // Clear trail
  const clearTrail = useCallback(() => {
    setGestureTrail([]);
    const trailCanvas = trailCanvasRef.current;
    if (trailCanvas) {
      const ctx = trailCanvas.getContext('2d');
      ctx?.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
    }
  }, []);

  // Capture gesture for divination
  const captureGesture = useCallback(() => {
    const trailCanvas = trailCanvasRef.current;
    if (!trailCanvas || gestureTrail.length < 10) {
      setGestureMessage('Draw more to capture your energy');
      return;
    }

    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = 640;
    exportCanvas.height = 480;
    const exportCtx = exportCanvas.getContext('2d');
    
    if (exportCtx) {
      // Dark mystical background
      exportCtx.fillStyle = currentTheme.id === 'mystic-purple' ? '#130424' :
                            currentTheme.id === 'midnight-ocean' ? '#0a1628' :
                            currentTheme.id === 'blood-moon' ? '#1a0a0a' : '#0a1f0a';
      exportCtx.fillRect(0, 0, 640, 480);
      
      // Draw the gesture trail
      exportCtx.drawImage(trailCanvas, 0, 0);
      
      const base64 = exportCanvas.toDataURL('image/png').split(',')[1];
      setCapturedGesture(base64);
      
      if (onComplete) {
        onComplete(base64);
      }
      
      setGestureMessage('Energy pattern captured! Close to use in divination.');
    }
  }, [gestureTrail, currentTheme, onComplete]);

  // Hold to capture
  const startHold = useCallback(() => {
    if (gestureTrail.length < 10) return;
    
    setHoldProgress(0);
    holdTimerRef.current = setInterval(() => {
      setHoldProgress(prev => {
        if (prev >= 100) {
          if (holdTimerRef.current) clearInterval(holdTimerRef.current);
          captureGesture();
          return 0;
        }
        return prev + 4;
      });
    }, 50);
  }, [gestureTrail, captureGesture]);

  const endHold = useCallback(() => {
    if (holdTimerRef.current) {
      clearInterval(holdTimerRef.current);
    }
    setHoldProgress(0);
  }, []);

  // Handle use for divination - must be before early return!
  const handleUseDivination = useCallback(() => {
    if (capturedGesture && onUseDivination) {
      onUseDivination(capturedGesture);
      onClose();
    }
  }, [capturedGesture, onUseDivination, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md overflow-y-auto py-4"
      >
        <div className="absolute inset-0" onClick={onClose}></div>
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-xl mx-4"
        >
          <div 
            className="rounded-2xl overflow-hidden"
            style={{ 
              background: `linear-gradient(180deg, var(--theme-bg-light), var(--theme-bg))`,
              border: '1px solid color-mix(in srgb, var(--theme-gold) 40%, transparent)'
            }}
          >
            {/* Header with Close Button */}
            <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'color-mix(in srgb, var(--theme-gold) 20%, transparent)' }}>
              <div>
                <h2 className="font-serif text-xl" style={{ color: 'var(--theme-gold)' }}>Hand Divination</h2>
                <p className="text-xs" style={{ color: 'var(--theme-text-dim)' }}>Draw with your hand gestures</p>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ 
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  border: '1px solid var(--theme-gold)',
                  color: 'var(--theme-gold)'
                }}
                title="Close (ESC)"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Video/Canvas Area - Smaller */}
            <div className="relative aspect-[4/3] bg-black max-h-[50vh]">
              <video
                ref={videoRef}
                className="hidden"
                width={640}
                height={480}
                playsInline
                muted
                autoPlay
              />
              
              <canvas
                ref={canvasRef}
                width={640}
                height={480}
                className="absolute inset-0 w-full h-full object-contain"
              />
              
              <canvas
                ref={trailCanvasRef}
                width={640}
                height={480}
                className="absolute inset-0 w-full h-full pointer-events-none object-contain"
              />

              {/* Loading overlay */}
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 rounded-full animate-spin mb-3 mx-auto" 
                         style={{ borderColor: 'var(--theme-gold)', borderTopColor: 'transparent' }}></div>
                    <p className="text-sm" style={{ color: 'var(--theme-gold)' }}>Loading hand tracking...</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--theme-text-dim)' }}>Allow camera access</p>
                  </div>
                </div>
              )}

              {/* Error overlay */}
              {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                  <div className="text-center p-4">
                    <svg className="w-10 h-10 mx-auto mb-2 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <p className="text-red-400 text-sm mb-2">{error}</p>
                    <button
                      onClick={onClose}
                      className="px-4 py-1.5 rounded-lg text-sm"
                      style={{ backgroundColor: 'var(--theme-gold)', color: 'var(--theme-bg)' }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}

              {/* Gesture message */}
              {!isLoading && !error && (
                <div className="absolute top-2 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full backdrop-blur-md"
                     style={{ backgroundColor: 'rgba(0,0,0,0.6)', border: '1px solid var(--theme-gold)' }}>
                  <p className="text-xs font-serif" style={{ color: 'var(--theme-gold)' }}>{gestureMessage}</p>
                </div>
              )}

              {/* Captured preview */}
              {capturedGesture && (
                <div className="absolute bottom-2 right-2 w-16 h-12 rounded overflow-hidden border"
                     style={{ borderColor: 'var(--theme-gold)' }}>
                  <img src={`data:image/png;base64,${capturedGesture}`} alt="Captured" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <span className="text-white text-xs">✓</span>
                  </div>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="p-4 flex flex-wrap gap-2 justify-center">
              <button
                onClick={clearTrail}
                className="px-4 py-2 rounded-lg text-sm font-serif transition-all hover:scale-105"
                style={{ 
                  backgroundColor: 'transparent',
                  border: '1px solid var(--theme-gold)',
                  color: 'var(--theme-text-dim)'
                }}
              >
                Clear
              </button>
              
              <button
                onMouseDown={startHold}
                onMouseUp={endHold}
                onMouseLeave={endHold}
                onTouchStart={startHold}
                onTouchEnd={endHold}
                disabled={gestureTrail.length < 10}
                className="px-5 py-2 rounded-lg text-sm font-serif font-bold relative overflow-hidden transition-all"
                style={{ 
                  backgroundColor: gestureTrail.length < 10 ? '#374151' : 'var(--theme-bg-lighter)',
                  border: gestureTrail.length < 10 ? '1px solid #4b5563' : '1px solid var(--theme-gold)',
                  color: gestureTrail.length < 10 ? '#6b7280' : 'var(--theme-gold)',
                  cursor: gestureTrail.length < 10 ? 'not-allowed' : 'pointer'
                }}
              >
                <div 
                  className="absolute inset-0 opacity-80"
                  style={{ 
                    background: `linear-gradient(90deg, var(--theme-gold), var(--theme-gold-dim))`,
                    width: `${holdProgress}%`,
                    transition: 'width 50ms linear'
                  }}
                />
                <span className="relative z-10">
                  {holdProgress > 0 ? 'Channeling...' : 'Hold to Capture'}
                </span>
              </button>

              {/* Use for Divination button - appears after capture */}
              {capturedGesture && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={handleUseDivination}
                  className="px-5 py-2 rounded-lg text-sm font-serif font-bold transition-all hover:scale-105"
                  style={{ 
                    background: `linear-gradient(135deg, var(--theme-gold), var(--theme-gold-dim))`,
                    color: 'var(--theme-bg)',
                    boxShadow: '0 0 20px color-mix(in srgb, var(--theme-gold) 30%, transparent)'
                  }}
                >
                  Use for Divination
                </motion.button>
              )}
            </div>

            {/* Compact Instructions */}
            <div className="px-4 pb-4">
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs justify-center" style={{ color: 'var(--theme-text-dim)' }}>
                <span>Point to draw</span>
                <span>Hold to capture</span>
                <span>Use captured pattern</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default HandDivination;
