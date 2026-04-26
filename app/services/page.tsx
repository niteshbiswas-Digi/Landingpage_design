'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring, useScroll, useTransform } from 'framer-motion';
import AnimatedCursor from '../../components/AnimatedCursor';
import Footer from '../../components/Footer';
import Navigation from '../../components/Navigation';

function useIsMobile() {
  const [m, setM] = useState(false);
  useEffect(() => {
    const fn = () => setM(window.innerWidth < 768);
    fn();
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return m;
}

const E = [0.16, 1, 0.3, 1] as const;

// ─── WordReveal ────────────────────────────────────────────────────────────────
function WordReveal({ text, inView, delay = 0, style }: {
  text: string; inView: boolean; delay?: number; style?: React.CSSProperties;
}) {
  return (
    <span style={{ display: 'inline', ...style }}>
      {text.split(' ').map((word, i) => (
        <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', lineHeight: 'inherit' }}>
          <motion.span
            style={{ display: 'inline-block' }}
            initial={{ y: '112%', opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.9, delay: delay + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
          >
            {word}{i < text.split(' ').length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

// ─── MagneticBtn ──────────────────────────────────────────────────────────────
function MagneticBtn({ children, primary, href }: { children: React.ReactNode; primary?: boolean; href?: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const mx = useMotionValue(0); const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 180, damping: 14 });
  const sy = useSpring(my, { stiffness: 180, damping: 14 });
  const isMobile = useIsMobile();
  return (
    <motion.a
      ref={ref} href={href ?? '#'}
      style={{
        x: sx, y: sy,
        padding: isMobile ? '14px 28px' : '17px 44px',
        borderRadius: 10, textDecoration: 'none',
        background: primary ? '#f0f0f0' : 'transparent',
        color: primary ? '#050505' : '#555',
        fontWeight: primary ? 800 : 700,
        fontSize: isMobile ? 13 : 14, letterSpacing: '-0.01em',
        border: primary ? 'none' : '1px solid rgba(255,255,255,0.09)',
        fontFamily: 'var(--font-outfit)',
        position: 'relative', overflow: 'hidden', display: 'inline-block',
        width: isMobile ? '100%' : 'auto', textAlign: 'center' as const,
      }}
      onMouseMove={(e) => {
        if (!ref.current) return;
        const r = ref.current.getBoundingClientRect();
        mx.set((e.clientX - (r.left + r.width / 2)) * 0.28);
        my.set((e.clientY - (r.top + r.height / 2)) * 0.28);
      }}
      onMouseLeave={() => { mx.set(0); my.set(0); }}
      whileHover={primary ? { boxShadow: '0 16px 50px rgba(74,222,128,0.3)', scale: 1.03 } : { borderColor: 'rgba(74,222,128,0.4)', color: '#e0e0e0' }}
      whileTap={{ scale: 0.95 }}
    >
      {primary && (
        <motion.span
          initial={{ x: '-120%' }} whileHover={{ x: '200%' }}
          transition={{ duration: 0.55 }}
          style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg,transparent 30%,rgba(255,255,255,0.35) 50%,transparent 70%)', pointerEvents: 'none' }}
        />
      )}
      {children}
    </motion.a>
  );
}

// ─── Hero preview cards data ──────────────────────────────────────────────────
const HERO_CARDS = [
  { title: 'Web Development',    sub: 'React · Next.js · Node.js',    accent: '#4ADE80', icon: '⬡' },
  { title: 'Mobile Apps',        sub: 'React Native · Flutter · Swift', accent: '#38bdf8', icon: '◈' },
  { title: 'UI / UX Design',     sub: 'Figma · Design Systems',        accent: '#a78bfa', icon: '✦' },
  { title: 'Cloud & DevOps',     sub: 'AWS · Docker · CI/CD',          accent: '#4ade80', icon: '◉' },
];

const STATS = [
  { value: '50+',  label: 'Projects Delivered' },
  { value: '12+',  label: 'Tech Stacks' },
  { value: '5',    label: 'Core Domains' },
  { value: '98%',  label: 'Satisfaction Rate' },
];

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection() {
  const isMobile = useIsMobile();

  return (
    <section style={{
      position: 'relative', minHeight: '100vh',
      display: 'flex', alignItems: 'center',
      overflow: 'hidden', background: '#050505',
    }}>
      {/* Multi-layer background */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 3 }}
        style={{ position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)', width: 1100, height: 800, background: 'radial-gradient(ellipse, rgba(74,222,128,0.08) 0%, transparent 60%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

      {/* Ghost watermark */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2.5 }}
        style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          fontSize: 'clamp(80px,20vw,280px)', fontWeight: 900, letterSpacing: '-0.06em',
          color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.018)',
          fontFamily: 'var(--font-outfit)', userSelect: 'none', pointerEvents: 'none', whiteSpace: 'nowrap',
        }}
      >
        SERVICES
      </motion.div>

      <div style={{
        position: 'relative', zIndex: 10, width: '100%',
        padding: isMobile ? '130px 24px 80px' : '0 80px',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1.05fr',
        gap: isMobile ? 60 : 80,
        alignItems: 'center', minHeight: '100vh',
      }}>

        {/* ── Left content ── */}
        <div>
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, ease: E, delay: 0.3 }}
            style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 36 }}
          >
            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.5, delay: 0.4, ease: E }}
              style={{ width: 36, height: 1, background: '#4ADE80', transformOrigin: 'left' }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.44em', textTransform: 'uppercase', color: '#4ADE80' }}>What We Build</span>
          </motion.div>

          {/* Title */}
          <h1 style={{ fontSize: isMobile ? 'clamp(46px,11vw,72px)' : 'clamp(56px,7.5vw,96px)', fontWeight: 900, letterSpacing: '-0.055em', lineHeight: 0.87, margin: '0 0 32px' }}>
            {[
              { text: 'Premium',    style: {} },
              { text: 'Digital',    style: { color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.3)' } },
              { text: 'Services.',  style: { color: '#4ADE80' } },
            ].map((line, i) => (
              <div key={i} style={{ display: 'block', overflow: 'hidden' }}>
                <motion.div
                  initial={{ y: '105%' }} animate={{ y: 0 }}
                  transition={{ duration: 1.2, delay: 0.48 + i * 0.13, ease: E }}
                  style={{ display: 'block', ...line.style }}
                >
                  {line.text}
                </motion.div>
              </div>
            ))}
          </h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease: E }}
            style={{ color: '#606060', fontSize: isMobile ? 14 : 15.5, lineHeight: 1.78, maxWidth: 460, letterSpacing: '-0.01em', marginBottom: 44 }}
          >
            From web and mobile applications to cloud infrastructure and SEO — end-to-end
            digital solutions built with precision, speed, and a relentless focus on quality.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1, ease: E }}
            style={{ display: 'flex', gap: 12, flexDirection: isMobile ? 'column' : 'row', marginBottom: 52 }}
          >
            <MagneticBtn primary href="#web">Explore Services</MagneticBtn>
            <MagneticBtn href="#contact">Get a Quote</MagneticBtn>
          </motion.div>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.25, ease: E }}
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${isMobile ? 2 : 4}, 1fr)`,
              gap: '1px',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: 16,
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            {STATS.map((s, i) => (
              <div key={i} style={{
                padding: isMobile ? '16px 14px' : '20px 20px',
                background: '#080808',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: isMobile ? 22 : 26, fontWeight: 900, color: '#4ADE80', letterSpacing: '-0.05em', lineHeight: 1, fontFamily: 'var(--font-outfit)', marginBottom: 5 }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 9.5, fontWeight: 600, color: '#3a3a3a', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Right: service preview cards ── */}
        {!isMobile && (
          <div style={{ position: 'relative' }}>
            {/* Ambient glow */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
              width: 480, height: 480, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(74,222,128,0.06) 0%, transparent 70%)',
              filter: 'blur(50px)', pointerEvents: 'none',
            }} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, position: 'relative', zIndex: 1 }}>
              {HERO_CARDS.map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 + i * 0.12, ease: E }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  style={{
                    background: 'linear-gradient(145deg, #0e0e0e, #0a0a0a)',
                    border: `1px solid ${card.accent}28`,
                    borderRadius: 20,
                    padding: '28px 24px',
                    position: 'relative', overflow: 'hidden',
                    cursor: 'default',
                    transition: 'border-color 0.3s, box-shadow 0.3s',
                    boxShadow: `0 8px 32px rgba(0,0,0,0.4)`,
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = `${card.accent}55`;
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 24px 60px rgba(0,0,0,0.6), 0 0 50px ${card.accent}18`;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = `${card.accent}28`;
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px rgba(0,0,0,0.4)`;
                  }}
                >
                  {/* Top shimmer */}
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${card.accent}40, transparent)` }} />
                  {/* Corner glow */}
                  <div style={{ position: 'absolute', top: 0, right: 0, width: 100, height: 100, background: `radial-gradient(circle at top right, ${card.accent}18, transparent 70%)`, pointerEvents: 'none' }} />

                  {/* Icon */}
                  <div style={{
                    width: 48, height: 48, borderRadius: 14,
                    background: `${card.accent}18`, border: `1px solid ${card.accent}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 20, fontSize: 22, color: card.accent,
                    fontFamily: 'var(--font-outfit)',
                  }}>
                    {card.icon}
                  </div>

                  <div style={{ fontSize: 15, fontWeight: 800, color: '#e2e2e2', letterSpacing: '-0.03em', marginBottom: 8, lineHeight: 1.2 }}>
                    {card.title}
                  </div>
                  <div style={{ fontSize: 11, color: '#484848', letterSpacing: '-0.01em', lineHeight: 1.5 }}>
                    {card.sub}
                  </div>

                  {/* Accent bottom bar */}
                  <motion.div
                    initial={{ scaleX: 0 }} whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.4, ease: E }}
                    style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${card.accent}, transparent 75%)`, transformOrigin: 'left' }}
                  />
                </motion.div>
              ))}
            </div>

            {/* Floating stat badge */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              style={{
                position: 'absolute', bottom: -28, right: -18,
                background: 'rgba(8,8,8,0.96)', border: '1px solid rgba(74,222,128,0.22)',
                borderRadius: 16, padding: '18px 22px',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
                zIndex: 2,
              }}
            >
              <div style={{ fontSize: 26, fontWeight: 900, color: '#4ADE80', letterSpacing: '-0.05em', lineHeight: 1 }}>150+</div>
              <div style={{ fontSize: 9, fontWeight: 700, color: '#444', letterSpacing: '0.22em', textTransform: 'uppercase', marginTop: 5 }}>Happy Clients</div>
            </motion.div>
          </div>
        )}
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 1.8 }}
        style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, zIndex: 10 }}
      >
        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.32em', color: '#333', textTransform: 'uppercase' }}>Scroll</span>
        <motion.div animate={{ y: [0, 9, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ width: 1, height: 36, background: 'linear-gradient(to bottom, #4ADE80, transparent)' }} />
      </motion.div>
    </section>
  );
}

// ─── Section Label ─────────────────────────────────────────────────────────────
function SectionLabel({ text, inView, center = false }: { text: string; inView: boolean; center?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: E }}
      style={{ display: 'flex', alignItems: 'center', justifyContent: center ? 'center' : 'flex-start', gap: 14, marginBottom: 22 }}
    >
      {center && <motion.div initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}} transition={{ duration: 0.5, ease: E }} style={{ width: 32, height: 1, background: '#4ADE80', transformOrigin: 'right' }} />}
      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.44em', textTransform: 'uppercase', color: '#4ADE80' }}>{text}</span>
      <motion.div initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}} transition={{ duration: 0.5, ease: E }} style={{ width: 32, height: 1, background: '#4ADE80', transformOrigin: 'left' }} />
    </motion.div>
  );
}

// ─── Service Card ─────────────────────────────────────────────────────────────
const SERVICE_ICONS: Record<string, React.ReactNode> = {
  web: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
    </svg>
  ),
  mobile: (
    <svg width="20" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="17" r="1" fill="currentColor"/>
    </svg>
  ),
  ecommerce: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
    </svg>
  ),
  frontend: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
    </svg>
  ),
  backend: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
    </svg>
  ),
  custom: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M4.93 19.07l1.41-1.41M19.07 19.07l-1.41-1.41M2 12h2M20 12h2M12 2v2M12 20v2"/>
    </svg>
  ),
  ios: (
    <svg width="20" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83"/>
      <path d="M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  ),
  android: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M5 16.5v-9a2 2 0 012-2h10a2 2 0 012 2v9a2 2 0 01-2 2H7a2 2 0 01-2-2z"/>
      <path d="M8 5.5L6 3M16 5.5l2-2.5M9 11h.01M15 11h.01"/>
    </svg>
  ),
  api: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
    </svg>
  ),
  ux: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="12" r="10"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/>
    </svg>
  ),
  cloud: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"/>
    </svg>
  ),
  seo: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
};

function ServiceCard({ iconKey, title, body, accent, index, inView, cols = 3 }: {
  iconKey: string; title: string; body: string;
  accent: string; index: number; inView: boolean; cols?: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const delay = Math.floor(index / cols) * 0.08 + (index % cols) * 0.07;

  return (
    <motion.div
      initial={{ opacity: 0, y: 48, scale: 0.96 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.78, delay, ease: E }}
      style={{ height: '100%' }}
    >
      <motion.div
        ref={cardRef}
        whileHover={{ y: -10 }}
        transition={{ type: 'spring', stiffness: 200, damping: 22 }}
        onMouseMove={(e) => {
          if (!cardRef.current || !glowRef.current) return;
          const r = cardRef.current.getBoundingClientRect();
          glowRef.current.style.left    = `${((e.clientX - r.left) / r.width) * 100}%`;
          glowRef.current.style.top     = `${((e.clientY - r.top)  / r.height) * 100}%`;
          glowRef.current.style.opacity = '1';
        }}
        style={{
          background: 'linear-gradient(150deg, #0f0f0f 0%, #0a0a0a 100%)',
          border: `1px solid ${accent}22`,
          borderRadius: 22, padding: '32px 28px 32px',
          position: 'relative', overflow: 'hidden', height: '100%',
          transition: 'border-color 0.32s, box-shadow 0.32s',
          boxShadow: `0 6px 28px rgba(0,0,0,0.35)`,
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.borderColor = `${accent}44`;
          (e.currentTarget as HTMLElement).style.boxShadow = `0 24px 64px rgba(0,0,0,0.55), 0 0 50px ${accent}14`;
        }}
        onMouseLeave={e => {
          if (glowRef.current) glowRef.current.style.opacity = '0';
          (e.currentTarget as HTMLElement).style.borderColor = `${accent}22`;
          (e.currentTarget as HTMLElement).style.boxShadow = `0 6px 28px rgba(0,0,0,0.35)`;
        }}
      >
        {/* Top shimmer line */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${accent}35, transparent)` }} />

        {/* Corner glow */}
        <div style={{ position: 'absolute', top: 0, right: 0, width: 120, height: 120, background: `radial-gradient(circle at top right, ${accent}14, transparent 68%)`, pointerEvents: 'none' }} />

        {/* Cursor glow */}
        <div ref={glowRef} style={{ position: 'absolute', width: 220, height: 220, transform: 'translate(-50%,-50%)', borderRadius: '50%', background: `radial-gradient(circle, ${accent}14 0%, transparent 70%)`, pointerEvents: 'none', zIndex: 0, opacity: 0, transition: 'opacity 0.2s' }} />

        {/* Ghost index */}
        <div style={{ position: 'absolute', top: 20, right: 24, fontSize: 52, fontWeight: 900, lineHeight: 1, color: `${accent}09`, letterSpacing: '-0.06em', fontFamily: 'var(--font-outfit)', userSelect: 'none' }}>
          {String(index + 1).padStart(2, '0')}
        </div>

        {/* Icon box */}
        <div style={{
          width: 52, height: 52, borderRadius: 15,
          background: `${accent}14`, border: `1px solid ${accent}2e`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 22, position: 'relative', zIndex: 1, color: accent,
          boxShadow: `0 0 20px ${accent}14`,
        }}>
          {SERVICE_ICONS[iconKey]}
        </div>

        <h3 style={{ fontSize: 17, fontWeight: 800, color: '#e2e2e2', letterSpacing: '-0.038em', marginBottom: 12, lineHeight: 1.2, position: 'relative', zIndex: 1 }}>
          {title}
        </h3>
        <p style={{ fontSize: 13.5, color: '#545454', lineHeight: 1.8, letterSpacing: '-0.01em', position: 'relative', zIndex: 1 }}>
          {body}
        </p>

        {/* Bottom hover bar */}
        <motion.div
          initial={{ scaleX: 0 }} whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.42, ease: E }}
          style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${accent}, transparent 72%)`, transformOrigin: 'left' }}
        />
      </motion.div>
    </motion.div>
  );
}

// ─── Web Services ─────────────────────────────────────────────────────────────
const WEB_SERVICES = [
  { iconKey: 'mobile',    title: 'Hybrid Mobile Application',    accent: '#38bdf8', body: 'Cross-platform apps using React Native, EXPO, and Redux. We also work with Flutter and Dart — one codebase, both iOS and Android.' },
  { iconKey: 'web',       title: 'Website Development Services', accent: '#4ADE80', body: 'Comprehensive website development — from pixel-perfect front ends to fully connected admin panels and content management systems.' },
  { iconKey: 'ecommerce', title: 'E-commerce Platform Solutions',accent: '#4ade80', body: 'Intuitive, secure, and scalable e-commerce platforms. Full cart, payment gateway integration, and inventory management built for growth.' },
  { iconKey: 'frontend',  title: 'Front End Development',        accent: '#a78bfa', body: 'Responsive and dynamic interfaces using TypeScript, React.js, Next.js, Vue.js, and TailwindCSS — functional, fast, and beautiful.' },
  { iconKey: 'custom',    title: 'Custom Web App Development',   accent: '#fb923c', body: 'Tailored web applications for your unique workflows. Latest front-end and back-end technology to deliver scalable, efficient solutions.' },
  { iconKey: 'backend',   title: 'Back End Development',         accent: '#f43f5e', body: 'Robust APIs and server-side logic using Python Django, FastAPI, Node.js, and PHP Laravel with MongoDB, PostgreSQL, and MySQL.' },
];

function WebSection() {
  const ref    = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-8%' });
  const isMobile = useIsMobile();

  return (
    <section id="web" ref={ref} style={{
      background: '#080808',
      padding: 'clamp(60px,6vw,96px) clamp(24px,6vw,96px)',
      position: 'relative', overflow: 'hidden',
      borderTop: '1px solid rgba(255,255,255,0.04)',
    }}>
      <div className="orb-a" style={{ position: 'absolute', top: '-12%', right: '-6%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(74,222,128,0.05) 0%, transparent 65%)', filter: 'blur(60px)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(32px,4vw,52px)' }}>
          <SectionLabel text="Web Development" inView={inView} center />
          <h2 style={{ fontSize: 'clamp(36px,5vw,64px)', fontWeight: 900, letterSpacing: '-0.055em', lineHeight: 0.95, margin: '0 0 24px' }}>
            <WordReveal text="Custom Web Application" inView={inView} delay={0.08} />
            <br />
            <WordReveal text="Development" inView={inView} delay={0.24} style={{ color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.28)' }} />
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4, ease: E }}
            style={{ color: '#545454', fontSize: 'clamp(13px,1.3vw,15px)', lineHeight: 1.82, maxWidth: 600, margin: '0 auto', letterSpacing: '-0.01em' }}
          >
            Bespoke web applications tailored to automate and streamline your business operations — from SaaS platforms and automation products to MVPs that let you test and validate your ideas fast.
          </motion.p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: isMobile ? 16 : 'clamp(16px,2vw,28px)',
          position: 'relative', zIndex: 1,
        }}>
          {WEB_SERVICES.map((s, i) => (
            <ServiceCard key={i} {...s} index={i} inView={inView} cols={3} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Mobile Services ──────────────────────────────────────────────────────────
const MOBILE_SERVICES = [
  { iconKey: 'mobile',  title: 'Hybrid Mobile Application',   accent: '#38bdf8', body: 'Cross-platform mobile apps with React Native, EXPO, and Redux. We also work with Flutter and Dart to create high-performance apps for both iOS and Android from a single codebase.' },
  { iconKey: 'ios',     title: 'Native iOS Application',      accent: '#a3e635', body: 'Robust native iOS apps built with Swift. Seamless performance, polished animations, and an intuitive user experience tailored to Apple\'s design standards.' },
  { iconKey: 'android', title: 'Native Android Application',  accent: '#4ade80', body: 'Powerful native Android apps using Java and Kotlin. Smooth user experience and optimal performance tailored to meet your specific business requirements.' },
  { iconKey: 'api',     title: 'API Integration Solutions',   accent: '#4ADE80', body: 'Seamlessly connect systems and services. We design and integrate RESTful and GraphQL APIs for streamlined operations, improved data flow, and scalable functionality.' },
];

function MobileSection() {
  const ref    = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-8%' });
  const isMobile = useIsMobile();

  return (
    <section id="mobile" ref={ref} style={{
      background: '#050505',
      padding: 'clamp(60px,6vw,96px) clamp(24px,6vw,96px)',
      position: 'relative', overflow: 'hidden',
      borderTop: '1px solid rgba(255,255,255,0.04)',
    }}>
      <div className="orb-b" style={{ position: 'absolute', bottom: '-12%', left: '-8%', width: 650, height: 650, borderRadius: '50%', background: 'radial-gradient(circle, rgba(56,189,248,0.04) 0%, transparent 65%)', filter: 'blur(65px)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(32px,4vw,52px)' }}>
          <SectionLabel text="Mobile Development" inView={inView} center />
          <h2 style={{ fontSize: 'clamp(36px,5vw,64px)', fontWeight: 900, letterSpacing: '-0.055em', lineHeight: 0.95, margin: '0 0 24px' }}>
            <WordReveal text="Mobile Application" inView={inView} delay={0.08} />
            <br />
            <WordReveal text="Development" inView={inView} delay={0.24} style={{ color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.28)' }} />
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4, ease: E }}
            style={{ color: '#545454', fontSize: 'clamp(13px,1.3vw,15px)', lineHeight: 1.82, maxWidth: 580, margin: '0 auto', letterSpacing: '-0.01em' }}
          >
            Specializing in mobile applications for iOS and Android — ensuring optimal performance, seamless user experience, and scalable architecture across every platform and device.
          </motion.p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
          gap: isMobile ? 16 : 'clamp(18px,2.2vw,32px)',
          position: 'relative', zIndex: 1,
        }}>
          {MOBILE_SERVICES.map((s, i) => (
            <ServiceCard key={i} {...s} index={i} inView={inView} cols={2} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Tech Stack Section ───────────────────────────────────────────────────────
const STACKS = [
  { label: 'Web Front End', items: ['React.js', 'Next.js', 'Vue.js', 'TypeScript', 'TailwindCSS'], accent: '#38bdf8' },
  { label: 'Mobile App',    items: ['React Native CLI', 'Expo', 'Flutter'],                        accent: '#4ade80' },
  { label: 'Back End',      items: ['Python Django', 'FastAPI', 'Node.js', 'PHP Laravel'],         accent: '#4ADE80' },
  { label: 'API & DB',      items: ['GraphQL', 'REST', 'MongoDB', 'MySQL', 'PostgreSQL'],          accent: '#a78bfa' },
];

const TECH_LOGOS = [
  { name: 'React',    sub: 'Frontend',  color: '#61dafb' },
  { name: 'Next.js',  sub: 'Full-Stack',color: '#e0e0e0' },
  { name: 'Node.js',  sub: 'Backend',   color: '#68a063' },
  { name: 'FastAPI',  sub: 'Backend',   color: '#009688' },
  { name: 'Django',   sub: 'Backend',   color: '#44b78b' },
  { name: 'Flutter',  sub: 'Mobile',    color: '#54c5f8' },
  { name: 'AWS',      sub: 'Cloud',     color: '#ff9900' },
  { name: 'MongoDB',  sub: 'Database',  color: '#47a248' },
  { name: 'MySQL',    sub: 'Database',  color: '#4479a1' },
  { name: 'Laravel',  sub: 'Backend',   color: '#ff2d20' },
  { name: 'Python',   sub: 'Backend',   color: '#ffd43b' },
  { name: 'GraphQL',  sub: 'API',       color: '#e535ab' },
];

function TechStackSection() {
  const ref    = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-8%' });
  const isMobile = useIsMobile();

  return (
    <section ref={ref} style={{
      background: '#080808',
      padding: 'clamp(60px,6vw,96px) clamp(24px,6vw,96px)',
      position: 'relative', overflow: 'hidden',
      borderTop: '1px solid rgba(255,255,255,0.04)',
    }}>
      <div className="orb-a" style={{ position: 'absolute', top: '5%', right: '-6%', width: 550, height: 550, borderRadius: '50%', background: 'radial-gradient(circle, rgba(74,222,128,0.045) 0%, transparent 65%)', filter: 'blur(60px)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(32px,4vw,52px)' }}>
          <SectionLabel text="Technology" inView={inView} center />
          <h2 style={{ fontSize: 'clamp(36px,5vw,64px)', fontWeight: 900, letterSpacing: '-0.055em', lineHeight: 0.95, margin: '0 0 24px' }}>
            <WordReveal text="Our Expertise" inView={inView} delay={0.08} />
            {' '}
            <WordReveal text="Tech Stacks" inView={inView} delay={0.22} style={{ color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.28)' }} />
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.38, ease: E }}
            style={{ color: '#545454', fontSize: 'clamp(13px,1.3vw,15px)', lineHeight: 1.82, maxWidth: 540, margin: '0 auto', letterSpacing: '-0.01em' }}
          >
            Our proficiency spans a comprehensive range of modern technology stacks — giving you full-coverage solutions from pixel to server.
          </motion.p>
        </div>

        {/* Two column layout: stack rows + logo grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1.4fr',
          gap: 'clamp(40px,6vw,80px)',
          alignItems: 'start',
        }}>
          {/* Left: stack categories */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {STACKS.map((stack, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -32 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.65, delay: 0.12 + i * 0.1, ease: E }}
                style={{
                  background: 'linear-gradient(145deg, #0d0d0d, #0a0a0a)',
                  border: `1px solid ${stack.accent}1e`,
                  borderRadius: 16, padding: '18px 20px',
                  position: 'relative', overflow: 'hidden',
                }}
              >
                {/* Accent left bar */}
                <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 3, background: `linear-gradient(to bottom, ${stack.accent}, ${stack.accent}44)`, borderRadius: '99px 0 0 99px' }} />
                <div style={{ fontSize: 9.5, fontWeight: 700, color: stack.accent, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 10, paddingLeft: 14 }}>
                  {stack.label}
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', paddingLeft: 14 }}>
                  {stack.items.map((item, j) => (
                    <span key={j} style={{
                      fontSize: 11.5, fontWeight: 600, color: '#5e5e5e',
                      background: 'rgba(255,255,255,0.035)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: 7, padding: '4px 10px',
                      letterSpacing: '-0.01em',
                    }}>
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right: large tech logo tiles — 4 col grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(4, 1fr)',
            gap: isMobile ? 10 : 14,
          }}>
            {TECH_LOGOS.map((tech, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.82, y: 20 }}
                animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: 0.18 + i * 0.055, type: 'spring', stiffness: 180, damping: 20 }}
                whileHover={{ scale: 1.06, y: -6, zIndex: 2 }}
                style={{
                  background: `linear-gradient(145deg, ${tech.color}0e, ${tech.color}06)`,
                  border: `1px solid ${tech.color}28`,
                  borderRadius: 18,
                  padding: '24px 12px 20px',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  gap: 8,
                  cursor: 'default',
                  transition: 'box-shadow 0.3s, border-color 0.3s',
                  boxShadow: `0 4px 16px rgba(0,0,0,0.35)`,
                  position: 'relative', overflow: 'hidden',
                  minHeight: isMobile ? 88 : 104,
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 16px 48px rgba(0,0,0,0.55), 0 0 40px ${tech.color}20`;
                  (e.currentTarget as HTMLElement).style.borderColor = `${tech.color}50`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 16px rgba(0,0,0,0.35)`;
                  (e.currentTarget as HTMLElement).style.borderColor = `${tech.color}28`;
                }}
              >
                {/* Glow blob */}
                <div style={{ position: 'absolute', top: '-15%', left: '50%', transform: 'translateX(-50%)', width: '90%', height: '60%', borderRadius: '50%', background: `radial-gradient(circle, ${tech.color}1a, transparent 70%)`, filter: 'blur(14px)', pointerEvents: 'none' }} />
                {/* Top shimmer */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${tech.color}40, transparent)` }} />

                <span style={{ fontSize: isMobile ? 13 : 15, fontWeight: 800, color: tech.color, letterSpacing: '-0.02em', fontFamily: 'var(--font-outfit)', position: 'relative', zIndex: 1, textAlign: 'center', lineHeight: 1.2 }}>
                  {tech.name}
                </span>
                <span style={{ fontSize: 9, fontWeight: 700, color: `${tech.color}66`, letterSpacing: '0.18em', textTransform: 'uppercase', position: 'relative', zIndex: 1 }}>
                  {tech.sub}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Extra Services ────────────────────────────────────────────────────────────
const EXTRA_SERVICES = [
  { iconKey: 'ux',    title: 'User Experience Design',       accent: '#a78bfa', body: 'Intuitive and engaging interfaces that elevate user interaction for Web and Mobile apps. Design systems, prototypes, and UX audits that drive retention and conversion.' },
  { iconKey: 'cloud', title: 'Cloud Integration Services',   accent: '#38bdf8', body: 'Seamlessly integrate cloud solutions to maximize performance and scalability. AWS, GCP, and Azure architecture, containerization, and CI/CD pipelines tailored to your product.' },
  { iconKey: 'seo',   title: 'Search Engine Optimization',   accent: '#4ade80', body: 'Improve your online visibility with data-driven SEO. We grow organic traffic, improve search rankings, and build sustainable discovery channels for your business.' },
];

function ExtraServicesSection() {
  const ref    = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-8%' });
  const isMobile = useIsMobile();

  return (
    <section ref={ref} style={{
      background: '#050505',
      padding: 'clamp(60px,6vw,96px) clamp(24px,6vw,96px)',
      position: 'relative', overflow: 'hidden',
      borderTop: '1px solid rgba(255,255,255,0.04)',
    }}>
      <div className="orb-b" style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: 550, height: 550, borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,0.05) 0%, transparent 65%)', filter: 'blur(60px)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(32px,4vw,52px)' }}>
          <SectionLabel text="More Services" inView={inView} center />
          <h2 style={{ fontSize: 'clamp(36px,5vw,64px)', fontWeight: 900, letterSpacing: '-0.055em', lineHeight: 0.95, margin: '0 0 24px' }}>
            <WordReveal text="Beyond" inView={inView} delay={0.08} />
            {' '}
            <WordReveal text="Development" inView={inView} delay={0.2} style={{ color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.28)' }} />
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.38, ease: E }}
            style={{ color: '#545454', fontSize: 'clamp(13px,1.3vw,15px)', lineHeight: 1.82, maxWidth: 520, margin: '0 auto', letterSpacing: '-0.01em' }}
          >
            From pixel-perfect design to cloud infrastructure and organic growth — we cover the full spectrum of digital needs.
          </motion.p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: isMobile ? 16 : 'clamp(18px,2.2vw,32px)',
          position: 'relative', zIndex: 1,
        }}>
          {EXTRA_SERVICES.map((s, i) => (
            <ServiceCard key={i} {...s} index={i} inView={inView} cols={3} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA Section ──────────────────────────────────────────────────────────────
function CTASection() {
  const ref    = useRef<HTMLElement>(null);
  const inView = useInView(ref, { margin: '-10%' });
  const isMobile = useIsMobile();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const yParallax = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);

  return (
    <section id="contact" ref={ref} style={{
      position: 'relative', width: '100%',
      padding: 'clamp(60px,6vw,96px) clamp(24px,6vw,96px)',
      background: '#080808',
      borderTop: '1px solid rgba(255,255,255,0.04)',
      overflow: 'hidden',
    }}>
      {/* Orbs */}
      <div className="orb-a" style={{ position: 'absolute', top: '-12%', left: '-6%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(74,222,128,0.08) 0%, transparent 65%)', filter: 'blur(55px)', pointerEvents: 'none', zIndex: 0 }} />
      <div className="orb-b" style={{ position: 'absolute', bottom: '-18%', right: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,0.07) 0%, transparent 65%)', filter: 'blur(55px)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Dot grid */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.022) 1px, transparent 1px)', backgroundSize: '48px 48px', opacity: 0.6 }} />

      {/* Parallax ghost text */}
      {!isMobile && (
        <motion.div
          style={{ y: yParallax }}
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 2, delay: 0.2 }}
        >
          <div style={{
            position: 'absolute', right: '-2%', bottom: '2%',
            fontSize: 'clamp(80px,16vw,220px)', fontWeight: 900,
            letterSpacing: '-0.07em', color: 'transparent',
            WebkitTextStroke: '1px rgba(255,255,255,0.025)',
            userSelect: 'none', pointerEvents: 'none', zIndex: 1,
            fontFamily: 'var(--font-outfit)',
          }}>
            UPCODO
          </div>
        </motion.div>
      )}

      <div style={{ position: 'relative', zIndex: 10, maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: E }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 40 }}
        >
          <motion.div initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}} transition={{ duration: 0.5, delay: 0.08, ease: E }}
            style={{ width: 40, height: 1, background: '#4ADE80', transformOrigin: 'right' }} />
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.44em', textTransform: 'uppercase', color: '#4ADE80' }}>Ready to innovate?</span>
          <motion.div initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}} transition={{ duration: 0.5, delay: 0.08, ease: E }}
            style={{ width: 40, height: 1, background: '#4ADE80', transformOrigin: 'left' }} />
        </motion.div>

        {/* Title */}
        <h2 style={{ fontSize: isMobile ? 'clamp(38px,9vw,56px)' : 'clamp(48px,7vw,84px)', fontWeight: 900, letterSpacing: '-0.055em', lineHeight: 0.9, margin: '0 0 36px' }}>
          <WordReveal text="Innovate with" inView={inView} delay={0.05} />
          <br />
          <WordReveal text="UpCodo" inView={inView} delay={0.22} style={{ color: '#4ADE80' }} />
        </h2>

        {/* Gold divider */}
        <motion.div
          initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.9, delay: 0.42, ease: E }}
          style={{ height: 1, maxWidth: 420, margin: '0 auto 40px', background: 'linear-gradient(90deg, transparent, rgba(74,222,128,0.5), transparent)', transformOrigin: 'center' }}
        />

        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.5, ease: E }}
          style={{ color: '#5e5e5e', fontSize: 'clamp(13px,1.3vw,15.5px)', lineHeight: 1.85, letterSpacing: '-0.01em', marginBottom: 48 }}
        >
          Transform your business ideas into reality with our cutting-edge mobile and web applications. Leverage expert development services tailored to your unique needs.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.58, ease: E }}
          style={{ display: 'flex', gap: 14, justifyContent: 'center', flexDirection: isMobile ? 'column' : 'row' }}
        >
          <MagneticBtn primary href="#contact">Contact Us</MagneticBtn>
          <MagneticBtn href="/about">Meet the Team</MagneticBtn>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function ServicesPage() {
  return (
    <main style={{ background: '#050505', minHeight: '100dvh', width: '100%', color: '#f0f0f0' }}>
      <AnimatedCursor />
      <Navigation activePage="services" />
      <HeroSection />
      <WebSection />
      <MobileSection />
      <TechStackSection />
      <ExtraServicesSection />
      <CTASection />
      <Footer />
    </main>
  );
}
