'use client';
import { useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Rahul Kumar',
    role: 'Founder',
    company: 'FitTech Solutions',
    initials: 'RK',
    color: '#a78bfa',
    rating: 5,
    quote: 'UpCodo transformed our vision into reality. The AI-powered fitness app they delivered exceeded our expectations. Their team understood our requirements perfectly and delivered on time and within budget.',
    featured: true,
  },
  {
    id: 2,
    name: 'Dr. Priya Singh',
    role: 'Medical Director',
    company: 'HealthCare Plus',
    initials: 'PS',
    color: '#4ade80',
    rating: 5,
    quote: 'The patient care application has revolutionized how we manage appointments and patient data. Seamless, intuitive, and reliable.',
    featured: false,
  },
  {
    id: 3,
    name: 'Amit Patel',
    role: 'Operations Manager',
    company: 'Corporate Assets Inc',
    initials: 'AP',
    color: '#38bdf8',
    rating: 5,
    quote: 'Asset Management System has improved our productivity by 40%. Exceptional support from the UpCodo team.',
    featured: false,
  },
  {
    id: 4,
    name: 'Sarah Johnson',
    role: 'CEO',
    company: 'Wisterias Tech',
    initials: 'SJ',
    color: '#f5a623',
    rating: 5,
    quote: 'The SaaS platform delivered was production-ready and scalable. Best investment we made for our business growth.',
    featured: false,
  },
  {
    id: 5,
    name: 'David Chen',
    role: 'CTO',
    company: 'Innovation Labs',
    initials: 'DC',
    color: '#f43f5e',
    rating: 5,
    quote: 'Working with UpCodo was a game-changer. Their expertise in AI and modern technology stacks is unmatched.',
    featured: false,
  },
  {
    id: 6,
    name: 'Emma Rodriguez',
    role: 'Product Lead',
    company: 'Digital Ventures',
    initials: 'ER',
    color: '#2dd4bf',
    rating: 5,
    quote: 'From concept to launch, UpCodo handled everything professionally. Highly recommend for any app development needs.',
    featured: false,
  },
];

const CLIENTS = [
  'FitTech Solutions', 'HealthCare Plus', 'Corporate Assets', 'Wisterias Tech',
  'Innovation Labs', 'Digital Ventures', 'VaultDAO', 'SkyBridge',
  'Meridian Labs', 'CipherStack', 'AeroCom', 'PulseGrid',
];

/* ── Staggered stars ── */
function Stars({ count, inView, delay = 0 }: { count: number; inView: boolean; delay?: number }) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.svg
          key={i}
          width="12" height="12" viewBox="0 0 24 24" fill="#f5a623"
          initial={{ scale: 0, opacity: 0, rotate: -30 }}
          animate={inView ? { scale: 1, opacity: 1, rotate: 0 } : {}}
          transition={{ duration: 0.35, delay: delay + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </motion.svg>
      ))}
    </div>
  );
}

/* ── 3-D tilt wrapper (reusable) ── */
function TiltCard({
  children, style, strength = 5,
}: { children: React.ReactNode; style?: React.CSSProperties; strength?: number }) {
  const ref   = useRef<HTMLDivElement>(null);
  const rawX  = useMotionValue(0);
  const rawY  = useMotionValue(0);
  const rotX  = useSpring(useTransform(rawY, [-0.5, 0.5], [strength, -strength]),  { stiffness: 150, damping: 22 });
  const rotY  = useSpring(useTransform(rawX, [-0.5, 0.5], [-strength, strength]), { stiffness: 150, damping: 22 });

  return (
    <motion.div
      ref={ref}
      style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d', transformPerspective: 800, ...style }}
      onMouseMove={(e) => {
        if (!ref.current) return;
        const r = ref.current.getBoundingClientRect();
        rawX.set((e.clientX - r.left) / r.width  - 0.5);
        rawY.set((e.clientY - r.top)  / r.height - 0.5);
      }}
      onMouseLeave={() => { rawX.set(0); rawY.set(0); }}
    >
      {children}
    </motion.div>
  );
}

const cardIn = (delay: number) => ({
  initial: { opacity: 0, y: 36, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
});

export default function TestimonialsSection() {
  const ref        = useRef<HTMLElement>(null);
  const inView     = useInView(ref, { once: true, margin: '-8%' });
  const featured   = TESTIMONIALS[0];
  const sideCards  = TESTIMONIALS.slice(1, 3);
  const bottomCards = TESTIMONIALS.slice(3);

  return (
    <section
      ref={ref}
      style={{
        padding: 'clamp(40px, 5vw, 80px) clamp(24px, 5vw, 80px)',
        background: '#080808',
        borderTop: '1px solid rgba(255,255,255,0.03)',
        overflow: 'hidden',
      }}
    >
      {/* Section header */}
      <div style={{ marginBottom: 'clamp(28px, 3.5vw, 52px)' }}>
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
            style={{ width: 28, height: 1, background: '#f5a623', transformOrigin: 'left' }}
          />
          <p style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '0.4em',
            textTransform: 'uppercase', color: '#f5a623', margin: 0,
          }}>
            Client Testimonials
          </p>
        </motion.div>
        <h2 style={{
          fontSize: 'clamp(36px, 5vw, 68px)', fontWeight: 900,
          letterSpacing: '-0.05em', lineHeight: 0.92, margin: 0,
        }}>
          {[
            { text: 'Trusted by teams', color: '#f0f0f0', delay: 0.08 },
            { text: 'building the future.', color: 'transparent', delay: 0.2, stroke: true },
          ].map(({ text, color, delay, stroke }) => (
            <span key={text} style={{ display: 'block', overflow: 'hidden' }}>
              <motion.span
                style={{
                  display: 'block', color,
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

      {/* Top row: featured + 2 side cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.45fr 1fr', gap: 12, marginBottom: 12 }}>

        {/* Featured — animated glow border + 3D tilt */}
        <TiltCard strength={4}>
          <motion.div {...cardIn(0.1)} whileHover={{ y: -6 }} style={{ position: 'relative' }}>
            {/* Pulsing gradient border ring */}
            <motion.div
              className="border-glow-anim"
              style={{
                position: 'absolute', inset: -1, borderRadius: 21,
                background: `linear-gradient(135deg, ${featured.color}55 0%, transparent 45%, ${featured.color}33 75%, transparent 100%)`,
                zIndex: 0, pointerEvents: 'none',
              }}
            />
            {/* Rotating shimmer on border */}
            <div
              className="spin-slow"
              style={{
                position: 'absolute', inset: -1, borderRadius: 21, overflow: 'hidden',
                zIndex: 0, pointerEvents: 'none', opacity: 0.35,
              }}
            >
              <div style={{
                position: 'absolute', inset: 0,
                background: `conic-gradient(from 0deg, transparent 0%, ${featured.color} 10%, transparent 20%)`,
                borderRadius: 21,
              }} />
            </div>

            {/* Card body */}
            <div style={{
              position: 'relative', zIndex: 1,
              background: '#0d0d0d', borderRadius: 20,
              padding: 'clamp(28px, 3vw, 48px)',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              minHeight: 340, overflow: 'hidden',
            }}>
              {/* Inner radial glow */}
              <div style={{
                position: 'absolute', top: -80, right: -80,
                width: 260, height: 260, borderRadius: '50%',
                background: `radial-gradient(circle, ${featured.color}18 0%, transparent 70%)`,
                pointerEvents: 'none',
              }} />

              <div>
                <Stars count={featured.rating} inView={inView} delay={0.2} />
                {/* Quote — word-by-word reveal */}
                <p style={{
                  fontSize: 'clamp(17px, 1.8vw, 23px)',
                  color: '#d0d0d0', lineHeight: 1.6, letterSpacing: '-0.02em',
                  margin: '24px 0 0', fontWeight: 400, maxWidth: 540,
                }}>
                  {featured.quote.split(' ').map((word, wi) => (
                    <span key={wi} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}>
                      <motion.span
                        style={{ display: 'inline-block' }}
                        initial={{ y: '100%', opacity: 0 }}
                        animate={inView ? { y: 0, opacity: 1 } : {}}
                        transition={{ duration: 0.55, delay: 0.3 + wi * 0.03, ease: [0.16, 1, 0.3, 1] }}
                      >
                        {word}&nbsp;
                      </motion.span>
                    </span>
                  ))}
                </p>
              </div>

              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.55 }}
                style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 32 }}
              >
                <motion.div
                  whileHover={{ scale: 1.12 }}
                  style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: `${featured.color}1a`, border: `1px solid ${featured.color}3a`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 800, color: featured.color, flexShrink: 0,
                  }}
                >
                  {featured.initials}
                </motion.div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#e8e8e8', letterSpacing: '-0.02em' }}>
                    {featured.name}
                  </div>
                  <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>
                    {featured.role}, {featured.company}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </TiltCard>

        {/* Side stack with 3D tilt */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {sideCards.map((t, i) => (
            <TiltCard key={t.id} style={{ flex: 1 }}>
              <motion.div
                {...cardIn(0.2 + i * 0.1)}
                whileHover={{ y: -6, boxShadow: '0 20px 50px rgba(255,255,255,0.08)' }}
                transition={{ type: 'spring', stiffness: 280, damping: 20 }}
                style={{
                  background: '#0d0d0d',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: 20, padding: 28, height: '100%',
                  position: 'relative', overflow: 'hidden',
                  display: 'flex', flexDirection: 'column',
                }}
              >
                <div style={{
                  position: 'absolute', top: -40, right: -40,
                  width: 140, height: 140, borderRadius: '50%',
                  background: `radial-gradient(circle, ${t.color}14 0%, transparent 70%)`,
                  pointerEvents: 'none',
                }} />
                <Stars count={t.rating} inView={inView} delay={0.3 + i * 0.15} />
                <p style={{ fontSize: 13, color: '#777', lineHeight: 1.7, margin: '14px 0 20px', flex: 1 }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: `${t.color}1a`, border: `1px solid ${t.color}3a`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 800, color: t.color, flexShrink: 0,
                    }}
                  >
                    {t.initials}
                  </motion.div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#d8d8d8' }}>{t.name}</div>
                    <div style={{ fontSize: 10, color: '#666', marginTop: 2 }}>{t.role}, {t.company}</div>
                  </div>
                </div>
              </motion.div>
            </TiltCard>
          ))}
        </div>
      </div>

      {/* Bottom row — 3 tilt cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {bottomCards.map((t, i) => (
          <TiltCard key={t.id}>
            <motion.div
              {...cardIn(0.3 + i * 0.09)}
              whileHover={{ y: -6, boxShadow: '0 20px 50px rgba(255,255,255,0.08)' }}
              transition={{ type: 'spring', stiffness: 280, damping: 20 }}
              style={{
                background: '#0d0d0d',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: 20, padding: 24,
                position: 'relative', overflow: 'hidden',
              }}
            >
              <div style={{
                position: 'absolute', top: -30, right: -30,
                width: 110, height: 110, borderRadius: '50%',
                background: `radial-gradient(circle, ${t.color}12 0%, transparent 70%)`,
                pointerEvents: 'none',
              }} />
              <Stars count={t.rating} inView={inView} delay={0.4 + i * 0.12} />
              <p style={{ fontSize: 13, color: '#666', lineHeight: 1.7, margin: '14px 0 20px' }}>
                &ldquo;{t.quote}&rdquo;
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: `${t.color}1a`, border: `1px solid ${t.color}3a`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: 800, color: t.color, flexShrink: 0,
                  }}
                >
                  {t.initials}
                </motion.div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#ccc' }}>{t.name}</div>
                  <div style={{ fontSize: 10, color: '#666', marginTop: 2 }}>{t.role}, {t.company}</div>
                </div>
              </div>
            </motion.div>
          </TiltCard>
        ))}
      </div>

      {/* Client marquee */}
      <div style={{
        marginTop: 52, paddingTop: 36,
        borderTop: '1px solid rgba(255,255,255,0.03)',
      }}>
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{
            fontSize: 9, fontWeight: 700, letterSpacing: '0.45em', textTransform: 'uppercase',
            color: '#555', marginBottom: 22, textAlign: 'center',
          }}
        >
          Trusted by builders at
        </motion.p>

        {/* Marquee with gradient edge masks */}
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: 120, zIndex: 1,
            background: 'linear-gradient(90deg, #080808 0%, transparent 100%)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', right: 0, top: 0, bottom: 0, width: 120, zIndex: 1,
            background: 'linear-gradient(270deg, #080808 0%, transparent 100%)',
            pointerEvents: 'none',
          }} />
          <div className="marquee-track" style={{ gap: 0 }}>
            {[...CLIENTS, ...CLIENTS].map((client, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center' }}>
                <span style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.28em',
                  textTransform: 'uppercase', color: '#777', whiteSpace: 'nowrap',
                  padding: '0 28px',
                }}>
                  {client}
                </span>
                <span style={{
                  width: 1, height: 9, background: 'rgba(255,255,255,0.07)', flexShrink: 0,
                }} />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
