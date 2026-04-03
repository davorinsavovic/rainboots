import { useEffect, useRef, useState } from 'react';
import './AcquisitionProcessAnimation.css';

const AcquisitionProcessAnimation = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);

  const stages = [
    { name: 'Audience Research', icon: '🎯', step: '01' },
    { name: 'Strategy Development', icon: '📊', step: '02' },
    { name: 'Campaign Launch', icon: '🚀', step: '03' },
    { name: 'Monitor & Optimize', icon: '📈', step: '04' },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const setCanvasSize = () => {
      const container = canvas.parentElement;
      canvas.width = container.clientWidth;
      canvas.height = 200;
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    let time = 0;
    let lastTimestamp = 0;

    const getBrandColors = () => {
      const computedStyle = getComputedStyle(document.documentElement);
      return {
        primary:
          computedStyle.getPropertyValue('--primary').trim() || '#212d51',
        secondary:
          computedStyle.getPropertyValue('--secondary').trim() || '#f7d50f',
      };
    };

    const colors = getBrandColors();

    const animate = (timestamp) => {
      if (!ctx) return;

      const delta = Math.min(0.05, (timestamp - lastTimestamp) / 1000);
      lastTimestamp = timestamp;
      time += delta;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Calculate stage positions horizontally
      const stageCount = stages.length;
      const spacing = canvas.width / (stageCount + 1);
      const y = canvas.height / 2;

      const positions = stages.map((_, i) => ({
        x: spacing * (i + 1),
        y: y,
      }));

      // Draw connecting lines
      ctx.beginPath();
      ctx.moveTo(positions[0].x, positions[0].y);
      for (let i = 1; i < positions.length; i++) {
        ctx.lineTo(positions[i].x, positions[i].y);
      }
      ctx.strokeStyle = `${colors.primary}30`;
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 8]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Animated progress line
      const progress = (time % 4) / 4; // 4 seconds per cycle
      const progressLength = progress * (positions.length - 1);
      const currentSegment = Math.floor(progressLength);
      const segmentProgress = progressLength - currentSegment;

      if (currentSegment < positions.length - 1) {
        const start = positions[currentSegment];
        const end = positions[currentSegment + 1];
        const currentX = start.x + (end.x - start.x) * segmentProgress;
        const currentY = start.y + (end.y - start.y) * segmentProgress;

        ctx.beginPath();
        ctx.moveTo(positions[0].x, positions[0].y);

        for (let i = 1; i <= currentSegment; i++) {
          ctx.lineTo(positions[i].x, positions[i].y);
        }

        if (currentSegment < positions.length - 1) {
          ctx.lineTo(currentX, currentY);
        }

        ctx.strokeStyle = colors.secondary;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Moving dot
        ctx.beginPath();
        ctx.arc(currentX, currentY, 6, 0, Math.PI * 2);
        ctx.fillStyle = colors.secondary;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(currentX, currentY, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
      }

      // Draw each stage
      stages.forEach((stage, idx) => {
        const pos = positions[idx];
        const isActive = Math.floor(time % 4) === idx;
        const pulse = Math.sin(time * 5) * 3;

        // Outer glow for active stage
        if (isActive) {
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, 32 + pulse * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = `${colors.secondary}15`;
          ctx.fill();
        }

        // Main circle
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 28, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.strokeStyle = isActive ? colors.secondary : colors.primary;
        ctx.lineWidth = isActive ? 3 : 2;
        ctx.stroke();

        // Icon
        ctx.font = '28px Arial';
        ctx.fillStyle = isActive ? colors.secondary : colors.primary;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(stage.icon, pos.x, pos.y);

        // Stage name below step number
        ctx.font = 'bold 12px Manrope, sans-serif';
        ctx.fillStyle = colors.primary;
        ctx.fillText(stage.name, pos.x, pos.y + 62);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div className='acquisition-process-animation'>
      <canvas ref={canvasRef} className='acquisition-canvas' />
    </div>
  );
};

export default AcquisitionProcessAnimation;
