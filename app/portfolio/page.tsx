'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import {
  motion, AnimatePresence, useInView, useMotionValue, useSpring, useScroll, useTransform,
} from 'framer-motion';
import AnimatedCursor from '../../components/AnimatedCursor';
import Footer from '../../components/Footer';

const E: [number, number, number, number] = [0.22, 1, 0.36, 1];

function useIsMobile() {
  const [m, setM] = useState(false);
  useEffect(() => {
    const fn = () => setM(window.innerWidth < 768);
    fn(); window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return m;
}

function imgSrc(filename: string) {
  return `/portfolio/${encodeURIComponent(filename)}`;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
type Project = {
  id: number; title: string; subtitle: string;
  category: string; tag: string; img: string; accent: string;
};

const PROJECTS: Project[] = [
  { id: 1,  title: 'Trip Align',             subtitle: 'iOS & Android Travel App',         category: 'Mobile Apps', tag: 'iOS & Android',   img: 'Tripalign.webp',              accent: '#38bdf8' },
  { id: 2,  title: 'Properly Web',            subtitle: 'Real Estate SaaS Platform',        category: 'SaaS',        tag: 'SaaS Platform',   img: 'Properly.webp',               accent: '#22C76F' },
  { id: 3,  title: 'Seent',                   subtitle: 'Social Sharing Mobile App',        category: 'Mobile Apps', tag: 'Mobile App',      img: 'Seent app.webp',              accent: '#a78bfa' },
  { id: 4,  title: 'HaulFreight AI',          subtitle: 'Logistics SaaS Solution',          category: 'SaaS',        tag: 'SaaS Platform',   img: 'Haulfreight_ai_.webp',        accent: '#4ade80' },
  { id: 5,  title: 'GRAJ',                    subtitle: 'iOS & Android Mobile App',         category: 'Mobile Apps', tag: 'iOS & Android',   img: 'Graj_app.webp',               accent: '#f43f5e' },
  { id: 6,  title: 'Wisterias',               subtitle: 'E-Commerce SaaS Web App',          category: 'SaaS',        tag: 'SaaS Web App',    img: 'Wisteria.webp',               accent: '#38bdf8' },
  { id: 7,  title: 'Water Donation',          subtitle: 'Charity Mobile Application',       category: 'Mobile Apps', tag: 'Mobile App',      img: 'Water_donation.webp',         accent: '#22d3ee' },
  { id: 8,  title: 'Gurbani Sangeet',         subtitle: 'Music iOS & Android App',          category: 'Mobile Apps', tag: 'iOS & Android',   img: 'Gurbani Sangeet.webp',        accent: '#22C76F' },
  { id: 9,  title: 'Embroidery Store',        subtitle: 'E-Commerce Web Platform',          category: 'Web Apps',    tag: 'E-Commerce',      img: 'Embroidery.webp',             accent: '#e879f9' },
  { id: 10, title: 'Zaples Biolink',          subtitle: 'Link-in-bio Builder',              category: 'Web Apps',    tag: 'Web App',         img: 'Zapies.webp',                 accent: '#38bdf8' },
  { id: 11, title: 'Properly Mobile',         subtitle: 'Real Estate Mobile SaaS',          category: 'SaaS',        tag: 'Mobile SaaS',     img: 'Properlyapp.webp',            accent: '#22C76F' },
  { id: 12, title: 'Collect Mineral',         subtitle: 'Collectibles Mobile App',          category: 'Mobile Apps', tag: 'Mobile App',      img: 'Collect Mineral app.webp',    accent: '#4ade80' },
  { id: 13, title: 'Nessma',                  subtitle: 'iOS & Android Streaming App',      category: 'Mobile Apps', tag: 'iOS & Android',   img: 'Nessma.webp',                 accent: '#f43f5e' },
  { id: 14, title: 'Protocol',                subtitle: 'Health Report Tracking SaaS',      category: 'SaaS',        tag: 'Health Tech',     img: 'Protocol.webp',               accent: '#22C76F' },
  { id: 15, title: 'Med Match',               subtitle: 'Healthcare SaaS Platform',         category: 'SaaS',        tag: 'SaaS Platform',   img: 'Medmatch.webp',               accent: '#38bdf8' },
  { id: 16, title: 'CrossLinker',             subtitle: 'E-Commerce Marketplace',           category: 'Web Apps',    tag: 'E-Commerce',      img: 'Crosslinker.webp',            accent: '#4ade80' },
  { id: 17, title: 'Cappli',                  subtitle: 'Loan Tracking Web App',            category: 'Web Apps',    tag: 'FinTech Web',     img: 'Caplli.webp',                 accent: '#fb923c' },
  { id: 18, title: 'Aroma of Wine',           subtitle: 'Wine E-Commerce Platform',         category: 'Web Apps',    tag: 'E-Commerce',      img: 'Aroma of Wine.webp',          accent: '#a78bfa' },
  { id: 19, title: 'Blip',                    subtitle: 'iOS & Android Social App',         category: 'Mobile Apps', tag: 'iOS & Android',   img: 'Blip.webp',                   accent: '#38bdf8' },
  { id: 20, title: 'Carvind',                 subtitle: 'Automotive Mobile App',            category: 'Mobile Apps', tag: 'Mobile App',      img: 'Carvind.webp',                accent: '#f43f5e' },
  { id: 21, title: '360AI',                   subtitle: 'AI-Powered SaaS Platform',         category: 'AI / Others', tag: 'AI Platform',     img: '360AI.webp',                  accent: '#4ade80' },
  { id: 22, title: 'Bantar',                  subtitle: 'Social Commerce Mobile App',       category: 'Mobile Apps', tag: 'Mobile App',      img: 'Bantar_app.webp',             accent: '#22d3ee' },
  { id: 23, title: 'Juno Market',             subtitle: 'Trading Mobile Application',       category: 'Mobile Apps', tag: 'Mobile App',      img: 'Juno Market.webp',            accent: '#22C76F' },
  { id: 24, title: 'My Tabla',                subtitle: 'Music Companion Mobile App',       category: 'Mobile Apps', tag: 'Mobile App',      img: 'Mytabla.webp',                accent: '#e879f9' },
  { id: 25, title: 'Koor Connect',            subtitle: 'Social Web Application',           category: 'Web Apps',    tag: 'Web App',         img: 'Koor.webp',                   accent: '#4ade80' },
  { id: 26, title: 'Six Seconds',             subtitle: 'Legacy System Modernization',      category: 'Web Apps',    tag: 'Web App',         img: 'Six_Seconds.webp',            accent: '#22C76F' },
  { id: 27, title: 'Prism Health',            subtitle: 'Health Tracking Mobile App',       category: 'Mobile Apps', tag: 'Mobile App',      img: 'Prism health tracking.webp',  accent: '#38bdf8' },
  { id: 28, title: 'Strength Pals',           subtitle: 'Fitness Tracker App',              category: 'Mobile Apps', tag: 'Fitness App',     img: 'Strength pals workout.webp',  accent: '#4ade80' },
  { id: 29, title: 'BookForVisa',             subtitle: 'Travel Booking Web App',           category: 'Web Apps',    tag: 'Web App',         img: 'Bookforvisa.webp',            accent: '#a78bfa' },
  { id: 30, title: 'Dummy Flights',           subtitle: 'Flight Search Platform',           category: 'Web Apps',    tag: 'Web App',         img: 'Dummyflights.webp',           accent: '#38bdf8' },
];

const CATEGORIES = ['All', 'Mobile Apps', 'Web Apps', 'SaaS', 'AI / Others'];

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
            transition={{ duration: 0.9, delay: delay + i * 0.09, ease: E }}
          >
            {word}{i < text.split(' ').length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

// ─── Navigation ───────────────────────────────────────────────────────────────
function Navigation() {
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    { label: 'Home',      href: '/'          },
    { label: 'About Us',  href: '/about'     },
    { label: 'Services',  href: '/services'  },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Blog',      href: '#'          },
  ];
  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: E, delay: 0.1 }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: isMobile ? '16px 20px' : '18px 48px',
          background: 'rgba(5,5,5,0.85)', backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        <motion.a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }} whileHover={{ scale: 1.03 }}>
          <img
            src="/Upcodo_logo.webp"
            alt="UpCodo Digital"
            style={{ height: 34, width: 'auto', filter: 'brightness(0) invert(1)', opacity: 0.92 }}
          />
        </motion.a>

        {!isMobile && (
          <div style={{ display: 'flex', gap: 36, alignItems: 'center' }}>
            {links.map((link, i) => {
              const active = link.label === 'Portfolio';
              return (
                <motion.a key={link.label} href={link.href}
                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.07, ease: E }}
                  style={{ fontSize: 12, fontWeight: active ? 700 : 600, color: active ? '#22C76F' : '#888', textDecoration: 'none', letterSpacing: '0.02em', position: 'relative' }}
                  onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.color = '#f0f0f0'; }}
                  onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.color = '#888'; }}
                >
                  {link.label}
                  {active && <div style={{ position: 'absolute', bottom: -3, left: 0, right: 0, height: 1.5, background: '#22C76F', borderRadius: 99 }} />}
                </motion.a>
              );
            })}
            <motion.a href="/services#contact"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.55, ease: E }}
              whileHover={{ scale: 1.08, boxShadow: '0 12px 40px rgba(34,199,111,0.4)', y: -3 }}
              style={{ padding: '9px 20px', borderRadius: 7, background: '#22C76F', color: '#050505', fontSize: 11, fontWeight: 800, textDecoration: 'none', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'inline-block', position: 'relative', overflow: 'hidden' }}
            >
              <motion.span initial={{ x: '-120%' }} whileHover={{ x: '200%' }} transition={{ duration: 0.5 }}
                style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg,transparent 30%,rgba(255,255,255,0.4) 50%,transparent 70%)', pointerEvents: 'none' }} />
              Start a Project
            </motion.a>
          </div>
        )}

        {isMobile && (
          <motion.button onClick={() => setMenuOpen(v => !v)} style={{ background: 'transparent', border: 'none', padding: 8, display: 'flex', flexDirection: 'column', gap: 5, cursor: 'pointer' }}>
            <motion.div animate={menuOpen ? { rotate: 45, y: 12 } : { rotate: 0, y: 0 }} style={{ width: 24, height: 2, background: '#f0f0f0', borderRadius: 1 }} />
            <motion.div animate={menuOpen ? { opacity: 0 } : { opacity: 1 }} style={{ width: 24, height: 2, background: '#f0f0f0', borderRadius: 1 }} />
            <motion.div animate={menuOpen ? { rotate: -45, y: -12 } : { rotate: 0, y: 0 }} style={{ width: 24, height: 2, background: '#f0f0f0', borderRadius: 1 }} />
          </motion.button>
        )}
      </motion.nav>

      {isMobile && menuOpen && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          style={{ position: 'fixed', top: 70, left: 0, right: 0, zIndex: 999, background: 'rgba(5,5,5,0.97)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.04)', padding: '16px 20px' }}>
          {links.map(link => (
            <a key={link.label} href={link.href} onClick={() => setMenuOpen(false)}
              style={{ display: 'block', padding: '12px 0', fontSize: 14, fontWeight: 600, color: link.label === 'Portfolio' ? '#22C76F' : '#888', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              {link.label}
            </a>
          ))}
          <a href="/services#contact" onClick={() => setMenuOpen(false)}
            style={{ display: 'block', marginTop: 8, padding: '14px 0', fontSize: 12, fontWeight: 800, background: '#22C76F', color: '#050505', textDecoration: 'none', textAlign: 'center', borderRadius: 7, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Start a Project
          </a>
        </motion.div>
      )}
    </>
  );
}

// ─── Hero Carousel — stacked deck ─────────────────────────────────────────────
const INTERVAL = 5000;
const REEL = PROJECTS.slice(0, 10);
const SHOW  = 3; // cards visible in stack

// y-offset, scale, opacity for each stack slot (0 = front/active)
const STACK = [
  { y: 0,   scale: 1,    opacity: 1,    zIndex: 3 },
  { y: -26, scale: 0.96, opacity: 0.52, zIndex: 2 },
  { y: -48, scale: 0.92, opacity: 0.26, zIndex: 1 },
] as const;

function HeroCarousel() {
  const [active, setActive]         = useState(0);
  const hasAdvanced                 = useRef(false);

  const advance = (i: number) => {
    hasAdvanced.current = true;
    setActive(i);
  };

  useEffect(() => {
    const t = setInterval(() => advance((active + 1) % REEL.length), INTERVAL);
    return () => clearInterval(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const visible = Array.from({ length: SHOW }, (_, i) => ({
    project: REEL[(active + i) % REEL.length],
    slot: i,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1.2, delay: 0.7, ease: E }}
      style={{ position: 'relative', height: 540, display: 'flex', gap: 10 }}
    >
      {/* Stack */}
      <div style={{ flex: 1, position: 'relative' }}>
        <AnimatePresence>
          {visible.map(({ project, slot }) => {
            const cfg    = STACK[slot];
            const isNew  = hasAdvanced.current && slot === SHOW - 1;
            const back   = STACK[SHOW - 1];

            return (
              <motion.div
                key={project.id}
                initial={isNew ? { y: back.y - 22, scale: back.scale - 0.02, opacity: 0 } : false}
                animate={{ y: cfg.y, scale: cfg.scale, opacity: cfg.opacity }}
                exit={{ y: -320, scale: 0.84, opacity: 0, filter: 'blur(8px)',
                  transition: { duration: 1.1, ease: E } }}
                transition={{ duration: 1.1, ease: E }}
                style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  height: 464,
                  background: 'linear-gradient(145deg,#111111,#0d0d0d)',
                  border: `1px solid ${project.accent}${slot === 0 ? '32' : '14'}`,
                  borderRadius: 22, overflow: 'hidden',
                  zIndex: cfg.zIndex,
                  boxShadow: slot === 0
                    ? `0 28px 70px rgba(0,0,0,0.55), 0 0 50px ${project.accent}12`
                    : '0 6px 20px rgba(0,0,0,0.4)',
                }}
              >
                {/* Always-present: accent glow + top shimmer line */}
                <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 35%, ${project.accent}${slot === 0 ? '14' : '08'}, transparent 62%)` }} />
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${project.accent}${slot === 0 ? '50' : '22'},transparent)` }} />

                {slot === 0 ? (
                  /* ── Front card: full content ── */
                  <>
                    <div style={{ padding: '16px 16px 0' }}>
                      <motion.div
                        key={project.id}
                        initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.85, delay: 0.22, ease: E }}
                        style={{ position: 'relative', width: '100%', aspectRatio: '1/1' }}
                      >
                        <Image src={imgSrc(project.img)} alt={project.title} fill style={{ objectFit: 'contain' }} />
                      </motion.div>
                    </div>
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      background: 'linear-gradient(to top, rgba(10,10,10,0.97), transparent)',
                      padding: '50px 18px 16px',
                    }}>
                      <motion.span
                        key={`tag-${project.id}`}
                        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, delay: 0.3, ease: E }}
                        style={{
                          display: 'inline-block', fontSize: 9, fontWeight: 700, color: project.accent,
                          letterSpacing: '0.16em', textTransform: 'uppercase',
                          border: `1px solid ${project.accent}38`, borderRadius: 99,
                          padding: '3px 10px', marginBottom: 8, background: `${project.accent}12`,
                        }}
                      >
                        {project.tag}
                      </motion.span>
                      <motion.div
                        key={`title-${project.id}`}
                        initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, delay: 0.38, ease: E }}
                        style={{ fontSize: 17, fontWeight: 800, color: '#f0f0f0', letterSpacing: '-0.03em', lineHeight: 1.2 }}
                      >
                        {project.title}
                      </motion.div>
                      <motion.div
                        key={`sub-${project.id}`}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        transition={{ duration: 0.55, delay: 0.45, ease: E }}
                        style={{ fontSize: 11.5, color: '#484848', marginTop: 3, letterSpacing: '-0.01em' }}
                      >
                        {project.subtitle}
                      </motion.div>
                      {/* Progress bar */}
                      <div style={{ marginTop: 14, height: 2, background: 'rgba(255,255,255,0.05)', borderRadius: 99, overflow: 'hidden' }}>
                        <motion.div
                          key={`prog-${active}`}
                          initial={{ width: '0%' }}
                          animate={{ width: '100%' }}
                          transition={{ duration: INTERVAL / 1000, ease: 'linear' }}
                          style={{ height: '100%', background: `linear-gradient(90deg,${project.accent},${project.accent}55)`, borderRadius: 99 }}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  /* ── Back cards: header hint only (peeking from top) ── */
                  <div style={{ padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: project.accent, opacity: 0.55, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.28)', letterSpacing: '-0.02em', flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                      {project.title}
                    </span>
                    <span style={{ fontSize: 9, fontWeight: 600, color: `${project.accent}60`, letterSpacing: '0.1em', textTransform: 'uppercase', flexShrink: 0 }}>
                      {project.tag}
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Dot rail */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 6, paddingLeft: 2 }}>
        {REEL.map((_p, i) => (
          <motion.button
            key={i}
            onClick={() => advance(i)}
            animate={{
              height: i === active ? 30 : 7,
              background: i === active
                ? '#22C76F'
                : Math.abs(i - active) <= 1
                  ? 'rgba(255,255,255,0.16)'
                  : 'rgba(255,255,255,0.06)',
            }}
            transition={{ duration: 0.45, ease: E }}
            style={{ width: 3, borderRadius: 99, border: 'none', padding: 0, cursor: 'pointer', flexShrink: 0, background: 'transparent' }}
          />
        ))}
      </div>
    </motion.div>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection() {
  const isMobile = useIsMobile();

  return (
    <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden', background: '#050505' }}>
      {/* Ambient glow */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 3 }}
        style={{ position: 'absolute', top: '-15%', right: '-8%', width: 900, height: 900, background: 'radial-gradient(ellipse, rgba(34,199,111,0.065) 0%, transparent 62%)', pointerEvents: 'none' }} />
      {/* Dot grid */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.024) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

      {/* Ghost PORTFOLIO */}
      <motion.div
        initial={{ opacity: 0, scale: 1.06 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.5 }}
        style={{ position: 'absolute', bottom: '8%', left: '50%', transform: 'translateX(-50%)', fontSize: 'clamp(80px,18vw,260px)', fontWeight: 900, letterSpacing: '-0.06em', color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.016)', fontFamily: 'var(--font-outfit)', userSelect: 'none', pointerEvents: 'none', whiteSpace: 'nowrap' }}
      >
        PORTFOLIO
      </motion.div>

      <div style={{
        position: 'relative', zIndex: 10, width: '100%',
        padding: isMobile ? '130px 24px 80px' : '0 80px',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1.1fr',
        gap: isMobile ? 60 : 80,
        alignItems: 'center', minHeight: '100vh',
      }}>
        {/* Left: text */}
        <div>
          <motion.div
            initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, ease: E, delay: 0.3 }}
            style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 36 }}
          >
            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.5, delay: 0.4, ease: E }}
              style={{ width: 36, height: 1, background: '#22C76F', transformOrigin: 'left' }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.44em', textTransform: 'uppercase', color: '#22C76F' }}>Our Work</span>
          </motion.div>

          <h1 style={{ fontSize: isMobile ? 'clamp(46px,11vw,72px)' : 'clamp(52px,6.5vw,86px)', fontWeight: 900, letterSpacing: '-0.055em', lineHeight: 0.87, margin: '0 0 32px' }}>
            {[
              { text: 'Crafted',    style: {} },
              { text: 'Digital',    style: { color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.28)' } as React.CSSProperties },
              { text: 'Products.',  style: { color: '#22C76F' } },
            ].map((line, i) => (
              <div key={i} style={{ display: 'block', overflow: 'hidden' }}>
                <motion.div
                  initial={{ y: '108%' }} animate={{ y: 0 }}
                  transition={{ duration: 1.2, delay: 0.48 + i * 0.13, ease: E }}
                  style={{ display: 'block', ...line.style }}
                >
                  {line.text}
                </motion.div>
              </div>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease: E }}
            style={{ color: '#606060', fontSize: isMobile ? 14 : 15.5, lineHeight: 1.78, maxWidth: 440, letterSpacing: '-0.01em', marginBottom: 44 }}
          >
            A curated collection of digital products built with precision and purpose — spanning mobile apps, web platforms, and enterprise SaaS solutions.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.1, ease: E }}
            style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}
          >
            {[
              { value: '30+', label: 'Projects' },
              { value: '5',   label: 'Categories' },
              { value: '98%', label: 'Satisfaction' },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: 28, fontWeight: 900, color: '#22C76F', letterSpacing: '-0.04em', lineHeight: 1, fontFamily: 'var(--font-outfit)' }}>{s.value}</div>
                <div style={{ fontSize: 10, fontWeight: 600, color: '#333', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: 5 }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right: vertical carousel */}
        {!isMobile && <HeroCarousel />}
      </div>

      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 1.8 }}
        style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, zIndex: 10 }}
      >
        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.32em', color: '#333', textTransform: 'uppercase' }}>Scroll</span>
        <motion.div animate={{ y: [0, 9, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ width: 1, height: 36, background: 'linear-gradient(to bottom, #22C76F, transparent)' }} />
      </motion.div>
    </section>
  );
}

// ─── Filter Bar ───────────────────────────────────────────────────────────────
function FilterBar({ active, onChange }: { active: string; onChange: (c: string) => void }) {
  const isMobile = useIsMobile();
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: E }}
      style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 'clamp(32px,4vw,52px)' }}
    >
      {CATEGORIES.map((cat) => {
        const isActive = cat === active;
        return (
          <motion.button
            key={cat}
            onClick={() => onChange(cat)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            style={{
              position: 'relative',
              padding: isMobile ? '9px 18px' : '11px 24px',
              borderRadius: 999,
              border: isActive ? '1px solid rgba(34,199,111,0.5)' : '1px solid rgba(255,255,255,0.07)',
              background: isActive ? 'linear-gradient(135deg, #22C76F, #e8941a)' : 'rgba(255,255,255,0.03)',
              color: isActive ? '#050505' : '#666',
              fontSize: isMobile ? 11 : 12,
              fontWeight: isActive ? 800 : 600,
              cursor: 'pointer',
              fontFamily: 'var(--font-outfit)',
              backdropFilter: 'blur(8px)',
              boxShadow: isActive ? '0 8px 30px rgba(34,199,111,0.3)' : 'none',
              transition: 'all 0.28s ease',
              overflow: 'hidden',
            }}
          >
            {isActive && (
              <motion.span
                layoutId="filterActive"
                style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #22C76F, #e8941a)', borderRadius: 999 }}
                transition={{ type: 'spring', stiffness: 340, damping: 32 }}
              />
            )}
            <span style={{ position: 'relative', zIndex: 1 }}>{cat}</span>
          </motion.button>
        );
      })}
    </motion.div>
  );
}

// ─── Project Card ─────────────────────────────────────────────────────────────
function ProjectCard({ project }: { project: Project }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const sX   = useSpring(rotX, { stiffness: 220, damping: 24 });
  const sY   = useSpring(rotY, { stiffness: 220, damping: 24 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !glowRef.current) return;
    const r  = cardRef.current.getBoundingClientRect();
    const cx = (e.clientX - r.left) / r.width;
    const cy = (e.clientY - r.top)  / r.height;
    rotX.set((cy - 0.5) * -10);
    rotY.set((cx - 0.5) *  12);
    glowRef.current.style.left    = `${cx * 100}%`;
    glowRef.current.style.top     = `${cy * 100}%`;
    glowRef.current.style.opacity = '1';
  };

  const handleLeave = () => {
    setHovered(false);
    rotX.set(0); rotY.set(0);
    if (glowRef.current) glowRef.current.style.opacity = '0';
  };

  return (
    <div style={{ perspective: '900px' }}>
      <motion.div
        ref={cardRef}
        animate={{ y: hovered ? -14 : 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 22 }}
        style={{
          rotateX: sX, rotateY: sY,
          transformStyle: 'preserve-3d',
          background: '#111111',
          border: `1px solid ${project.accent}${hovered ? '45' : '1e'}`,
          borderRadius: 20,
          overflow: 'hidden',
          position: 'relative',
          boxShadow: hovered
            ? `0 36px 80px rgba(0,0,0,0.65), 0 0 60px ${project.accent}1a`
            : '0 8px 32px rgba(0,0,0,0.38)',
          transition: 'border-color 0.3s, box-shadow 0.3s',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
      >
        {/* Cursor glow */}
        <div ref={glowRef} style={{
          position: 'absolute', width: 260, height: 260,
          transform: 'translate(-50%,-50%)', borderRadius: '50%',
          background: `radial-gradient(circle, ${project.accent}18 0%, transparent 70%)`,
          pointerEvents: 'none', zIndex: 0, opacity: 0, transition: 'opacity 0.2s',
        }} />

        {/* Top shimmer */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${project.accent}40, transparent)`, zIndex: 2 }} />

        {/* Image — contained, no crop */}
        <div style={{ position: 'relative', background: 'linear-gradient(160deg, #0e0e0e, #0b0b0b)', padding: '16px 16px 0', overflow: 'hidden' }}>
          {/* Accent glow behind image */}
          <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 55%, ${project.accent}14, transparent 68%)`, pointerEvents: 'none' }} />

          {/* Image — 1:1, contained */}
          <motion.div
            animate={{ scale: hovered ? 1.05 : 1 }}
            transition={{ duration: 0.5, ease: E }}
            style={{ position: 'relative', width: '100%', aspectRatio: '1/1' }}
          >
            <Image src={imgSrc(project.img)} alt={project.title} fill style={{ objectFit: 'contain' }} />
          </motion.div>

          {/* Bottom fade into card */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 48, background: 'linear-gradient(to top, #111111, transparent)', pointerEvents: 'none' }} />

          {/* Hover dark tint */}
          <motion.div
            animate={{ opacity: hovered ? 0.22 : 0 }}
            transition={{ duration: 0.3 }}
            style={{ position: 'absolute', inset: 0, background: '#000', pointerEvents: 'none' }}
          />

          {/* Shimmer sweep */}
          <motion.div
            animate={hovered
              ? { x: '220%', opacity: [0, 1, 0], transition: { duration: 0.7, ease: 'easeInOut' } }
              : { x: '-120%', opacity: 0, transition: { duration: 0 } }
            }
            style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(105deg, transparent 28%, rgba(255,255,255,0.07) 50%, transparent 72%)',
              zIndex: 4, pointerEvents: 'none',
            }}
          />

          {/* Category tag */}
          <motion.div
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 8 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'absolute', top: 12, right: 12,
              background: `${project.accent}22`, border: `1px solid ${project.accent}44`,
              borderRadius: 6, padding: '4px 10px',
              fontSize: 9.5, fontWeight: 700, color: project.accent,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              backdropFilter: 'blur(8px)', zIndex: 5,
            }}
          >
            {project.tag}
          </motion.div>
        </div>

        {/* Card body */}
        <div style={{ padding: '16px 18px 20px', position: 'relative', zIndex: 1 }}>
          <motion.h3
            animate={{ y: hovered ? -3 : 0, color: hovered ? '#ffffff' : '#e0e0e0' }}
            transition={{ duration: 0.28 }}
            style={{ fontSize: 15, fontWeight: 800, letterSpacing: '-0.035em', margin: '0 0 5px', lineHeight: 1.2 }}
          >
            {project.title}
          </motion.h3>
          <p style={{ fontSize: 12, color: '#454545', letterSpacing: '-0.01em', lineHeight: 1.5, margin: 0 }}>
            {project.subtitle}
          </p>

          {/* Hover bottom bar */}
          <motion.div
            animate={{ scaleX: hovered ? 1 : 0 }}
            transition={{ duration: 0.42, ease: E }}
            style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
              background: `linear-gradient(90deg, ${project.accent}, transparent 72%)`,
              transformOrigin: 'left',
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}

// ─── Portfolio Grid Section ────────────────────────────────────────────────────
function PortfolioSection() {
  const [active, setActive] = useState('All');
  const ref    = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-5%' });
  const isMobile = useIsMobile();

  const filtered = active === 'All' ? PROJECTS : PROJECTS.filter(p => p.category === active);

  return (
    <section ref={ref} style={{
      background: '#0a0a0a',
      padding: 'clamp(60px,6vw,96px) clamp(24px,6vw,96px)',
      borderTop: '1px solid rgba(255,255,255,0.04)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background orb */}
      <div className="orb-a" style={{ position: 'absolute', top: '-10%', right: '-8%', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,199,111,0.04) 0%, transparent 65%)', filter: 'blur(70px)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1300, margin: '0 auto' }}>
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(32px,4vw,52px)' }}>
          <motion.div
            initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: E }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 20 }}
          >
            <motion.div initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}} transition={{ duration: 0.5, ease: E }}
              style={{ width: 32, height: 1, background: '#22C76F', transformOrigin: 'right' }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.44em', textTransform: 'uppercase', color: '#22C76F' }}>All Projects</span>
            <motion.div initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}} transition={{ duration: 0.5, ease: E }}
              style={{ width: 32, height: 1, background: '#22C76F', transformOrigin: 'left' }} />
          </motion.div>

          <h2 style={{ fontSize: 'clamp(32px,4.5vw,60px)', fontWeight: 900, letterSpacing: '-0.055em', lineHeight: 0.92, margin: '0 0 16px' }}>
            <WordReveal text="Our Portfolio" inView={inView} delay={0.1} />
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3, ease: E }}
            style={{ color: '#484848', fontSize: 'clamp(13px,1.3vw,15px)', lineHeight: 1.8, maxWidth: 480, margin: '0 auto' }}
          >
            Our collection of iOS, Android and web applications — built to solve real problems.
          </motion.p>
        </div>

        {/* Filter */}
        <FilterBar active={active} onChange={setActive} />

        {/* Grid */}
        <motion.div layout style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: isMobile ? 16 : 28,
        }}>
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.93, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, delay: (i % (isMobile ? 1 : 3)) * 0.06 + Math.floor(i / (isMobile ? 1 : 3)) * 0.04, ease: E } }}
                exit={{ opacity: 0, scale: 0.9, y: -16, transition: { duration: 0.28 } }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Project count */}
        <motion.div
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          style={{ textAlign: 'center', marginTop: 48 }}
        >
          <span style={{ fontSize: 11, color: '#2e2e2e', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Showing {filtered.length} of {PROJECTS.length} projects
          </span>
        </motion.div>
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
      <div className="orb-a" style={{ position: 'absolute', top: '-12%', left: '-6%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,199,111,0.08) 0%, transparent 65%)', filter: 'blur(55px)', pointerEvents: 'none', zIndex: 0 }} />
      <div className="orb-b" style={{ position: 'absolute', bottom: '-18%', right: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,0.07) 0%, transparent 65%)', filter: 'blur(55px)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.022) 1px, transparent 1px)', backgroundSize: '48px 48px', opacity: 0.6 }} />

      {!isMobile && (
        <motion.div style={{ y: yParallax }} initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 2 }}>
          <div style={{ position: 'absolute', right: '-2%', bottom: '2%', fontSize: 'clamp(80px,16vw,220px)', fontWeight: 900, letterSpacing: '-0.07em', color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.024)', userSelect: 'none', pointerEvents: 'none', zIndex: 1, fontFamily: 'var(--font-outfit)' }}>
            UPCODO
          </div>
        </motion.div>
      )}

      <div style={{ position: 'relative', zIndex: 10, maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: E }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 40 }}
        >
          <motion.div initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}} transition={{ duration: 0.5, delay: 0.08, ease: E }}
            style={{ width: 40, height: 1, background: '#22C76F', transformOrigin: 'right' }} />
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.44em', textTransform: 'uppercase', color: '#22C76F' }}>Ready to build?</span>
          <motion.div initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}} transition={{ duration: 0.5, delay: 0.08, ease: E }}
            style={{ width: 40, height: 1, background: '#22C76F', transformOrigin: 'left' }} />
        </motion.div>

        <h2 style={{ fontSize: isMobile ? 'clamp(38px,9vw,56px)' : 'clamp(48px,7vw,84px)', fontWeight: 900, letterSpacing: '-0.055em', lineHeight: 0.9, margin: '0 0 36px' }}>
          <WordReveal text="Have a Project" inView={inView} delay={0.05} />
          <br />
          <WordReveal text="in Mind?" inView={inView} delay={0.22} style={{ color: '#22C76F' }} />
        </h2>

        <motion.div
          initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.9, delay: 0.42, ease: E }}
          style={{ height: 1, maxWidth: 420, margin: '0 auto 40px', background: 'linear-gradient(90deg, transparent, rgba(34,199,111,0.5), transparent)', transformOrigin: 'center' }}
        />

        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.5, ease: E }}
          style={{ color: '#5e5e5e', fontSize: 'clamp(13px,1.3vw,15.5px)', lineHeight: 1.85, letterSpacing: '-0.01em', marginBottom: 48 }}
        >
          Transform your idea into a world-class digital product. Our team is ready to bring your vision to life.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.58, ease: E }}
          style={{ display: 'flex', gap: 14, justifyContent: 'center', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center' }}
        >
          <motion.a href="/services#contact"
            whileHover={{ scale: 1.05, boxShadow: '0 16px 50px rgba(34,199,111,0.35)', y: -3 }}
            whileTap={{ scale: 0.96 }}
            style={{
              padding: isMobile ? '14px 28px' : '17px 44px',
              borderRadius: 10, textDecoration: 'none',
              background: '#f0f0f0', color: '#050505',
              fontWeight: 800, fontSize: isMobile ? 13 : 14,
              letterSpacing: '-0.01em', fontFamily: 'var(--font-outfit)',
              position: 'relative', overflow: 'hidden', display: 'inline-block',
              width: isMobile ? '100%' : 'auto', textAlign: 'center' as const,
            }}
          >
            <motion.span initial={{ x: '-120%' }} whileHover={{ x: '200%' }} transition={{ duration: 0.55 }}
              style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg,transparent 30%,rgba(255,255,255,0.35) 50%,transparent 70%)', pointerEvents: 'none' }} />
            Start a Project
          </motion.a>
          <motion.a href="/about"
            whileHover={{ borderColor: 'rgba(34,199,111,0.4)', color: '#e0e0e0' }}
            style={{
              padding: isMobile ? '14px 28px' : '17px 44px',
              borderRadius: 10, textDecoration: 'none',
              background: 'transparent', color: '#555',
              fontWeight: 700, fontSize: isMobile ? 13 : 14,
              letterSpacing: '-0.01em', fontFamily: 'var(--font-outfit)',
              border: '1px solid rgba(255,255,255,0.09)',
              display: 'inline-block',
              width: isMobile ? '100%' : 'auto', textAlign: 'center' as const,
            }}
          >
            Meet the Team
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function PortfolioPage() {
  return (
    <main style={{ background: '#050505', minHeight: '100dvh', width: '100%', color: '#f0f0f0' }}>
      <AnimatedCursor />
      <Navigation />
      <HeroSection />
      <PortfolioSection />
      <CTASection />
      <Footer />
    </main>
  );
}
