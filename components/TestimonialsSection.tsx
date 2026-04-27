'use client';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useTheme } from "../context/ThemeContext"

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
    color: '#4ADE80',
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

const PROJECT_LOGOS = [
  { file: '360AI.png',          alt: '360 AI' },
  { file: 'Aroma of wine.png',  alt: 'Aroma of Wine' },
  { file: 'Azubi.png',          alt: 'Azubi' },
  { file: 'Bookforvisa.png',    alt: 'Book For Visa' },
  { file: 'Carvind.png',        alt: 'Carvind' },
  { file: 'Dawerlee.png',       alt: 'Dawerlee' },
  { file: 'JUno.png',           alt: 'JUno' },
  { file: 'Koor.png',           alt: 'Koor' },
  { file: 'Six second.png',     alt: 'Six Second' },
  { file: 'Wisetria.png',       alt: 'Wisetria' },
  { file: 'denzai.png',         alt: 'Denzai' },
];

/* ── Staggered stars ── */
function Stars({ count, inView, delay = 0 }: { count: number; inView: boolean; delay?: number }) {
  const { c } = useTheme()
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.svg
          key={i}
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill={c.accent}
          initial={{ scale: 0, opacity: 0, rotate: -30 }}
          animate={inView ? { scale: 1, opacity: 1, rotate: 0 } : {}}
          transition={{
            duration: 0.35,
            delay: delay + i * 0.07,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </motion.svg>
      ))}
    </div>
  )
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
  const { c } = useTheme()
  const isMobile = useIsMobile();
  const featured   = TESTIMONIALS[0];
  const sideCards  = TESTIMONIALS.slice(1, 3);
  const bottomCards = TESTIMONIALS.slice(3);

  return (
    <section
      ref={ref}
      style={{
        padding: "clamp(40px, 5vw, 80px) clamp(24px, 5vw, 80px)",
        background: c.bgSection,
        borderTop: `1px solid ${c.border}`,
        overflow: "hidden",
      }}
    >
      {/* Section header */}
      <div style={{ marginBottom: "clamp(28px, 3.5vw, 52px)" }}>
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 20,
          }}
        >
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: 28,
              height: 1,
              background: c.accent,
              transformOrigin: "left",
            }}
          />
          <p
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              color: c.accent,
              margin: 0,
            }}
          >
            Client Testimonials
          </p>
        </motion.div>
        <h2
          style={{
            fontSize: "clamp(36px, 5vw, 68px)",
            fontWeight: 900,
            letterSpacing: "-0.05em",
            lineHeight: 0.92,
            margin: 0,
          }}
        >
          {[
            { text: "Trusted by teams", delay: 0.08 },
            { text: "building the future.", delay: 0.2, stroke: true },
          ].map(({ text, delay, stroke }) => (
            <span key={text} style={{ display: "block", overflow: "hidden" }}>
              <motion.span
                style={{
                  display: "block",
                  color: stroke ? "transparent" : (c.isDark ? c.text : c.accent),
                  ...(stroke
                    ? {
                        WebkitTextStroke: `1px ${
                          c.isDark
                            ? "rgba(255,255,255,0.22)"
                            : "rgba(0,0,0,0.18)"
                        }`,
                      }
                    : {}),
                }}
                initial={{ y: "108%" }}
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
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1.45fr 1fr",
          gap: 12,
          marginBottom: 12,
        }}
      >
        {/* Featured — animated glow border + 3D tilt */}
        <TiltCard strength={4}>
          <motion.div
            {...cardIn(0.1)}
            whileHover={{ y: -6 }}
            style={{ position: "relative" }}
          >
            {/* Pulsing gradient border ring */}
            <motion.div
              className="border-glow-anim"
              style={{
                position: "absolute",
                inset: -1,
                borderRadius: 21,
                background: `linear-gradient(135deg, ${featured.color}55 0%, transparent 45%, ${featured.color}33 75%, transparent 100%)`,
                zIndex: 0,
                pointerEvents: "none",
              }}
            />
            {/* Rotating shimmer on border */}
            <div
              className="spin-slow"
              style={{
                position: "absolute",
                inset: -1,
                borderRadius: 21,
                overflow: "hidden",
                zIndex: 0,
                pointerEvents: "none",
                opacity: 0.35,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `conic-gradient(from 0deg, transparent 0%, ${featured.color} 10%, transparent 20%)`,
                  borderRadius: 21,
                }}
              />
            </div>

            {/* Card body */}
            <div
              style={{
                position: "relative",
                zIndex: 1,
                background: c.bgCard,
                borderRadius: 20,
                padding: "clamp(28px, 3vw, 48px)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: 340,
                overflow: "hidden",
              }}
            >
              {/* Inner radial glow */}
              <div
                style={{
                  position: "absolute",
                  top: -80,
                  right: -80,
                  width: 260,
                  height: 260,
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${featured.color}18 0%, transparent 70%)`,
                  pointerEvents: "none",
                }}
              />

              <div>
                <Stars count={featured.rating} inView={inView} delay={0.2} />
                {/* Quote — word-by-word reveal */}
                <p
                  style={{
                    fontSize: "clamp(17px, 1.8vw, 23px)",
                    color: c.text,
                    lineHeight: 1.6,
                    letterSpacing: "-0.02em",
                    margin: "24px 0 0",
                    fontWeight: 400,
                    maxWidth: 540,
                  }}
                >
                  {featured.quote.split(" ").map((word, wi) => (
                    <span
                      key={wi}
                      style={{
                        display: "inline-block",
                        overflow: "hidden",
                        verticalAlign: "bottom",
                      }}
                    >
                      <motion.span
                        style={{ display: "inline-block" }}
                        initial={{ y: "100%", opacity: 0 }}
                        animate={inView ? { y: 0, opacity: 1 } : {}}
                        transition={{
                          duration: 0.55,
                          delay: 0.3 + wi * 0.03,
                          ease: [0.16, 1, 0.3, 1],
                        }}
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
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  marginTop: 32,
                }}
              >
                <motion.div
                  whileHover={{ scale: 1.12 }}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: `${featured.color}1a`,
                    border: `1px solid ${featured.color}3a`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    fontWeight: 800,
                    color: featured.color,
                    flexShrink: 0,
                  }}
                >
                  {featured.initials}
                </motion.div>
                <div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: c.text,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {featured.name}
                  </div>
                  <div
                    style={{ fontSize: 11, color: c.textMuted, marginTop: 2 }}
                  >
                    {featured.role}, {featured.company}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </TiltCard>

        {/* Side stack with 3D tilt */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {sideCards.map((t, i) => (
            <TiltCard key={t.id} style={{ flex: 1 }}>
              <motion.div
                {...cardIn(0.2 + i * 0.1)}
                whileHover={{
                  y: -6,
                  boxShadow: "0 20px 50px rgba(255,255,255,0.08)",
                }}
                transition={{ type: "spring", stiffness: 280, damping: 20 }}
                style={{
                  background: c.bgCard,
                  border: `1px solid ${c.border}`,
                  borderRadius: 20,
                  padding: 28,
                  height: "100%",
                  position: "relative",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: -40,
                    right: -40,
                    width: 140,
                    height: 140,
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${t.color}14 0%, transparent 70%)`,
                    pointerEvents: "none",
                  }}
                />
                <Stars
                  count={t.rating}
                  inView={inView}
                  delay={0.3 + i * 0.15}
                />
                <p
                  style={{
                    fontSize: 13,
                    color: c.textSub,
                    lineHeight: 1.7,
                    margin: "14px 0 20px",
                    flex: 1,
                  }}
                >
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: `${t.color}1a`,
                      border: `1px solid ${t.color}3a`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 800,
                      color: t.color,
                      flexShrink: 0,
                    }}
                  >
                    {t.initials}
                  </motion.div>
                  <div>
                    <div
                      style={{ fontSize: 13, fontWeight: 700, color: c.text }}
                    >
                      {t.name}
                    </div>
                    <div
                      style={{ fontSize: 10, color: c.textMuted, marginTop: 2 }}
                    >
                      {t.role}, {t.company}
                    </div>
                  </div>
                </div>
              </motion.div>
            </TiltCard>
          ))}
        </div>
      </div>

      {/* Bottom row — 3 tilt cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
          gap: 12,
        }}
      >
        {bottomCards.map((t, i) => (
          <TiltCard key={t.id}>
            <motion.div
              {...cardIn(0.3 + i * 0.09)}
              whileHover={{
                y: -6,
                boxShadow: "0 20px 50px rgba(255,255,255,0.08)",
              }}
              transition={{ type: "spring", stiffness: 280, damping: 20 }}
              style={{
                background: c.bgCard,
                border: `1px solid ${c.border}`,
                borderRadius: 20,
                padding: 24,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -30,
                  right: -30,
                  width: 110,
                  height: 110,
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${t.color}12 0%, transparent 70%)`,
                  pointerEvents: "none",
                }}
              />
              <Stars count={t.rating} inView={inView} delay={0.4 + i * 0.12} />
              <p
                style={{
                  fontSize: 13,
                  color: c.textSub,
                  lineHeight: 1.7,
                  margin: "14px 0 20px",
                }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: `${t.color}1a`,
                    border: `1px solid ${t.color}3a`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    fontWeight: 800,
                    color: t.color,
                    flexShrink: 0,
                  }}
                >
                  {t.initials}
                </motion.div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: c.text }}>
                    {t.name}
                  </div>
                  <div
                    style={{ fontSize: 10, color: c.textMuted, marginTop: 2 }}
                  >
                    {t.role}, {t.company}
                  </div>
                </div>
              </div>
            </motion.div>
          </TiltCard>
        ))}
      </div>

      {/* ── Spline Hero Strip ── */}
      <div
        style={{
          position: "relative",
          marginTop: 52,
          borderTop: `1px solid ${c.border}`,
          overflow: "hidden",
          minHeight: 440,
          background: c.isDark
            ? "#000000"
            : `radial-gradient(ellipse at 65% 80%, ${c.accent}12 0%, transparent 55%), radial-gradient(ellipse at 20% 20%, rgba(167,139,250,0.1) 0%, transparent 50%), radial-gradient(ellipse at 85% 15%, rgba(56,189,248,0.07) 0%, transparent 45%), ${c.bgSection}`,
        }}
      >
        {/* Spline iframe — dark scene for dark mode, transparent scene for light mode */}
        <iframe
          src={
            c.isDark
              ? "https://my.spline.design/claritystream-Q52ockJWUvSLYG0vmh8aOGBW/"
              : "https://my.spline.design/claritystream-A6s6qfCZjwijbspR7VFjfgWO/"
          }
          loading="lazy"
          style={{
            position: "absolute",
            width: "110%",
            height: "720px",
            left: "-5%",
            bottom: "-340px",
            border: "none",
            opacity: c.isDark ? 1 : 0.18,
            transform: c.isDark ? "scale(1.25)" : "scale(1.15)",
            transformOrigin: "center bottom",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        {/* Left/right side fades */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 160,
            zIndex: 3,
            background: `linear-gradient(90deg, ${c.isDark ? "#000" : c.bgSection} 0%, transparent 100%)`,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: 160,
            zIndex: 3,
            background: `linear-gradient(270deg, ${c.isDark ? "#000" : c.bgSection} 0%, transparent 100%)`,
            pointerEvents: "none",
          }}
        />

        {/* Top fade — text sits on a clean surface */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 240,
            zIndex: 3,
            background: `linear-gradient(to bottom, ${c.isDark ? "#000" : c.bgSection} 20%, transparent 100%)`,
            pointerEvents: "none",
          }}
        />

        {/* Bottom fade */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 100,
            zIndex: 3,
            background: `linear-gradient(to top, ${c.isDark ? "#000" : c.bgSection} 0%, transparent 100%)`,
            pointerEvents: "none",
          }}
        />

        {/* ── Heading overlay ── */}
        <div
          style={{
            position: "relative",
            zIndex: 4,
            textAlign: "center",
            paddingTop: 52,
            paddingBottom: 0,
          }}
        >
          {/* Small eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                width: 28,
                height: 1,
                background:
                  `linear-gradient(90deg, transparent, ${c.accent}99)`,
              }}
            />
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.5em",
                textTransform: "uppercase",
                color: c.accent,
              }}
            >
              Trusted by builders at
            </span>
            <div
              style={{
                width: 28,
                height: 1,
                background:
                  `linear-gradient(270deg, transparent, ${c.accent}99)`,
              }}
            />
          </motion.div>

          {/* Large display heading */}
          <motion.h2
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.82, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontSize: isMobile
                ? "clamp(40px, 10vw, 60px)"
                : "clamp(56px, 6.5vw, 88px)",
              fontWeight: 900,
              letterSpacing: "-0.055em",
              lineHeight: 1.0,
              margin: "0 0 18px",
              textShadow: c.isDark
                ? "0 2px 40px rgba(0,0,0,0.6)"
                : `0 2px 32px ${c.accent}20`,
            }}
          >
            <span style={{ color: c.text }}>Clarity. </span>
            <span style={{ color: c.accent }}>Focus.</span>
            {!isMobile && <br />}
            {isMobile && " "}
            <span
              style={{
                color: "transparent",
                WebkitTextStroke: c.isDark
                  ? isMobile
                    ? "1px rgba(255,255,255,0.35)"
                    : "1.5px rgba(255,255,255,0.3)"
                  : isMobile
                  ? `1px ${c.accent}70`
                  : `1.5px ${c.accent}60`,
              }}
            >
              Impact.
            </span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontSize: isMobile ? 13 : "clamp(13px, 1.2vw, 16px)",
              color: c.textMuted,
              letterSpacing: "-0.01em",
              margin: 0,
              textShadow: c.isDark ? "0 1px 16px rgba(0,0,0,0.8)" : "none",
            }}
          >
            We turn complex ideas into effortless digital experiences.
          </motion.p>
        </div>
      </div>

      {/* ── Marquee strip — sits below the Spline wave ── */}
      <div
        style={{
          background: c.bgSection,
          borderTop: `1px solid ${c.border}`,
          paddingTop: 24,
          paddingBottom: 24,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Edge masks */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 120,
            zIndex: 1,
            background: `linear-gradient(90deg, ${c.bgSection} 0%, transparent 100%)`,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: 120,
            zIndex: 1,
            background: `linear-gradient(270deg, ${c.bgSection} 0%, transparent 100%)`,
            pointerEvents: "none",
          }}
        />

        <div className="marquee-track" style={{ gap: 0 }}>
          {[...PROJECT_LOGOS, ...PROJECT_LOGOS].map((logo, i) => (
            <span
              key={i}
              style={{ display: "inline-flex", alignItems: "center" }}
            >
              <span
                style={{
                  padding: isMobile ? "0 24px" : "0 40px",
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                <Image
                  src={`/project_logos/${logo.file}`}
                  alt={logo.alt}
                  width={120}
                  height={48}
                  style={{
                    objectFit: "contain",
                    width: "auto",
                    height: isMobile ? 32 : 40,
                    filter: c.isDark
                      ? "brightness(0) invert(1)"
                      : "brightness(0)",
                    opacity: c.isDark ? 0.55 : 0.4,
                  }}
                />
              </span>
              <span
                style={{
                  width: 1,
                  height: 20,
                  background: c.isDark
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(0,0,0,0.08)",
                  flexShrink: 0,
                }}
              />
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
