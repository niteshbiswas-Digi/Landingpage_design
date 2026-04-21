'use client';
import { useRef, useEffect, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import RevealCanvas from '../components/RevealCanvas';
import ProjectsSection from '../components/ProjectsSection';
import TestimonialsSection from '../components/TestimonialsSection';
import AnimatedCursor from '../components/AnimatedCursor';

const NAV_LINKS = ['Services', 'Work', 'Process', 'About'];

const STATS = [
  { value: '50+',   label: 'Projects Delivered'       },
  { value: '98%',   label: 'Client Satisfaction'      },
  { value: '15+',   label: 'Years Combined Experience' },
  { value: '100K+', label: 'Lines of Code'             },
];

/* ── Count-up hook ── */
function useCountUp(target: string, active: boolean) {
  const [display, setDisplay] = useState('0');
  const ran = useRef(false);

  useEffect(() => {
    if (!active || ran.current) return;
    ran.current = true;
    const m = target.match(/^([\d.]+)(.*)$/);
    if (!m) { setDisplay(target); return; }
    const num  = parseFloat(m[1]);
    const sfx  = m[2];
    const dur  = 1800;
    const t0   = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3); // ease-out cubic
      setDisplay(Math.round(num * e) + sfx);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, target]);

  return display;
}

/* ── Word-reveal component ── */
function WordReveal({
  text, inView, delay = 0, style,
}: { text: string; inView: boolean; delay?: number; style?: React.CSSProperties }) {
  const words = text.split(' ');
  return (
    <span style={{ display: 'inline', ...style }}>
      {words.map((word, i) => (
        <span
          key={i}
          style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', lineHeight: 'inherit' }}
        >
          <motion.span
            style={{ display: 'inline-block' }}
            initial={{ y: '112%', opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.92, delay: delay + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
          >
            {word}{i < words.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* ── Magnetic button ── */
function MagneticBtn({
  children, primary, onClick,
}: { children: React.ReactNode; primary?: boolean; onClick?: () => void }) {
  const ref  = useRef<HTMLButtonElement>(null);
  const mx   = useMotionValue(0);
  const my   = useMotionValue(0);
  const sx   = useSpring(mx, { stiffness: 180, damping: 14 });
  const sy   = useSpring(my, { stiffness: 180, damping: 14 });

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      style={{
        x: sx, y: sy,
        padding: '18px 48px', borderRadius: 10,
        background: primary ? '#f0f0f0' : 'transparent',
        color: primary ? '#050505' : '#606060',
        fontWeight: primary ? 800 : 700,
        fontSize: 14, letterSpacing: '-0.01em',
        border: primary ? 'none' : '1px solid rgba(255,255,255,0.08)',
        fontFamily: 'var(--font-outfit), sans-serif',
        position: 'relative', overflow: 'hidden',
      }}
      onMouseMove={(e) => {
        if (!ref.current) return;
        const r = ref.current.getBoundingClientRect();
        mx.set((e.clientX - (r.left + r.width  / 2)) * 0.28);
        my.set((e.clientY - (r.top  + r.height / 2)) * 0.28);
      }}
      onMouseLeave={() => { mx.set(0); my.set(0); }}
      whileHover={primary
        ? { boxShadow: '0 16px 50px rgba(245,166,35,0.28)', scale: 1.03 }
        : { borderColor: 'rgba(245,166,35,0.4)', color: '#e0e0e0' }
      }
      whileTap={{ scale: 0.95, y: 2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Shimmer sweep on primary */}
      {primary && (
        <motion.span
          initial={{ x: '-120%', skewX: '-20deg' }}
          whileHover={{ x: '200%' }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.35) 50%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
      )}
      {children}
    </motion.button>
  );
}

/* ── Stat item with count-up ── */
function StatItem({ stat, index, inView }: { stat: typeof STATS[0]; index: number; inView: boolean }) {
  const display = useCountUp(stat.value, inView);
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -5 }}
      style={{
        borderLeft: index > 0 ? '1px solid rgba(255,255,255,0.04)' : 'none',
        paddingLeft: index > 0 ? 'clamp(24px, 3vw, 52px)' : 0,
      }}
    >
      <div style={{
        fontSize: 'clamp(32px, 4vw, 58px)',
        fontWeight: 900, letterSpacing: '-0.05em',
        lineHeight: 1, marginBottom: 10,
        background: 'linear-gradient(135deg, #ffffff 0%, #aaaaaa 100%)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        {display}
      </div>
      <div style={{
        fontSize: 11, color: '#888',
        letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700,
      }}>
        {stat.label}
      </div>
    </motion.div>
  );
}

function StatsBar() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-5%' });

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        background: '#080808',
        padding: 'clamp(24px, 3.5vw, 52px) clamp(24px, 5vw, 80px)',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 0,
        overflow: 'hidden',
      }}
    >
      {/* Scan line — single pass CSS animation */}
      <div style={{
        position: 'absolute', left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(245,166,35,0.4), transparent)',
        animation: 'scan-line 2.4s ease-in-out 0.3s 1 forwards',
        zIndex: 2, pointerEvents: 'none',
      }} />

      {STATS.map((stat, i) => (
        <StatItem key={stat.label} stat={stat} index={i} inView={inView} />
      ))}
    </div>
  );
}

/* ── CTA floating orbs (perpetual — isolated React.memo) ── */
import { memo } from 'react';
const CTAOrbs = memo(function CTAOrbs() {
  return (
    <>
      <div className="orb-a" style={{
        position: 'absolute', top: '-10%', left: '-5%',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245,166,35,0.07) 0%, transparent 65%)',
        pointerEvents: 'none', zIndex: 0,
      }} />
      <div className="orb-b" style={{
        position: 'absolute', bottom: '-15%', right: '-8%',
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(167,139,250,0.06) 0%, transparent 65%)',
        pointerEvents: 'none', zIndex: 0,
      }} />
    </>
  );
});

function CTASection() {
  const ref    = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });

  return (
    <section
      ref={ref}
      style={{
        position: 'relative', width: '100%',
        padding: 'clamp(72px, 9vw, 130px) clamp(24px, 5vw, 80px)',
        background: '#050505',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        overflow: 'hidden',
      }}
    >
      <CTAOrbs />

      {/* Dot grid */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.022) 1px, transparent 1px)',
        backgroundSize: '44px 44px',
        opacity: 0.55,
      }} />

      {/* Ghost watermark */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 1.8, delay: 0.2 }}
        style={{
          position: 'absolute', right: '-1%', bottom: '4%',
          fontSize: 'clamp(90px, 15vw, 220px)',
          fontWeight: 900, letterSpacing: '-0.07em', lineHeight: 1,
          color: 'transparent',
          WebkitTextStroke: '1px rgba(255,255,255,0.028)',
          userSelect: 'none', pointerEvents: 'none',
          zIndex: 1, fontFamily: 'var(--font-outfit), sans-serif',
        }}
      >
        UPCODO
      </motion.div>

      <div style={{ position: 'relative', zIndex: 10, maxWidth: 940 }}>

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}
        >
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            style={{ width: 36, height: 1, background: '#f5a623', transformOrigin: 'left' }}
          />
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '0.42em',
            textTransform: 'uppercase', color: '#f5a623',
          }}>
            Ready to build?
          </span>
        </motion.div>

        {/* Headline — outline text effect for ghost lines */}
        <h2 style={{
          fontSize: 'clamp(50px, 7.8vw, 118px)',
          fontWeight: 900, letterSpacing: '-0.065em', lineHeight: 0.88,
          margin: '0 0 36px',
        }}>
          <WordReveal text="Let's build" inView={inView} delay={0.05} />
          <br />
          <WordReveal
            text="something"
            inView={inView}
            delay={0.22}
            style={{ color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.28)' }}
          />
          <br />
          <WordReveal
            text="impossible."
            inView={inView}
            delay={0.38}
            style={{ color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.18)' }}
          />
        </h2>

        {/* Thin gold rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.9, delay: 0.48, ease: [0.16, 1, 0.3, 1] }}
          style={{
            height: 1, maxWidth: 480,
            background: 'linear-gradient(90deg, rgba(245,166,35,0.55) 0%, rgba(245,166,35,0.12) 55%, transparent 100%)',
            marginBottom: 44, transformOrigin: 'left',
          }}
        />

        {/* Bottom row: subtitle + buttons side by side */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'clamp(32px, 5vw, 72px)', flexWrap: 'wrap' }}>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.52, ease: [0.16, 1, 0.3, 1] }}
            style={{
              color: '#777', fontSize: 'clamp(13px, 1.3vw, 15px)',
              maxWidth: 300, lineHeight: 1.8, letterSpacing: '-0.01em', margin: 0,
            }}
          >
            From architecture to deployment — we take your most ambitious technical bets and ship them.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}
          >
            <MagneticBtn primary>Free Consultation</MagneticBtn>
            <MagneticBtn>View Portfolio</MagneticBtn>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const ref    = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.footer
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      style={{ background: '#050505', borderTop: '1px solid rgba(255,255,255,0.05)' }}
    >
      {/* Main grid */}
      <div style={{
        padding: 'clamp(44px, 5.5vw, 72px) clamp(24px, 5vw, 80px)',
        display: 'grid',
        gridTemplateColumns: '1.8fr 1fr 1fr',
        gap: 'clamp(28px, 4vw, 56px)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}>
        {/* Brand column */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              border: '1.5px solid rgba(245,166,35,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, boxShadow: '0 0 14px rgba(245,166,35,0.1)',
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f5a623" strokeWidth="2.5">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" stroke="rgba(255,255,255,0.35)" />
              </svg>
            </div>
            <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: '-0.04em', textTransform: 'uppercase', color: '#e8e8e8' }}>
              UP<span style={{ color: '#f5a623' }}>CODO</span>
            </span>
          </div>
          <p style={{
            color: '#606060', fontSize: 13, lineHeight: 1.78,
            maxWidth: 248, letterSpacing: '-0.01em', marginBottom: 24,
          }}>
            Transforming ambitious ideas into cutting-edge digital products. Building for the world from Noida.
          </p>
          <div style={{ width: 36, height: 1, background: 'rgba(245,166,35,0.25)' }} />
        </div>

        {/* Services */}
        <div>
          <p style={{
            fontSize: 9, fontWeight: 700, letterSpacing: '0.38em',
            textTransform: 'uppercase', color: '#555', marginBottom: 20,
          }}>
            Services
          </p>
          {['Mobile Apps', 'Web Development', 'AI Solutions', 'UI/UX Design'].map(link => (
            <a
              key={link} href="#"
              style={{
                display: 'block', fontSize: 13, color: '#666', fontWeight: 500,
                textDecoration: 'none', marginBottom: 11, letterSpacing: '-0.01em',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#f5a623')}
              onMouseLeave={e => (e.currentTarget.style.color = '#666')}
            >
              {link}
            </a>
          ))}
        </div>

        {/* Company */}
        <div>
          <p style={{
            fontSize: 9, fontWeight: 700, letterSpacing: '0.38em',
            textTransform: 'uppercase', color: '#555', marginBottom: 20,
          }}>
            Company
          </p>
          {['About', 'Work', 'Process', 'Contact', 'GitHub'].map(link => (
            <a
              key={link} href="#"
              style={{
                display: 'block', fontSize: 13, color: '#666', fontWeight: 500,
                textDecoration: 'none', marginBottom: 11, letterSpacing: '-0.01em',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#f5a623')}
              onMouseLeave={e => (e.currentTarget.style.color = '#666')}
            >
              {link}
            </a>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        padding: 'clamp(14px, 1.8vw, 22px) clamp(24px, 5vw, 80px)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 12,
      }}>
        <span style={{ fontSize: 10, color: '#4a4a4a', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          © 2026 UpCodo Digital · All rights reserved
        </span>
        <div style={{ display: 'flex', gap: 28 }}>
          {['Privacy', 'Terms'].map(link => (
            <a
              key={link} href="#"
              style={{
                fontSize: 10, color: '#4a4a4a', fontWeight: 700,
                letterSpacing: '0.18em', textTransform: 'uppercase', textDecoration: 'none',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#f5a623')}
              onMouseLeave={e => (e.currentTarget.style.color = '#4a4a4a')}
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </motion.footer>
  );
}

export default function Home() {
  return (
    <main style={{ background: '#050505', minHeight: '100dvh', width: '100%', color: '#f0f0f0' }}>

      <AnimatedCursor />

      {/* ── Animated Nav entry ── */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 48px',
          background: 'rgba(5,5,5,0.8)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        {/* Logo */}
        <motion.div
          style={{ display: 'flex', alignItems: 'center', gap: 10 }}
          whileHover={{ scale: 1.03 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        >
          <div style={{
            width: 30, height: 30, borderRadius: 9,
            border: '1.5px solid #f5a623',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 18px rgba(245,166,35,0.22)', flexShrink: 0,
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f5a623" strokeWidth="2.5">
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" stroke="rgba(255,255,255,0.35)" />
            </svg>
          </div>
          <span style={{ color: '#ffffff', fontSize: 14, fontWeight: 800, letterSpacing: '-0.04em', textTransform: 'uppercase' }}>
            UP<span style={{ color: '#f5a623' }}>CODO</span>
          </span>
        </motion.div>

        {/* Nav links + CTA */}
        <div style={{ display: 'flex', gap: 36, alignItems: 'center' }}>
          {NAV_LINKS.map((link, i) => (
            <motion.a
              key={link}
              href="#"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontSize: 12, fontWeight: 600, color: '#888',
                textDecoration: 'none', letterSpacing: '0.02em',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#f0f0f0')}
              onMouseLeave={e => (e.currentTarget.style.color = '#888')}
            >
              {link}
            </motion.a>
          ))}
          <motion.a
            href="#"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.05, boxShadow: '0 0 24px rgba(245,166,35,0.35)' }}
            whileTap={{ scale: 0.95, y: 1 }}
            style={{
              padding: '9px 20px', borderRadius: 7,
              background: '#f5a623', color: '#050505',
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
      </motion.nav>

      {/* ── Hero Scroll Sequence ── */}
      <RevealCanvas />

      {/* ── Stats Bar with count-up ── */}
      <StatsBar />

      {/* ── Projects Bento Grid ── */}
      <ProjectsSection />

      {/* ── Client Testimonials ── */}
      <TestimonialsSection />

      {/* ── Final CTA ── */}
      <CTASection />

      {/* ── Footer ── */}
      <Footer />

    </main>
  );
}
