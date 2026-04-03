import { useEffect, useRef, useState } from 'react';
import './BrandProcessAnimation.css';

const BrandProcessAnimation = () => {
  const [activeStep, setActiveStep] = useState(0);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const burstsRef = useRef([]);
  const streamRef = useRef({ active: true, currentSegment: 0, progress: 0 });
  const stepBurstTriggeredRef = useRef({});
  const lastBurstTimeRef = useRef({});

  // Get CSS variables for brand colors
  const getBrandColors = () => {
    const computedStyle = getComputedStyle(document.documentElement);
    return {
      primary: computedStyle.getPropertyValue('--primary').trim() || '#212d51',
      secondary:
        computedStyle.getPropertyValue('--secondary').trim() || '#f7d50f',
    };
  };

  const brandColors = getBrandColors();

  const steps = [
    {
      name: 'Discovery',
      x: 100,
      y: 150,
      icon: '🔍',
      color: brandColors.primary,
      outlineColor: brandColors.primary,
    },
    {
      name: 'Concept',
      x: 350,
      y: 100,
      icon: '💡',
      color: brandColors.primary,
      outlineColor: brandColors.primary,
    },
    {
      name: 'Refinement',
      x: 600,
      y: 120,
      icon: '✨',
      color: brandColors.primary,
      outlineColor: brandColors.primary,
    },
    {
      name: 'Delivery',
      x: 850,
      y: 150,
      icon: '🎯',
      color: brandColors.primary,
      outlineColor: brandColors.primary,
    },
  ];

  // Subtle burst particle class
  class BurstParticle {
    constructor(x, y, color, stepIndex) {
      this.x = x;
      this.y = y;
      this.stepIndex = stepIndex;
      const angle = Math.random() * Math.PI * 4;
      const speed = Math.random() * 2 + 1;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.life = 1;
      this.size = Math.random() * 2 + 1;
      this.color = color;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vx *= 0.96;
      this.vy *= 0.96;
      this.life -= 0.025;
      return this.life > 0;
    }

    draw(ctx) {
      ctx.globalAlpha = this.life * 0.6;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * this.life, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Regular floating particle with spacing
  class Particle {
    constructor(x, y, stepIndex) {
      this.x = x;
      this.y = y;
      this.stepIndex = stepIndex;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5 - 0.3;
      this.life = 1;
      this.size = Math.random() * 2 + 0.5;
      this.color = steps[stepIndex].outlineColor;
      this.targetReached = false;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life -= 0.008;

      const targetStep = steps[this.stepIndex];
      const dx = this.x - targetStep.x;
      const dy = this.y - targetStep.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 20 && !this.targetReached && this.life > 0.5) {
        this.targetReached = true;
        const burstCount = Math.floor(Math.random() * 6) + 4;
        for (let i = 0; i < burstCount; i++) {
          burstsRef.current.push(
            new BurstParticle(
              targetStep.x,
              targetStep.y,
              targetStep.outlineColor,
              this.stepIndex,
            ),
          );
        }
        return false;
      }

      return this.life > 0;
    }

    draw(ctx) {
      ctx.globalAlpha = this.life * 0.5;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Trigger subtle burst for a specific step when stream reaches it
  const triggerStepBurst = (stepIndex) => {
    const step = steps[stepIndex];
    const now = Date.now();
    if (
      !lastBurstTimeRef.current[stepIndex] ||
      now - lastBurstTimeRef.current[stepIndex] > 1000
    ) {
      lastBurstTimeRef.current[stepIndex] = now;
      stepBurstTriggeredRef.current[stepIndex] = true;
      const burstCount = Math.floor(Math.random() * 22) + 8;
      for (let i = 0; i < burstCount; i++) {
        burstsRef.current.push(
          new BurstParticle(step.x, step.y, step.outlineColor, stepIndex),
        );
      }
      setTimeout(() => {
        stepBurstTriggeredRef.current[stepIndex] = false;
      }, 1000);
    }
  };

  // Reset burst tracking for the next cycle
  const resetBurstTracking = () => {
    stepBurstTriggeredRef.current = {};
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Set canvas dimensions
    const setCanvasSize = () => {
      const container = canvas.parentElement;
      canvas.width = container.clientWidth;
      canvas.height = 300;
      const width = canvas.width;
      steps[0].x = width * 0.1;
      steps[1].x = width * 0.37;
      steps[2].x = width * 0.63;
      steps[3].x = width * 0.9;
      steps[0].y = 150;
      steps[1].y = 100;
      steps[2].y = 120;
      steps[3].y = 150;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    let time = 0;
    let lastTimestamp = 0;
    const STREAM_SPEED = 0.67;

    const animate = (timestamp) => {
      if (!ctx) return;

      const delta = Math.min(0.05, (timestamp - lastTimestamp) / 1000);
      lastTimestamp = timestamp;
      time += delta;

      if (streamRef.current.active) {
        streamRef.current.progress += delta * STREAM_SPEED;

        if (streamRef.current.progress >= 1) {
          streamRef.current.progress = 0;
          streamRef.current.currentSegment++;

          if (streamRef.current.currentSegment < steps.length) {
            const reachedStepIndex = streamRef.current.currentSegment;
            triggerStepBurst(reachedStepIndex);
          }

          if (streamRef.current.currentSegment >= steps.length - 1) {
            streamRef.current.currentSegment = 0;
            triggerStepBurst(0);
          }
        }
      }

      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw static connecting path (dim background)
      ctx.beginPath();
      ctx.moveTo(steps[0].x, steps[0].y);
      for (let i = 1; i < steps.length; i++) {
        ctx.lineTo(steps[i].x, steps[i].y);
      }
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 12]);
      ctx.stroke();
      ctx.setLineDash([]);

      const currentSegment = streamRef.current.currentSegment;
      const progress = streamRef.current.progress;

      if (currentSegment < steps.length - 1) {
        const start = steps[currentSegment];
        const end = steps[currentSegment + 1];

        const currentX = start.x + (end.x - start.x) * progress;
        const currentY = start.y + (end.y - start.y) * progress;

        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(currentX, currentY);
        ctx.strokeStyle = brandColors.primary;
        ctx.lineWidth = 3;
        ctx.setLineDash([6, 8]);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.beginPath();
        ctx.arc(currentX, currentY, 5, 0, Math.PI * 2);
        ctx.fillStyle = brandColors.primary;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(currentX, currentY, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();

        for (let i = 0; i < 6; i++) {
          const trailProgress = Math.max(0, progress - (i + 1) * 0.08);
          if (trailProgress > 0) {
            const trailX = start.x + (end.x - start.x) * trailProgress;
            const trailY = start.y + (end.y - start.y) * trailProgress;
            ctx.beginPath();
            ctx.arc(trailX, trailY, 2.5 - i * 0.3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(33, 45, 81, ${0.4 - i * 0.05})`;
            ctx.fill();
          }
        }
      }

      for (let i = 0; i < currentSegment; i++) {
        ctx.beginPath();
        ctx.moveTo(steps[i].x, steps[i].y);
        ctx.lineTo(steps[i + 1].x, steps[i + 1].y);
        ctx.strokeStyle = brandColors.primary;
        ctx.lineWidth = 2.5;
        ctx.setLineDash([6, 8]);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // Draw each step node (circles and strokes only - NO icons yet)
      steps.forEach((step, idx) => {
        const pulse = Math.sin(time * 3 + idx) * 2;
        const isActive = idx === activeStep;
        const isCurrentTarget = idx === currentSegment + 1;
        const hasJustBurst = stepBurstTriggeredRef.current[idx];

        if (isCurrentTarget && progress > 0.1) {
          ctx.beginPath();
          ctx.arc(step.x, step.y, 36, 0, Math.PI * 2);

          const gradient = ctx.createRadialGradient(
            step.x,
            step.y,
            10,
            step.x,
            step.y,
            36,
          );

          gradient.addColorStop(0, 'rgba(247, 213, 15, 0.25)');
          gradient.addColorStop(1, 'rgba(247, 213, 15, 0)');

          ctx.fillStyle = gradient;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(step.x, step.y, 32 + pulse * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = isActive
          ? `${step.outlineColor}15`
          : `${step.outlineColor}08`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(step.x, step.y, 28, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();

        if (hasJustBurst) {
          ctx.strokeStyle = step.outlineColor;
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.font = '16px Arial';
          ctx.fillStyle = step.outlineColor;
          ctx.fillText('✓', step.x + 18, step.y - 18);
        } else {
          ctx.strokeStyle = step.outlineColor;
          ctx.lineWidth = isActive ? 2.5 : 1.5;
          ctx.stroke();
        }
      });

      // Draw icons in a SEPARATE loop at the very end so they sit on top
      steps.forEach((step, idx) => {
        ctx.font = '28px Arial';
        ctx.fillStyle = step.color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(step.icon, step.x, step.y);
      });

      // Draw labels
      // steps.forEach((step, idx) => {
      //   ctx.font = 'bold 14px Manrope, sans-serif';
      //   ctx.fillStyle = brandColors.secondary;
      //   ctx.fillText(step.name, step.x, step.y + 55);
      // });

      particlesRef.current = particlesRef.current.filter((p) => p.update());
      particlesRef.current.forEach((p) => p.draw(ctx));

      burstsRef.current = burstsRef.current.filter((b) => b.update());
      burstsRef.current.forEach((b) => b.draw(ctx));

      if (Math.random() < 0.1) {
        const stepIndex = Math.floor(Math.random() * steps.length);
        const step = steps[stepIndex];
        const angle = Math.random() * Math.PI * 2;
        const radius = 20 + Math.random() * 10;
        const x = step.x + Math.cos(angle) * radius;
        const y = step.y + Math.sin(angle) * radius;
        particlesRef.current.push(new Particle(x, y, stepIndex));
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    streamRef.current = { active: true, currentSegment: 0, progress: 0 };
    resetBurstTracking();
    setTimeout(() => triggerStepBurst(0), 100);

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const mouseX = (e.clientX - rect.left) * scaleX;
      const mouseY = (e.clientY - rect.top) * scaleY;

      let newActive = -1;
      steps.forEach((step, idx) => {
        const dx = mouseX - step.x;
        const dy = mouseY - step.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 35) newActive = idx;
      });
      setActiveStep(newActive);
    };

    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const mouseX = (e.clientX - rect.left) * scaleX;
      const mouseY = (e.clientY - rect.top) * scaleY;

      steps.forEach((step, idx) => {
        const dx = mouseX - step.x;
        const dy = mouseY - step.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 35) {
          const burstCount = Math.floor(Math.random() * 10) + 6;
          for (let i = 0; i < burstCount; i++) {
            burstsRef.current.push(
              new BurstParticle(step.x, step.y, step.outlineColor, idx),
            );
          }
        }
      });
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', () => setActiveStep(-1));
    canvas.addEventListener('click', handleClick);

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', () => setActiveStep(-1));
      canvas.removeEventListener('click', handleClick);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div className='brand-process-animation'>
      <canvas ref={canvasRef} className='process-canvas' />
    </div>
  );
};

export default BrandProcessAnimation;
