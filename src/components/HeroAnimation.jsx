/**
 * HeroAnimation.jsx
 * =================
 * A multi-scene animated hero sequence built with Framer Motion.
 *
 * [All your existing documentation remains the same...]
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo, useRef } from 'react';
import './HeroAnimation.css';
import designIcon from '/images/web-design.svg';
import htmlIcon from '/images/html-5.svg';
import cssIcon from '/images/css3.svg';
import laptop from '/images/laptop.png';
import websites from '/images/websites.png';
import youtubeIcon from '/images/youtube.svg';
import linkedinIcon from '/images/linkedin.svg';
import vimeoIcon from '/images/vimeo.svg';
import facebookIcon from '/images/facebook.svg';
import tiktokIcon from '/images/tiktok.svg';

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────

/** Inline SVG data-URL for the X (Twitter) logo — used because no SVG file is available */
const X_SVG_URL =
  "data:image/svg+xml,%3Csvg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23212d51' d='M21.742 21.75l-7.563-11.179 7.056-8.321h-2.456l-5.691 6.714-4.54-6.714H2.359l7.29 10.776L2.25 21.75h2.456l6.035-7.118 4.818 7.118h6.191-.008zM7.739 3.818L18.81 20.182h-2.447L5.29 3.818h2.447z'/%3E%3C/svg%3E";

/**
 * SOCIAL_ICONS — Scene 3 orbiting social media icons.          [REF:social-icon-data]
 *
 * Each entry controls one icon's orbit behaviour:
 *   radius      — orbit distance from center in px. Larger = further out.
 *   size        — icon container size in px.
 *   duration    — seconds for one full orbit loop. Smaller = faster spin.
 *   delay       — seconds before this icon starts animating (stagger entry).
 *   startAngle  — initial position on the orbit circle in radians.
 *                 0 = right, Math.PI/2 = bottom, Math.PI = left, etc.
 */
const SOCIAL_ICONS = [
  {
    id: 'youtube',
    src: youtubeIcon,
    radius: 195,
    size: 60,
    duration: 7.2,
    delay: 0,
    startAngle: 0,
  },
  {
    id: 'linkedin',
    src: linkedinIcon,
    radius: 230,
    size: 52,
    duration: 9.5,
    delay: 0.18,
    startAngle: Math.PI * 0.4,
  },
  {
    id: 'vimeo',
    src: vimeoIcon,
    radius: 170,
    size: 48,
    duration: 6.1,
    delay: 0.36,
    startAngle: Math.PI * 0.8,
  },
  {
    id: 'facebook',
    src: facebookIcon,
    radius: 215,
    size: 68,
    duration: 8.3,
    delay: 0.54,
    startAngle: Math.PI * 1.2,
  },
  {
    id: 'tiktok',
    src: tiktokIcon,
    radius: 185,
    size: 50,
    duration: 7.8,
    delay: 0.72,
    startAngle: Math.PI * 1.6,
  },
  {
    id: 'x',
    src: X_SVG_URL,
    radius: 240,
    size: 46,
    duration: 10.4,
    delay: 0.9,
    startAngle: Math.PI * 0.2,
  },
];

/**
 * LABELS — Scene 3 cycling text labels shown below the main circle.  [REF:cycling-labels]
 *
 * primary   — first word, rendered in the brand navy color
 * secondary — second word, rendered in gray
 * Displayed in order: online → sales → social
 */
const LABELS = [
  { id: 'online', primary: 'ONLINE', secondary: 'PRESENCE' },
  { id: 'sales', primary: 'SALES', secondary: 'CAMPAIGNS' },
  { id: 'social', primary: 'SOCIAL', secondary: 'NETWORKS' },
];

/**
 * FRAGMENT_STAGES — stages during which Scene 3 fragment/orbit elements are visible.
 * Used as a guard in both render conditions and the leftCircleDone effect.
 */
const FRAGMENT_STAGES = [
  'fragments-show',
  'label-online',
  'label-sales',
  'label-social',
  'final-collapse',
];

/**
 * SCENE4_STAGES — all stages belonging to Scene 4 ("TO MAKE YOU").
 * Used to suppress Scene 1/2/3 elements and vertical-line elements during Scene 4.
 */
const SCENE4_STAGES = [
  'scene4-appear',
  'scene4-bubbles',
  'scene4-orb',
  'scene4-done',
  'scene4-shrink',
  'scene4-settle',
  'scene4-collapse',
];

/**
 * SCENE5_STAGES — all stages belonging to Scene 5 ("LET'S WORK TOGETHER").
 * Used to suppress earlier scene elements during Scene 5.
 */
const SCENE5_STAGES = [
  'scene5-appear',
  'scene5-flash',
  'scene5-shrink',
  'scene5-lines',
  'scene5-together',
  'scene5-done',
];

// ─────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────

const HeroAnimation = ({
  onAnimationComplete,
  onStateChange,
  initialStage,
  isInSplash = false,
}) => {
  // ── STAGE STATE ──────────────────────────────────────────────
  // Master state machine value. Every visual element checks `stage`
  // to decide whether to render, what animation target to use, etc.
  // Change a stage name here AND in the STAGE CONTROLLER effect to rename it.
  const [stage, setStage] = useState('circle-growing');

  // ── ANIMATION CONTROL ────────────────────────────────────────
  // Controls whether the animation is running or stopped
  const [isAnimating, setIsAnimating] = useState(true);
  // Tracks if we're in the final pause before stopping
  const [isFinalPause, setIsFinalPause] = useState(false);

  // ── SCENE 1 STATE ─────────────────────────────────────────────
  // currentWord: index of word currently shown (0=none, 1=THIS, 2=IS, 3=WHAT)
  const [currentWord, setCurrentWord] = useState(0);

  // leftCircleDone: true once the left icon circle finishes its entry animation.
  // Triggers the vertical lines + top/bottom circles to appear.
  const [leftCircleDone, setLeftCircleDone] = useState(false);

  // showVerticalLines: gate for rendering the vertical dotted lines and
  // the top (HTML) / bottom (CSS) icon circles. Set true 600ms after leftCircleDone.
  const [showVerticalLines, setShowVerticalLines] = useState(false);

  // particlesActive: unused visually now (kept for onAnimationComplete compat).
  // Was used to gate the old side-particles; now the orb cloud uses orbPhase instead.
  const [particlesActive, setParticlesActive] = useState(false);

  // ── SCENE 2 STATE ─────────────────────────────────────────────
  // showUpwardBubbles: shows the upward + downward bubble clouds that fly
  // alongside the circle as it moves right in scene 2.
  const [showUpwardBubbles, setShowUpwardBubbles] = useState(false);

  // ── SCENE 3 STATE ─────────────────────────────────────────────
  // showScene3Elements: gates the "WEBSITES" image + text and "BUSINESS" text
  // that flank the circle in scene 3. Set true 500ms into scene3-move-shrink.
  const [showScene3Elements, setShowScene3Elements] = useState(false);

  // showFinalText: gates rendering "WE BOOST YOUR" inside the main circle.
  // Set true when entering final-appear so text is ready when circle pops in.
  const [showFinalText, setShowFinalText] = useState(false);

  // showFinalBubbles: shows the omnidirectional burst bubbles during final-appear
  // (the brief moment before the expanding ring and orbits start).
  const [showFinalBubbles, setShowFinalBubbles] = useState(false);

  // activeLabel: which Scene 3 label is currently visible (null = none).
  // Cycles: null → 'online' → null → 'sales' → null → 'social' → null
  const [activeLabel, setActiveLabel] = useState(null);

  // ── ORB CLOUD STATE (Scene 1 + Scene 4 share the same particle data) ──
  // orbPhase: drives the Scene 1 orb-cloud animation sequence.
  //   null     = particles invisible / not yet started
  //   'expand' = particles fly outward from center to their rest positions (1.1s)
  //   'pulsate'= particles briefly pulse outward ×1.1 then back (0.35s)
  //   'explode'= left-half particles shoot left, right-half shoot right (0.48s)
  //   'fade'   = particles already off-screen; safety fade (0.2s)
  const [orbPhase, setOrbPhase] = useState(null);

  // scene4OrbPhase: same phase values as orbPhase but drives Scene 4's orb cloud.
  // Scene 4 uses a radial (360°) explosion instead of the left/right split.
  const [scene4OrbPhase, setScene4OrbPhase] = useState(null);

  // ── SCENE 4 STATE ─────────────────────────────────────────────
  // showScene4Bubbles: gates the right-bottom biased burst bubbles in Scene 4.
  // Turned off just before the orb explosion fires (at t=1450ms into scene4-orb).
  const [showScene4Bubbles, setShowScene4Bubbles] = useState(false);

  // showScene4BigCircle: triggers the giant expanding ring that fires simultaneously
  // with the orb explosion in Scene 4. Lasts ~400ms then collapses.
  const [showScene4BigCircle, setShowScene4BigCircle] = useState(false);

  // showScene4Text: gates the "STAND ABOVE / OTHERS" text panel below the circle.
  // Becomes true when scene4-settle begins; collapses with the rest in scene4-collapse.
  const [showScene4Text, setShowScene4Text] = useState(false);

  // ── SCENE 5 STATE ─────────────────────────────────────────────
  // showScene5Flash: triggers the quick expanding ring flash in Scene 5.
  const [showScene5Flash, setShowScene5Flash] = useState(false);

  // showScene5Lines: gates both horizontal lines (top from left, bottom from right).
  const [showScene5Lines, setShowScene5Lines] = useState(false);

  // showScene5Together: gates the "TOGETHER" word that scales in between the lines.
  const [showScene5Together, setShowScene5Together] = useState(false);

  // ── MISC ──────────────────────────────────────────────────────
  // words: the three words that flash sequentially inside the circle in Scene 1.
  // To change words, update both this array and the render block that uses `currentWord`.
  const words = ['THIS', 'IS', 'WHAT'];

  // Refs for the three icon circles used to measure vertical-line heights.
  const leftCircleRef = useRef(null); // design icon — anchors the vertical lines
  const topCircleRef = useRef(null); // HTML icon — top of the vertical line
  const bottomCircleRef = useRef(null); // CSS icon — bottom of the vertical line

  // lineHeights: pixel distances between leftCircle↔topCircle and leftCircle↔bottomCircle.
  // Calculated via getBoundingClientRect() after all three refs mount.
  // Default 120 is a fallback in case measurement runs before layout.
  const [lineHeights, setLineHeights] = useState({ up: 120, down: 120 });

  // ─────────────────────────────────────────────────────────────
  // STATE TRACKING - Report state changes to parent
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (onStateChange) {
      const currentState = {
        stage,
        currentWord,
        leftCircleDone,
        showVerticalLines,
        showUpwardBubbles,
        showScene3Elements,
        showFinalText,
        activeLabel,
        orbPhase,
        scene4OrbPhase,
        showScene4Bubbles,
        showScene4BigCircle,
        showScene4Text,
        showScene5Flash,
        showScene5Lines,
        showScene5Together,
        isAnimating,
      };
      onStateChange(currentState);
    }
  }, [
    stage,
    currentWord,
    leftCircleDone,
    showVerticalLines,
    showUpwardBubbles,
    showScene3Elements,
    showFinalText,
    activeLabel,
    orbPhase,
    scene4OrbPhase,
    showScene4Bubbles,
    showScene4BigCircle,
    showScene4Text,
    showScene5Flash,
    showScene5Lines,
    showScene5Together,
    isAnimating,
    onStateChange,
  ]);

  // ─────────────────────────────────────────────────────────────
  // INITIALIZE FROM SAVED STATE (for main page)
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (initialStage && !isInSplash) {
      setStage(initialStage.stage || 'circle-growing');
      setCurrentWord(initialStage.currentWord || 0);
      setLeftCircleDone(initialStage.leftCircleDone || false);
      setShowVerticalLines(initialStage.showVerticalLines || false);
      setShowUpwardBubbles(initialStage.showUpwardBubbles || false);
      setShowScene3Elements(initialStage.showScene3Elements || false);
      setShowFinalText(initialStage.showFinalText || false);
      setActiveLabel(initialStage.activeLabel || null);
      setOrbPhase(initialStage.orbPhase || null);
      setScene4OrbPhase(initialStage.scene4OrbPhase || null);
      setShowScene4Bubbles(initialStage.showScene4Bubbles || false);
      setShowScene4BigCircle(initialStage.showScene4BigCircle || false);
      setShowScene4Text(initialStage.showScene4Text || false);
      setShowScene5Flash(initialStage.showScene5Flash || false);
      setShowScene5Lines(initialStage.showScene5Lines || false);
      setShowScene5Together(initialStage.showScene5Together || false);
      setIsAnimating(
        initialStage.isAnimating !== undefined
          ? initialStage.isAnimating
          : true,
      );
    }
  }, [initialStage, isInSplash]);

  useEffect(() => {
    if (stage === 'scene5-done' && isFinalPause) {
      const t1 = setTimeout(() => {
        setIsAnimating(false);
        setIsFinalPause(false);

        const finalState = {
          stage,
          currentWord,
          leftCircleDone,
          showVerticalLines,
          showUpwardBubbles,
          showScene3Elements,
          showFinalText,
          activeLabel,
          orbPhase,
          scene4OrbPhase,
          showScene4Bubbles,
          showScene4BigCircle,
          showScene4Text,
          showScene5Flash,
          showScene5Lines,
          showScene5Together,
          isAnimating: false,
        };

        console.log('HeroAnimation completing with state:', finalState);

        if (onAnimationComplete) {
          onAnimationComplete(finalState);
        }
      }, 1000);
      return () => clearTimeout(t1);
    }
  }, [stage, isFinalPause, onAnimationComplete]);

  // ─────────────────────────────────────────────────────────────
  // STAGE CONTROLLER                                              [REF:stage-controller]
  // ─────────────────────────────────────────────────────────────
  // Initial delay before the animation begins (ms).
  // Increase this to add a pause before anything appears.
  useEffect(() => {
    if (!isAnimating) return;

    const timer = setTimeout(() => setStage('showing-words'), 500); // ← 500ms boot delay
    return () => clearTimeout(timer);
  }, [isAnimating]);

  useEffect(() => {
    if (!isAnimating) return;

    // ── SCENE 1: THIS / IS / WHAT ──────────────────────────────  [REF:word-flash]
    if (stage === 'showing-words') {
      if (currentWord < words.length) {
        // 333ms per word — change to slow down or speed up the word flash sequence
        const timer = setTimeout(() => setCurrentWord((p) => p + 1), 333);
        return () => clearTimeout(timer);
      } else {
        // 500ms pause after the last word before hiding starts
        const timer = setTimeout(() => setStage('hiding-what'), 500);
        return () => clearTimeout(timer);
      }
    }

    if (stage === 'hiding-what') {
      // 200ms — how long the "hide" animation plays before the morph begins
      const timer = setTimeout(() => setStage('transforming'), 200);
      return () => clearTimeout(timer);
    }

    if (stage === 'transforming') {
      // 200ms — duration of the circle blob-morph shape animation
      const timer = setTimeout(() => setStage('we-do'), 200);
      return () => clearTimeout(timer);
    }

    if (stage === 'we-do') {
      // 320ms — how long "WE DO" is shown before floating bubbles appear
      const timer = setTimeout(() => setStage('bubbles'), 320);
      return () => clearTimeout(timer);
    }

    if (stage === 'bubbles') {
      // 1000ms — how long the floating bubble burst plays before the circle shrinks
      const timer = setTimeout(() => setStage('shrink'), 1000);
      return () => clearTimeout(timer);
    }

    if (stage === 'shrink') {
      /**
       * ORB CLOUD SEQUENCE (all timings relative to entering 'shrink'): [REF:orb-timing-s1]
       *
       *   t=100ms  — orb particles begin expanding from center to rest positions
       *              ↳ change this to delay the orb appearance
       *
       *   t=1200ms — orb switches to 'pulsate' phase (brief ×1.1 pulse)
       *              ↳ expand phase duration = 1200 - 100 = 1100ms
       *              ↳ change gap between t1 and t2 to lengthen/shorten expansion
       *
       *   t=1550ms — orb explodes: left particles → left, right particles → right
       *              ↳ pulsate phase duration = 1550 - 1200 = 350ms
       *
       *   t=2050ms — fade phase begins (particles already off-screen)
       *              ↳ explode phase duration = 2050 - 1550 = 500ms
       *
       *   t=2550ms — orbPhase cleared (particles invisible; React cleans up)
       *              ↳ fade phase duration = 2550 - 2050 = 500ms
       *
       *   t=4500ms — stage advances to 'collapse' (end of Scene 1 hold)
       *              ↳ change this to extend/shorten how long Scene 1 stays visible
       *              ↳ must be > 2550ms so orb finishes before collapse
       *              ↳ must be > ~1500ms so leftCircleDone fires (left-circle entry delay)
       */
      const t1 = setTimeout(() => setOrbPhase('expand'), 100);
      const t2 = setTimeout(() => setOrbPhase('pulsate'), 1200);
      const t3 = setTimeout(() => setOrbPhase('explode'), 1550);
      const t4 = setTimeout(() => setOrbPhase('fade'), 2050);
      const t5 = setTimeout(() => setOrbPhase(null), 2550);
      const holdTimer = setTimeout(() => {
        setStage('collapse');
        setParticlesActive(false);
      }, 4500); // ← total Scene 1 hold duration                   [REF:s1-hold]
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
        clearTimeout(t5);
        clearTimeout(holdTimer);
      };
    }

    // ── SCENE 1 → SCENE 2 TRANSITION ───────────────────────────
    if (stage === 'collapse') {
      // 800ms — pause while Scene 1 elements animate out before Scene 2 begins
      const timer = setTimeout(() => {
        setStage('scene2-move-right');
        setShowUpwardBubbles(true); // bubble clouds appear as circle slides in
      }, 800);
      return () => clearTimeout(timer);
    }

    // ── SCENE 2: WE BUILD ───────────────────────────────────────
    if (stage === 'scene2-move-right') {
      // 1000ms — duration of the circle sliding in from left + bubble cloud display
      const timer = setTimeout(() => {
        setShowUpwardBubbles(false);
        setStage('scene2-expand-collapse');
      }, 1000);
      return () => clearTimeout(timer);
    }

    if (stage === 'scene2-expand-collapse') {
      // 333ms — the quick expand/collapse flash circle that acts as a wipe transition
      const timer = setTimeout(() => setStage('scene3-move-shrink'), 333);
      return () => clearTimeout(timer);
    }

    if (stage === 'scene3-move-shrink') {
      // 500ms — delay before WEBSITES image + BUSINESS text elements are shown
      // The circle is already moving right during this time
      const timer = setTimeout(() => setShowScene3Elements(true), 500);
      return () => clearTimeout(timer);
    }

    // scene3-elements-shown is set by the separate useEffect watching showScene3Elements

    if (stage === 'scene3-elements-shown') {
      // 1000ms — how long the full Scene 2 layout (circle + websites + business) is visible
      const timer = setTimeout(() => setStage('scene3-final-collapse'), 1000);
      return () => clearTimeout(timer);
    }

    if (stage === 'scene3-final-collapse') {
      // 1000ms — Scene 2 elements animate out before Scene 3 begins
      const timer = setTimeout(() => {
        setShowScene3Elements(false);
        setStage('final-appear');
        setShowFinalText(true); // pre-load "WE BOOST YOUR" so it's ready when circle pops
      }, 1000);
      return () => clearTimeout(timer);
    }

    // ── SCENE 3: WE BOOST YOUR ──────────────────────────────────
    if (stage === 'final-appear') {
      // 500ms — delay before burst bubbles appear around the newly-shown circle
      const timer1 = setTimeout(() => setShowFinalBubbles(true), 500);
      // 1500ms total — then the expanding ring fires and orbits begin
      const timer2 = setTimeout(() => {
        setStage('expanding-circle-show');
        setShowFinalBubbles(false);
      }, 1500);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }

    if (stage === 'expanding-circle-show') {
      // 333ms — duration of the expanding ring flash before orbits/labels begin
      const timer = setTimeout(() => setStage('fragments-show'), 333);
      return () => clearTimeout(timer);
    }

    if (stage === 'fragments-show') {
      // 400ms settle before the first label appears
      const t1 = setTimeout(() => {
        setActiveLabel('online');
        setStage('label-online');
      }, 400);
      return () => clearTimeout(t1);
    }

    if (stage === 'label-online') {
      // 1000ms — how long "ONLINE PRESENCE" is visible before starting to fade  [REF:label-timing]
      const t1 = setTimeout(() => setActiveLabel(null), 1000); // begin fade-out
      // 1400ms — 400ms after fade-out starts, next label appears (crossfade gap)
      const t2 = setTimeout(() => {
        setActiveLabel('sales');
        setStage('label-sales');
      }, 1400);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }

    if (stage === 'label-sales') {
      // Same timing as label-online — 1000ms visible, 400ms crossfade gap
      const t1 = setTimeout(() => setActiveLabel(null), 1000);
      const t2 = setTimeout(() => {
        setActiveLabel('social');
        setStage('label-social');
      }, 1400);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }

    if (stage === 'label-social') {
      // 1000ms — how long "SOCIAL NETWORKS" is visible before scene collapses
      const t1 = setTimeout(() => setActiveLabel(null), 1000);
      // 1400ms — then everything in Scene 3 exits via AnimatePresence
      const t2 = setTimeout(() => setStage('final-collapse'), 1400);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }

    // final-collapse: AnimatePresence handles exit animations automatically.
    // 600ms gap before Scene 4 starts to let exit animations play.
    if (stage === 'final-collapse') {
      const t1 = setTimeout(() => setStage('scene4-appear'), 600);
      return () => clearTimeout(t1);
    }

    // ── SCENE 4: TO MAKE YOU ────────────────────────────────────
    if (stage === 'scene4-appear') {
      // 300ms — circle pops in, then bubbles start
      const t1 = setTimeout(() => {
        setShowScene4Bubbles(true);
        setStage('scene4-bubbles');
      }, 300);
      return () => clearTimeout(t1);
    }

    if (stage === 'scene4-bubbles') {
      // 800ms — right-bottom biased bubbles burst before orb cloud begins
      const t1 = setTimeout(() => {
        setStage('scene4-orb');
        setScene4OrbPhase('expand');
        setShowScene4Bubbles(false);
      }, 800);
      return () => clearTimeout(t1);
    }

    if (stage === 'scene4-orb') {
      /**
       * SCENE 4 ORB CLOUD SEQUENCE (relative to entering 'scene4-orb'): [REF:orb-timing-s4]
       *
       *   t=1100ms — pulsate: orb briefly pulses outward ×1.1
       *              ↳ expand duration = 1100ms
       *
       *   t=1450ms — explode: particles blast radially outward in ALL directions (360°)
       *              Also: bubbles stop (setShowScene4Bubbles(false))
       *              Also: giant ring fires (setShowScene4BigCircle(true))
       *              ↳ pulsate duration = 1450 - 1100 = 350ms
       *
       *   t=1850ms — big ring collapses; orb enters fade phase
       *              ↳ explode + ring duration = 1850 - 1450 = 400ms
       *
       *   t=2350ms — orbPhase cleared; stage advances to 'scene4-done'
       *              ↳ fade duration = 2350 - 1850 = 500ms
       */
      const t1 = setTimeout(() => setScene4OrbPhase('pulsate'), 1100);
      const t2 = setTimeout(() => {
        setShowScene4Bubbles(false); // stop bubbles just before explosion
        setScene4OrbPhase('explode');
        setShowScene4BigCircle(true); // giant ring fires at same moment as explosion
      }, 1450);
      const t3 = setTimeout(() => {
        setShowScene4BigCircle(false); // giant ring collapses
        setScene4OrbPhase('fade');
      }, 1850);
      const t4 = setTimeout(() => {
        setScene4OrbPhase(null);
        setStage('scene4-done');
      }, 2350);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
      };
    }

    if (stage === 'scene4-done') {
      // 50ms micro-pause then begin shrinking the circle up
      const t1 = setTimeout(() => setStage('scene4-shrink'), 50);
      return () => clearTimeout(t1);
    }

    if (stage === 'scene4-shrink') {
      // 550ms — circle shrinks to 0.67× and moves up; then "STAND ABOVE" text appears
      const t1 = setTimeout(() => {
        setStage('scene4-settle');
        setShowScene4Bubbles(false);
        setShowScene4Text(true); // "STAND ABOVE / OTHERS" panel appears below circle
      }, 550);
      return () => clearTimeout(t1);
    }

    if (stage === 'scene4-settle') {
      // 1800ms — how long the final Scene 4 layout is held before collapsing
      // Increase this to give viewers more time to read "STAND ABOVE OTHERS"
      const t1 = setTimeout(() => setStage('scene4-collapse'), 2800);
      return () => clearTimeout(t1);
    }

    if (stage === 'scene4-collapse') {
      // 1000ms — elements blast upward with blur; then Scene 5 begins
      const t1 = setTimeout(() => {
        setShowScene4Text(false);
        setStage('scene5-appear');
      }, 1000);
      return () => clearTimeout(t1);
    }

    // ── SCENE 5: LET'S WORK TOGETHER ───────────────────────────
    if (stage === 'scene5-appear') {
      // 650ms — circle slides up from bottom; then flash ring fires
      const t1 = setTimeout(() => {
        setShowScene5Flash(true);
        setStage('scene5-flash');
      }, 650);
      return () => clearTimeout(t1);
    }

    if (stage === 'scene5-flash') {
      // 300ms — expanding ring flash duration; then begin circle shrink
      const t1 = setTimeout(() => {
        setShowScene5Flash(false);
        setStage('scene5-shrink'); // ← New stage for circle shrinking
      }, 300);
      return () => clearTimeout(t1);
    }

    if (stage === 'scene5-shrink') {
      // 400ms — circle shrinks to half size
      const t1 = setTimeout(() => {
        setShowScene5Lines(true);
        setStage('scene5-lines');
      }, 400);
      return () => clearTimeout(t1);
    }

    if (stage === 'scene5-lines') {
      // 500ms — lines animate in from edges; then "TOGETHER" appears
      const t1 = setTimeout(() => {
        setShowScene5Together(true);
        setStage('scene5-together');
      }, 500);
      return () => clearTimeout(t1);
    }

    if (stage === 'scene5-together') {
      // 1500ms — how long the final "LET'S WORK / TOGETHER" layout is held
      const t1 = setTimeout(() => {
        setStage('scene5-done');
        setIsFinalPause(true); // Enter final pause state
      }, 1500);
      return () => clearTimeout(t1);
    }

    // scene5-done: animation sequence complete. Pause for 1 second then stop.
    if (stage === 'scene5-done' && isFinalPause) {
      const t1 = setTimeout(() => {
        setIsAnimating(false);
        setIsFinalPause(false);

        // Create final state to pass back
        const finalState = {
          stage,
          currentWord,
          leftCircleDone,
          showVerticalLines,
          showUpwardBubbles,
          showScene3Elements,
          showFinalText,
          activeLabel,
          orbPhase,
          scene4OrbPhase,
          showScene4Bubbles,
          showScene4BigCircle,
          showScene4Text,
          showScene5Flash,
          showScene5Lines,
          showScene5Together,
          isAnimating: false,
        };

        // Call the onAnimationComplete callback if provided
        if (onAnimationComplete) {
          onAnimationComplete(finalState);
        }
      }, 1000); // ← 1 second pause after last event
      return () => clearTimeout(t1);
    }
  }, [
    stage,
    currentWord,
    showFinalBubbles,
    isAnimating,
    isFinalPause,
    onAnimationComplete,
  ]);

  // ─────────────────────────────────────────────────────────────
  // AUXILIARY EFFECTS
  // ─────────────────────────────────────────────────────────────

  /**
   * Advances stage to 'scene3-elements-shown' 800ms after showScene3Elements
   * becomes true. Separated into its own effect because showScene3Elements is
   * set inside the main effect and React batches state updates.
   * Change 800ms to adjust how long the circle takes to finish moving before
   * the hold stage begins.
   */
  useEffect(() => {
    if (!isAnimating) return;

    if (showScene3Elements && stage === 'scene3-move-shrink') {
      const timer = setTimeout(() => setStage('scene3-elements-shown'), 800);
      return () => clearTimeout(timer);
    }
  }, [showScene3Elements, stage, isAnimating]);

  /**
   * When the left icon circle finishes its entry animation (leftCircleDone = true)
   * AND the stage is still in Scene 1 (not in any later scene's stage list),    [REF:leftcircle-trigger]
   * trigger the vertical lines + top/bottom circles to appear after 600ms.
   *
   * The exclusion list covers every stage AFTER 'shrink' so these elements never
   * reappear accidentally in later scenes.
   *
   * ↳ Change 600ms to delay how long after the left circle appears before the
   *   top/bottom circles and connecting dotted lines animate in.
   */
  useEffect(() => {
    if (!isAnimating) return;

    if (
      leftCircleDone &&
      stage !== 'collapse' &&
      stage !== 'scene2-move-right' &&
      stage !== 'scene2-expand-collapse' &&
      stage !== 'scene3-move-shrink' &&
      stage !== 'scene3-elements-shown' &&
      stage !== 'scene3-final-collapse' &&
      stage !== 'final-appear' &&
      stage !== 'expanding-circle-show' &&
      !FRAGMENT_STAGES.includes(stage) &&
      !SCENE4_STAGES.includes(stage) &&
      !SCENE5_STAGES.includes(stage)
    ) {
      setParticlesActive(false);
      const timer = setTimeout(() => setShowVerticalLines(true), 600); // ← delay after left-circle
      return () => clearTimeout(timer);
    }
  }, [leftCircleDone, stage, isAnimating]);

  // ─────────────────────────────────────────────────────────────
  // PARTICLE / BUBBLE DATA  (all stable across re-renders via useMemo)
  // ─────────────────────────────────────────────────────────────

  /**
   * orbParticles — shared between Scene 1 and Scene 4 orb clouds (160 particles). [REF:orb-particle-data]
   *
   * Each particle has:
   *   angle        — polar angle (0–2π) determining where it rests in the cloud
   *   normR        — normalized radius 0–1 (sqrt-biased so more particles live near edge)
   *   side         — 'left' or 'right' — used for Scene 1's left/right split explosion
   *   size         — diameter in px (inner particles larger, outer smaller)
   *   color        — rgba; dark navy at center → near-white at edge
   *   jitterX/Y    — small random offset so cloud looks organic, not perfectly circular
   *
   * To change cloud size: modify ORB_R in the render blocks below (currently 320px).
   * To change particle count: change 160 in Array.from({ length: 160 }).
   * To change color range: modify the `light` calculation (currently 0–220 brightness).
   */
  const orbParticles = useMemo(
    () =>
      Array.from({ length: 160 }, (_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const normR = Math.sqrt(Math.random()); // sqrt biases distribution toward outer ring
        const light = Math.round(normR * 220); // 0 = dark navy core, 220 = near-white edge
        const alpha = 0.55 + normR * 0.45; // 0.55–1.0 opacity (inner more transparent)
        const size = 4 + (1 - normR) * 12 + Math.random() * 6; // inner larger, outer smaller
        return {
          id: i,
          angle,
          normR,
          side: Math.cos(angle) >= 0 ? 'right' : 'left',
          size,
          color: `rgba(${light},${light},${light + 15},${alpha})`,
          jitterX: (Math.random() - 0.5) * 18,
          jitterY: (Math.random() - 0.5) * 18,
          pulseDuration: 0.18 + Math.random() * 0.12, // (unused directly; kept for reference)
        };
      }),
    [],
  );

  /**
   * bubbles — Scene 1 floating bubbles that burst around "WE DO" (15 bubbles).  [REF:s1-bubble-data]
   *   distance — how far each bubble travels from center (120–195px)
   *   size     — bubble diameter (40–50px)
   *   opacity  — max visibility (0.6–1.0)
   *   duration — animation cycle length in seconds (0.8–2.0s)
   *   delay    — stagger start (0–0.4s)
   */
  const bubbles = useMemo(
    () =>
      Array.from({ length: 15 }, (_, i) => ({
        id: i,
        distance: 120 + Math.random() * 75,
        size: 40 + Math.random() * 10,
        opacity: 0.6 + Math.random() * 0.4,
        duration: 0.8 + Math.random() * 1.2,
        delay: Math.random() * 0.4,
      })),
    [],
  );

  /**
   * finalBubbles — Scene 3 omnidirectional burst bubbles during final-appear (20 bubbles). [REF:final-appear-bubbles]
   * Similar to `bubbles` but travel in random angles (angle field) rather than evenly spaced.
   *   distance — 100–250px
   *   size     — 30–60px
   */
  const finalBubbles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        distance: 100 + Math.random() * 150,
        size: 30 + Math.random() * 30,
        opacity: 0.5 + Math.random() * 0.5,
        duration: 0.5 + Math.random() * 2,
        delay: Math.random() * 0.5,
        angle: Math.random() * Math.PI * 2, // full 360° spread
      })),
    [],
  );

  /**
   * upwardBubbles — Scene 2 bubbles that float upward-left as the circle enters (20 bubbles). [REF:s2-bubble-data]
   * finalY — negative (moves up), range: -300 to -500px
   * finalX — negative (moves left), range: -150 to -250px
   */
  const upwardBubbles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        offsetX: -30 + Math.random() * 60,
        size: 30 + Math.random() * 40,
        opacity: 0.5 + Math.random() * 0.5,
        duration: 1.5 + Math.random() * 1.5,
        delay: Math.random() * 2.5,
        finalY: -300 - Math.random() * 200, // upward travel distance
        finalX: -150 - Math.random() * 100, // leftward travel distance
      })),
    [],
  );

  /**
   * downwardBubbles — Scene 2 bubbles that float downward-left (5 bubbles, smaller set).
   * finalY — positive (moves down), range: 250–400px
   * finalX — negative (moves left), range: -80 to -140px
   */
  const downwardBubbles = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => ({
        id: i,
        offsetX: -20 + Math.random() * 40,
        size: 25 + Math.random() * 35,
        opacity: 0.5 + Math.random() * 0.5,
        duration: 1.5 + Math.random() * 1.5,
        delay: Math.random() * 2.5,
        finalY: 250 + Math.random() * 150, // downward travel distance
        finalX: -80 - Math.random() * 60, // leftward travel distance
      })),
    [],
  );

  /**
   * burstBubbles — Scene 3 sporadic small bubbles that pop around the orbit area (28 bubbles). [REF:burst-bubble-data]
   * Repeat with random delays so they fire at irregular intervals throughout Scene 3.
   * color: every 4th bubble is yellow-gold; rest are navy.
   *   distance — 30–120px from center
   *   size     — 6–20px (smaller than other bubble sets)
   *   repeatDelay is randomized per-render (1.5–4s) to make timing feel organic
   */
  const burstBubbles = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        angle: Math.random() * Math.PI * 2,
        distance: 30 + Math.random() * 90,
        size: 6 + Math.random() * 14,
        opacity: 0.5 + Math.random() * 0.5,
        duration: 0.5 + Math.random() * 0.8,
        delay: Math.random() * 4,
        color: i % 4 === 0 ? 'rgba(247,213,15,0.7)' : 'rgba(33,45,81,0.65)',
      })),
    [],
  );

  /**
   * scene4Bubbles — Scene 4 bubbles biased toward the right-bottom quadrant (22 bubbles). [REF:s4-bubble-data]
   * baseAngle range: -0.1π to 1.1π ≈ right side and bottom half of the circle.
   *   distance — 80–220px
   *   size     — 18–46px
   */
  const scene4Bubbles = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => {
        const baseAngle = -Math.PI * 0.1 + Math.random() * Math.PI * 1.2; // right-bottom bias
        const distance = 80 + Math.random() * 140;
        return {
          id: i,
          angle: baseAngle,
          distance,
          size: 18 + Math.random() * 28,
          opacity: 0.55 + Math.random() * 0.45,
          duration: 0.6 + Math.random() * 1.0,
          delay: Math.random() * 1.8,
        };
      }),
    [],
  );

  // ─────────────────────────────────────────────────────────────
  // LINE HEIGHT MEASUREMENT                                        [REF:line-height-calc]
  // ─────────────────────────────────────────────────────────────
  /**
   * Measures the pixel gaps between the left icon circle and the top/bottom
   * icon circles to set exact heights for the vertical dotted lines.
   * Runs whenever showVerticalLines flips to true (the circles have just mounted).
   * If refs are not yet available the default lineHeights (120px each) are used.
   */
  useEffect(() => {
    if (
      showVerticalLines &&
      leftCircleRef.current &&
      topCircleRef.current &&
      bottomCircleRef.current
    ) {
      const leftRect = leftCircleRef.current.getBoundingClientRect();
      const topRect = topCircleRef.current.getBoundingClientRect();
      const bottomRect = bottomCircleRef.current.getBoundingClientRect();
      setLineHeights({
        up: leftRect.top - topRect.bottom, // gap above left circle
        down: bottomRect.top - leftRect.bottom, // gap below left circle
      });
    }
  }, [showVerticalLines]);

  // ─────────────────────────────────────────────────────────────
  // ORBIT KEYFRAME GENERATOR
  // ─────────────────────────────────────────────────────────────
  /**
   * Generates x/y keyframe arrays for a smooth circular orbit animation.
   * Used for Scene 3 social media icons.
   *
   * @param radius     — orbit radius in px (matches SOCIAL_ICONS[n].radius)
   * @param startAngle — starting angle in radians (matches SOCIAL_ICONS[n].startAngle)
   * @param steps      — number of keyframe points; more = smoother but heavier (default 60)
   * @returns { xs, ys } — parallel arrays of x and y pixel offsets from center
   */
  const orbitKeyframes = (radius, startAngle, steps = 60) => {
    const xs = [],
      ys = [];
    for (let i = 0; i <= steps; i++) {
      const angle = startAngle + (Math.PI * 2 * i) / steps;
      xs.push(Math.cos(angle) * radius);
      ys.push(Math.sin(angle) * radius);
    }
    return { xs, ys };
  };

  // Convenience booleans to keep JSX render conditions readable
  const inFragmentStage = FRAGMENT_STAGES.includes(stage);
  const inScene4Stage = SCENE4_STAGES.includes(stage);
  const inScene5Stage = SCENE5_STAGES.includes(stage);

  // If animation is not running, don't render anything
  if (!isAnimating) {
    return null;
  }

  // ─────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────
  return (
    <div className='hero-animation-container'>
      <div className='hero-animation-scale-wrapper'>
        <div className='hero-animation'>
          {/* ══════════════════════════════════════════════════════
          TRANSITION FLASHES — quick expanding ring wipes
          ══════════════════════════════════════════════════════ */}

          {/* Scene 2 — expand-collapse wipe */}
          {stage === 'scene2-expand-collapse' && (
            <motion.div
              className='expanding-circle'
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 5.5, 0], opacity: [0, 1, 0] }}
              transition={{
                duration: 0.333,
                times: [0, 0.5, 1],
                ease: 'easeOut',
              }}
            />
          )}

          {/* Scene 1 — shrink flash */}
          {stage === 'shrink' && (
            <motion.div
              className='expanding-circle'
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 2.5, 0], opacity: [0, 1, 0] }}
              transition={{
                duration: 0.9,
                times: [0, 0.6, 1],
                ease: 'easeOut',
              }}
              onAnimationComplete={() => {
                if (stage === 'shrink') setParticlesActive(true);
              }}
            />
          )}

          {/* Scene 3 — expanding ring flash */}
          <AnimatePresence>
            {stage === 'expanding-circle-show' && (
              <motion.div
                key='expanding-circle'
                className='expanding-circle'
                style={{ border: '2px solid #212d51', zIndex: 15 }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 2.5, 0], opacity: [0, 1, 0] }}
                transition={{
                  duration: 0.333,
                  times: [0, 0.5, 1],
                  ease: 'easeOut',
                }}
              />
            )}
          </AnimatePresence>

          {/* ══════════════════════════════════════════════════════
          SCENE 3 — ORBITING FRAGMENTS
          ══════════════════════════════════════════════════════ */}
          <AnimatePresence>
            {inFragmentStage && stage !== 'final-collapse' && (
              <>
                {/* Fragment 1 */}
                <motion.div
                  key='fragment1'
                  className='orbiting-fragment'
                  style={{
                    position: 'absolute',
                    width: '40px',
                    height: '40px',
                    border: '2px solid #000',
                    borderRadius: '50%',
                    background: 'transparent',
                    zIndex: 30,
                    left: '50%',
                    top: '50%',
                    marginLeft: '-20px',
                    marginTop: '-20px',
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    x: 220 * Math.cos(0),
                    y: 220 * Math.sin(0),
                    rotate: 360,
                  }}
                  exit={{ scale: 0, opacity: 0, transition: { duration: 0.6 } }}
                  transition={{
                    duration: 6,
                    ease: 'linear',
                    repeat: Infinity,
                    delay: 0.33,
                    x: {
                      duration: 6,
                      ease: 'linear',
                      repeat: Infinity,
                      repeatType: 'loop',
                      values: [0, 220, 0, -220, 0],
                    },
                    y: {
                      duration: 6,
                      ease: 'linear',
                      repeat: Infinity,
                      repeatType: 'loop',
                      values: [0, 0, 220, 0, -220, 0],
                    },
                  }}
                />
                {/* Fragment 2 */}
                <motion.div
                  key='fragment2'
                  className='orbiting-fragment'
                  style={{
                    position: 'absolute',
                    width: '30px',
                    height: '30px',
                    border: '2px solid #212d51',
                    borderRadius: '50%',
                    background: 'transparent',
                    zIndex: 30,
                    left: '50%',
                    top: '50%',
                    marginLeft: '-15px',
                    marginTop: '-15px',
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: 0.9,
                    opacity: 1,
                    x: 180 * Math.cos(0),
                    y: 180 * Math.sin(0),
                    rotate: -360,
                  }}
                  exit={{ scale: 0, opacity: 0, transition: { duration: 0.6 } }}
                  transition={{
                    duration: 5,
                    ease: 'linear',
                    repeat: Infinity,
                    delay: 0.33,
                    x: {
                      duration: 5,
                      ease: 'linear',
                      repeat: Infinity,
                      repeatType: 'loop',
                      values: [0, -180, 0, 180, 0],
                    },
                    y: {
                      duration: 5,
                      ease: 'linear',
                      repeat: Infinity,
                      repeatType: 'loop',
                      values: [0, 180, 0, -180, 0],
                    },
                  }}
                />
                {/* Fragment 3 */}
                <motion.div
                  key='fragment3'
                  className='orbiting-fragment'
                  style={{
                    position: 'absolute',
                    width: '25px',
                    height: '25px',
                    border: '2px solid rgba(247,213,15,0.7)',
                    borderRadius: '50%',
                    background: 'transparent',
                    zIndex: 30,
                    left: '50%',
                    top: '50%',
                    marginLeft: '-12.5px',
                    marginTop: '-12.5px',
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: 0.8,
                    opacity: 0.9,
                    x: 150 * Math.cos(Math.PI / 4),
                    y: 150 * Math.sin(Math.PI / 4),
                    rotate: 360,
                  }}
                  exit={{ scale: 0, opacity: 0, transition: { duration: 0.6 } }}
                  transition={{
                    duration: 4.5,
                    ease: 'linear',
                    repeat: Infinity,
                    delay: 0.33,
                    x: {
                      duration: 4.5,
                      ease: 'linear',
                      repeat: Infinity,
                      repeatType: 'loop',
                      values: [0, 106, 150, 106, 0, -106, -150, -106, 0],
                    },
                    y: {
                      duration: 4.5,
                      ease: 'linear',
                      repeat: Infinity,
                      repeatType: 'loop',
                      values: [0, 106, 0, -106, 0, 106, 0, -106, 0],
                    },
                  }}
                />
              </>
            )}
          </AnimatePresence>

          {/* ══════════════════════════════════════════════════════
          SCENE 3 — SOCIAL MEDIA ICONS ORBITING
          ══════════════════════════════════════════════════════ */}
          <AnimatePresence>
            {inFragmentStage &&
              stage !== 'final-collapse' &&
              SOCIAL_ICONS.map((icon) => {
                const { xs, ys } = orbitKeyframes(icon.radius, icon.startAngle);
                const entryX = Math.cos(icon.startAngle) * icon.radius;
                const entryY = Math.sin(icon.startAngle) * icon.startAngle;
                return (
                  <motion.div
                    key={`social-${icon.id}`}
                    className='social-orbit-icon'
                    style={{
                      position: 'absolute',
                      width: `${icon.size}px`,
                      height: `${icon.size}px`,
                      left: '50%',
                      top: '50%',
                      marginLeft: `-${icon.size / 2}px`,
                      marginTop: `-${icon.size / 2}px`,
                      zIndex: 28,
                    }}
                    initial={{
                      scale: 0,
                      opacity: 0,
                      x: entryX * 0.3,
                      y: entryY * 0.3 - 300,
                      filter: 'blur(20px)',
                    }}
                    animate={{
                      scale: 1,
                      opacity: [0, 0.85, 0.85],
                      x: xs,
                      y: ys,
                      filter: ['blur(6px)', 'blur(3px)', 'blur(1px)'],
                    }}
                    exit={{
                      scale: 0,
                      opacity: 0,
                      filter: 'blur(10px)',
                      transition: { duration: 0.5, delay: icon.delay * 0.3 },
                    }}
                    transition={{
                      delay: icon.delay,
                      scale: {
                        duration: 0.5,
                        delay: icon.delay,
                        ease: 'easeOut',
                      },
                      opacity: { duration: 0.5, delay: icon.delay },
                      filter: { duration: 0.5, delay: icon.delay },
                      x: {
                        duration: icon.duration,
                        delay: icon.delay + 0.5,
                        ease: 'linear',
                        repeat: Infinity,
                        repeatType: 'loop',
                      },
                      y: {
                        duration: icon.duration,
                        delay: icon.delay + 0.5,
                        ease: 'linear',
                        repeat: Infinity,
                        repeatType: 'loop',
                      },
                    }}
                  >
                    <img
                      src={icon.src}
                      alt={icon.id}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  </motion.div>
                );
              })}
          </AnimatePresence>

          {/* ══════════════════════════════════════════════════════
          SCENE 3 — SPORADIC BURST BUBBLES
          ══════════════════════════════════════════════════════ */}
          <AnimatePresence>
            {inFragmentStage &&
              stage !== 'final-collapse' &&
              burstBubbles.map((b) => {
                const bx = Math.cos(b.angle) * b.distance;
                const by = Math.sin(b.angle) * b.distance;
                return (
                  <motion.div
                    key={`burst-${b.id}`}
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      width: b.size,
                      height: b.size,
                      marginLeft: -b.size / 2,
                      marginTop: -b.size / 2,
                      borderRadius: '50%',
                      background: b.color,
                      zIndex: 6,
                      pointerEvents: 'none',
                    }}
                    initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                    animate={{
                      scale: [0, 1.2, 0],
                      opacity: [0, b.opacity, 0],
                      x: [0, bx * 0.6, bx],
                      y: [0, by * 0.6, by],
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: b.duration,
                      delay: b.delay,
                      repeat: Infinity,
                      repeatDelay: 1.5 + Math.random() * 2.5,
                      ease: 'easeOut',
                    }}
                  />
                );
              })}
          </AnimatePresence>

          {/* ══════════════════════════════════════════════════════
          SCENE 3 — CYCLING LABELS
          ══════════════════════════════════════════════════════ */}
          <AnimatePresence mode='wait'>
            {activeLabel &&
              (() => {
                const label = LABELS.find((l) => l.id === activeLabel);
                return (
                  <motion.div
                    key={label.id}
                    className='online-presence-label'
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                  >
                    <span className='online-word'>{label.primary}</span>{' '}
                    <span className='presence-word'>
                      {label.secondary}
                    </span>{' '}
                  </motion.div>
                );
              })()}
          </AnimatePresence>

          {/* ══════════════════════════════════════════════════════
          SCENE 3 — FINAL-APPEAR BURST BUBBLES
          ══════════════════════════════════════════════════════ */}
          <AnimatePresence>
            {showFinalBubbles &&
              stage === 'final-appear' &&
              !stage.includes('expanding') &&
              finalBubbles.map((bubble) => {
                const finalX = Math.cos(bubble.angle) * bubble.distance;
                const finalY = Math.sin(bubble.angle) * bubble.distance;
                return (
                  <motion.div
                    key={`final-bubble-${bubble.id}`}
                    className='floating-bubble'
                    initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                    animate={{
                      scale: [0, 1, 1.1, 0],
                      opacity: [0, bubble.opacity, bubble.opacity, 0],
                      x: [0, finalX * 0.3, finalX * 0.6, finalX],
                      y: [0, finalY * 0.3, finalY * 0.6, finalY],
                    }}
                    exit={{
                      scale: 0,
                      opacity: 0,
                      transition: { duration: 0.3 },
                    }}
                    transition={{
                      duration: bubble.duration,
                      delay: bubble.delay,
                      repeat: Infinity,
                      ease: 'easeOut',
                    }}
                    style={{
                      width: bubble.size,
                      height: bubble.size,
                      background: `rgba(33,45,81,${0.3 + Math.random() * 0.3})`,
                      border: '2px solid rgba(247,213,15,0.3)',
                    }}
                  />
                );
              })}
          </AnimatePresence>

          {/* ══════════════════════════════════════════════════════
          SCENE 1 — LEFT HORIZONTAL DOTTED LINE + LAPTOP IMAGE
          ══════════════════════════════════════════════════════ */}
          <AnimatePresence>
            {(stage === 'shrink' || stage === 'collapse') && (
              <>
                <motion.div
                  className='dotted-line left-line'
                  initial={{ width: 0, opacity: 0 }}
                  animate={{
                    width: stage === 'collapse' ? 0 : 260,
                    opacity: stage === 'collapse' ? 0 : 1,
                  }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{
                    delay: stage === 'shrink' ? 1.2 : 0.2,
                    duration: 0.4,
                    ease: 'easeOut',
                  }}
                />
                <motion.img
                  src={laptop}
                  alt='Web Design'
                  className='laptop-image'
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: stage === 'collapse' ? 0 : 1,
                    scale: stage === 'collapse' ? 0 : 1,
                  }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{
                    delay: stage === 'shrink' ? 1.5 : 0.15,
                    duration: 0.3,
                    ease: 'easeOut',
                  }}
                />
              </>
            )}
          </AnimatePresence>

          {/* ══════════════════════════════════════════════════════
          SCENE 1 — LEFT ICON CIRCLE
          ══════════════════════════════════════════════════════ */}
          <AnimatePresence>
            {(stage === 'shrink' || stage === 'collapse') && (
              <motion.div
                className='left-circle'
                ref={leftCircleRef}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: stage === 'collapse' ? 0 : 1,
                  opacity: stage === 'collapse' ? 0 : 1,
                }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{
                  delay: stage === 'shrink' ? 1.5 : 0.15,
                  duration: 0.4,
                  ease: 'easeOut',
                }}
                onAnimationComplete={() => {
                  if (stage === 'shrink') setLeftCircleDone(true);
                }}
              >
                <img src={designIcon} alt='Design Icon' />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ══════════════════════════════════════════════════════
          SCENE 1 — RIGHT VERTICAL LINE + WORDS
          ══════════════════════════════════════════════════════ */}
          <AnimatePresence>
            {(stage === 'shrink' || stage === 'collapse') && (
              <>
                <motion.div
                  className='right-vertical-line'
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: stage === 'collapse' ? 0 : '8rem',
                    opacity: stage === 'collapse' ? 0 : 1,
                  }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    delay: stage === 'shrink' ? 1.2 : 0,
                    duration: 0.4,
                    ease: 'easeOut',
                  }}
                />
                <motion.div
                  className='right-words'
                  initial={{ opacity: 0, x: -20 }}
                  animate={{
                    opacity: stage === 'collapse' ? 0 : 1,
                    x: stage === 'collapse' ? 40 : 0,
                  }}
                  exit={{ opacity: 0, x: 40 }}
                  transition={{
                    delay: stage === 'shrink' ? 1.5 : 0.1,
                    duration: 0.4,
                    ease: 'easeOut',
                  }}
                >
                  <div className='right-word'>
                    <span className='first-letter'>M</span>
                    <span className='rest-letters'>ARKETING</span>
                  </div>
                  <div className='right-word'>
                    <span className='first-letter'>D</span>
                    <span className='rest-letters'>ESIGNING</span>
                  </div>
                  <div className='right-word'>
                    <span className='first-letter'>B</span>
                    <span className='rest-letters'>RANDING</span>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* ══════════════════════════════════════════════════════
          SCENE 1 — TOP AND BOTTOM CIRCLES
          ══════════════════════════════════════════════════════ */}
          <AnimatePresence>
            {showVerticalLines &&
              stage !== 'collapse' &&
              stage !== 'scene2-move-right' &&
              stage !== 'scene2-expand-collapse' &&
              stage !== 'scene3-move-shrink' &&
              stage !== 'scene3-elements-shown' &&
              stage !== 'scene3-final-collapse' &&
              stage !== 'final-appear' &&
              stage !== 'expanding-circle-show' &&
              !FRAGMENT_STAGES.includes(stage) &&
              !SCENE4_STAGES.includes(stage) &&
              !SCENE5_STAGES.includes(stage) && (
                <>
                  <motion.div
                    className='top-circle icon-circle'
                    ref={topCircleRef}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0, x: -100, y: -50 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                  >
                    <img src={htmlIcon} alt='HTML5 Icon' />
                  </motion.div>
                  <motion.div
                    className='bottom-circle icon-circle'
                    ref={bottomCircleRef}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0, x: -100, y: 50 }}
                    transition={{
                      duration: 0.25,
                      ease: 'easeOut',
                      delay: 0.05,
                    }}
                  >
                    <img src={cssIcon} alt='CSS3 Icon' />
                  </motion.div>
                </>
              )}
          </AnimatePresence>

          {/* ══════════════════════════════════════════════════════
          SCENE 1 — VERTICAL DOTTED LINES
          ══════════════════════════════════════════════════════ */}
          <AnimatePresence>
            {showVerticalLines &&
              stage !== 'collapse' &&
              stage !== 'scene2-move-right' &&
              stage !== 'scene2-expand-collapse' &&
              stage !== 'scene3-move-shrink' &&
              stage !== 'scene3-elements-shown' &&
              stage !== 'scene3-final-collapse' &&
              stage !== 'final-appear' &&
              stage !== 'expanding-circle-show' &&
              !FRAGMENT_STAGES.includes(stage) &&
              !SCENE4_STAGES.includes(stage) &&
              !SCENE5_STAGES.includes(stage) && (
                <>
                  <motion.div
                    className='vertical-dotted-line'
                    style={{ left: '-65px', bottom: '50%' }}
                    initial={{ height: 0 }}
                    animate={{ height: lineHeights.up }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                  />
                  <motion.div
                    className='vertical-dotted-line'
                    style={{ left: '-65px', top: '50%' }}
                    initial={{ height: 0 }}
                    animate={{ height: lineHeights.down }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      duration: 0.15,
                      ease: 'easeOut',
                      delay: 0.05,
                    }}
                  />
                </>
              )}
          </AnimatePresence>

          {/* ══════════════════════════════════════════════════════
          SCENE 1 — ORB-CLOUD PARTICLES
          ══════════════════════════════════════════════════════ */}
          <AnimatePresence>
            {stage === 'shrink' &&
              orbParticles.map((p) => {
                const ORB_R = 320;
                const restX = Math.cos(p.angle) * p.normR * ORB_R + p.jitterX;
                const restY = Math.sin(p.angle) * p.normR * ORB_R + p.jitterY;
                const pulseX = restX * 1.1;
                const pulseY = restY * 1.1;
                const EXPLODE_DIST = 500;
                const explodeX =
                  (p.side === 'left' ? -EXPLODE_DIST : EXPLODE_DIST) +
                  p.jitterX * 2;
                const explodeY = p.jitterY * 3;

                let animX, animY, animOpacity, animScale, dur, ease;
                if (!orbPhase || orbPhase === 'expand') {
                  animX = orbPhase === 'expand' ? restX : 0;
                  animY = orbPhase === 'expand' ? restY : 0;
                  animOpacity = orbPhase === 'expand' ? 1 : 0;
                  animScale = orbPhase === 'expand' ? 1 : 0;
                  dur = 1.1;
                  ease = [0.2, 0.8, 0.4, 1];
                } else if (orbPhase === 'pulsate') {
                  animX = [restX, pulseX, restX];
                  animY = [restY, pulseY, restY];
                  animOpacity = 1;
                  animScale = [1, 1.1, 1];
                  dur = 0.35;
                  ease = 'easeInOut';
                } else if (orbPhase === 'explode') {
                  animX = explodeX;
                  animY = explodeY;
                  animOpacity = [1, 0];
                  animScale = [1, 0.3];
                  dur = 0.48;
                  ease = [0.85, 0, 1, 0.4];
                } else {
                  animX = explodeX;
                  animY = explodeY;
                  animOpacity = 0;
                  animScale = 0;
                  dur = 0.2;
                  ease = 'easeIn';
                }
                return (
                  <motion.div
                    key={`orb-${p.id}`}
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      width: p.size,
                      height: p.size,
                      marginLeft: -p.size / 2,
                      marginTop: -p.size / 2,
                      borderRadius: '50%',
                      background: p.color,
                      zIndex: 2,
                      pointerEvents: 'none',
                      willChange: 'transform, opacity',
                    }}
                    initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                    animate={{
                      x: animX,
                      y: animY,
                      opacity: animOpacity,
                      scale: animScale,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0,
                      transition: { duration: 0.25 },
                    }}
                    transition={{ duration: dur, ease }}
                  />
                );
              })}
          </AnimatePresence>

          {/* ══════════════════════════════════════════════════════
          SCENE 2 — UPWARD BUBBLES
          ══════════════════════════════════════════════════════ */}
          <AnimatePresence>
            {showUpwardBubbles && stage === 'scene2-move-right' && (
              <motion.div
                style={{ position: 'absolute', left: '50%', top: '50%' }}
                initial={{ x: -500 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              >
                {upwardBubbles.map((bubble) => (
                  <motion.div
                    key={`upward-${bubble.id}`}
                    className='floating-bubble'
                    initial={{ scale: 0, opacity: 0, x: bubble.offsetX, y: 0 }}
                    animate={{
                      scale: [0, 0.5, 0.6, 0],
                      opacity: [0, bubble.opacity, bubble.opacity, 0],
                      x: bubble.offsetX + bubble.finalX,
                      y: [
                        0,
                        bubble.finalY * 0.3,
                        bubble.finalY * 0.7,
                        bubble.finalY,
                      ],
                    }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{
                      x: {
                        duration: bubble.duration,
                        delay: bubble.delay,
                        ease: 'easeOut',
                      },
                      scale: {
                        duration: bubble.duration,
                        delay: bubble.delay,
                        ease: 'easeOut',
                      },
                      opacity: {
                        duration: bubble.duration,
                        delay: bubble.delay,
                        ease: 'easeOut',
                      },
                      y: {
                        duration: bubble.duration,
                        delay: bubble.delay,
                        ease: 'easeOut',
                      },
                    }}
                    style={{ width: bubble.size, height: bubble.size }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ══════════════════════════════════════════════════════
          SCENE 2 — DOWNWARD BUBBLES
          ══════════════════════════════════════════════════════ */}
          <AnimatePresence>
            {showUpwardBubbles && stage === 'scene2-move-right' && (
              <motion.div
                style={{ position: 'absolute', left: '50%', top: '50%' }}
                initial={{ x: -500 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              >
                {downwardBubbles.map((bubble) => (
                  <motion.div
                    key={`downward-${bubble.id}`}
                    className='floating-bubble'
                    initial={{ scale: 0, opacity: 0, x: bubble.offsetX, y: 0 }}
                    animate={{
                      scale: [0, 0.4, 0.6, 0],
                      opacity: [0, bubble.opacity, bubble.opacity, 0],
                      x: bubble.offsetX + bubble.finalX,
                      y: [
                        0,
                        bubble.finalY * 0.3,
                        bubble.finalY * 0.7,
                        bubble.finalY,
                      ],
                    }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{
                      x: {
                        duration: bubble.duration,
                        delay: bubble.delay,
                        ease: 'easeOut',
                      },
                      scale: {
                        duration: bubble.duration,
                        delay: bubble.delay,
                        ease: 'easeOut',
                      },
                      opacity: {
                        duration: bubble.duration,
                        delay: bubble.delay,
                        ease: 'easeOut',
                      },
                      y: {
                        duration: bubble.duration,
                        delay: bubble.delay,
                        ease: 'easeOut',
                      },
                    }}
                    style={{ width: bubble.size, height: bubble.size }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ══════════════════════════════════════════════════════
          SCENE 1 — TRIANGLES
          ══════════════════════════════════════════════════════ */}
          <AnimatePresence>
            {stage === 'bubbles' &&
              [
                { rotate: 0, key: 'triangle-1' },
                { rotate: 120, key: 'triangle-2' },
                { rotate: 240, key: 'triangle-3' },
              ].map(({ rotate, key }) => (
                <motion.div
                  key={key}
                  className='triangle-wrapper'
                  initial={{ scale: 0, opacity: 0, rotate }}
                  animate={{
                    scale: 0.8,
                    opacity: 0.8,
                    rotate,
                    filter: 'blur(1px)',
                  }}
                  exit={{ scale: 0, opacity: 0, filter: 'blur(10px)' }}
                  transition={{ duration: 0.33, ease: 'easeOut' }}
                >
                  <svg
                    width='200'
                    height='300'
                    viewBox='0 0 200 300'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M100 0 Q-100 280 100 300 Q300 280 100 0 Z'
                      fill='#212d51'
                    />
                    <path
                      d='M100 5 Q-95 275 100 295 Q295 275 100 5 Z'
                      fill='#f8f9fa'
                    />
                  </svg>
                </motion.div>
              ))}
          </AnimatePresence>

          {/* ══════════════════════════════════════════════════════
          SCENE 2 — WEBSITES IMAGE + TEXT ELEMENTS
          ══════════════════════════════════════════════════════ */}
          <AnimatePresence>
            {showScene3Elements &&
              (stage === 'scene3-move-shrink' ||
                stage === 'scene3-elements-shown') && (
                <>
                  <motion.div
                    className='we-do-text'
                    style={{
                      position: 'absolute',
                      left: 'calc(50% + 50px)',
                      top: '50%',
                      marginTop: '-20px',
                      transform: 'translateY(-50%)',
                    }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{
                      opacity: stage === 'scene3-final-collapse' ? 0 : 1,
                      x: stage === 'scene3-final-collapse' ? 100 : 0,
                      filter:
                        stage === 'scene3-final-collapse'
                          ? 'blur(10px)'
                          : 'blur(0px)',
                    }}
                    exit={{ opacity: 0, x: 100, filter: 'blur(10px)' }}
                    transition={{
                      delay: stage === 'scene3-final-collapse' ? 0.3 : 0,
                      duration: stage === 'scene3-final-collapse' ? 0.5 : 0.4,
                      ease: 'easeInOut',
                    }}
                  >
                    <div className='we-build-secondary-line'>BUSINESS</div>
                  </motion.div>

                  <motion.div
                    style={{
                      position: 'absolute',
                      left: 'calc(50% + 28px)',
                      top: 'calc(50% - 5px)',
                      transform: 'translateY(-50%)',
                      width: '5px',
                      height: '1.5rem',
                      background: '#212d51',
                      zIndex: 8,
                    }}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: stage === 'scene3-final-collapse' ? 0 : '3rem',
                      opacity: stage === 'scene3-final-collapse' ? 0 : 1,
                    }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
                  />

                  <motion.div
                    className='we-do-text'
                    style={{
                      position: 'absolute',
                      left: 'calc(50% - 235px)',
                      top: '50%',
                      marginTop: '-20px',
                      transform: 'translateY(-50%)',
                    }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{
                      opacity: stage === 'scene3-final-collapse' ? 0 : 1,
                      x: stage === 'scene3-final-collapse' ? -100 : 0,
                      filter:
                        stage === 'scene3-final-collapse'
                          ? 'blur(10px)'
                          : 'blur(0px)',
                    }}
                    exit={{ opacity: 0, x: -100, filter: 'blur(10px)' }}
                    transition={{
                      delay: stage === 'scene3-final-collapse' ? 0.1 : 0.4,
                      duration: stage === 'scene3-final-collapse' ? 0.5 : 0.4,
                      ease: 'easeInOut',
                    }}
                  >
                    <div className='we-build-line'>WEBSITES</div>
                  </motion.div>

                  <motion.img
                    src={websites}
                    alt='Websites'
                    style={{
                      position: 'absolute',
                      left: 'calc(50% - 385px)',
                      top: '50%',
                      marginTop: '-50px',
                      transform: 'translateY(-50%)',
                      width: '140px',
                      height: '94px',
                      zIndex: 12,
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: stage === 'scene3-final-collapse' ? 0 : 1,
                      scale: stage === 'scene3-final-collapse' ? 0 : 1,
                      rotate: stage === 'scene3-final-collapse' ? -45 : 0,
                      filter:
                        stage === 'scene3-final-collapse'
                          ? 'blur(8px)'
                          : 'blur(0px)',
                    }}
                    exit={{ opacity: 0, scale: 0, filter: 'blur(8px)' }}
                    transition={{
                      delay: stage === 'scene3-final-collapse' ? 0 : 0.6,
                      duration: stage === 'scene3-final-collapse' ? 0.6 : 0.3,
                      ease: 'easeInOut',
                    }}
                  />
                </>
              )}
          </AnimatePresence>

          {/* ══════════════════════════════════════════════════════
          SCENE 1 — FLOATING BUBBLES
          ══════════════════════════════════════════════════════ */}
          <AnimatePresence>
            {(stage === 'bubbles' || stage === 'we-build-center') &&
              bubbles.map((bubble) => {
                const angle = (Math.PI * 2 * bubble.id) / bubbles.length;
                const finalX = Math.cos(angle) * bubble.distance;
                const finalY = Math.sin(angle) * bubble.distance;
                return (
                  <motion.div
                    key={bubble.id}
                    className='floating-bubble'
                    initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                    animate={{
                      scale: [0, 1, 1.1, 0],
                      opacity: [0, bubble.opacity, bubble.opacity, 0],
                      x: [0, finalX * 0.5, finalX * 0.8, finalX],
                      y: [0, finalY * 0.5, finalY * 0.8, finalY],
                    }}
                    exit={{
                      scale: 0,
                      opacity: 0,
                      transition: { duration: 0.3 },
                    }}
                    transition={{
                      duration: bubble.duration,
                      delay: bubble.delay,
                      repeat: Infinity,
                      ease: 'easeOut',
                    }}
                    style={{ width: bubble.size, height: bubble.size }}
                  />
                );
              })}
          </AnimatePresence>

          {/* ══════════════════════════════════════════════════════════════════
          SCENE 4 — "TO MAKE YOU"
          ══════════════════════════════════════════════════════════════════ */}

          {/* Scene 4 bubbles */}
          <AnimatePresence>
            {showScene4Bubbles &&
              scene4Bubbles.map((b) => {
                const fx = Math.cos(b.angle) * b.distance;
                const fy = Math.sin(b.angle) * b.distance;
                return (
                  <motion.div
                    key={`s4b-${b.id}`}
                    className='floating-bubble'
                    style={{
                      width: b.size,
                      height: b.size,
                      background: 'rgba(33,45,81,0.7)',
                      border: '2px solid rgba(247,213,15,0.35)',
                    }}
                    initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                    animate={{
                      scale: [0, 1, 1.1, 0],
                      opacity: [0, b.opacity, b.opacity, 0],
                      x: [0, fx * 0.5, fx * 0.8, fx],
                      y: [0, fy * 0.5, fy * 0.8, fy],
                    }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{
                      duration: b.duration,
                      delay: b.delay,
                      repeat: Infinity,
                    }}
                  />
                );
              })}
          </AnimatePresence>

          {/* Scene 4 orb particles */}
          <AnimatePresence>
            {SCENE4_STAGES.includes(stage) &&
              stage !== 'scene4-appear' &&
              stage !== 'scene4-done' &&
              stage !== 'scene4-collapse' &&
              orbParticles.map((p) => {
                const ORB_R = 320;
                const restX = Math.cos(p.angle) * p.normR * ORB_R + p.jitterX;
                const restY = Math.sin(p.angle) * p.normR * ORB_R + p.jitterY;
                const pulseX = restX * 1.1;
                const pulseY = restY * 1.1;
                const EXPLODE_R = 520 + p.normR * 180;
                const explodeX = Math.cos(p.angle) * EXPLODE_R;
                const explodeY = Math.sin(p.angle) * EXPLODE_R;

                let animX, animY, animOpacity, animScale, dur, ease;
                if (!scene4OrbPhase || scene4OrbPhase === 'expand') {
                  animX = scene4OrbPhase === 'expand' ? restX : 0;
                  animY = scene4OrbPhase === 'expand' ? restY : 0;
                  animOpacity = scene4OrbPhase === 'expand' ? 1 : 0;
                  animScale = scene4OrbPhase === 'expand' ? 1 : 0;
                  dur = 1.1;
                  ease = [0.2, 0.8, 0.4, 1];
                } else if (scene4OrbPhase === 'pulsate') {
                  animX = [restX, pulseX, restX];
                  animY = [restY, pulseY, restY];
                  animOpacity = 1;
                  animScale = [1, 1.1, 1];
                  dur = 0.35;
                  ease = 'easeInOut';
                } else if (scene4OrbPhase === 'explode') {
                  animX = [restX, explodeX];
                  animY = [restY, explodeY];
                  animOpacity = [1, 0];
                  animScale = [1, 0.15];
                  dur = 0.55;
                  ease = [0.15, 0.8, 0.3, 1];
                } else {
                  animX = explodeX;
                  animY = explodeY;
                  animOpacity = 0;
                  animScale = 0;
                  dur = 0.2;
                  ease = 'easeIn';
                }
                return (
                  <motion.div
                    key={`s4orb-${p.id}`}
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      width: p.size,
                      height: p.size,
                      marginLeft: -p.size / 2,
                      marginTop: -p.size / 2,
                      borderRadius: '50%',
                      background: p.color,
                      zIndex: 2,
                      pointerEvents: 'none',
                    }}
                    initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                    animate={{
                      x: animX,
                      y: animY,
                      opacity: animOpacity,
                      scale: animScale,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0,
                      transition: { duration: 0.25 },
                    }}
                    transition={{ duration: dur, ease }}
                  />
                );
              })}
          </AnimatePresence>

          {/* Scene 4 big ring */}
          <AnimatePresence>
            {showScene4BigCircle && (
              <motion.div
                key='scene4-big-circle'
                className='expanding-circle'
                style={{ border: '3px solid rgba(33,45,81,0.9)', zIndex: 16 }}
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: [0, 12, 0], opacity: [1, 0.8, 0] }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.4,
                  times: [0, 0.6, 1],
                  ease: [0.2, 0.8, 0.2, 1],
                }}
              />
            )}
          </AnimatePresence>

          {/* Scene 4 main circle */}
          <AnimatePresence>
            {SCENE4_STAGES.includes(stage) && (
              <motion.div
                key='scene4-circle'
                className='main-circle'
                style={{ zIndex: 20 }}
                initial={{
                  scale: 0,
                  opacity: 0,
                  filter: 'blur(14px)',
                  x: 0,
                  y: 0,
                }}
                animate={{
                  scale: (() => {
                    if (stage === 'scene4-collapse') return 0.4;
                    if (
                      stage === 'scene4-shrink' ||
                      stage === 'scene4-settle' ||
                      stage === 'scene4-done'
                    )
                      return 0.67;
                    if (
                      stage === 'scene4-appear' ||
                      stage === 'scene4-bubbles' ||
                      stage === 'scene4-orb'
                    )
                      return 1;
                    return 0.5;
                  })(),
                  opacity: stage === 'scene4-collapse' ? 0 : 1,
                  filter:
                    stage === 'scene4-collapse' ? 'blur(20px)' : 'blur(0px)',
                  y: (() => {
                    if (stage === 'scene4-collapse') return -500;
                    if (stage === 'scene4-settle' || stage === 'scene4-done')
                      return -70;
                    return 0;
                  })(),
                }}
                exit={{
                  scale: 0,
                  opacity: 0,
                  filter: 'blur(20px)',
                  transition: { duration: 0.5, ease: 'easeIn' },
                }}
                transition={{
                  scale: {
                    duration: stage === 'scene4-collapse' ? 0.35 : 0.45,
                    ease:
                      stage === 'scene4-collapse' ? [0.4, 0, 1, 1] : 'easeOut',
                  },
                  filter: { duration: 0.1 },
                  y: {
                    duration: stage === 'scene4-collapse' ? 0.38 : 0.45,
                    ease:
                      stage === 'scene4-collapse' ? [0.4, 0, 1, 1] : 'easeOut',
                  },
                  opacity: { duration: 0.1 },
                }}
              >
                <motion.div
                  className='we-do-text'
                  initial={{ opacity: 0, scale: 0.5, filter: 'blur(10px)' }}
                  animate={{
                    opacity: stage === 'scene4-collapse' ? 0 : 1,
                    scale: stage === 'scene4-collapse' ? 0.3 : 1,
                    filter:
                      stage === 'scene4-collapse' ? 'blur(15px)' : 'blur(0px)',
                  }}
                  transition={{
                    duration: stage === 'scene4-collapse' ? 0.25 : 0.35,
                    delay: stage === 'scene4-collapse' ? 0 : 0.12,
                    ease: 'easeOut',
                  }}
                >
                  <div className='we-do-line'>TO</div>
                  <div className='we-do-line'>MAKE</div>
                  <div className='we-do-line'>YOU</div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Scene 4 text panel */}
          <AnimatePresence>
            {showScene4Text &&
              (stage === 'scene4-settle' || stage === 'scene4-collapse') && (
                <motion.div
                  key='scene4-text-panel'
                  style={{
                    position: 'absolute',
                    left: 'calc(50% - 205px)',
                    top: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 22,
                    marginTop: '12px',
                  }}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{
                    opacity: stage === 'scene4-collapse' ? 0 : 1,
                    y: stage === 'scene4-collapse' ? -480 : 0,
                    filter:
                      stage === 'scene4-collapse' ? 'blur(16px)' : 'blur(0px)',
                  }}
                  exit={{ opacity: 0, y: -480, filter: 'blur(16px)' }}
                  transition={{
                    duration: stage === 'scene4-collapse' ? 0.38 : 0.45,
                    ease:
                      stage === 'scene4-collapse' ? [0.4, 0, 1, 1] : 'easeOut',
                    delay: stage === 'scene4-collapse' ? 0 : 0.2,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <div
                      style={{
                        background: '#212d51',
                        height: '5px',
                        borderRadius: '2px',
                        width: '100%',
                      }}
                    />
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '0.45em',
                        paddingTop: '0.3rem',
                        paddingBottom: '0.3rem',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'Manrope', sans-serif;",
                          fontSize: '3.2rem',
                          fontWeight: 700,
                          fontStyle: 'italic',
                          color: 'rgba(33,45,81,1)',
                          letterSpacing: '0.1em',
                          lineHeight: 1,
                        }}
                      >
                        STAND
                      </span>
                      <span
                        style={{
                          fontFamily: "'Manrope', sans-serif;",
                          fontSize: '3.2rem',
                          fontWeight: 700,
                          fontStyle: 'italic',
                          color: '#c9c9c9',
                          letterSpacing: '0.1em',
                          lineHeight: 1,
                        }}
                      >
                        ABOVE
                      </span>
                    </div>
                    <div
                      style={{
                        background: '#212d51',
                        height: '5px',
                        borderRadius: '2px',
                        width: '100%',
                      }}
                    />
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '0.45em',
                        paddingTop: '0.3rem',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'Manrope', sans-serif;",
                          fontSize: '5.7rem',
                          fontWeight: 700,
                          fontStyle: 'italic',
                          color: 'rgba(33,45,81,1)',
                          letterSpacing: '0.1em',
                          lineHeight: 0.75,
                          display: 'block',
                          textAlign: 'center',
                        }}
                      >
                        OTHERS
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
          </AnimatePresence>

          {/* ══════════════════════════════════════════════════════════════════
          SCENE 5 — "LET'S WORK TOGETHER"
          ══════════════════════════════════════════════════════════════════ */}

          {/* Scene 5 flash ring */}
          <AnimatePresence>
            {showScene5Flash && (
              <motion.div
                key='scene5-flash'
                className='expanding-circle'
                style={{
                  border: '2px solid #212d51',
                  zIndex: 15,
                  top: 'calc(50% - 100px)',
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 10, 0], opacity: [0, 1, 0] }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.58,
                  times: [0, 0.5, 1],
                  ease: 'easeOut',
                }}
              />
            )}
          </AnimatePresence>

          {/* Scene 5 top line */}
          <AnimatePresence>
            {showScene5Lines &&
              (stage === 'scene5-lines' ||
                stage === 'scene5-together' ||
                stage === 'scene5-done') && (
                <motion.div
                  key='scene5-top-line'
                  style={{
                    position: 'absolute',
                    left: 'calc(50% - 180px)',
                    top: 'calc(50% + 8px)',
                    height: '4px',
                    background: '#212d51',
                    borderRadius: '0 2px 2px 0',
                    zIndex: 18,
                    transformOrigin: 'left center',
                    width: 'calc(50% + 115px)',
                  }}
                  initial={{ x: '-100%', opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{
                    x: '-100%',
                    opacity: 0,
                    transition: { duration: 0.2 },
                  }}
                  transition={{
                    duration: 0.5,
                    ease: [0.2, 0.9, 0.3, 1],
                    delay: 0.1,
                  }}
                />
              )}
          </AnimatePresence>

          {/* Scene 5 bottom line */}
          <AnimatePresence>
            {showScene5Lines &&
              (stage === 'scene5-lines' ||
                stage === 'scene5-together' ||
                stage === 'scene5-done') && (
                <motion.div
                  key='scene5-bottom-line'
                  style={{
                    position: 'absolute',
                    right: 'calc(50% - 180px)',
                    top: 'calc(50% + 83px)',
                    height: '4px',
                    background: '#212d51',
                    borderRadius: '2px 0 0 2px',
                    zIndex: 18,
                    transformOrigin: 'right center',
                    width: 'calc(50% + 115px)',
                  }}
                  initial={{ x: '100%', opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{
                    x: '100%',
                    opacity: 0,
                    transition: { duration: 0.2 },
                  }}
                  transition={{
                    duration: 0.5,
                    ease: [0.2, 0.9, 0.3, 1],
                    delay: 0.15,
                  }}
                />
              )}
          </AnimatePresence>

          {/* Scene 5 "TOGETHER" text */}
          <AnimatePresence>
            {showScene5Together &&
              (stage === 'scene5-together' || stage === 'scene5-done') && (
                <motion.div
                  key='scene5-together'
                  style={{
                    position: 'absolute',
                    left: 'calc(50% - 190px)',
                    top: 'calc(50% - 80px)',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 22,
                    marginTop: '98px',
                    whiteSpace: 'nowrap',
                  }}
                  initial={{ opacity: 0, scaleX: 0.4, filter: 'blur(12px)' }}
                  animate={{ opacity: 1, scaleX: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scaleX: 0.4, filter: 'blur(12px)' }}
                  transition={{ duration: 0.4, ease: [0.2, 0.8, 0.3, 1] }}
                >
                  <span
                    style={{
                      fontFamily: "'Manrope', sans-serif;",
                      fontSize: '3.8rem',
                      fontWeight: 700,
                      fontStyle: 'italic',
                      color: '#212d51',
                      letterSpacing: '0.1em',
                      lineHeight: 1,
                    }}
                  >
                    TOGETHER
                  </span>
                </motion.div>
              )}
          </AnimatePresence>

          {/* Scene 5 main circle */}
          <AnimatePresence>
            {inScene5Stage && (
              <motion.div
                key='scene5-circle'
                className='main-circle'
                style={{
                  zIndex: 20,
                  top: 'calc(50% - 320px)',
                  transform: 'translate(-50%, -50%)',
                }}
                initial={{
                  scale: 0.7,
                  opacity: 0,
                  filter: 'blur(18px)',
                  y: 600,
                }}
                animate={{
                  scale:
                    stage === 'scene5-shrink' ||
                    stage === 'scene5-lines' ||
                    stage === 'scene5-together' ||
                    stage === 'scene5-done'
                      ? 0.5
                      : stage === 'scene5-appear' || stage === 'scene5-flash'
                        ? 1
                        : [0.7, 1.2, 1],
                  opacity: 1,
                  filter: 'blur(0px)',
                  y: 0,
                }}
                exit={{
                  scale: 0,
                  opacity: 0,
                  filter: 'blur(20px)',
                  transition: { duration: 0.5, ease: 'easeIn' },
                }}
                transition={{
                  scale: {
                    duration: stage === 'scene5-shrink' ? 0.55 : 0.55,
                  },
                  opacity: { duration: 0.4 },
                  filter: { duration: 0.45 },
                  y: { duration: 0.55, ease: [0.2, 0.8, 0.3, 1] },
                }}
              >
                <motion.div
                  className='we-do-text'
                  initial={{ opacity: 0, scale: 0.6, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  transition={{ duration: 0.3, delay: 0.25, ease: 'easeOut' }}
                >
                  <div className='we-do-line'>LET'S</div>
                  <div className='we-do-line'>WORK</div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ══════════════════════════════════════════════════════════════════
          MAIN CIRCLE — Scenes 1, 2 and 3
          ══════════════════════════════════════════════════════════════════ */}
          <AnimatePresence mode='wait'>
            {stage !== 'final-collapse' &&
              !SCENE4_STAGES.includes(stage) &&
              !SCENE5_STAGES.includes(stage) &&
              (stage !== 'collapse' ||
                stage === 'scene2-move-right' ||
                stage === 'scene2-expand-collapse' ||
                stage === 'scene3-move-shrink' ||
                stage === 'scene3-elements-shown' ||
                stage === 'scene3-final-collapse' ||
                stage === 'final-appear' ||
                stage === 'expanding-circle-show' ||
                inFragmentStage) && (
                <motion.div
                  className='main-circle'
                  key={
                    inFragmentStage
                      ? 'final'
                      : stage === 'scene2-move-right' ||
                          stage === 'scene2-expand-collapse' ||
                          stage === 'scene3-move-shrink' ||
                          stage === 'scene3-elements-shown' ||
                          stage === 'scene3-final-collapse'
                        ? 'scene2'
                        : stage === 'final-appear' ||
                            stage === 'expanding-circle-show'
                          ? 'final'
                          : 'scene1'
                  }
                  initial={{
                    scale:
                      stage === 'final-appear' ||
                      stage === 'expanding-circle-show' ||
                      inFragmentStage
                        ? 0
                        : stage === 'scene2-move-right' ||
                            stage === 'scene2-expand-collapse' ||
                            stage === 'scene3-move-shrink' ||
                            stage === 'scene3-elements-shown' ||
                            stage === 'scene3-final-collapse'
                          ? 1
                          : 0,
                    filter:
                      stage === 'final-appear' ||
                      stage === 'expanding-circle-show' ||
                      inFragmentStage
                        ? 'blur(20px)'
                        : stage === 'scene2-move-right' ||
                            stage === 'scene2-expand-collapse' ||
                            stage === 'scene3-move-shrink' ||
                            stage === 'scene3-elements-shown' ||
                            stage === 'scene3-final-collapse'
                          ? 'blur(0px)'
                          : 'blur(4px)',
                    x:
                      stage === 'final-appear' ||
                      stage === 'expanding-circle-show' ||
                      inFragmentStage
                        ? 0
                        : stage === 'scene2-move-right' ||
                            stage === 'scene2-expand-collapse' ||
                            stage === 'scene3-move-shrink' ||
                            stage === 'scene3-elements-shown' ||
                            stage === 'scene3-final-collapse'
                          ? -500
                          : 0,
                  }}
                  animate={{
                    scale:
                      stage === 'final-appear'
                        ? [0, 1.2, 1]
                        : inFragmentStage
                          ? 0.5
                          : stage === 'expanding-circle-show'
                            ? 1
                            : stage === 'shrink'
                              ? 0.5
                              : stage === 'scene3-move-shrink' ||
                                  stage === 'scene3-elements-shown'
                                ? 0.5
                                : stage === 'scene3-final-collapse'
                                  ? 0
                                  : 1,
                    opacity: 1,
                    x:
                      stage === 'final-appear' ||
                      stage === 'expanding-circle-show' ||
                      inFragmentStage
                        ? 0
                        : stage === 'scene3-final-collapse'
                          ? 0
                          : stage === 'scene3-move-shrink' ||
                              stage === 'scene3-elements-shown'
                            ? 350
                            : 0,
                    filter:
                      stage === 'final-appear'
                        ? ['blur(20px)', 'blur(4px)', 'blur(0px)']
                        : stage === 'expanding-circle-show' || inFragmentStage
                          ? 'blur(0px)'
                          : stage === 'circle-growing' ||
                              stage === 'transforming'
                            ? 'blur(4px)'
                            : stage === 'scene3-final-collapse'
                              ? 'blur(20px)'
                              : 'blur(0px)',
                    borderRadius:
                      stage === 'transforming'
                        ? '30% 70% 70% 30% / 30% 30% 70% 70%'
                        : '50%',
                  }}
                  exit={{
                    scale: 0,
                    opacity: 0,
                    filter: 'blur(20px)',
                    transition: { duration: 0.7, ease: 'easeIn' },
                  }}
                  transition={{ scale: { duration: 0.5, ease: 'easeOut' } }}
                >
                  {/* THIS / IS / WHAT words */}
                  {(stage === 'showing-words' || stage === 'hiding-what') &&
                    currentWord > 0 && (
                      <motion.div
                        key={currentWord}
                        className='word'
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{
                          opacity: stage === 'hiding-what' ? 0 : 1,
                          scale: stage === 'hiding-what' ? 0.5 : 1,
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        {words[currentWord - 1]}{' '}
                      </motion.div>
                    )}

                  {/* "WE DO" */}
                  {(stage === 'we-do' ||
                    stage === 'bubbles' ||
                    stage === 'shrink') && (
                    <motion.div
                      className='we-do-text'
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className='we-do-line'>WE</div>
                      <div className='we-do-line'>DO</div>
                    </motion.div>
                  )}

                  {/* "WE BUILD" */}
                  {(stage === 'scene2-move-right' ||
                    stage === 'scene2-expand-collapse' ||
                    stage === 'scene3-move-shrink' ||
                    stage === 'scene3-elements-shown' ||
                    stage === 'scene3-final-collapse') && (
                    <motion.div
                      className='we-do-text'
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className='we-do-line'>WE</div>
                      <div className='we-do-line'>BUILD</div>
                    </motion.div>
                  )}

                  {/* "WE BOOST YOUR" */}
                  {(stage === 'final-appear' ||
                    stage === 'expanding-circle-show' ||
                    inFragmentStage) &&
                    showFinalText && (
                      <motion.div
                        className='we-do-text'
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.15, delay: 0.15 }}
                      >
                        <div className='we-do-line'>WE</div>
                        <div className='we-do-line'>BOOST</div>
                        <div className='we-do-line-small'>YOUR</div>
                      </motion.div>
                    )}
                </motion.div>
              )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default HeroAnimation;
