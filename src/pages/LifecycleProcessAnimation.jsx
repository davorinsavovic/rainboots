import { useEffect, useRef, useState } from 'react';
import './LifecycleProcessAnimation.css';

const LifecycleProcessAnimation = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);

  const stages = [
    { name: 'Audit & Analysis', x: 0, y: 0, icon: '🔍', phase: 'discover' },
    { name: 'Strategy Development', x: 0, y: 0, icon: '📊', phase: 'plan' },
    { name: 'Implementation', x: 0, y: 0, icon: '⚙️', phase: 'execute' },
    { name: 'Optimization', x: 0, y: 0, icon: '📈', phase: 'optimize' },
  ];

  // Particle class for flowing energy
  class FlowParticle {
    constructor(startX, startY, endX, endY, color) {
      this.startX = startX;
      this.startY = startY;
      this.endX = endX;
      this.endY = endY;
      this.progress = 0;
      this.speed = 0.005 + Math.random() * 0.01;
      this.size = Math.random() * 4 + 2;
      this.color = color;
      this.life = 1;
    }

    update() {
      this.progress += this.speed;
      this.life = 1 - this.progress;
      return this.progress < 1;
    }

    getPosition() {
      const x = this.startX + (this.endX - this.startX) * this.progress;
      const y = this.startY + (this.endY - this.startY) * this.progress;
      return { x, y };
    }

    draw(ctx) {
      const pos = this.getPosition();
      ctx.globalAlpha = this.life * 0.8;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, this.size * this.life, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Orbiting particle class
  class OrbitingParticle {
    constructor(cx, cy, radius, angle, color, stageIndex) {
      this.cx = cx;
      this.cy = cy;
      this.radius = radius;
      this.angle = angle;
      this.speed = 0.01 + Math.random() * 0.02;
      this.size = Math.random() * 3 + 1;
      this.color = color;
      this.stageIndex = stageIndex;
      this.life = 1;
    }

    update() {
      this.angle += this.speed;
      this.life -= 0.003;
      return this.life > 0;
    }

    getPosition() {
      return {
        x: this.cx + Math.cos(this.angle) * this.radius,
        y: this.cy + Math.sin(this.angle) * this.radius,
      };
    }

    draw(ctx) {
      const pos = this.getPosition();
      ctx.globalAlpha = this.life * 0.6;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const setCanvasSize = () => {
      const container = canvas.parentElement;
      canvas.width = container.clientWidth;
      canvas.height = 500;

      // Set stage positions in a circular flow
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2 - 30;
      const radius = Math.min(canvas.width, canvas.height) * 0.28;

      stages[0].x = centerX;
      stages[0].y = centerY - radius;
      stages[1].x = centerX + radius;
      stages[1].y = centerY;
      stages[2].x = centerX;
      stages[2].y = centerY + radius;
      stages[3].x = centerX - radius;
      stages[3].y = centerY;
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    let time = 0;
    let lastTimestamp = 0;
    let flowParticles = [];
    let orbitingParticles = [];
    let lastParticleSpawn = 0;

    const getBrandColors = () => {
      const computedStyle = getComputedStyle(document.documentElement);
      return {
        primary:
          computedStyle.getPropertyValue('--primary').trim() || '#212d51',
        secondary:
          computedStyle.getPropertyValue('--secondary').trim() || '#f7d50f',
        accent: computedStyle.getPropertyValue('--splash').trim() || '#4BB3D4',
      };
    };

    const colors = getBrandColors();

    const animate = (timestamp) => {
      if (!ctx) return;

      const delta = Math.min(0.05, (timestamp - lastTimestamp) / 1000);
      lastTimestamp = timestamp;
      time += delta;

      // Clear canvas with fade trail effect
      ctx.fillStyle = 'rgba(237, 242, 248, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw connecting arrows (circular flow)
      for (let i = 0; i < stages.length; i++) {
        const from = stages[i];
        const to = stages[(i + 1) % stages.length];

        // Draw curved path
        ctx.beginPath();

        if (i === 0) {
          // Top to right - bezier curve
          ctx.moveTo(from.x, from.y);
          ctx.quadraticCurveTo(from.x + 40, from.y + 40, to.x, to.y);
        } else if (i === 1) {
          // Right to bottom
          ctx.moveTo(from.x, from.y);
          ctx.quadraticCurveTo(from.x - 40, from.y + 40, to.x, to.y);
        } else if (i === 2) {
          // Bottom to left
          ctx.moveTo(from.x, from.y);
          ctx.quadraticCurveTo(from.x - 40, from.y - 40, to.x, to.y);
        } else {
          // Left to top
          ctx.moveTo(from.x, from.y);
          ctx.quadraticCurveTo(from.x + 40, from.y - 40, to.x, to.y);
        }

        ctx.strokeStyle = `${colors.primary}30`;
        ctx.lineWidth = 3;
        ctx.setLineDash([8, 12]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw arrow head
        const angle = Math.atan2(to.y - from.y, to.x - from.x);
        const arrowSize = 10;
        const arrowX = to.x - 20;
        const arrowY = to.y - 20;

        ctx.beginPath();
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(arrowX - arrowSize * 0.7, arrowY - arrowSize * 0.5);
        ctx.lineTo(arrowX - arrowSize * 0.7, arrowY + arrowSize * 0.5);
        ctx.fillStyle = `${colors.primary}40`;
        ctx.fill();
      }

      // Draw pulsing flow ring
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2 - 30;
      const ringRadius = Math.min(canvas.width, canvas.height) * 0.32;
      const pulseRing = Math.sin(time * 2) * 3;

      ctx.beginPath();
      ctx.arc(centerX, centerY, ringRadius + pulseRing, 0, Math.PI * 2);
      ctx.strokeStyle = `${colors.secondary}40`;
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 15]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw each stage node
      stages.forEach((stage, idx) => {
        const pulse = Math.sin(time * 2 + idx) * 3;
        const isActive = Math.floor(time * 0.5) % stages.length === idx;

        // Outer glow for active stage
        if (isActive) {
          ctx.beginPath();
          ctx.arc(stage.x, stage.y, 38 + pulse, 0, Math.PI * 2);
          const gradient = ctx.createRadialGradient(
            stage.x,
            stage.y,
            20,
            stage.x,
            stage.y,
            45,
          );
          gradient.addColorStop(0, `${colors.secondary}30`);
          gradient.addColorStop(1, `${colors.secondary}00`);
          ctx.fillStyle = gradient;
          ctx.fill();
        }

        // Stage circle
        ctx.beginPath();
        ctx.arc(stage.x, stage.y, 32, 0, Math.PI * 2);
        ctx.fillStyle = isActive ? 'white' : `${colors.primary}08`;
        ctx.fill();
        ctx.strokeStyle = isActive ? colors.secondary : colors.primary;
        ctx.lineWidth = isActive ? 3 : 2;
        ctx.stroke();

        // Icon
        ctx.font = '32px Arial';
        ctx.fillStyle = isActive ? colors.secondary : colors.primary;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(stage.icon, stage.x, stage.y);

        // Stage name
        ctx.font = 'bold 12px Manrope, sans-serif';
        ctx.fillStyle = colors.primary;
        ctx.fillText(stage.name, stage.x, stage.y + 75);
      });

      // Spawn new flow particles
      if (timestamp - lastParticleSpawn > 300) {
        lastParticleSpawn = timestamp;
        const fromIdx = Math.floor(Math.random() * stages.length);
        const from = stages[fromIdx];
        const to = stages[(fromIdx + 1) % stages.length];

        flowParticles.push(
          new FlowParticle(from.x, from.y, to.x, to.y, colors.secondary),
        );
      }

      // Spawn orbiting particles around active stage
      if (Math.random() < 0.15) {
        const activeIdx = Math.floor(time * 0.5) % stages.length;
        const stage = stages[activeIdx];
        const radius = 45 + Math.random() * 15;
        const angle = Math.random() * Math.PI * 2;
        orbitingParticles.push(
          new OrbitingParticle(
            stage.x,
            stage.y,
            radius,
            angle,
            colors.secondary,
            activeIdx,
          ),
        );
      }

      // Update and draw flow particles
      flowParticles = flowParticles.filter((p) => p.update());
      flowParticles.forEach((p) => p.draw(ctx));

      // Update and draw orbiting particles
      orbitingParticles = orbitingParticles.filter((p) => p.update());
      orbitingParticles.forEach((p) => p.draw(ctx));

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div className='lifecycle-process-animation'>
      <canvas ref={canvasRef} className='lifecycle-canvas' />
    </div>
  );
};

export default LifecycleProcessAnimation;
