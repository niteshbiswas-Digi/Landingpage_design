'use client';

import { useRef, useEffect, useState } from 'react';
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
} from 'framer-motion';
import Image from 'next/image';
import AnimatedCursor from '../../components/AnimatedCursor';
import Footer from '../../components/Footer';

// ─── Hook ─────────────────────────────────────────────────────────────────────
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

// ─── Constants ────────────────────────────────────────────────────────────────
const E = [0.16, 1, 0.3, 1] as const;

// ─── Data ─────────────────────────────────────────────────────────────────────
const TEAM = [
  // ── Founders & Leadership ──────────────────────────────────────────────────
  { name: 'Akshay Pratap Singh',   role: 'Co-founder & System Architect',                  img: '/team/Akshay_Pratap_Singh.webp',  accent: '#38bdf8' },
  { name: 'Gaurav Jain',           role: 'Co-founder / CEO & Head of Operations',          img: '/team/Gaurav_Jain.webp',          accent: '#22C76F' },
  { name: 'Abhay Pratap',          role: 'Co-founder & Chief Technology Officer',           img: '/team/Abhay_Pratap.webp',         accent: '#4ade80' },
  { name: 'Rajat Singh',           role: 'Product Delivery Head',                          img: '/team/Rajat_Singh.webp',          accent: '#a78bfa' },
  { name: 'Yuvraj Shinde',         role: 'Project Delivery Manager',                       img: '/team/Yuvraj_Shinde.webp',        accent: '#fb923c' },
  // ── MERN Stack Developers ──────────────────────────────────────────────────
  { name: 'Ravindra Jain',         role: 'MERN Stack Developer',                           img: '/team/Ravindra_Jain.webp',        accent: '#2dd4bf' },
  { name: 'Sandeep Sikarwar',      role: 'MERN Stack Developer',                           img: '/team/Sandeep_Sikarwar.webp',     accent: '#e879f9' },
  { name: 'Abhishek Tiwari',       role: 'MERN Stack Developer',                           img: '/team/Abhishek_tiwari.webp',      accent: '#a3e635' },
  { name: 'Saral Shrivastava',     role: 'MERN Stack Developer',                           img: '/team/Saral_shrivastava.webp',    accent: '#22C76F' },
  { name: 'Sakshi Shrivastava',    role: 'MERN Stack Developer',                           img: '/team/Sakshi_Shrivastava.webp',   accent: '#38bdf8' },
  { name: 'Sarfaraj Ali',          role: 'MERN Stack Developer',                           img: '/team/Sarfaraj_Ali.webp',         accent: '#4ade80' },
  { name: 'Akash Singh Pathoriya', role: 'MERN Stack Developer',                           img: '/team/Akash_Singh.webp',          accent: '#a78bfa' },
  { name: 'Abhishek Singh',        role: 'MERN Stack Developer',                           img: '/team/Abhishek_Singh.webp',       accent: '#fb923c' },
  { name: 'Romesh Jain',           role: 'MERN Stack Developer',                           img: '/team/Romesh_Jain.webp',          accent: '#f43f5e' },
  { name: 'Prashant Gupta',        role: 'MERN Stack Developer',                           img: '/team/Prashant_Gupta.webp',       accent: '#2dd4bf' },
  { name: 'Mangal Vanik',          role: 'MERN Stack Developer',                           img: '/team/Mangal_Banik.webp',         accent: '#e879f9' },
  { name: 'Sanskar Sahu',          role: 'MERN Stack Developer',                           img: '/team/Sanskar_Sahu.webp',         accent: '#a3e635' },
  { name: 'Sandeep Sahu',          role: 'MERN Stack Developer',                           img: '/team/Sandeep_sahu.webp',         accent: '#22C76F' },
  { name: 'Vivek Shrivastava',     role: 'MERN Stack Developer',                           img: '/team/Vivek.webp',                accent: '#38bdf8' },
  { name: 'Jatin Pal',             role: 'MERN Stack Developer',                           img: '/team/Jatin_pal.webp',            accent: '#4ade80' },
  { name: 'Bhoopnesh',             role: 'MERN Stack Developer',                           img: '/team/Bhoopesh.webp',             accent: '#a78bfa' },
  { name: 'Alka Sinha',            role: 'MERN Stack Developer',                           img: '/team/Alka_Sinha.webp',           accent: '#fb923c' },
  { name: 'Lokesh Kushwaha',       role: 'MERN Stack Developer',                           img: '/team/Lokesh_Kushwah.webp',       accent: '#f43f5e' },
  { name: 'Neeraj Pal',            role: 'MERN Stack Developer',                           img: '/team/Neeraj_Pal.webp',           accent: '#2dd4bf' },
  { name: 'Injila Naureen',        role: 'MERN Stack Developer',                           img: '/team/Injila_Naureen.webp',       accent: '#e879f9' },
  // ── UI/UX ─────────────────────────────────────────────────────────────────
  { name: 'Pradeep Singh Tomar',   role: 'Sr. UI/UX Designer',                             img: '/team/Pradeep_Tomar.webp',        accent: '#a3e635' },
  { name: 'Nitesh Biswas',         role: 'Sr. UI/UX Designer',                             img: '/team/Nitesh_Biswas.webp',        accent: '#22C76F' },
  { name: 'Harsh Tomar',           role: 'Sr. UI/UX Designer',                             img: '/team/Harsh_Tomar.webp',          accent: '#38bdf8' },
  { name: 'Saumya Bais',           role: 'UI/UX Developer',                                img: '/team/Saumya_bais.webp',          accent: '#a78bfa' },
  { name: 'Narayan Singh',         role: 'UI/UX Developer',                                img: '/team/Narayan.webp',              accent: '#fb923c' },
  { name: 'Chirag Jain',           role: 'UI/UX Designer',                                 img: '/team/Chirag_jain_UI.webp',       accent: '#f43f5e' },
  { name: 'Uday Verma',            role: 'UI/UX Designer',                                 img: '/team/Uday.webp',                 accent: '#2dd4bf' },
  { name: 'Santosh Lodhi',         role: 'UI/UX Developer',                                img: '/team/Santosh.webp',              accent: '#e879f9' },
  // ── Flutter Developers ────────────────────────────────────────────────────
  { name: 'Pawan Sharma',          role: 'Flutter Developer',                              img: '/team/Pawan_Sharma.webp',         accent: '#38bdf8' },
  { name: 'Gaurav Kumar',          role: 'Flutter Developer',                              img: '/team/Gaurav_Kumar.webp',         accent: '#4ade80' },
  // ── React Native Developers ───────────────────────────────────────────────
  { name: 'Jitendra Narwaria',     role: 'React Native Developer',                         img: '/team/Jitendra_Narwariya.webp',   accent: '#a78bfa' },
  { name: 'Nitin Verma',           role: 'React Native & MERN Stack Developer',            img: '/team/Nitin_Verma.webp',          accent: '#fb923c' },
  { name: 'Shahid Khan',           role: 'React Native Developer',                         img: '/team/Shahid.webp',               accent: '#f43f5e' },
  // ── Full-Stack Developers ─────────────────────────────────────────────────
  { name: 'Hemant Mandeliya',      role: 'Full-Stack Developer',                           img: '/team/Hemant.webp',               accent: '#2dd4bf' },
  { name: 'Suraj Maurya',          role: 'Full-Stack Developer',                           img: '/team/Suraj_Maurya.webp',         accent: '#a3e635' },
  // ── Laravel Developers ────────────────────────────────────────────────────
  { name: 'Praveen Kushwah',       role: 'Laravel Developer',                              img: '/team/Praveen_kushwah.webp',      accent: '#22C76F' },
  { name: 'Suraj Prajapati',       role: 'Laravel Developer',                              img: '/team/Suraj_Prajapati.webp',      accent: '#38bdf8' },
  // ── Python & Django Developers ────────────────────────────────────────────
  { name: 'Praveen Vaidhya',       role: 'Python & Django Developer',                      img: '/team/Praveen_Vaidhya.webp',      accent: '#4ade80' },
  { name: 'Yogesh Sahu',           role: 'Python & Django Developer',                      img: '/team/Yogesh.webp',               accent: '#a78bfa' },
  { name: 'Krishna Rathore',       role: 'Python & Django Developer',                      img: '/team/Krishna.webp',              accent: '#fb923c' },
  { name: 'Aman Tomar',            role: 'Python & Django Developer',                      img: '/team/Aman_Tomar.webp',           accent: '#f43f5e' },
  { name: 'Abhishek Rajput',       role: 'Python & Django Developer',                      img: '/team/Abhishek_Rajput.webp',      accent: '#2dd4bf' },
  // ── DevOps & AWS ─────────────────────────────────────────────────────────
  { name: 'Vishnu Kumar Gahlot',   role: 'DevOps & AWS Engineer',                          img: '/team/Vishnu.webp',               accent: '#e879f9' },
  { name: 'Chirag Jain',           role: 'DevOps & AWS Engineer',                          img: '/team/Chirag_jain_Devops.webp',   accent: '#a3e635' },
  // ── Software Quality Analysts ─────────────────────────────────────────────
  { name: 'Pankaj Singh',          role: 'Software Quality Analyst',                       img: '/team/Pankaj.webp',               accent: '#22C76F' },
  { name: 'Aman Kushwah',          role: 'Software Quality Analyst',                       img: '/team/Aman_Kushwah.webp',         accent: '#38bdf8' },
  { name: 'Saurabh Pathak',        role: 'Software Quality Analyst',                       img: '/team/Saurabh_Pathak.webp',       accent: '#4ade80' },
];

const WHY = [
  { sym: '⚡', title: 'Engineering First',  body: 'Rock-solid architecture on every project. Every line reviewed, tested, and optimized for production scale.' },
  { sym: '✦',  title: 'Design Obsessed',    body: 'Pixel-perfect interfaces with intention. Beauty and usability are never at odds here.' },
  { sym: '🚀', title: 'Ship Fast & Right',  body: 'Speed without sacrifice. Our agile process ships quality products in weeks, not months.' },
  { sym: '◈',  title: 'True Partnership',   body: "You are not a ticket. We embed in your vision and become a real extension of your team." },
  { sym: '✧',  title: 'Innovation Driven',  body: 'AI, modern frameworks, and emerging patterns to keep you ahead of the competitive curve.' },
  { sym: '◉',  title: 'Results Guaranteed', body: '98% client satisfaction. We measure success not just by delivery, but by the impact created.' },
];

const PROCESS = [
  { n: '01', title: 'Discovery',    body: 'Deep-dive into your business, audience, and goals. Research-backed strategy from day one.' },
  { n: '02', title: 'Architecture', body: 'Technical roadmap and sprint planning. Every decision documented and aligned with your vision.' },
  { n: '03', title: 'Design',       body: 'High-fidelity prototypes with real interactions. Your brand, elevated to its highest form.' },
  { n: '04', title: 'Development',  body: 'Parallel streams with CI/CD pipelines. Zero-defect deployment philosophy at every stage.' },
  { n: '05', title: 'Launch',       body: 'Staged rollout with real-time monitoring. We stand by during go-live and handle every edge.' },
  { n: '06', title: 'Growth',       body: 'Post-launch analytics and iterative improvements. Your long-term success is our KPI.' },
];

const HERO_AVATARS = [
  { name: 'Gaurav Jain',         img: '/team/Gaurav_Jain.webp',          accent: '#22C76F', x: 10, y: 10, size: 82, d: 0 },
  { name: 'Akshay Pratap Singh', img: '/team/Akshay_Pratap_Singh.webp',  accent: '#38bdf8', x: 72, y: 8,  size: 68, d: 0.1 },
  { name: 'Abhay Pratap',        img: '/team/Abhay_Pratap.webp',         accent: '#4ade80', x: 80, y: 46, size: 62, d: 0.06 },
  { name: 'Rajat Singh',         img: '/team/Rajat_Singh.webp',          accent: '#a78bfa', x: 60, y: 78, size: 54, d: 0.18 },
  { name: 'Nitesh Biswas',       img: '/team/Nitesh_Biswas.webp',        accent: '#22C76F', x: 16, y: 74, size: 58, d: 0.12 },
  { name: 'Yuvraj Shinde',       img: '/team/Yuvraj_Shinde.webp',        accent: '#fb923c', x: 38, y: 54, size: 48, d: 0.22 },
  { name: 'Pradeep Singh Tomar', img: '/team/Pradeep_Tomar.webp',        accent: '#a3e635', x: 24, y: 32, size: 52, d: 0.08 },
  { name: 'Sakshi Shrivastava',  img: '/team/Sakshi_Shrivastava.webp',   accent: '#e879f9', x: 55, y: 24, size: 50, d: 0.28 },
];

// ─── WordReveal ────────────────────────────────────────────────────────────────
function WordReveal({
  text, inView, delay = 0, style,
}: { text: string; inView: boolean; delay?: number; style?: React.CSSProperties }) {
  const words = text.split(' ');
  return (
    <span style={{ display: 'inline', ...style }}>
      {words.map((word, i) => (
        <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', lineHeight: 'inherit' }}>
          <motion.span
            style={{ display: 'inline-block' }}
            initial={{ y: '112%', opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.92, delay: delay + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
          >
            {word}{i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

// ─── MagneticBtn ──────────────────────────────────────────────────────────────
function MagneticBtn({
  children, primary, href,
}: { children: React.ReactNode; primary?: boolean; href?: string }) {
  const ref  = useRef<HTMLAnchorElement>(null);
  const mx   = useMotionValue(0);
  const my   = useMotionValue(0);
  const sx   = useSpring(mx, { stiffness: 180, damping: 14 });
  const sy   = useSpring(my, { stiffness: 180, damping: 14 });
  const isMobile = useIsMobile();

  return (
    <motion.a
      ref={ref}
      href={href ?? '#'}
      style={{
        x: sx, y: sy,
        padding: isMobile ? '14px 24px' : '18px 48px',
        borderRadius: 10,
        background: primary ? '#f0f0f0' : 'transparent',
        color: primary ? '#050505' : '#606060',
        fontWeight: primary ? 800 : 700,
        fontSize: isMobile ? 12 : 14,
        letterSpacing: '-0.01em',
        border: primary ? 'none' : '1px solid rgba(255,255,255,0.08)',
        fontFamily: 'var(--font-outfit), sans-serif',
        position: 'relative', overflow: 'hidden',
        display: 'inline-block',
        textDecoration: 'none',
        width: isMobile ? '100%' : 'auto',
        textAlign: 'center' as const,
      }}
      onMouseMove={(e) => {
        if (!ref.current) return;
        const r = ref.current.getBoundingClientRect();
        mx.set((e.clientX - (r.left + r.width  / 2)) * 0.28);
        my.set((e.clientY - (r.top  + r.height / 2)) * 0.28);
      }}
      onMouseLeave={() => { mx.set(0); my.set(0); }}
      whileHover={primary
        ? { boxShadow: '0 16px 50px rgba(34,199,111,0.28)', scale: 1.03 }
        : { borderColor: 'rgba(34,199,111,0.4)', color: '#e0e0e0' }
      }
      whileTap={{ scale: 0.95 }}
    >
      {primary && (
        <motion.span
          initial={{ x: '-120%' }}
          whileHover={{ x: '200%' }}
          transition={{ duration: 0.6 }}
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.35) 50%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
      )}
      {children}
    </motion.a>
  );
}

// ─── Navigation ───────────────────────────────────────────────────────────────
function Navigation() {
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { label: 'Home',     href: '/'       },
    { label: 'About Us', href: '/about'  },
    { label: 'Services', href: '/services' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Blog',     href: '#'       },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: E, delay: 0.1 }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: isMobile ? '16px 20px' : '18px 48px',
          background: 'rgba(5,5,5,0.82)',
          backdropFilter: 'blur(22px)',
          WebkitBackdropFilter: 'blur(22px)',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        {/* Logo */}
        <motion.a
          href="/"
          style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}
          whileHover={{ scale: 1.03 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        >
          <img
            src="/Upcodo_logo.webp"
            alt="UpCodo Digital"
            style={{ height: 34, width: 'auto', filter: 'brightness(0) invert(1)', opacity: 0.92 }}
          />
        </motion.a>

        {/* Desktop links */}
        {!isMobile && (
          <div style={{ display: 'flex', gap: 36, alignItems: 'center' }}>
            {links.map((link, i) => {
              const active = link.label === 'About Us';
              return (
                <motion.a
                  key={link.label}
                  href={link.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.07, ease: E }}
                  style={{
                    fontSize: 12, fontWeight: active ? 700 : 600,
                    color: active ? '#22C76F' : '#888',
                    textDecoration: 'none', letterSpacing: '0.02em',
                    position: 'relative',
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.color = '#f0f0f0'; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.color = '#888'; }}
                >
                  {link.label}
                  {active && (
                    <div style={{
                      position: 'absolute', bottom: -3, left: 0, right: 0,
                      height: 1.5, background: '#22C76F', borderRadius: 99,
                    }} />
                  )}
                </motion.a>
              );
            })}
            <motion.a
              href="#contact"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.55, ease: E }}
              whileHover={{ scale: 1.08, boxShadow: '0 12px 40px rgba(34,199,111,0.4)', y: -3 }}
              whileTap={{ scale: 0.92 }}
              style={{
                padding: '9px 20px', borderRadius: 7,
                background: '#22C76F', color: '#050505',
                fontSize: 11, fontWeight: 800, textDecoration: 'none',
                letterSpacing: '0.08em', textTransform: 'uppercase',
                display: 'inline-block', position: 'relative', overflow: 'hidden',
              }}
            >
              <motion.span
                initial={{ x: '-120%' }}
                whileHover={{ x: '200%' }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)',
                  pointerEvents: 'none',
                }}
              />
              Start a Project
            </motion.a>
          </div>
        )}

        {/* Hamburger */}
        {isMobile && (
          <motion.button
            onClick={() => setMenuOpen(v => !v)}
            style={{ background: 'transparent', border: 'none', padding: 8, display: 'flex', flexDirection: 'column', gap: 5, cursor: 'pointer' }}
          >
            <motion.div animate={menuOpen ? { rotate: 45, y: 12 } : { rotate: 0, y: 0 }} style={{ width: 24, height: 2, background: '#f0f0f0', borderRadius: 1 }} />
            <motion.div animate={menuOpen ? { opacity: 0 } : { opacity: 1 }} style={{ width: 24, height: 2, background: '#f0f0f0', borderRadius: 1 }} />
            <motion.div animate={menuOpen ? { rotate: -45, y: -12 } : { rotate: 0, y: 0 }} style={{ width: 24, height: 2, background: '#f0f0f0', borderRadius: 1 }} />
          </motion.button>
        )}
      </motion.nav>

      {/* Mobile menu */}
      {isMobile && menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'fixed', top: 70, left: 0, right: 0, zIndex: 999,
            background: 'rgba(5,5,5,0.96)', backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
            padding: '16px 20px',
          }}
        >
          {links.map(link => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'block', padding: '12px 0', fontSize: 14, fontWeight: 600,
                color: link.label === 'About Us' ? '#22C76F' : '#888',
                textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.04)',
              }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setMenuOpen(false)}
            style={{
              display: 'block', marginTop: 8, padding: '14px 0', fontSize: 12, fontWeight: 800,
              background: '#22C76F', color: '#050505', textDecoration: 'none',
              textAlign: 'center', borderRadius: 7, letterSpacing: '0.08em', textTransform: 'uppercase',
            }}
          >
            Start a Project
          </a>
        </motion.div>
      )}
    </>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection() {
  const isMobile = useIsMobile();

  return (
    <section style={{
      position: 'relative', minHeight: '100vh',
      display: 'flex', alignItems: 'center',
      overflow: 'hidden', background: '#050505',
    }}>
      {/* Radial glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2.5, ease: 'easeOut' }}
        style={{
          position: 'absolute', top: '-15%', left: '50%',
          transform: 'translateX(-50%)',
          width: 900, height: 700,
          background: 'radial-gradient(ellipse, rgba(34,199,111,0.07) 0%, transparent 68%)',
          pointerEvents: 'none',
        }}
      />

      {/* Dot grid */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.022) 1px, transparent 1px)',
        backgroundSize: '44px 44px',
      }} />

      {/* Ghost UPCODO */}
      <motion.div
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 3, ease: E }}
        style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: 'clamp(90px, 20vw, 260px)',
          fontWeight: 900, letterSpacing: '-0.06em',
          color: 'transparent',
          WebkitTextStroke: '1px rgba(255,255,255,0.025)',
          fontFamily: 'var(--font-outfit)',
          userSelect: 'none', pointerEvents: 'none', whiteSpace: 'nowrap', zIndex: 0,
          opacity: 0.05,
        }}
      >
        UPCODO
      </motion.div>

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 10, width: '100%',
        padding: isMobile ? '130px 24px 80px' : '0 80px',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: isMobile ? 52 : 60,
        alignItems: 'center', minHeight: '100vh',
      }}>
        {/* Left */}
        <div>
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: E, delay: 0.3 }}
            style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 40 }}
          >
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, delay: 0.4, ease: E }}
              style={{ width: 36, height: 1, background: '#22C76F', transformOrigin: 'left' }}
            />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.42em', textTransform: 'uppercase', color: '#22C76F' }}>
              About UpCodo
            </span>
          </motion.div>

          {/* Heading — line-by-line */}
          <h1 style={{
            fontSize: isMobile ? 'clamp(44px,10vw,72px)' : 'clamp(58px,7.2vw,96px)',
            fontWeight: 900, letterSpacing: '-0.055em', lineHeight: 0.88,
            margin: '0 0 28px',
          }}>
            {(['People', 'Behind the', 'Precision.'] as const).map((line, i) => (
              <div key={i} style={{ display: 'block', overflow: 'hidden' }}>
                <motion.div
                  initial={{ y: '105%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.2, delay: 0.5 + i * 0.13, ease: E }}
                  style={{
                    display: 'block',
                    ...(i === 1 ? { color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.32)' } : {}),
                    ...(i === 2 ? { color: '#22C76F' } : {}),
                  }}
                >
                  {line}
                </motion.div>
              </div>
            ))}
          </h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease: E }}
            style={{
              color: '#666', fontSize: isMobile ? 14 : 15.5,
              lineHeight: 1.75, maxWidth: 440, letterSpacing: '-0.01em',
              marginBottom: 48,
            }}
          >
            A team of engineers, designers, and thinkers crafting premium digital
            products that scale with ambition and endure with integrity.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1, ease: E }}
            style={{ display: 'flex', gap: 12, flexDirection: isMobile ? 'column' : 'row' }}
          >
            <MagneticBtn primary href="#team">Meet the Team</MagneticBtn>
            <MagneticBtn href="#vision">Our Vision</MagneticBtn>
          </motion.div>
        </div>

        {/* Right: floating avatar cluster */}
        {!isMobile && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.6, delay: 0.4, ease: E }}
            style={{ position: 'relative', height: 520 }}
          >
            {/* Ambient glow */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%,-50%)',
              width: 440, height: 440, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(34,199,111,0.06) 0%, transparent 70%)',
              filter: 'blur(60px)', pointerEvents: 'none',
            }} />
            {/* Connecting ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%,-50%)',
                width: 340, height: 340, borderRadius: '50%',
                border: '1px solid rgba(34,199,111,0.07)',
                pointerEvents: 'none',
              }}
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%,-50%)',
                width: 220, height: 220, borderRadius: '50%',
                border: '1px solid rgba(167,139,250,0.06)',
                pointerEvents: 'none',
              }}
            />
            {HERO_AVATARS.map((av, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 + i * 0.1, ease: E }}
                style={{ position: 'absolute', left: `${av.x}%`, top: `${av.y}%` }}
              >
                <motion.div
                  animate={{ y: [0, -(6 + (i % 4) * 3), 0] }}
                  transition={{ duration: 3.2 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.35 }}
                  whileHover={{ scale: 1.18, zIndex: 20 }}
                  style={{
                    width: av.size, height: av.size, borderRadius: '50%',
                    border: `2px solid ${av.accent}66`,
                    boxShadow: `0 0 28px ${av.accent}33, 0 0 60px ${av.accent}12`,
                    position: 'relative', overflow: 'hidden',
                    cursor: 'default', flexShrink: 0,
                    background: '#111',
                  }}
                >
                  <Image
                    src={av.img}
                    alt={av.name}
                    fill
                    sizes={`${av.size}px`}
                    style={{ objectFit: 'cover', objectPosition: 'center top' }}
                  />
                  {/* Inner glow rim */}
                  <div style={{
                    position: 'absolute', inset: 0, borderRadius: '50%',
                    boxShadow: `inset 0 0 12px ${av.accent}22`,
                    pointerEvents: 'none',
                  }} />
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.6 }}
        style={{
          position: 'absolute', bottom: 40, left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, zIndex: 10,
        }}
      >
        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.3em', color: '#3a3a3a', textTransform: 'uppercase' }}>
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ width: 1, height: 36, background: 'linear-gradient(to bottom, #22C76F, transparent)' }}
        />
      </motion.div>
    </section>
  );
}

// ─── Vision Section ───────────────────────────────────────────────────────────
function VisionSection() {
  const ref    = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });
  const isMobile = useIsMobile();

  return (
    <section id="vision" ref={ref} style={{
      background: '#080808',
      padding: 'clamp(80px,10vw,140px) clamp(24px,5vw,80px)',
      position: 'relative', overflow: 'hidden',
      borderTop: '1px solid rgba(255,255,255,0.04)',
    }}>
      <div className="orb-a" style={{
        position: 'absolute', top: '-10%', right: '-5%',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(34,199,111,0.045) 0%, transparent 65%)',
        filter: 'blur(50px)', pointerEvents: 'none',
      }} />

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: 'clamp(40px,6vw,88px)', alignItems: 'center',
        maxWidth: 1240, margin: '0 auto',
      }}>
        {/* Left text */}
        <div>
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: E }}
            style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}
          >
            <motion.div
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.08, ease: E }}
              style={{ width: 36, height: 1, background: '#22C76F', transformOrigin: 'left' }}
            />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.42em', textTransform: 'uppercase', color: '#22C76F' }}>
              Our Vision
            </span>
          </motion.div>

          <h2 style={{
            fontSize: 'clamp(32px,4.5vw,58px)', fontWeight: 900,
            letterSpacing: '-0.05em', lineHeight: 0.96, margin: '0 0 28px',
          }}>
            <WordReveal text="Building the" inView={inView} delay={0.1} />
            <br />
            <WordReveal
              text="Future,"
              inView={inView} delay={0.22}
              style={{ color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.32)' }}
            />
            {' '}
            <WordReveal text="Today." inView={inView} delay={0.3} />
          </h2>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.36, ease: E }}
            style={{
              height: 1, maxWidth: 380,
              background: 'linear-gradient(90deg, rgba(34,199,111,0.5), transparent)',
              marginBottom: 28, transformOrigin: 'left',
            }}
          />

          {[
            "UpCodo Digital is Noida's premier application development studio. We exist to bridge the gap between breakthrough ideas and production-grade software that people love.",
            "Our team of 50+ engineers, designers, and strategists believes exceptional products are born at the intersection of technical depth and design intelligence.",
          ].map((para, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.42 + i * 0.14, ease: E }}
              style={{
                color: '#666', fontSize: 'clamp(13px,1.3vw,15px)',
                lineHeight: 1.82, letterSpacing: '-0.01em', marginBottom: 16,
              }}
            >
              {para}
            </motion.p>
          ))}
        </div>

        {/* Right visual */}
        <motion.div
          initial={{ opacity: 0, x: 40, scale: 0.96 }}
          animate={inView ? { opacity: 1, x: 0, scale: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.2, ease: E }}
          style={{ position: 'relative' }}
          whileHover={{ scale: 1.01 }}
        >
          {/* Frame */}
          <div style={{
            position: 'relative', borderRadius: 24, overflow: 'hidden',
            aspectRatio: '4/3',
            background: 'linear-gradient(135deg, #0f0f0f 0%, #0a0a0a 100%)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
            {/* Gradient overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(135deg, rgba(34,199,111,0.04) 0%, rgba(167,139,250,0.03) 100%)',
            }} />

            {/* Team photo grid */}
            <div style={{
              position: 'absolute', inset: 0,
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gridTemplateRows: 'repeat(3, 1fr)',
              gap: 8, padding: 24,
            }}>
              {TEAM.slice(0, 12).map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.55 + i * 0.055, type: 'spring', stiffness: 200, damping: 20 }}
                  whileHover={{ scale: 1.1, zIndex: 2 }}
                  style={{
                    borderRadius: 10,
                    border: `1px solid ${m.accent}33`,
                    overflow: 'hidden',
                    position: 'relative',
                    background: m.img ? '#111' : `linear-gradient(135deg, ${m.accent}22, #111)`,
                  }}
                >
                  {m.img ? (
                    <Image
                      src={m.img}
                      alt={m.name}
                      fill
                      sizes="80px"
                      style={{ objectFit: 'cover', objectPosition: 'center top' }}
                    />
                  ) : (
                    <div style={{
                      position: 'absolute', inset: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <span style={{ fontSize: 16, fontWeight: 900, color: m.accent, fontFamily: 'var(--font-outfit)' }}>
                        {m.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Bottom gradient */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: '45%',
              background: 'linear-gradient(to top, rgba(34,199,111,0.07), transparent)',
              pointerEvents: 'none',
            }} />
          </div>

          {/* Edge glow */}
          <div style={{
            position: 'absolute', inset: -2, borderRadius: 26, zIndex: -1,
            background: 'linear-gradient(135deg, rgba(34,199,111,0.18), transparent 55%, rgba(167,139,250,0.12))',
            filter: 'blur(12px)',
          }} />

          {/* Floating stat */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute', bottom: -22, right: -10,
              background: 'rgba(8,8,8,0.96)',
              border: '1px solid rgba(34,199,111,0.2)',
              borderRadius: 16, padding: '16px 20px',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
            }}
          >
            <div style={{ fontSize: 28, fontWeight: 900, color: '#22C76F', letterSpacing: '-0.05em', lineHeight: 1 }}>50+</div>
            <div style={{ fontSize: 9, fontWeight: 700, color: '#555', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: 5 }}>
              Team Members
            </div>
          </motion.div>

          {/* Second badge */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
            style={{
              position: 'absolute', top: -16, left: -10,
              background: 'rgba(8,8,8,0.96)',
              border: '1px solid rgba(167,139,250,0.2)',
              borderRadius: 14, padding: '12px 16px',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 16px 40px rgba(0,0,0,0.35)',
            }}
          >
            <div style={{ fontSize: 22, fontWeight: 900, color: '#a78bfa', letterSpacing: '-0.04em', lineHeight: 1 }}>98%</div>
            <div style={{ fontSize: 9, fontWeight: 700, color: '#555', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: 4 }}>
              Satisfaction
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Team Card ────────────────────────────────────────────────────────────────
function TeamCard({ member, index, inView }: { member: typeof TEAM[0]; index: number; inView: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const imgRef  = useRef<HTMLDivElement>(null);

  const row   = Math.floor(index / 4);
  const col   = index % 4;
  const delay = row * 0.08 + col * 0.06;

  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const sTX   = useSpring(tiltX, { stiffness: 280, damping: 28 });
  const sTY   = useSpring(tiltY, { stiffness: 280, damping: 28 });

  const initials = member.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.94 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.75, delay, ease: E }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        ref={cardRef}
        style={{ rotateX: sTX, rotateY: sTY, transformStyle: 'preserve-3d' }}
        whileHover={{ y: -10 }}
        transition={{ type: 'spring', stiffness: 220, damping: 22 }}
        onMouseMove={(e) => {
          if (!cardRef.current) return;
          const r = cardRef.current.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width;
          const y = (e.clientY - r.top)  / r.height;
          tiltX.set((y - 0.5) * -8);
          tiltY.set((x - 0.5) *  8);
          if (glowRef.current) {
            glowRef.current.style.left    = `${x * 100}%`;
            glowRef.current.style.top     = `${y * 100}%`;
            glowRef.current.style.opacity = '1';
          }
          if (imgRef.current)  imgRef.current.style.transform  = 'scale(1.07)';
          if (lineRef.current) lineRef.current.style.transform = 'scaleX(1)';
        }}
        onMouseLeave={() => {
          tiltX.set(0);
          tiltY.set(0);
          if (glowRef.current) glowRef.current.style.opacity = '0';
          if (imgRef.current)  imgRef.current.style.transform  = 'scale(1)';
          if (lineRef.current) lineRef.current.style.transform = 'scaleX(0)';
        }}
      >
        <div
          style={{
            position: 'relative', borderRadius: 18,
            aspectRatio: '3/4',
            border: `1px solid ${member.accent}22`,
            overflow: 'hidden',
            transition: 'border-color 0.35s, box-shadow 0.35s',
            boxShadow: `0 6px 28px rgba(0,0,0,0.45)`,
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.borderColor = `${member.accent}55`;
            (e.currentTarget as HTMLElement).style.boxShadow = `0 20px 60px rgba(0,0,0,0.65), 0 0 50px ${member.accent}22`;
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.borderColor = `${member.accent}22`;
            (e.currentTarget as HTMLElement).style.boxShadow = `0 6px 28px rgba(0,0,0,0.45)`;
          }}
        >
          {/* Photo / initials — fills entire card */}
          <div
            ref={imgRef}
            style={{
              position: 'absolute', inset: 0,
              transition: 'transform 0.55s cubic-bezier(0.22,1,0.36,1)',
              background: member.img ? '#111' : `linear-gradient(135deg, ${member.accent}28 0%, #0d0d0d 100%)`,
            }}
          >
            {member.img ? (
              <Image
                src={member.img}
                alt={member.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                style={{ objectFit: 'cover', objectPosition: 'center top' }}
              />
            ) : (
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{
                  fontSize: 'clamp(36px,5vw,52px)', fontWeight: 900,
                  color: member.accent, letterSpacing: '-0.04em',
                  fontFamily: 'var(--font-outfit)',
                  textShadow: `0 0 40px ${member.accent}66`,
                }}>
                  {initials}
                </span>
              </div>
            )}
          </div>

          {/* Deep gradient overlay — darkens bottom so text is readable */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 35%, rgba(0,0,0,0.08) 62%, transparent 100%)',
            pointerEvents: 'none', zIndex: 1,
          }} />

          {/* Accent corner glow top-right */}
          <div style={{
            position: 'absolute', top: 0, right: 0, width: 110, height: 110,
            background: `radial-gradient(circle at top right, ${member.accent}20, transparent 70%)`,
            pointerEvents: 'none', zIndex: 1,
          }} />

          {/* Cursor-tracked radial glow */}
          <div
            ref={glowRef}
            style={{
              position: 'absolute', width: 240, height: 240,
              transform: 'translate(-50%,-50%)',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${member.accent}22 0%, transparent 68%)`,
              pointerEvents: 'none', zIndex: 2, opacity: 0,
              transition: 'opacity 0.22s',
              mixBlendMode: 'soft-light',
            }}
          />

          {/* Name + role overlay at bottom */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: '14px 16px 16px',
            zIndex: 3,
          }}>
            {/* Animated accent underline */}
            <div
              ref={lineRef}
              style={{
                width: '100%', height: 1.5, borderRadius: 99, marginBottom: 9,
                background: `linear-gradient(90deg, ${member.accent}, transparent 75%)`,
                transform: 'scaleX(0)',
                transformOrigin: 'left',
                transition: 'transform 0.42s cubic-bezier(0.22,1,0.36,1)',
              }}
            />
            <div style={{
              fontSize: 13.5, fontWeight: 700, color: '#f0f0f0',
              letterSpacing: '-0.025em', lineHeight: 1.15, marginBottom: 4,
            }}>
              {member.name}
            </div>
            <div style={{
              fontSize: 9, fontWeight: 700, color: member.accent,
              letterSpacing: '0.1em', textTransform: 'uppercase', lineHeight: 1.2,
            }}>
              {member.role}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Team Section ─────────────────────────────────────────────────────────────
function TeamSection() {
  const ref    = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-8%' });
  const isMobile = useIsMobile();

  return (
    <section id="team" ref={ref} style={{
      background: '#050505',
      padding: 'clamp(80px,10vw,140px) clamp(24px,5vw,80px)',
      position: 'relative', overflow: 'hidden',
      borderTop: '1px solid rgba(255,255,255,0.04)',
    }}>
      <div className="orb-b" style={{
        position: 'absolute', bottom: '-10%', left: '-8%',
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(167,139,250,0.04) 0%, transparent 65%)',
        filter: 'blur(60px)', pointerEvents: 'none',
      }} />

      {/* Section header */}
      <div style={{ textAlign: 'center', marginBottom: 'clamp(48px,6vw,80px)', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: E }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 20 }}
        >
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.5, ease: E }}
            style={{ width: 32, height: 1, background: '#22C76F', transformOrigin: 'right' }}
          />
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.42em', textTransform: 'uppercase', color: '#22C76F' }}>
            The People
          </span>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.5, ease: E }}
            style={{ width: 32, height: 1, background: '#22C76F', transformOrigin: 'left' }}
          />
        </motion.div>

        <h2 style={{
          fontSize: 'clamp(34px,5vw,64px)', fontWeight: 900,
          letterSpacing: '-0.055em', lineHeight: 0.94, margin: '0 0 16px',
        }}>
          <WordReveal text="Meet the Architects" inView={inView} delay={0.1} />
          <br />
          <WordReveal
            text="of Your Vision"
            inView={inView} delay={0.28}
            style={{ color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.28)' }}
          />
        </h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.45, ease: E }}
          style={{ color: '#555', fontSize: 14, maxWidth: 480, margin: '0 auto' }}
        >
          Not a department. A collective of individuals who care deeply about craft.
        </motion.p>
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
        gap: isMobile ? 12 : 'clamp(12px,1.6vw,20px)',
        position: 'relative', zIndex: 1,
        maxWidth: 1240, margin: '0 auto',
      }}>
        {TEAM.map((member, i) => (
          <TeamCard key={member.name} member={member} index={i} inView={inView} />
        ))}
      </div>
    </section>
  );
}

// ─── Life @ UpCodo Section ────────────────────────────────────────────────────
const LIFE_TILES = [
  { label: 'Team Syncs',       caption: 'Daily standups, weekly strategy',   accent: '#22C76F', cols: 2, rows: 1, grad: 'linear-gradient(145deg, #1a1200 0%, #2d1f00 100%)' },
  { label: 'Design Sprints',   caption: 'Ideas from sketch to prototype',    accent: '#a78bfa', cols: 1, rows: 1, grad: 'linear-gradient(145deg, #0d0a1f 0%, #1a1335 100%)' },
  { label: 'Code Reviews',     caption: 'Every PR is a learning moment',     accent: '#38bdf8', cols: 1, rows: 2, grad: 'linear-gradient(145deg, #001a2d 0%, #002d47 100%)' },
  { label: 'Hackathons',       caption: '48 hrs of pure innovation',         accent: '#4ade80', cols: 1, rows: 1, grad: 'linear-gradient(145deg, #001a0a 0%, #002d15 100%)' },
  { label: 'Launch Days',      caption: 'The moment everything clicks',      accent: '#f43f5e', cols: 1, rows: 1, grad: 'linear-gradient(145deg, #1f000a 0%, #2d0015 100%)' },
  { label: 'Learning Sessions', caption: 'Grow every single week',           accent: '#2dd4bf', cols: 1, rows: 1, grad: 'linear-gradient(145deg, #001f1a 0%, #002d26 100%)' },
];

function LifeSection() {
  const ref    = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-8%' });
  const isMobile = useIsMobile();

  return (
    <section ref={ref} style={{
      background: '#080808',
      padding: 'clamp(80px,10vw,140px) clamp(24px,5vw,80px)',
      position: 'relative', overflow: 'hidden',
      borderTop: '1px solid rgba(255,255,255,0.04)',
    }}>
      {/* Section header */}
      <div style={{ textAlign: 'center', marginBottom: 'clamp(48px,6vw,72px)' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: E }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 20 }}
        >
          <motion.div
            initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.5, ease: E }}
            style={{ width: 32, height: 1, background: '#22C76F', transformOrigin: 'right' }}
          />
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.42em', textTransform: 'uppercase', color: '#22C76F' }}>
            Inside UpCodo
          </span>
          <motion.div
            initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.5, ease: E }}
            style={{ width: 32, height: 1, background: '#22C76F', transformOrigin: 'left' }}
          />
        </motion.div>
        <h2 style={{ fontSize: 'clamp(32px,4.5vw,58px)', fontWeight: 900, letterSpacing: '-0.055em', lineHeight: 0.96, margin: 0 }}>
          <WordReveal text="Life @ UpCodo" inView={inView} delay={0.1} />
        </h2>
      </div>

      {/* Bento grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
        gridAutoRows: isMobile ? '140px' : '180px',
        gap: isMobile ? 12 : 16,
        maxWidth: 1240, margin: '0 auto',
      }}>
        {LIFE_TILES.map((tile, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: i * 0.1, ease: E }}
            whileHover={{ scale: 1.03, zIndex: 2 }}
            style={{
              gridColumn: !isMobile && tile.cols === 2 ? 'span 2' : 'span 1',
              gridRow:    !isMobile && tile.rows === 2 ? 'span 2' : 'span 1',
              borderRadius: 20,
              background: tile.grad,
              border: `1px solid ${tile.accent}22`,
              position: 'relative', overflow: 'hidden',
              cursor: 'default',
            }}
          >
            {/* Inner glow */}
            <div style={{
              position: 'absolute', top: '-30%', left: '-20%',
              width: '80%', height: '80%', borderRadius: '50%',
              background: `radial-gradient(circle, ${tile.accent}18, transparent 70%)`,
              filter: 'blur(30px)', pointerEvents: 'none',
            }} />

            {/* Label */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease: E }}
              style={{
                position: 'absolute', bottom: 20, left: 20, right: 20,
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 800, color: tile.accent, letterSpacing: '-0.03em', marginBottom: 4 }}>
                {tile.label}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '-0.01em', fontWeight: 500 }}>
                {tile.caption}
              </div>
            </motion.div>

            {/* Corner number */}
            <div style={{
              position: 'absolute', top: 16, right: 18,
              fontSize: 40, fontWeight: 900, lineHeight: 1,
              color: `${tile.accent}12`, letterSpacing: '-0.06em',
              fontFamily: 'var(--font-outfit)',
              userSelect: 'none',
            }}>
              {String(i + 1).padStart(2, '0')}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Why Section ──────────────────────────────────────────────────────────────
function WhySection() {
  const ref    = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-8%' });
  const isMobile = useIsMobile();

  return (
    <section ref={ref} style={{
      background: '#050505',
      padding: 'clamp(80px,10vw,140px) clamp(24px,5vw,80px)',
      position: 'relative', overflow: 'hidden',
      borderTop: '1px solid rgba(255,255,255,0.04)',
    }}>
      <div className="orb-a" style={{
        position: 'absolute', top: '10%', right: '-5%',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(34,199,111,0.04) 0%, transparent 65%)',
        filter: 'blur(60px)', pointerEvents: 'none',
      }} />

      {/* Section header */}
      <div style={{ textAlign: 'center', marginBottom: 'clamp(48px,6vw,80px)' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: E }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 20 }}
        >
          <motion.div initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.5, ease: E }}
            style={{ width: 32, height: 1, background: '#22C76F', transformOrigin: 'right' }}
          />
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.42em', textTransform: 'uppercase', color: '#22C76F' }}>
            Why Choose Us
          </span>
          <motion.div initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.5, ease: E }}
            style={{ width: 32, height: 1, background: '#22C76F', transformOrigin: 'left' }}
          />
        </motion.div>
        <h2 style={{ fontSize: 'clamp(32px,4.5vw,58px)', fontWeight: 900, letterSpacing: '-0.055em', lineHeight: 0.96, margin: 0 }}>
          <WordReveal text="The UpCodo" inView={inView} delay={0.1} />
          {' '}
          <WordReveal
            text="Difference"
            inView={inView} delay={0.26}
            style={{ color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.3)' }}
          />
        </h2>
      </div>

      {/* Cards grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
        gap: isMobile ? 16 : 'clamp(14px,1.8vw,24px)',
        maxWidth: 1240, margin: '0 auto',
        position: 'relative', zIndex: 1,
      }}>
        {WHY.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 60, scale: 0.96 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.75, delay: i * 0.1, ease: E }}
            whileHover={{
              y: -10,
              boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(34,199,111,0.22)',
              borderColor: 'rgba(34,199,111,0.28)',
            }}
            style={{
              background: 'linear-gradient(145deg, #0d0d0d 0%, #0a0a0a 100%)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 20, padding: '32px 28px',
              position: 'relative', overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              cursor: 'default',
              transition: 'border-color 0.3s, box-shadow 0.3s',
            }}
          >
            {/* Top shimmer line */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 1,
              background: 'linear-gradient(90deg, transparent, rgba(34,199,111,0.3), transparent)',
            }} />

            {/* Symbol */}
            <div style={{
              fontSize: 28, marginBottom: 20, lineHeight: 1,
              filter: 'drop-shadow(0 0 12px rgba(34,199,111,0.4))',
            }}>
              {item.sym}
            </div>

            {/* Ghost number */}
            <div style={{
              position: 'absolute', top: 16, right: 20,
              fontSize: 52, fontWeight: 900, lineHeight: 1,
              color: 'rgba(255,255,255,0.022)',
              letterSpacing: '-0.06em',
              fontFamily: 'var(--font-outfit)', userSelect: 'none',
            }}>
              {String(i + 1).padStart(2, '0')}
            </div>

            <h3 style={{
              fontSize: 17, fontWeight: 800, color: '#e0e0e0',
              letterSpacing: '-0.035em', marginBottom: 12, lineHeight: 1.1,
            }}>
              {item.title}
            </h3>
            <p style={{
              fontSize: 13.5, color: '#575757', lineHeight: 1.75,
              letterSpacing: '-0.01em',
            }}>
              {item.body}
            </p>

            {/* Hover glow corner */}
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              style={{
                position: 'absolute', bottom: 0, right: 0,
                width: 100, height: 100,
                background: 'radial-gradient(circle at bottom right, rgba(34,199,111,0.08), transparent 70%)',
                pointerEvents: 'none',
              }}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Mobile Process Step (extracted to obey hooks rules) ─────────────────────
function MobileProcessStep({ step }: { step: typeof PROCESS[0] }) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-20%' });

  return (
    <div ref={ref} style={{ display: 'flex', gap: 20, alignItems: 'flex-start', paddingLeft: 32 }}>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
        style={{
          position: 'absolute', left: 1,
          width: 18, height: 18, borderRadius: '50%',
          background: '#22C76F',
          boxShadow: '0 0 16px rgba(34,199,111,0.5)',
          flexShrink: 0, marginTop: 20,
        }}
      />
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, ease: E }}
        style={{
          background: 'linear-gradient(145deg, #0e0e0e, #0a0a0a)',
          border: '1px solid rgba(34,199,111,0.12)',
          borderRadius: 16, padding: '20px',
          position: 'relative', overflow: 'hidden', width: '100%',
        }}
      >
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(34,199,111,0.22), transparent)',
        }} />
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.28em', color: '#22C76F', textTransform: 'uppercase', marginBottom: 8 }}>{step.n}</div>
        <div style={{ fontSize: 16, fontWeight: 800, color: '#e2e2e2', letterSpacing: '-0.03em', marginBottom: 8 }}>{step.title}</div>
        <div style={{ fontSize: 13, color: '#575757', lineHeight: 1.7 }}>{step.body}</div>
      </motion.div>
    </div>
  );
}

// ─── Process Section ──────────────────────────────────────────────────────────
function ProcessStep({ step, index, isLeft }: { step: typeof PROCESS[0]; index: number; isLeft: boolean }) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15%' });

  return (
    <div ref={ref} style={{
      display: 'grid',
      gridTemplateColumns: '1fr 60px 1fr',
      alignItems: 'start',
      gap: 0,
    }}>
      {/* Left content */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -48 : 0 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, ease: E }}
        style={{
          padding: '0 clamp(20px,3vw,40px) 0 0',
          textAlign: 'right',
          visibility: isLeft ? 'visible' : 'hidden',
        }}
      >
        <div style={{
          background: 'linear-gradient(145deg, #0e0e0e, #0a0a0a)',
          border: `1px solid rgba(34,199,111,0.14)`,
          borderRadius: 16, padding: '24px 24px 24px 28px',
          position: 'relative', overflow: 'hidden',
          boxShadow: inView ? '0 0 40px rgba(34,199,111,0.06)' : 'none',
          textAlign: 'left',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(34,199,111,0.25), transparent)',
          }} />
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.28em', color: '#22C76F', textTransform: 'uppercase', marginBottom: 10 }}>
            {step.n}
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#e2e2e2', letterSpacing: '-0.03em', marginBottom: 10, lineHeight: 1.1 }}>
            {step.title}
          </div>
          <div style={{ fontSize: 13.5, color: '#575757', lineHeight: 1.72, letterSpacing: '-0.01em' }}>
            {step.body}
          </div>
        </div>
      </motion.div>

      {/* Center dot */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 28 }}>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2, type: 'spring', stiffness: 200 }}
          style={{
            width: 20, height: 20, borderRadius: '50%',
            background: '#22C76F',
            boxShadow: '0 0 20px rgba(34,199,111,0.6), 0 0 40px rgba(34,199,111,0.25)',
            zIndex: 2, flexShrink: 0,
          }}
        />
      </div>

      {/* Right content */}
      <motion.div
        initial={{ opacity: 0, x: !isLeft ? 48 : 0 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, ease: E }}
        style={{
          padding: '0 0 0 clamp(20px,3vw,40px)',
          visibility: !isLeft ? 'visible' : 'hidden',
        }}
      >
        <div style={{
          background: 'linear-gradient(145deg, #0e0e0e, #0a0a0a)',
          border: `1px solid rgba(34,199,111,0.14)`,
          borderRadius: 16, padding: '24px 28px 24px 24px',
          position: 'relative', overflow: 'hidden',
          boxShadow: inView ? '0 0 40px rgba(34,199,111,0.06)' : 'none',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(34,199,111,0.25), transparent)',
          }} />
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.28em', color: '#22C76F', textTransform: 'uppercase', marginBottom: 10 }}>
            {step.n}
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#e2e2e2', letterSpacing: '-0.03em', marginBottom: 10, lineHeight: 1.1 }}>
            {step.title}
          </div>
          <div style={{ fontSize: 13.5, color: '#575757', lineHeight: 1.72, letterSpacing: '-0.01em' }}>
            {step.body}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function ProcessSection() {
  const ref       = useRef<HTMLElement>(null);
  const lineRef   = useRef<HTMLDivElement>(null);
  const inView    = useInView(ref, { once: true, margin: '-5%' });
  const isMobile  = useIsMobile();

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const lineH = useTransform(scrollYProgress, [0.05, 0.95], ['0%', '100%']);

  return (
    <section ref={ref} style={{
      background: '#080808',
      padding: 'clamp(80px,10vw,140px) clamp(24px,5vw,80px)',
      position: 'relative', overflow: 'hidden',
      borderTop: '1px solid rgba(255,255,255,0.04)',
    }}>
      {/* Section header */}
      <div style={{ textAlign: 'center', marginBottom: 'clamp(52px,7vw,88px)' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: E }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 20 }}
        >
          <motion.div initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}} transition={{ duration: 0.5, ease: E }}
            style={{ width: 32, height: 1, background: '#22C76F', transformOrigin: 'right' }} />
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.42em', textTransform: 'uppercase', color: '#22C76F' }}>
            How We Work
          </span>
          <motion.div initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}} transition={{ duration: 0.5, ease: E }}
            style={{ width: 32, height: 1, background: '#22C76F', transformOrigin: 'left' }} />
        </motion.div>
        <h2 style={{ fontSize: 'clamp(32px,4.5vw,58px)', fontWeight: 900, letterSpacing: '-0.055em', lineHeight: 0.96, margin: 0 }}>
          <WordReveal text="Our Process" inView={inView} delay={0.1} />
        </h2>
      </div>

      {/* Timeline */}
      {isMobile ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 600, margin: '0 auto', position: 'relative' }}>
          {/* Vertical line */}
          <div style={{ position: 'absolute', left: 10, top: 0, bottom: 0, width: 1, background: 'rgba(255,255,255,0.05)' }} />
          <motion.div
            style={{ position: 'absolute', left: 10, top: 0, width: 1, height: lineH, background: 'linear-gradient(to bottom, #22C76F, rgba(34,199,111,0.2))', transformOrigin: 'top' }}
          />
          {PROCESS.map((step, i) => (
            <MobileProcessStep key={i} step={step} />
          ))}
        </div>
      ) : (
        <div style={{ position: 'relative', maxWidth: 900, margin: '0 auto' }}>
          {/* Center spine */}
          <div style={{
            position: 'absolute', left: '50%', top: 0, bottom: 0,
            width: 1, background: 'rgba(255,255,255,0.05)',
            transform: 'translateX(-50%)',
          }} />
          <motion.div style={{
            position: 'absolute', left: '50%', top: 0,
            width: 1, height: lineH,
            background: 'linear-gradient(to bottom, #22C76F, rgba(34,199,111,0.15))',
            transform: 'translateX(-50%)',
            transformOrigin: 'top',
          }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(24px,3vw,36px)' }}>
            {PROCESS.map((step, i) => (
              <ProcessStep key={i} step={step} index={i} isLeft={i % 2 === 0} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

// ─── CTA Section ──────────────────────────────────────────────────────────────
function CTASection() {
  const ref    = useRef<HTMLElement>(null);
  const inView = useInView(ref, { margin: '-10%' });
  const isMobile = useIsMobile();

  return (
    <section id="contact" ref={ref} style={{
      position: 'relative', width: '100%',
      padding: 'clamp(80px,10vw,140px) clamp(24px,5vw,80px)',
      background: '#050505',
      borderTop: '1px solid rgba(255,255,255,0.04)',
      overflow: 'hidden',
    }}>
      {/* Orbs */}
      <div className="orb-a" style={{
        position: 'absolute', top: '-10%', left: '-5%',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(34,199,111,0.07) 0%, transparent 65%)',
        filter: 'blur(50px)', pointerEvents: 'none', zIndex: 0,
      }} />
      <div className="orb-b" style={{
        position: 'absolute', bottom: '-15%', right: '-8%',
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(167,139,250,0.06) 0%, transparent 65%)',
        filter: 'blur(50px)', pointerEvents: 'none', zIndex: 0,
      }} />

      {/* Dot grid */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.022) 1px, transparent 1px)',
        backgroundSize: '44px 44px', opacity: isMobile ? 0.3 : 0.55,
      }} />

      {/* Ghost watermark */}
      {!isMobile && (
        <motion.div
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1.8, delay: 0.2 }}
          style={{
            position: 'absolute', right: '-1%', bottom: '4%',
            fontSize: 'clamp(90px,15vw,220px)', fontWeight: 900,
            letterSpacing: '-0.07em', lineHeight: 1, color: 'transparent',
            WebkitTextStroke: '1px rgba(255,255,255,0.025)',
            userSelect: 'none', pointerEvents: 'none', zIndex: 1,
            fontFamily: 'var(--font-outfit)',
          }}
        >
          UPCODO
        </motion.div>
      )}

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: E }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 36 }}
        >
          <motion.div initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.08, ease: E }}
            style={{ width: 36, height: 1, background: '#22C76F', transformOrigin: 'right' }}
          />
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.42em', textTransform: 'uppercase', color: '#22C76F' }}>
            Ready to build?
          </span>
          <motion.div initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.08, ease: E }}
            style={{ width: 36, height: 1, background: '#22C76F', transformOrigin: 'left' }}
          />
        </motion.div>

        <h2 style={{
          fontSize: isMobile ? 'clamp(36px,8vw,56px)' : 'clamp(48px,7vw,80px)',
          fontWeight: 900, letterSpacing: '-0.055em', lineHeight: 0.9,
          margin: '0 0 32px',
        }}>
          <WordReveal text="Let's Build Something" inView={inView} delay={0.05} />
          <br />
          <WordReveal
            text="Exceptional Together"
            inView={inView} delay={0.22}
            style={{ color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.28)' }}
          />
        </h2>

        <motion.div
          initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.9, delay: 0.4, ease: E }}
          style={{
            height: 1, maxWidth: 400, margin: '0 auto 36px',
            background: 'linear-gradient(90deg, transparent, rgba(34,199,111,0.45), transparent)',
            transformOrigin: 'center',
          }}
        />

        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.48, ease: E }}
          style={{
            color: '#666', fontSize: 'clamp(13px,1.3vw,15px)',
            lineHeight: 1.8, letterSpacing: '-0.01em', marginBottom: 44,
          }}
        >
          From architecture to deployment — we take your most ambitious bets and ship them.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.56, ease: E }}
          style={{ display: 'flex', gap: 12, justifyContent: 'center', flexDirection: isMobile ? 'column' : 'row' }}
        >
          <MagneticBtn primary href="#contact">Free Consultation</MagneticBtn>
          <MagneticBtn href="/">View Our Work</MagneticBtn>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function AboutPage() {
  return (
    <main style={{ background: '#050505', minHeight: '100dvh', width: '100%', color: '#f0f0f0' }}>
      <AnimatedCursor />
      <Navigation />
      <HeroSection />
      <VisionSection />
      <TeamSection />
      <LifeSection />
      <WhySection />
      <ProcessSection />
      <CTASection />
      <Footer />
    </main>
  );
}
