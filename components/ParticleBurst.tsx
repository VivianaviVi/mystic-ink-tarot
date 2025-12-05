import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  angle: number;
  speed: number;
  opacity: number;
  rotation: number;
  type: 'star' | 'sparkle' | 'dot';
}

interface ParticleBurstProps {
  trigger: boolean;
  onComplete?: () => void;
  colors?: string[];
  particleCount?: number;
}

const PARTICLE_COLORS = [
  '#FFD700', // Gold
  '#FFF8DC', // Cornsilk
  '#FFE4B5', // Moccasin
  '#9D4EDD', // Purple accent
  '#FFFFFF', // White
  '#F0E68C', // Khaki
];

const ParticleBurst: React.FC<ParticleBurstProps> = ({ 
  trigger, 
  onComplete,
  colors = PARTICLE_COLORS,
  particleCount = 40
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (trigger && !isAnimating) {
      setIsAnimating(true);
      
      // Generate particles
      const newParticles: Particle[] = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: 50, // Start from center (percentage)
        y: 50,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        angle: (Math.PI * 2 * i) / particleCount + Math.random() * 0.5,
        speed: Math.random() * 150 + 80,
        opacity: 1,
        rotation: Math.random() * 360,
        type: ['star', 'sparkle', 'dot'][Math.floor(Math.random() * 3)] as 'star' | 'sparkle' | 'dot',
      }));
      
      setParticles(newParticles);
      
      // Clear after animation
      setTimeout(() => {
        setParticles([]);
        setIsAnimating(false);
        onComplete?.();
      }, 1500);
    }
  }, [trigger, isAnimating, colors, particleCount, onComplete]);

  if (particles.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-particle-burst"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            '--angle': particle.angle,
            '--speed': `${particle.speed}px`,
            '--rotation': `${particle.rotation}deg`,
            animationDuration: `${1 + Math.random() * 0.5}s`,
          } as React.CSSProperties}
        >
          {particle.type === 'star' && (
            <svg 
              width={particle.size} 
              height={particle.size} 
              viewBox="0 0 24 24" 
              fill={particle.color}
              style={{ filter: `drop-shadow(0 0 ${particle.size/2}px ${particle.color})` }}
            >
              <path d="M12 0L14.59 8.41L24 12L14.59 15.59L12 24L9.41 15.59L0 12L9.41 8.41L12 0Z" />
            </svg>
          )}
          {particle.type === 'sparkle' && (
            <div 
              className="rounded-full"
              style={{ 
                width: particle.size, 
                height: particle.size, 
                backgroundColor: particle.color,
                boxShadow: `0 0 ${particle.size}px ${particle.color}`,
              }} 
            />
          )}
          {particle.type === 'dot' && (
            <div 
              style={{ 
                width: particle.size / 2, 
                height: particle.size / 2, 
                backgroundColor: particle.color,
                borderRadius: '50%',
                boxShadow: `0 0 ${particle.size}px ${particle.color}`,
              }} 
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default ParticleBurst;


