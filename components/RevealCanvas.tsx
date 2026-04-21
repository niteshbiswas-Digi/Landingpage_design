'use client';
import { useRef, useEffect, useState, useCallback } from 'react';
import {
  useScroll, useTransform, useSpring, useMotionValueEvent, AnimatePresence, motion
} from 'framer-motion';

const FRAME_COUNT = 120;

const BEATS = [
  {
    id: 'A',
    eyebrow: 'Custom Solutions',
    title: 'Transforming\nIdeas into Apps.',
    sub: 'We turn your innovative ideas into cutting-edge mobile and web applications that propel your business to new digital heights.',
    cta: null,
    range: [0, 0.35] as [number, number],
  },
  {
    id: 'B',
    eyebrow: 'Expert Development',
    title: 'Strategic App\nDevelopment.',
    sub: 'From custom mobile apps to robust web solutions, we deliver scalable applications designed to meet your unique business needs.',
    cta: null,
    range: [0.25, 0.6] as [number, number],
  },
  {
    id: 'C',
    eyebrow: 'Innovative Technology',
    title: 'AI-Powered\nSolutions.',
    sub: 'Leverage our expertise in AI development, chatbots, and intelligent design to build next-generation applications.',
    cta: null,
    range: [0.5, 0.85] as [number, number],
  },
  {
    id: 'D',
    eyebrow: 'Your Trusted Partner',
    title: 'Let\'s Build\nYour Vision.',
    sub: 'Our team of expert developers and designers collaborate to deliver customized solutions tailored to your business goals. Start your transformation today.',
    cta: 'Start Your Project',
    range: [0.75, 1.0] as [number, number],
  },
];

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function beatOpacity(p: number, range: [number, number], isFirst: boolean, isLast: boolean): number {
  const [start, end] = range;
  const fadeCurve = 0.25; 
  const fadeLen = (end - start) * fadeCurve;

  if (isFirst && p <= start) return 1;
  if (isLast && p >= end) return 1;
  
  if (p < start) return 0;
  if (p < start + fadeLen) return clamp((p - start) / fadeLen, 0, 1);
  if (p < end - fadeLen) return 1;
  if (p < end) return clamp((end - p) / fadeLen, 0, 1);
  return 0;
}

function beatY(p: number, range: [number, number], isFirst: boolean, isLast: boolean): number {
  const [start, end] = range;
  const fadeLen = (end - start) * 0.25;

  if (isFirst && p <= start) return 0;
  if (isLast && p >= end) return 0;

  if (p < start) return 30;
  if (p < start + fadeLen) return clamp(30 * (1 - (p - start) / fadeLen), 0, 30);
  if (p < end - fadeLen) return 0;
  if (p < end) return clamp(-20 * ((p - (end - fadeLen)) / fadeLen), -20, 0);
  return -20;
}

export default function RevealCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const imagesRef    = useRef<HTMLImageElement[]>([]);

  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoaded,    setIsLoaded]    = useState(false);
  const [progress,    setProgress]    = useState(0);

  /* ── Preload ── */
  useEffect(() => {
    let n = 0;
    const imgs: HTMLImageElement[] = [];
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = `/sequence/frame_${i}.webp`;
      img.onload = () => { 
        n++; 
        setLoadedCount(n); 
        if (n === FRAME_COUNT) setIsLoaded(true); 
      };
      imgs.push(img);
    }
    imagesRef.current = imgs;
  }, []);

  /* ── Scroll Logic ── */
  const { scrollYProgress } = useScroll({ 
    target: containerRef, 
    offset: ['start start', 'end end'] 
  });
  
  const smooth = useSpring(scrollYProgress, { 
    stiffness: 100, 
    damping: 30,    
    restDelta: 0.001 
  });
  
  const sequenceProgress = useTransform(smooth, [0, 0.85], [0, 1]);
  const frameIdx = useTransform(sequenceProgress, [0, 1], [0, FRAME_COUNT - 1], { clamp: true });

  /* ── Draw ── */
  const draw = useCallback((idx: number) => {
    const canvas = canvasRef.current;
    const img    = imagesRef.current[idx];
    if (!canvas || !img?.complete) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const dpr  = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    
    if (canvas.width !== Math.round(rect.width * dpr) || canvas.height !== Math.round(rect.height * dpr)) {
      canvas.width  = Math.round(rect.width  * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.scale(dpr, dpr);
    }
    
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, rect.width, rect.height);
    
    const r  = Math.min(rect.width / img.naturalWidth, rect.height / img.naturalHeight);
    const cx = (rect.width  - img.naturalWidth  * r) / 2;
    const cy = (rect.height - img.naturalHeight * r) / 2;
    
    ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, cx, cy, img.naturalWidth * r, img.naturalHeight * r);
  }, []);

  useMotionValueEvent(frameIdx, 'change', (v) => draw(Math.round(clamp(v, 0, FRAME_COUNT - 1))));
  useMotionValueEvent(sequenceProgress, 'change', (v) => setProgress(v));

  useEffect(() => {
    if (!isLoaded) return;
    // Scroll to top when loading completes
    window.scrollTo({ top: 0, behavior: 'smooth' });
    draw(0);
    const onResize = () => {
      if (canvasRef.current) { 
        canvasRef.current.width = 0; 
        canvasRef.current.height = 0; 
      }
      draw(Math.round(frameIdx.get()));
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [isLoaded, draw, frameIdx]);

  const pct = Math.round((loadedCount / FRAME_COUNT) * 100);
  const activeBeat = BEATS.findIndex(b => progress >= b.range[0] && progress < b.range[1]);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        position: 'relative', 
        height: '600vh', 
        width: '100%',
        background: '#000',
        zIndex: 1
      }}
    >
      <div style={{
        position: 'sticky', 
        top: 0, 
        left: 0,
        height: '100vh',
        width: '100%',
        display: 'flex', 
        alignItems: 'stretch',
        background: '#000', 
        overflow: 'hidden',
        zIndex: 50,
      }}>

        {/* ── LEFT: Storytelling ── */}
        <div style={{
          flex: 1, position: 'relative',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '0 80px', overflow: 'hidden', background: 'rgba(5,5,5,0.7)',
        }}>

          <div style={{
            position: 'absolute', top: 48, left: 48,
            display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start',
          }}>
            {BEATS.map((b, i) => (
              <div key={b.id} style={{
                width: 2, borderRadius: 2,
                background: i === activeBeat ? '#f5a623' : '#1a1a1c',
                height: i === activeBeat ? 40 : 10,
                transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              }} />
            ))}
          </div>

          {BEATS.map((beat, i) => {
            const isFirst = i === 0;
            const isLast  = i === BEATS.length - 1;
            const op = beatOpacity(progress, beat.range, isFirst, isLast);
            const y  = beatY(progress, beat.range, isFirst, isLast);
            if (op < 0.005) return null;
            return (
              <div key={beat.id} style={{
                position: 'absolute', padding: '0 80px', opacity: op,
                transform: `translateY(${y}px)`, textAlign: 'left', width: '100%',
                zIndex: isFirst ? 5 : 4,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#f5a623' }}>
                    {beat.eyebrow}
                  </span>
                  <div style={{ flex: 1, height: 1, background: 'rgba(245,166,35,0.2)' }} />
                </div>

                <h2 style={{
                  fontSize: 'clamp(48px, 6vw, 96px)',
                  fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 0.9,
                  color: '#fff', whiteSpace: 'pre-line', marginBottom: 32,
                  textShadow: '0 0 100px rgba(255,255,255,0.1)',
                }}>
                  {beat.title}
                </h2>

                <p style={{
                  fontSize: 'clamp(18px, 1.8vw, 24px)',
                  color: '#a1a1a6', lineHeight: 1.6, letterSpacing: '-0.02em',
                  maxWidth: 520, marginBottom: beat.cta ? 48 : 0,
                }}>
                  {beat.sub}
                </p>

                {beat.cta && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.92 }}
                    style={{
                      padding: '22px 52px', borderRadius: 14,
                      background: '#fff', color: '#000',
                      fontWeight: 800, fontSize: 17,
                      letterSpacing: '-0.02em', border: 'none',
                      cursor: 'pointer', display: 'inline-flex',
                      alignItems: 'center', gap: 12,
                      boxShadow: '0 20px 50px rgba(255,255,255,0.2)',
                    }}
                  >
                    {beat.cta}
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </motion.button>
                )}
              </div>
            );
          })}

          <div style={{
            position: 'absolute', bottom: 60, right: 80,
            fontSize: 11, color: '#333', fontWeight: 900,
            letterSpacing: '0.4em', textTransform: 'uppercase',
          }}>
            REVELATION / {activeBeat >= 0 ? `0${activeBeat + 1}` : 'FINALE'}
          </div>
        </div>



        {/* ── RIGHT: Visuals ── */}
        <div style={{ position: 'relative', width: '50%', flexShrink: 0, overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
            background: `radial-gradient(circle at 50% 60%, rgba(245,166,35,${(0.06 + progress * 0.2).toFixed(3)}) 0%, transparent 65%)`,
          }} />

          <canvas ref={canvasRef} style={{
            position: 'absolute', inset: 0, zIndex: 2,
            width: '100%', height: '100%', display: 'block',
          }} />

          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 180, zIndex: 3,
            background: 'linear-gradient(to bottom, #000, transparent)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 180, zIndex: 3,
            background: 'linear-gradient(to top, #000, transparent)',
            pointerEvents: 'none',
          }} />
        </div>
      </div>

      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 9999, background: '#000',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 32,
            }}
          >
            <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
               style={{
                 width: 64, height: 64, borderRadius: 18, border: '1px solid rgba(245,166,35,0.5)',
                 display: 'flex', alignItems: 'center', justifyContent: 'center',
                 boxShadow: '0 0 60px rgba(245,166,35,0.2)',
               }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <polyline points="16 18 22 12 16 6" stroke="#f5a623" strokeWidth="2.5" />
                <polyline points="8 6 2 12 8 18" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" />
              </svg>
            </motion.div>
            <div style={{ textAlign: 'center' }}>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                style={{ fontSize: 11, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#f5a623', fontWeight: 900, margin: 0 }}
              >
                UPCODO Digital
              </motion.p>
              <div style={{ width: 260, height: 2, background: '#111', borderRadius: 99, overflow: 'hidden', marginTop: 12 }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} style={{ height: '100%', background: '#f5a623' }} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
