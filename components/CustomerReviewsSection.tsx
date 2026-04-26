'use client';
import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

const AUTO_INTERVAL = 12000; // 12 s per slide

const VIDEOS = [
  {
    id: 'qjC0KysrgSg',
    name: 'Easl Space',
    person: 'UK Client',
    company: 'Easl Space',
    country: '🇬🇧 United Kingdom',
    color: '#4ade80',
    tag: 'Product Design',
    initials: 'ES',
  },
  {
    id: 'vO20f2ftp5w',
    name: 'Kurtis Rhee',
    person: 'President',
    company: 'OrthoStore, USA',
    country: '🇺🇸 United States',
    color: '#38bdf8',
    tag: 'E-Commerce',
    initials: 'KR',
  },
  {
    id: 'inCkLQpw6Ag',
    name: 'Matt Bennett',
    person: 'Co-Founder',
    company: 'GRAJ',
    country: '🇺🇸 United States',
    color: '#4ADE80',
    tag: 'SaaS Platform',
    initials: 'MB',
  },
  {
    id: '5obJf0KNV0k',
    name: 'Juan Agosto',
    person: 'Owner',
    company: 'Rent Logic',
    country: '🇺🇸 United States',
    color: '#f43f5e',
    tag: 'PropTech',
    initials: 'JA',
  },
];

const videoVariants = {
  enter: (d: number) => ({ x: d > 0 ? '55%' : '-55%', opacity: 0, scale: 0.88, rotateY: d > 0 ? 12 : -12 }),
  center: { x: 0, opacity: 1, scale: 1, rotateY: 0 },
  exit: (d: number) => ({ x: d > 0 ? '-55%' : '55%', opacity: 0, scale: 0.88, rotateY: d > 0 ? -12 : 12 }),
};

const infoVariants = {
  enter: (d: number) => ({ y: d > 0 ? 30 : -30, opacity: 0 }),
  center: { y: 0, opacity: 1 },
  exit: (d: number) => ({ y: d > 0 ? -30 : 30, opacity: 0 }),
};

function ChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

export default function CustomerReviewsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: false, margin: '-8%' });
  const isMobile = useIsMobile();

  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  const goTo = useCallback((idx: number, direction = 1) => {
    setDir(direction);
    setActive(idx);
    setIsPlaying(false);
  }, []);

  const next = useCallback(() => goTo((active + 1) % VIDEOS.length, 1), [active, goTo]);
  const prev = useCallback(() => goTo((active - 1 + VIDEOS.length) % VIDEOS.length, -1), [active, goTo]);

  // When user clicks into the iframe the window loses focus — that means video interaction
  useEffect(() => {
    const handleBlur = () => {
      requestAnimationFrame(() => {
        if (document.activeElement instanceof HTMLIFrameElement) {
          setIsPlaying(true);
        }
      });
    };
    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, []);

  // Auto-advance — paused while video is playing
  useEffect(() => {
    if (isPlaying) return;
    const t = setTimeout(next, AUTO_INTERVAL);
    return () => clearTimeout(t);
  }, [active, next, isPlaying]);

  const video = VIDEOS[active];

  return (
    <section
      ref={sectionRef}
      style={{
        background: '#080808',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        padding: 'clamp(60px, 7vw, 100px) clamp(24px, 5vw, 80px)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Ambient glow — cross-fades with each active color */}
      <AnimatePresence>
        <motion.div
          key={video.color}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          style={{
            position: 'absolute', top: '-15%', left: '25%',
            width: 700, height: 700, borderRadius: '50%',
            pointerEvents: 'none',
            background: `radial-gradient(circle, ${video.color}09 0%, transparent 65%)`,
          }}
        />
      </AnimatePresence>

      {/* ── Section header ── */}
      <div style={{ marginBottom: 'clamp(40px, 5vw, 64px)', position: 'relative', zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}
        >
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            style={{ width: 28, height: 1, background: '#4ADE80', transformOrigin: 'left' }}
          />
          <p style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '0.4em',
            textTransform: 'uppercase', color: '#4ADE80', margin: 0,
          }}>
            Our Customer Reviews
          </p>
        </motion.div>

        <h2 style={{
          fontSize: 'clamp(36px, 5vw, 68px)', fontWeight: 900,
          letterSpacing: '-0.05em', lineHeight: 0.92, margin: 0,
        }}>
          {[
            { text: 'Clients who', color: '#f0f0f0', delay: 0.08 },
            { text: 'trust us.', delay: 0.2, stroke: true },
          ].map(({ text, color, delay, stroke }) => (
            <span key={text} style={{ display: 'block', overflow: 'hidden' }}>
              <motion.span
                style={{
                  display: 'block',
                  color: color ?? 'transparent',
                  ...(stroke ? { WebkitTextStroke: '1px rgba(255,255,255,0.22)' } : {}),
                }}
                initial={{ y: '108%' }}
                animate={inView ? { y: 0 } : {}}
                transition={{ duration: 0.92, delay, ease: [0.16, 1, 0.3, 1] }}
              >
                {text}
              </motion.span>
            </span>
          ))}
        </h2>
      </div>

      {/* ── Main carousel ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: isMobile ? 36 : 'clamp(36px, 5vw, 80px)',
        alignItems: 'center',
        position: 'relative', zIndex: 2,
      }}>

        {/* ── Left: Phone frame + video ── */}
        <div style={{ display: 'flex', justifyContent: 'center', order: isMobile ? 2 : 1 }}>
          <div style={{ position: 'relative' }}>

            {/* Outer pulsing glow ring */}
            <AnimatePresence>
              <motion.div
                key={video.color + '-ring'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                style={{
                  position: 'absolute', inset: -28, borderRadius: 60,
                  background: `radial-gradient(ellipse at 50% 50%, ${video.color}18 0%, transparent 68%)`,
                  pointerEvents: 'none',
                }}
              />
            </AnimatePresence>

            {/* Subtle rotating border */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute', inset: -3, borderRadius: 46, pointerEvents: 'none',
                background: `conic-gradient(from 0deg, transparent 0%, ${video.color}40 15%, transparent 30%)`,
                opacity: 0.5,
              }}
            />

            {/* Phone chassis */}
            <div style={{
              width: isMobile ? 210 : 260,
              aspectRatio: '9 / 16',
              borderRadius: 42,
              border: '7px solid #1e1e1e',
              background: '#000',
              overflow: 'hidden',
              position: 'relative',
              boxShadow: `
                0 0 0 1px rgba(255,255,255,0.06),
                0 40px 90px rgba(0,0,0,0.75),
                0 0 60px ${video.color}14
              `,
            }}>

              {/* Notch */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 28,
                background: '#000', zIndex: 4,
                display: 'flex', justifyContent: 'center', alignItems: 'center',
              }}>
                <div style={{ width: 88, height: 20, background: '#050505', borderRadius: 10 }} />
              </div>

              {/* Video slide */}
              <AnimatePresence mode="wait" custom={dir}>
                <motion.div
                  key={active}
                  custom={dir}
                  variants={videoVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    position: 'absolute', inset: 0,
                    paddingTop: 28,
                    transformPerspective: 900,
                  }}
                >
                  <iframe
                    src={`https://www.youtube.com/embed/${video.id}?rel=0&modestbranding=1&playsinline=1`}
                    style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    title={`${video.name} testimonial`}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Home indicator */}
              <div style={{
                position: 'absolute', bottom: 6, left: '50%', transform: 'translateX(-50%)',
                width: 80, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.2)', zIndex: 4,
              }} />
            </div>

            {/* Floating "LIVE" badge */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'absolute', top: 48, right: isMobile ? -10 : -52,
                background: 'rgba(10,10,10,0.88)', backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 10, padding: '7px 12px',
                display: 'flex', alignItems: 'center', gap: 7,
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                zIndex: 5,
              }}
            >
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.4, repeat: Infinity }}
                style={{ width: 7, height: 7, borderRadius: '50%', background: '#f43f5e', flexShrink: 0 }}
              />
              <span style={{ fontSize: 9, fontWeight: 800, color: '#e0e0e0', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                Live review
              </span>
            </motion.div>

            {/* Floating stars badge */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'absolute', bottom: 60, right: isMobile ? -10 : -64,
                background: 'rgba(10,10,10,0.88)', backdropFilter: 'blur(12px)',
                border: `1px solid ${video.color}30`,
                borderRadius: 10, padding: '8px 14px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                zIndex: 5,
              }}
            >
              <div style={{ display: 'flex', gap: 3, marginBottom: 4 }}>
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="10" height="10" viewBox="0 0 24 24" fill="#4ADE80">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <div style={{ fontSize: 9, fontWeight: 700, color: '#888', letterSpacing: '0.06em' }}>5.0 rating</div>
            </motion.div>
          </div>
        </div>

        {/* ── Right: Client info + controls ── */}
        <div style={{ order: isMobile ? 1 : 2 }}>

          {/* Counter */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            style={{
              display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 32,
            }}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={active}
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -16, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  fontSize: 'clamp(40px, 5.5vw, 72px)', fontWeight: 900,
                  color: video.color, letterSpacing: '-0.07em', lineHeight: 1,
                }}
              >
                0{active + 1}
              </motion.span>
            </AnimatePresence>
            <span style={{ fontSize: 14, color: '#3a3a3a', fontWeight: 700 }}>/</span>
            <span style={{ fontSize: 14, color: '#3a3a3a', fontWeight: 700 }}>0{VIDEOS.length}</span>
          </motion.div>

          {/* Animated client details */}
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={active}
              custom={dir}
              variants={infoVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Tag pill */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: `${video.color}10`,
                border: `1px solid ${video.color}28`,
                borderRadius: 8, padding: '6px 14px', marginBottom: 22,
              }}>
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.6, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ width: 6, height: 6, borderRadius: '50%', background: video.color, flexShrink: 0 }}
                />
                <span style={{
                  fontSize: 9, fontWeight: 800, color: video.color,
                  letterSpacing: '0.28em', textTransform: 'uppercase',
                }}>
                  {video.tag}
                </span>
              </div>

              {/* Name */}
              <h3 style={{
                fontSize: 'clamp(30px, 4vw, 56px)', fontWeight: 900,
                color: '#f0f0f0', letterSpacing: '-0.055em', lineHeight: 1.05,
                margin: '0 0 10px',
              }}>
                {video.name}
              </h3>

              {/* Role · Company */}
              <p style={{
                fontSize: 'clamp(13px, 1.4vw, 16px)', color: '#666',
                margin: '0 0 8px', letterSpacing: '-0.015em',
              }}>
                {video.person}
                <span style={{ color: '#2e2e2e', margin: '0 8px' }}>·</span>
                <span style={{ color: '#999' }}>{video.company}</span>
              </p>

              {/* Country */}
              <p style={{ fontSize: 13, color: '#444', margin: '0 0 36px', letterSpacing: '-0.01em' }}>
                {video.country}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Progress bar */}
          <div style={{
            height: 2, background: 'rgba(255,255,255,0.05)',
            borderRadius: 2, marginBottom: 28, overflow: 'hidden',
          }}>
            <motion.div
              key={active}
              initial={{ width: '0%' }}
              animate={{ width: isPlaying ? undefined : '100%' }}
              transition={{ duration: AUTO_INTERVAL / 1000, ease: 'linear' }}
              style={{
                height: '100%', borderRadius: 2,
                background: `linear-gradient(90deg, ${video.color} 0%, ${video.color}88 100%)`,
              }}
            />
          </div>

          {/* Navigation controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <motion.button
              onClick={prev}
              whileHover={{ scale: 1.1, borderColor: 'rgba(255,255,255,0.18)' }}
              whileTap={{ scale: 0.88 }}
              style={{
                width: 44, height: 44, borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'transparent', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666',
              }}
            >
              <ChevronLeft />
            </motion.button>

            {/* Dot indicators */}
            <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
              {VIDEOS.map((v, i) => (
                <motion.button
                  key={v.id}
                  onClick={() => goTo(i, i > active ? 1 : -1)}
                  whileTap={{ scale: 0.8 }}
                  animate={{
                    width: i === active ? 26 : 8,
                    background: i === active ? video.color : 'rgba(255,255,255,0.15)',
                  }}
                  transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    height: 8, borderRadius: 4,
                    border: 'none', cursor: 'pointer', padding: 0,
                  }}
                />
              ))}
            </div>

            <motion.button
              onClick={next}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.88 }}
              style={{
                width: 44, height: 44, borderRadius: '50%',
                border: `1px solid ${video.color}44`,
                background: `${video.color}12`,
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: video.color,
              }}
            >
              <ChevronRight />
            </motion.button>
          </div>
        </div>
      </div>

      {/* ── Client selector strip ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: 10,
          marginTop: 'clamp(40px, 5vw, 64px)',
          position: 'relative', zIndex: 2,
        }}
      >
        {VIDEOS.map((v, i) => (
          <motion.button
            key={v.id}
            onClick={() => goTo(i, i > active ? 1 : -1)}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.97 }}
            animate={{
              borderColor: i === active ? v.color : 'rgba(255,255,255,0.06)',
              background: i === active ? `${v.color}0e` : '#0d0d0d',
            }}
            transition={{ duration: 0.32 }}
            style={{
              borderRadius: 14, padding: '14px 16px',
              cursor: 'pointer', border: '1px solid rgba(255,255,255,0.06)',
              background: '#0d0d0d', textAlign: 'left',
              position: 'relative', overflow: 'hidden',
            }}
          >
            {/* Top accent line — shared layout animation */}
            {i === active && (
              <motion.div
                layoutId="selector-line"
                style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                  background: v.color,
                }}
                transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
              />
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{
                width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                background: `${v.color}18`, border: `1px solid ${v.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 900, color: v.color,
              }}>
                {v.initials}
              </div>
              <div>
                <div style={{
                  fontSize: 12, fontWeight: 700,
                  color: i === active ? '#e8e8e8' : '#666',
                  letterSpacing: '-0.02em',
                }}>
                  {v.name}
                </div>
                <div style={{ fontSize: 9, color: '#444', marginTop: 2 }}>{v.person}</div>
              </div>
            </div>
            <div style={{
              fontSize: 8, fontWeight: 700, letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: i === active ? v.color : '#3a3a3a',
            }}>
              {v.tag}
            </div>
          </motion.button>
        ))}
      </motion.div>
    </section>
  );
}
