'use client';
import { useRef, useEffect, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import RevealCanvas from '../components/RevealCanvas';
import ServicesSection from '../components/ServicesSection';
import ProjectsSection from '../components/ProjectsSection';
import TestimonialsSection from '../components/TestimonialsSection';
import CustomerReviewsSection from '../components/CustomerReviewsSection';
import BlogSection from '../components/BlogSection';
import AnimatedCursor from '../components/AnimatedCursor';
import Footer from '../components/Footer';

const NAV_LINKS = [
  { label: 'Home',      href: '/'       },
  { label: 'About Us',  href: '/about'  },
  { label: 'Services',  href: '/services'   },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Blog',      href: '#'       },
];

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

/* ── Mobile check hook ── */
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
  const isMobile = useIsMobile();

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      style={{
        x: sx, y: sy,
        padding: isMobile ? '14px 24px' : '18px 48px', borderRadius: 10,
        background: primary ? '#f0f0f0' : 'transparent',
        color: primary ? '#050505' : '#606060',
        fontWeight: primary ? 800 : 700,
        fontSize: isMobile ? 12 : 14, letterSpacing: '-0.01em',
        border: primary ? 'none' : '1px solid rgba(255,255,255,0.08)',
        fontFamily: 'var(--font-outfit), sans-serif',
        position: 'relative', overflow: 'hidden',
        width: isMobile ? '100%' : 'auto',
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
  const isMobile = useIsMobile();

  const shouldShowBorder = !isMobile && index > 0;
  const shouldShowPadding = !isMobile && index > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.8, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -8, scale: 1.05 }}
      style={{
        borderLeft: shouldShowBorder ? '1px solid rgba(255,255,255,0.04)' : 'none',
        paddingLeft: shouldShowPadding ? 'clamp(24px, 3vw, 52px)' : 0,
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
  const isMobile = useIsMobile();

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
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
        gap: isMobile ? 'clamp(32px, 5vw, 48px)' : 0,
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
  const inView = useInView(ref, { margin: '-10%' });
  const isMobile = useIsMobile();

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
      {!isMobile && <CTAOrbs />}

      {/* Dot grid */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.022) 1px, transparent 1px)',
        backgroundSize: '44px 44px',
        opacity: isMobile ? 0.3 : 0.55,
      }} />

      {/* Ghost watermark */}
      {!isMobile && (
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
      )}

      <div style={{ position: 'relative', zIndex: 10, display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 'clamp(40px, 5vw, 80px)', alignItems: isMobile ? 'flex-start' : 'center' }}>

        <div>
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
          fontSize: isMobile ? 'clamp(32px, 6vw, 118px)' : 'clamp(50px, 7.8vw, 118px)',
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
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'stretch' : 'flex-end', gap: isMobile ? '20px' : 'clamp(32px, 5vw, 72px)', flexWrap: 'wrap' }}>
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
            style={{ display: 'flex', gap: 12, flexDirection: isMobile ? 'column' : 'row', flexWrap: 'wrap', width: isMobile ? '100%' : 'auto' }}
          >
            <MagneticBtn primary>Free Consultation</MagneticBtn>
            <MagneticBtn>View Portfolio</MagneticBtn>
          </motion.div>
        </div>
        </div>

        {/* Right side: App Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotateY: 30 }}
          animate={inView ? { opacity: 1, scale: 1, rotateY: 0 } : {}}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{
            perspective: 1200,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            height: '100%',
            minHeight: isMobile ? 300 : 500,
          }}
        >
          {/* Floating glow orbs */}
          {!isMobile && (
            <motion.div
              animate={{ y: [0, -15, 0], opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                top: '5%',
                right: '-10%',
                width: 200,
                height: 200,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(245,166,35,0.15) 0%, transparent 70%)',
                filter: 'blur(40px)',
                zIndex: 0,
              }}
            />
          )}

          {/* Phone Mockup */}
          <motion.div
            whileHover={{ y: -10, rotateX: 5 }}
            style={{
              position: 'relative',
              zIndex: 2,
              width: 'clamp(240px, 100%, 340px)',
              aspectRatio: '9 / 18',
              background: '#0a0a0a',
              borderRadius: 40,
              border: '8px solid #1a1a1a',
              boxShadow: '0 0 60px rgba(245,166,35,0.2), inset 0 0 60px rgba(245,166,35,0.05)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Phone notch */}
            <div style={{
              height: 28,
              background: '#000',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <div style={{
                width: 120,
                height: 20,
                background: '#000',
                borderRadius: 10,
              }} />
            </div>

            {/* App Content */}
            <div style={{
              flex: 1,
              background: 'linear-gradient(180deg, #0d0d0d 0%, #050505 100%)',
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              overflow: 'hidden',
            }}>
              {/* App header with insights */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.5 }}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}
              >
                <div style={{ fontSize: 10, fontWeight: 700, color: '#f5a623', letterSpacing: '0.2em', textTransform: 'uppercase' }}>UpCodo</div>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(245,166,35,0.2)', border: '1px solid #f5a623' }} />
              </motion.div>

              {/* Insight metrics - animated reveal */}
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.7, delay: 0.65 }}
                style={{
                  background: 'linear-gradient(135deg, rgba(245,166,35,0.08) 0%, rgba(167,139,250,0.04) 100%)',
                  border: '1px solid rgba(245,166,35,0.1)',
                  borderRadius: 8,
                  padding: '8px 10px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 8,
                  marginBottom: 4,
                }}
              >
                {[
                  { label: 'Users', value: '10K+' },
                  { label: 'Active', value: '98%' }
                ].map((metric, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.8 + i * 0.1 }}
                  >
                    <div style={{ fontSize: 8, color: '#888', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 2 }}>
                      {metric.label}
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#f5a623' }}>
                      {metric.value}
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Divider line - draws on reveal */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.75, ease: 'easeOut' }}
                style={{
                  height: 1,
                  background: 'linear-gradient(90deg, rgba(245,166,35,0.2) 0%, transparent 100%)',
                  transformOrigin: 'left',
                }}
              />

              {/* App cards - animated reveal with insights */}
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.6 + i * 0.1 }}
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(245,166,35,0.15)',
                    borderRadius: 12,
                    padding: 12,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    overflow: 'hidden',
                  }}
                  whileHover={{
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    borderColor: 'rgba(245,166,35,0.35)',
                    y: -2,
                  }}
                >
                  {/* Top row with icon and title */}
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={inView ? { scale: 1 } : {}}
                      transition={{ duration: 0.5, delay: 0.7 + i * 0.1, type: 'spring' }}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 6,
                        background: `rgba(245,166,35,${0.1 + i * 0.05})`,
                        border: '1px solid rgba(245,166,35,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 14,
                        fontWeight: 700,
                        color: '#f5a623',
                      }}
                    >
                      {i + 1}
                    </motion.div>
                    <div style={{ flex: 1 }}>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.75 + i * 0.1 }}
                        style={{ fontSize: 11, fontWeight: 600, color: '#e0e0e0' }}
                      >
                        Feature {i + 1}
                      </motion.div>
                    </div>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: 'linear', delay: i * 0.2 }}
                      style={{
                        width: 4,
                        height: 4,
                        borderRadius: '50%',
                        background: '#f5a623',
                      }}
                    />
                  </div>

                  {/* Insight bar - animated fill */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ fontSize: 8, color: '#888', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      Performance
                    </div>
                    <div style={{
                      height: 4,
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: 2,
                      overflow: 'hidden',
                    }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${60 + i * 15}%` } : {}}
                        transition={{ duration: 1, delay: 0.8 + i * 0.12, ease: 'easeOut' }}
                        style={{
                          height: '100%',
                          background: `linear-gradient(90deg, #f5a623 0%, rgba(245,166,35,0.5) 100%)`,
                          borderRadius: 2,
                        }}
                      />
                    </div>
                  </div>

                  {/* Details reveal */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.5, delay: 1 + i * 0.1 }}
                    style={{ fontSize: 9, color: '#666', letterSpacing: '-0.01em', lineHeight: 1.4 }}
                  >
                    Premium quality & optimized
                  </motion.div>
                </motion.div>
              ))}

              {/* CTA in app */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.9 }}
                style={{
                  marginTop: 'auto',
                  padding: '10px 12px',
                  background: '#f5a623',
                  color: '#000',
                  borderRadius: 10,
                  textAlign: 'center',
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  cursor: 'pointer',
                }}
                whileHover={{ scale: 1.05 }}
              >
                Get Started
              </motion.div>
            </div>
          </motion.div>

          {/* Accent shapes behind phone */}
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
            style={{
              position: 'absolute',
              bottom: '-5%',
              left: '-15%',
              width: 180,
              height: 180,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(167,139,250,0.1) 0%, transparent 70%)',
              filter: 'blur(50px)',
              zIndex: 1,
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}


function Navigation() {
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: isMobile ? '16px 20px' : '18px 48px',
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

        {/* Desktop Nav links + CTA */}
        {!isMobile && (
          <div style={{ display: 'flex', gap: 36, alignItems: 'center' }}>
            {NAV_LINKS.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -2 }}
                style={{
                  fontSize: 12, fontWeight: 600, color: '#888',
                  textDecoration: 'none', letterSpacing: '0.02em',
                  transition: 'color 0.2s ease',
                  position: 'relative',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#f0f0f0')}
                onMouseLeave={e => (e.currentTarget.style.color = '#888')}
              >
                {link.label}
              </motion.a>
            ))}
            <motion.a
              href="#"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.08, boxShadow: '0 12px 40px rgba(245,166,35,0.4)', y: -3 }}
              whileTap={{ scale: 0.92 }}
              style={{
                padding: '9px 20px', borderRadius: 7,
                background: '#f5a623', color: '#050505',
                fontSize: 11, fontWeight: 800, textDecoration: 'none',
                letterSpacing: '0.08em', textTransform: 'uppercase',
                display: 'inline-block', position: 'relative', overflow: 'hidden',
                cursor: 'pointer',
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

        {/* Mobile Hamburger Button */}
        {isMobile && (
          <motion.button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'transparent', border: 'none', padding: 8,
              display: 'flex', flexDirection: 'column', gap: 5,
              cursor: 'pointer',
            }}
          >
            <motion.div
              animate={menuOpen ? { rotate: 45, y: 12 } : { rotate: 0, y: 0 }}
              style={{ width: 24, height: 2, background: '#f0f0f0', borderRadius: 1 }}
            />
            <motion.div
              animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
              style={{ width: 24, height: 2, background: '#f0f0f0', borderRadius: 1 }}
            />
            <motion.div
              animate={menuOpen ? { rotate: -45, y: -12 } : { rotate: 0, y: 0 }}
              style={{ width: 24, height: 2, background: '#f0f0f0', borderRadius: 1 }}
            />
          </motion.button>
        )}
      </motion.nav>

      {/* Mobile Menu Overlay */}
      {isMobile && menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'fixed', top: 70, left: 0, right: 0, zIndex: 999,
            background: 'rgba(5,5,5,0.95)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
            display: 'flex', flexDirection: 'column', gap: 0,
            padding: '16px 20px',
          }}
        >
          {NAV_LINKS.map((link) => (
            <motion.a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                padding: '12px 0', fontSize: 14, fontWeight: 600, color: '#888',
                textDecoration: 'none', letterSpacing: '0.02em',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#f0f0f0')}
              onMouseLeave={e => (e.currentTarget.style.color = '#888')}
            >
              {link.label}
            </motion.a>
          ))}
          <motion.a
            href="#"
            onClick={() => setMenuOpen(false)}
            style={{
              padding: '14px 0', marginTop: 8, fontSize: 12, fontWeight: 800,
              background: '#f5a623', color: '#050505',
              textDecoration: 'none', letterSpacing: '0.08em', textTransform: 'uppercase',
              display: 'block', textAlign: 'center', borderRadius: 7,
              cursor: 'pointer',
            }}
          >
            Start a Project
          </motion.a>
        </motion.div>
      )}
    </>
  );
}

export default function Home() {
  return (
    <main style={{ background: '#050505', minHeight: '100dvh', width: '100%', color: '#f0f0f0' }}>

      <AnimatedCursor />

      <Navigation />

      {/* ── Hero Scroll Sequence ── */}
      <RevealCanvas />

      {/* ── Stats Bar with count-up ── */}
      <StatsBar />

      {/* ── Services ── */}
      <ServicesSection />

      {/* ── Projects Bento Grid ── */}
      <ProjectsSection />

      {/* ── Client Testimonials ── */}
      <TestimonialsSection />

      {/* ── Customer Reviews ── */}
      <CustomerReviewsSection />

      {/* ── Recent Blog Posts ── */}
      <BlogSection />

      {/* ── Final CTA ── */}
      <CTASection />

      {/* ── Footer ── */}
      <Footer />

    </main>
  );
}
