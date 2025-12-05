import React, { useEffect, useRef } from 'react';
import { useTheme } from './ThemeSelector';

// Theme-specific background configurations
interface ThemeConfig {
  bg: string;
  primaryColor: string;
  secondaryColor: string;
}

const THEME_CONFIGS: Record<string, ThemeConfig> = {
  'mystic-purple': { 
    bg: '#130424', 
    primaryColor: '#c5a059',
    secondaryColor: '#9333ea'
  },
  'midnight-ocean': { 
    bg: '#0a1628', 
    primaryColor: '#60a5fa',
    secondaryColor: '#22d3ee'
  },
  'blood-moon': { 
    bg: '#1a0a0a', 
    primaryColor: '#fbbf24',
    secondaryColor: '#dc2626'
  },
  'enchanted-forest': { 
    bg: '#0a1f0a', 
    primaryColor: '#a3e635',
    secondaryColor: '#4ade80'
  },
};

// ============================================
// PARTICLE TYPES FOR EACH THEME
// ============================================

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  twinkleSpeed: number;
}

// Deep Ocean - Floating mystical orbs
interface DeepOrb {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speedX: number;
  speedY: number;
  pulsePhase: number;
  pulseSpeed: number;
  hue: number; // For color variation
}

interface Ember {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speedY: number;
  speedX: number;
  life: number;
  maxLife: number;
  wobble: number;
}

interface Leaf {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  swayPhase: number;
  type: number;
}

// ============================================
// MAIN COMPONENT
// ============================================

const StarBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { currentTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const config = THEME_CONFIGS[currentTheme.id] || THEME_CONFIGS['mystic-purple'];

    // Parse hex color to RGB
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 255, g: 255, b: 255 };
    };

    const primaryRgb = hexToRgb(config.primaryColor);
    const secondaryRgb = hexToRgb(config.secondaryColor);

    // ============================================
    // PURPLE THEME - STARS
    // ============================================
    let stars: Star[] = [];
    
    const initStars = () => {
      stars = [];
      const count = Math.floor((canvas.width * canvas.height) / 4000);
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2.5 + 0.5,
          opacity: Math.random(),
          speed: Math.random() * 0.15 + 0.03,
          twinkleSpeed: Math.random() * 0.003 + 0.001
        });
      }
    };

    const drawStars = () => {
      stars.forEach(star => {
        star.opacity += Math.sin(Date.now() * star.twinkleSpeed) * 0.02;
        star.opacity = Math.max(0.1, Math.min(1, star.opacity));
        
        star.y -= star.speed;
        if (star.y < -5) {
          star.y = canvas.height + 5;
          star.x = Math.random() * canvas.width;
        }

        const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 3);
        gradient.addColorStop(0, `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, ${star.opacity * 0.8})`);
        gradient.addColorStop(0.5, `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, ${star.opacity * 0.3})`);
        gradient.addColorStop(1, 'transparent');
        
        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * 0.9})`;
        ctx.arc(star.x, star.y, star.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    // ============================================
    // BLUE THEME - DEEP OCEAN MYSTICAL ORBS
    // ============================================
    let orbs: DeepOrb[] = [];

    const initOrbs = () => {
      orbs = [];
      const count = 50;
      for (let i = 0; i < count; i++) {
        orbs.push(createOrb());
      }
    };

    const createOrb = (): DeepOrb => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 20 + 5,
      opacity: Math.random() * 0.4 + 0.1,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.2 - 0.1, // Slight upward drift
      pulsePhase: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.02 + 0.01,
      hue: Math.random() * 40 - 20 // Slight color variation
    });

    const drawDeepOcean = () => {
      const time = Date.now() * 0.001;
      
      // Draw subtle mist layers
      for (let i = 0; i < 3; i++) {
        const mistY = canvas.height * (0.3 + i * 0.25);
        const mistOpacity = 0.03 - i * 0.008;
        
        ctx.beginPath();
        ctx.fillStyle = `rgba(${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}, ${mistOpacity})`;
        ctx.ellipse(
          canvas.width / 2 + Math.sin(time * 0.3 + i) * 100,
          mistY,
          canvas.width * 0.8,
          100 + Math.sin(time * 0.5 + i) * 30,
          0, 0, Math.PI * 2
        );
        ctx.fill();
      }

      // Draw floating orbs
      orbs.forEach((orb, index) => {
        // Update position
        orb.x += orb.speedX;
        orb.y += orb.speedY;
        orb.pulsePhase += orb.pulseSpeed;
        
        // Wrap around screen
        if (orb.x < -50) orb.x = canvas.width + 50;
        if (orb.x > canvas.width + 50) orb.x = -50;
        if (orb.y < -50) orb.y = canvas.height + 50;
        if (orb.y > canvas.height + 50) orb.y = -50;
        
        // Pulsing size and opacity
        const pulse = Math.sin(orb.pulsePhase) * 0.3 + 1;
        const currentSize = orb.size * pulse;
        const currentOpacity = orb.opacity * (0.7 + Math.sin(orb.pulsePhase) * 0.3);
        
        // Outer glow
        const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, currentSize * 3);
        gradient.addColorStop(0, `rgba(${primaryRgb.r + orb.hue}, ${primaryRgb.g + orb.hue}, ${primaryRgb.b}, ${currentOpacity * 0.8})`);
        gradient.addColorStop(0.4, `rgba(${secondaryRgb.r}, ${secondaryRgb.g + orb.hue}, ${secondaryRgb.b}, ${currentOpacity * 0.4})`);
        gradient.addColorStop(1, 'transparent');
        
        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(orb.x, orb.y, currentSize * 3, 0, Math.PI * 2);
        ctx.fill();

        // Inner bright core
        ctx.beginPath();
        ctx.fillStyle = `rgba(200, 230, 255, ${currentOpacity * 0.6})`;
        ctx.arc(orb.x, orb.y, currentSize * 0.3, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw ethereal connection lines between nearby orbs
      ctx.strokeStyle = `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.05)`;
      ctx.lineWidth = 1;
      for (let i = 0; i < orbs.length; i++) {
        for (let j = i + 1; j < orbs.length; j++) {
          const dx = orbs[i].x - orbs[j].x;
          const dy = orbs[i].y - orbs[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(orbs[i].x, orbs[i].y);
            ctx.lineTo(orbs[j].x, orbs[j].y);
            ctx.globalAlpha = (1 - dist / 150) * 0.15;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }

      // Add subtle shimmer particles
      for (let i = 0; i < 30; i++) {
        const shimmerX = (Math.sin(time * 0.5 + i * 1.7) * 0.5 + 0.5) * canvas.width;
        const shimmerY = (Math.cos(time * 0.3 + i * 2.1) * 0.5 + 0.5) * canvas.height;
        const shimmerSize = 1.5 + Math.sin(time * 3 + i) * 0.8;
        const shimmerOpacity = 0.3 + Math.sin(time * 2 + i * 0.5) * 0.2;
        
        ctx.beginPath();
        ctx.fillStyle = `rgba(180, 220, 255, ${shimmerOpacity})`;
        ctx.arc(shimmerX, shimmerY, shimmerSize, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    // ============================================
    // RED THEME - FIRE EMBERS
    // ============================================
    let embers: Ember[] = [];

    const initEmbers = () => {
      embers = [];
      const count = 80;
      for (let i = 0; i < count; i++) {
        embers.push(createEmber());
      }
    };

    const createEmber = (): Ember => ({
      x: Math.random() * canvas.width,
      y: canvas.height + Math.random() * 100,
      size: Math.random() * 4 + 1,
      opacity: Math.random() * 0.8 + 0.2,
      speedY: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      life: 0,
      maxLife: Math.random() * 200 + 100,
      wobble: Math.random() * Math.PI * 2
    });

    const drawEmbers = () => {
      embers.forEach((ember, index) => {
        ember.life++;
        ember.y -= ember.speedY;
        ember.wobble += 0.1;
        ember.x += ember.speedX + Math.sin(ember.wobble) * 0.5;
        
        const lifeRatio = ember.life / ember.maxLife;
        ember.opacity = Math.max(0, 1 - lifeRatio) * 0.8;
        ember.size = Math.max(0.5, (1 - lifeRatio) * 4);
        
        if (ember.life >= ember.maxLife || ember.y < -20) {
          embers[index] = createEmber();
          return;
        }
        
        const gradient = ctx.createRadialGradient(ember.x, ember.y, 0, ember.x, ember.y, ember.size * 4);
        gradient.addColorStop(0, `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, ${ember.opacity})`);
        gradient.addColorStop(0.3, `rgba(${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}, ${ember.opacity * 0.6})`);
        gradient.addColorStop(1, 'transparent');
        
        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(ember.x, ember.y, ember.size * 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = `rgba(255, ${180 + Math.random() * 75}, 50, ${ember.opacity})`;
        ctx.arc(ember.x, ember.y, ember.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Heat haze at bottom
      const time = Date.now() * 0.002;
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x += 20) {
        const heatY = canvas.height - 50 + Math.sin(x * 0.02 + time) * 20;
        ctx.moveTo(x, canvas.height);
        ctx.lineTo(x + Math.sin(time + x * 0.01) * 5, heatY);
      }
      ctx.strokeStyle = `rgba(${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}, 0.1)`;
      ctx.lineWidth = 2;
      ctx.stroke();
    };

    // ============================================
    // GREEN THEME - FALLING LEAVES
    // ============================================
    let leaves: Leaf[] = [];

    const initLeaves = () => {
      leaves = [];
      const count = 40;
      for (let i = 0; i < count; i++) {
        leaves.push(createLeaf());
      }
    };

    const createLeaf = (): Leaf => ({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height,
      size: Math.random() * 12 + 6,
      opacity: Math.random() * 0.6 + 0.3,
      speedY: Math.random() * 1 + 0.5,
      speedX: (Math.random() - 0.5) * 0.3,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.05,
      swayPhase: Math.random() * Math.PI * 2,
      type: Math.floor(Math.random() * 3)
    });

    const drawLeaf = (leaf: Leaf) => {
      ctx.save();
      ctx.translate(leaf.x, leaf.y);
      ctx.rotate(leaf.rotation);
      ctx.globalAlpha = leaf.opacity;
      
      ctx.beginPath();
      const s = leaf.size;
      
      if (leaf.type === 0) {
        ctx.ellipse(0, 0, s * 0.4, s, 0, 0, Math.PI * 2);
      } else if (leaf.type === 1) {
        ctx.moveTo(0, -s);
        ctx.quadraticCurveTo(s * 0.6, -s * 0.3, s * 0.5, s * 0.3);
        ctx.quadraticCurveTo(0, s, 0, s);
        ctx.quadraticCurveTo(0, s, -s * 0.5, s * 0.3);
        ctx.quadraticCurveTo(-s * 0.6, -s * 0.3, 0, -s);
      } else {
        for (let i = 0; i < 5; i++) {
          const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
          const innerAngle = angle + Math.PI / 5;
          const outerR = s;
          const innerR = s * 0.4;
          if (i === 0) {
            ctx.moveTo(Math.cos(angle) * outerR, Math.sin(angle) * outerR);
          }
          ctx.lineTo(Math.cos(innerAngle) * innerR, Math.sin(innerAngle) * innerR);
          ctx.lineTo(Math.cos(angle + Math.PI * 2 / 5) * outerR, Math.sin(angle + Math.PI * 2 / 5) * outerR);
        }
      }
      
      const gradient = ctx.createLinearGradient(-s, -s, s, s);
      gradient.addColorStop(0, `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 1)`);
      gradient.addColorStop(1, `rgba(${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}, 1)`);
      
      ctx.fillStyle = gradient;
      ctx.fill();
      
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.8);
      ctx.lineTo(0, s * 0.8);
      ctx.strokeStyle = `rgba(0, 50, 0, 0.3)`;
      ctx.lineWidth = 1;
      ctx.stroke();
      
      ctx.restore();
    };

    const drawLeaves = () => {
      leaves.forEach((leaf, index) => {
        leaf.swayPhase += 0.02;
        leaf.y += leaf.speedY;
        leaf.x += leaf.speedX + Math.sin(leaf.swayPhase) * 1.5;
        leaf.rotation += leaf.rotationSpeed;
        
        if (leaf.y > canvas.height + 30) {
          leaves[index] = createLeaf();
          leaves[index].y = -30;
          return;
        }
        
        drawLeaf(leaf);
      });

      // Fireflies/pollen
      const time = Date.now() * 0.001;
      for (let i = 0; i < 15; i++) {
        const x = (Math.sin(time * 0.3 + i * 2.5) * 0.4 + 0.5) * canvas.width;
        const y = (Math.cos(time * 0.4 + i * 1.8) * 0.4 + 0.5) * canvas.height;
        const opacity = 0.3 + Math.sin(time * 3 + i) * 0.2;
        const size = 2 + Math.sin(time * 2 + i * 0.7) * 1;
        
        ctx.beginPath();
        const particleGradient = ctx.createRadialGradient(x, y, 0, x, y, size * 3);
        particleGradient.addColorStop(0, `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, ${opacity})`);
        particleGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = particleGradient;
        ctx.arc(x, y, size * 3, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    // ============================================
    // RESIZE AND INIT
    // ============================================
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      switch (currentTheme.id) {
        case 'midnight-ocean':
          initOrbs();
          break;
        case 'blood-moon':
          initEmbers();
          break;
        case 'enchanted-forest':
          initLeaves();
          break;
        default:
          initStars();
      }
    };

    // ============================================
    // MAIN DRAW LOOP
    // ============================================
    const draw = () => {
      ctx.fillStyle = config.bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      switch (currentTheme.id) {
        case 'midnight-ocean':
          drawDeepOcean();
          break;
        case 'blood-moon':
          drawEmbers();
          break;
        case 'enchanted-forest':
          drawLeaves();
          break;
        default:
          drawStars();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [currentTheme.id]);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" />;
};

export default StarBackground;
