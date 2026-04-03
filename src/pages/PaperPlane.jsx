import { useEffect, useRef } from 'react';

const FLIGHT_PATH =
  'M 0 128 C 60 128,130 75,200 75 C 270 75,330 118,420 118 C 490 118,560 62,640 62 C 720 62,780 112,860 112 C 940 112,1000 55,1080 55 C 1130 55,1165 68,1200 48';
const DURATION = 10000; // 10s — slower, more relaxed
const DOT_SPACING = 18; // px between dot centres along the path
const DOT_RADIUS = 3; // dot size

const PaperPlane = () => {
  const ghostRef = useRef(null);
  const dotsRef = useRef(null);
  const p1Ref = useRef(null);
  const p2Ref = useRef(null);
  const p3Ref = useRef(null);
  const spRef = useRef(null);
  const rafRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    const ghost = ghostRef.current;
    const dotsG = dotsRef.current;
    const total = ghost.getTotalLength();

    // Pre-calculate fixed dot positions along the full path
    const dotCount = Math.floor(total / DOT_SPACING);
    const dotPositions = [];
    for (let i = 0; i <= dotCount; i++) {
      const pt = ghost.getPointAtLength(i * DOT_SPACING);
      dotPositions.push(pt);
    }

    // Build a pool of reusable <circle> elements — avoids createElement each frame
    const pool = [];
    for (let i = 0; i < dotPositions.length; i++) {
      const c = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'circle',
      );
      c.setAttribute('r', DOT_RADIUS);
      c.setAttribute('fill', '#1B2A6B');
      c.style.display = 'none';
      dotsG.appendChild(c);
      pool.push(c);
    }

    const getAngle = (t) => {
      const eps = 0.005;
      const a = ghost.getPointAtLength(Math.max(0, t - eps) * total);
      const b = ghost.getPointAtLength(Math.min(1, t + eps) * total);
      return Math.atan2(b.y - a.y, b.x - a.x);
    };

    const pts = (arr) => arr.map((p) => p.join(',')).join(' ');

    const rot = (x, y, angle, px, py) => [
      x + px * Math.cos(angle) - py * Math.sin(angle),
      y + px * Math.sin(angle) + py * Math.cos(angle),
    ];

    const drawPlane = (x, y, angle) => {
      const nose = rot(x, y, angle, 26, 0);
      const tail = rot(x, y, angle, -26, 0);
      const topR = rot(x, y, angle, 10, -12);
      const botR = rot(x, y, angle, 10, 12);

      p1Ref.current.setAttribute('points', pts([nose, topR, tail]));
      p2Ref.current.setAttribute('points', pts([nose, botR, tail]));
      p3Ref.current.setAttribute('points', pts([topR, nose, botR]));
      spRef.current.setAttribute('x1', tail[0]);
      spRef.current.setAttribute('y1', tail[1]);
      spRef.current.setAttribute('x2', nose[0]);
      spRef.current.setAttribute('y2', nose[1]);
    };

    const frame = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const t = ((ts - startRef.current) % DURATION) / DURATION;
      const dist = t * total;

      // Show dots only behind the plane's current position
      for (let i = 0; i < dotPositions.length; i++) {
        const c = pool[i];
        if (i * DOT_SPACING <= dist) {
          c.setAttribute('cx', dotPositions[i].x);
          c.setAttribute('cy', dotPositions[i].y);
          c.style.display = '';
        } else {
          c.style.display = 'none';
        }
      }

      const pt = ghost.getPointAtLength(dist);
      drawPlane(pt.x, pt.y, getAngle(t));
      rafRef.current = requestAnimationFrame(frame);
    };

    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <section className='plane-animation-section'>
      <svg
        width='100%'
        viewBox='0 0 1200 180'
        xmlns='http://www.w3.org/2000/svg'
      >
        {/* Invisible guide path */}
        <path ref={ghostRef} d={FLIGHT_PATH} fill='none' stroke='none' />

        {/* Dot trail — circles appended by JS into this group */}
        <g ref={dotsRef} />

        {/* Paper plane */}
        <g>
          <polygon
            ref={p1Ref}
            fill='#1B2C6E'
            stroke='#0a1230'
            strokeWidth='0.8'
            strokeLinejoin='round'
          />
          <polygon
            ref={p2Ref}
            fill='#2C3E8C'
            stroke='#0a1230'
            strokeWidth='0.8'
            strokeLinejoin='round'
          />
          <polygon
            ref={p3Ref}
            fill='#162258'
            stroke='#0a1230'
            strokeWidth='0.7'
            strokeLinejoin='round'
          />
          <line ref={spRef} stroke='#0a1230' strokeWidth='0.8' />
        </g>
      </svg>
    </section>
  );
};

export default PaperPlane;
