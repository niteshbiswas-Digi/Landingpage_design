'use client';
import { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useAnimationFrame } from 'framer-motion';
import { Smartphone, Globe, PenTool, Activity, LucideIcon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

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

const SERVICES: {
  icon: LucideIcon;
  num: string;
  title: string;
  description: string;
  floatDelay: number;
}[] = [
  {
    icon: Smartphone,
    num: '01',
    title: 'Mobile App Development',
    description:
      'Native iOS and Android apps built around real user flows — from architecture through App Store delivery.',
    floatDelay: 0,
  },
  {
    icon: Globe,
    num: '02',
    title: 'Web Application Engineering',
    description:
      'Scalable, secure web apps built with modern frameworks — clean architecture, fast load times, maintainable code.',
    floatDelay: 0.55,
  },
  {
    icon: PenTool,
    num: '03',
    title: 'Product Design & Interface',
    description:
      'Design systems grounded in user research — interface patterns that drive retention and reduce churn.',
    floatDelay: 1.1,
  },
  {
    icon: Activity,
    num: '04',
    title: 'API & Platform Integration',
    description:
      'Direct connectivity between your product and third-party platforms, payment rails, and enterprise APIs.',
    floatDelay: 1.65,
  },
];

/* ─── Slow-moving spotlight orb ─── */
function SpotlightOrb() {
  const x = useMotionValue(60);
  const y = useMotionValue(20);
  const t = useRef(0);

  useAnimationFrame((_, delta) => {
    t.current += delta * 0.00008;
    x.set(55 + Math.sin(t.current) * 20);
    y.set(18 + Math.cos(t.current * 0.7) * 18);
  });

  return (
    <motion.div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      <motion.div
        style={{
          position: 'absolute',
          width: 700,
          height: 700,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(26,174,92,0.07) 0%, rgba(26,174,92,0.02) 40%, transparent 70%)',
          left: x.get() + '%',
          top: y.get() + '%',
          x: '-50%',
          y: '-50%',
          filter: 'blur(2px)',
        }}
      />
    </motion.div>
  );
}

/* ─── Animated reveal lines (section header accent) ─── */
function RevealLines({ inView }: { inView: boolean }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 1,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        style={{
          height: '100%',
          background:
            'linear-gradient(90deg, transparent 0%, rgba(26,174,92,0.5) 30%, rgba(77,208,142,0.7) 50%, rgba(26,174,92,0.5) 70%, transparent 100%)',
          transformOrigin: 'center',
          boxShadow: '0 0 16px rgba(26,174,92,0.4)',
        }}
      />
    </div>
  );
}

/* ─── Service card ─── */
function ServiceCard({
  service,
  index,
}: {
  service: (typeof SERVICES)[0];
  index: number;
}) {
  const Icon = service.icon;
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const { c } = useTheme();

  /* Mouse-tracked inner glow */
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const glowX = useSpring(rawX, { stiffness: 200, damping: 30 });
  const glowY = useSpring(rawY, { stiffness: 200, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    rawX.set(e.clientX - r.left);
    rawY.set(e.clientY - r.top);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40, rotateX: 6 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: false, amount: 0.12 }}
      transition={{ type: 'spring', stiffness: 75, damping: 18, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      style={{
        position: 'relative',
        background: hovered
          ? (c.isDark ? 'linear-gradient(135deg, rgba(255,255,255,0.055) 0%, rgba(26,174,92,0.03) 100%)' : 'linear-gradient(135deg, #ffffff 0%, rgba(74,222,128,0.04) 100%)')
          : (c.isDark ? 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)' : '#FFFFFF'),
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: hovered ? 'rgba(26,174,92,0.5)' : c.border,
        borderRadius: 20,
        padding: 'clamp(28px, 3vw, 40px)',
        overflow: 'hidden',
        cursor: 'default',
        boxShadow: hovered
          ? (c.isDark ? '0 0 60px rgba(26,174,92,0.12), 0 30px 80px rgba(0,0,0,0.6)' : '0 8px 40px rgba(74,222,128,0.12), 0 2px 16px rgba(0,0,0,0.07)')
          : c.cardShadow,
        transition: 'border-color 0.35s ease, box-shadow 0.35s ease, background 0.35s ease',
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
    >
      {/* Mouse-tracked glow */}
      <motion.div
        style={{
          position: 'absolute',
          width: 280,
          height: 280,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(26,174,92,0.14) 0%, transparent 65%)',
          left: glowX,
          top: glowY,
          x: '-50%',
          y: '-50%',
          pointerEvents: 'none',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.35s ease',
        }}
      />

      {/* Corner L-brackets — reveal on hover */}
      {[
        { top: 12, left: 12, rotate: '0deg' },
        { top: 12, right: 12, rotate: '90deg' },
        { bottom: 12, right: 12, rotate: '180deg' },
        { bottom: 12, left: 12, rotate: '270deg' },
      ].map((pos, ci) => {
        const { rotate, ...rest } = pos;
        return (
          <motion.div
            key={ci}
            animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.6 }}
            transition={{ duration: 0.3, delay: ci * 0.04 }}
            style={{
              position: 'absolute',
              ...rest,
              width: 12,
              height: 12,
              borderTop: ci < 2 ? '1px solid rgba(26,174,92,0.55)' : 'none',
              borderBottom: ci >= 2 ? '1px solid rgba(26,174,92,0.55)' : 'none',
              borderLeft: ci === 0 || ci === 3 ? '1px solid rgba(26,174,92,0.55)' : 'none',
              borderRight: ci === 1 || ci === 2 ? '1px solid rgba(26,174,92,0.55)' : 'none',
              pointerEvents: 'none',
            }}
          />
        );
      })}

      {/* Ghost card number */}
      <div
        style={{
          position: 'absolute',
          top: 18,
          right: 22,
          fontSize: 56,
          fontWeight: 900,
          letterSpacing: '-0.06em',
          lineHeight: 1,
          color: 'transparent',
          WebkitTextStroke: `1px ${c.isDark ? `rgba(255,255,255,${hovered ? 0.08 : 0.04})` : `rgba(0,0,0,${hovered ? 0.07 : 0.04})`}`,
          userSelect: 'none',
          pointerEvents: 'none',
          transition: 'all 0.4s ease',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {service.num}
      </div>

      {/* Icon */}
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut', delay: service.floatDelay }}
        style={{
          width: 54,
          height: 54,
          borderRadius: 14,
          background: `linear-gradient(135deg, rgba(26,174,92,${hovered ? 0.18 : 0.09}) 0%, rgba(26,174,92,${hovered ? 0.06 : 0.02}) 100%)`,
          border: `1px solid rgba(26,174,92,${hovered ? 0.45 : 0.18})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 22,
          boxShadow: hovered ? '0 0 24px rgba(26,174,92,0.25), inset 0 0 12px rgba(26,174,92,0.1)' : 'none',
          transition: 'all 0.38s ease',
        }}
      >
        <Icon size={22} color={c.accent} strokeWidth={1.6} />
      </motion.div>

      {/* Separator */}
      <div
        style={{
          width: hovered ? 52 : 28,
          height: 1,
          background: `linear-gradient(90deg, rgba(26,174,92,${hovered ? 0.8 : 0.28}), transparent)`,
          marginBottom: 18,
          transition: 'all 0.4s ease',
          borderRadius: 1,
        }}
      />

      <h3
        style={{
          fontSize: 'clamp(17px, 1.5vw, 21px)',
          fontWeight: 700,
          letterSpacing: '-0.03em',
          lineHeight: 1.2,
          color: hovered ? (c.isDark ? '#ffffff' : '#0A0A0A') : c.text,
          marginBottom: 12,
          transition: 'color 0.3s ease',
        }}
      >
        {service.title}
      </h3>

      <p
        style={{
          fontSize: 'clamp(13px, 1.1vw, 15px)',
          color: c.textSub,
          lineHeight: 1.8,
          letterSpacing: '-0.01em',
          margin: 0,
        }}
      >
        {service.description}
      </p>

      {/* Bottom amber sweep */}
      <motion.div
        animate={{ scaleX: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 2,
          background: 'linear-gradient(90deg, #4ADE80 0%, #6EE7B0 40%, transparent 100%)',
          transformOrigin: 'left',
          borderRadius: '0 0 20px 20px',
          boxShadow: '0 0 12px rgba(26,174,92,0.5)',
        }}
      />
    </motion.div>
  );
}

/* ─── Section ─── */
export default function ServicesSection() {
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLElement>(null);
  const [sectionInView, setSectionInView] = useState(false);
  const { c } = useTheme();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setSectionInView(entry.isIntersecting),
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        background: c.bgSection,
        padding: isMobile
          ? '60px 20px 70px'
          : 'clamp(72px, 7vw, 100px) clamp(32px, 5vw, 80px)',
        borderTop: `1px solid ${c.border}`,
        overflow: 'hidden',
      }}
    >
      {/* ── Ambient layers ── */}

      {/* Top-right amber glow */}
      <div style={{
        position: 'absolute', top: '-20%', right: '-8%',
        width: 700, height: 700, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(26,174,92,0.10) 0%, transparent 58%)',
        pointerEvents: 'none',
      }} />

      {/* Bottom-left secondary glow */}
      <div style={{
        position: 'absolute', bottom: '-10%', left: '-6%',
        width: 450, height: 450, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(26,174,92,0.045) 0%, transparent 68%)',
        pointerEvents: 'none',
      }} />

      {/* Slow-breathing center glow */}
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.12, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', top: '30%', left: '50%',
          transform: 'translateX(-50%)',
          width: 500, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(26,174,92,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(20px)',
        }}
      />

      {/* Moving spotlight */}
      <SpotlightOrb />

      {/* Dot grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `radial-gradient(circle, ${c.dotGrid} 1px, transparent 1px)`,
        backgroundSize: '44px 44px',
        pointerEvents: 'none', opacity: 0.55,
      }} />

      {/* Animated top border line */}
      <RevealLines inView={sectionInView} />

      {/* Floating accent dots */}
      {[
        { style: { top: '12%', left: '2%' },   size: 3,   delay: 0,   dur: 4.8 },
        { style: { top: '68%', left: '4.5%' }, size: 2.5, delay: 1.6, dur: 5.5 },
        { style: { top: '20%', right: '2.5%' },size: 4,   delay: 0.9, dur: 4.2 },
        { style: { bottom: '22%', right: '6%' },size: 2.5, delay: 2.3, dur: 6   },
        { style: { top: '50%', left: '48%' },  size: 2,   delay: 1.1, dur: 5   },
      ].map((dot, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -10, 0], opacity: [0.2, 0.65, 0.2] }}
          transition={{ duration: dot.dur, repeat: Infinity, ease: 'easeInOut', delay: dot.delay }}
          style={{
            position: 'absolute', ...dot.style,
            width: dot.size, height: dot.size, borderRadius: '50%',
            background: c.accent,
            boxShadow: `0 0 ${dot.size * 3}px rgba(26,174,92,0.7)`,
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Diagonal light beam */}
      <motion.div
        animate={{ opacity: [0, 0.06, 0], x: ['-10%', '110%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear', repeatDelay: 6 }}
        style={{
          position: 'absolute', top: 0, left: 0,
          width: 120, height: '100%',
          background: 'linear-gradient(105deg, transparent 30%, rgba(26,174,92,0.4) 50%, transparent 70%)',
          pointerEvents: 'none', zIndex: 0,
          transform: 'skewX(-20deg)',
        }}
      />

      {/* ── Content ── */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto' }}>

        {/* ── Header ── */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(32px, 3.5vw, 48px)' }}>

          {/* Eyebrow with flanking lines */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            style={{
              display: 'inline-flex', alignItems: 'center',
              gap: 14, marginBottom: 24,
            }}
          >
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{
                width: 36, height: 1,
                background: 'linear-gradient(90deg, transparent, rgba(26,174,92,0.7))',
                transformOrigin: 'right',
              }}
            />
            <span style={{
              fontSize: 11, fontWeight: 700,
              letterSpacing: '0.52em', textTransform: 'uppercase',
              color: c.accent,
            }}>
              Our Services
            </span>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{
                width: 36, height: 1,
                background: 'linear-gradient(270deg, transparent, rgba(26,174,92,0.7))',
                transformOrigin: 'left',
              }}
            />
          </motion.div>

          {/* Main heading — matches site heading scale */}
          <motion.h2
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontSize: isMobile
                ? 'clamp(36px, 9vw, 54px)'
                : 'clamp(52px, 5.8vw, 76px)',
              fontWeight: 900,
              letterSpacing: '-0.055em',
              lineHeight: 1.0,
              margin: '0 0 20px',
            }}
          >
            <span style={{ color: c.text }}>Strategic{' '}</span>
            <span style={{ color: c.accent }}>
              App Development
            </span>
            <br />
            <span style={{
              color: 'transparent',
              WebkitTextStroke: isMobile
                ? `1px ${c.isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.14)'}`
                : `1px ${c.isDark ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.18)'}`,
            }}>
              for Business Growth.
            </span>
          </motion.h2>

          {/* Gold divider with glow */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: 60, height: 2,
              background: `linear-gradient(90deg, transparent, ${c.accent} 30%, #6EE7B0 50%, ${c.accent} 70%, transparent)`,
              margin: '0 auto',
              borderRadius: 2,
              transformOrigin: 'center',
              boxShadow: '0 0 16px rgba(26,174,92,0.5)',
            }}
          />
        </div>

        {/* ── Cards ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? 14 : 18,
        }}>
          {SERVICES.map((service, i) => (
            <ServiceCard key={service.num} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
