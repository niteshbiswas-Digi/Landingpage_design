'use client';
import { useRef, useState, useEffect } from 'react';
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
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

const PROJECTS = [
  {
    id: 1,
    name: 'Gym Management System',
    tag: 'AI / Fitness',
    desc: 'AI-powered fitness app offering personalized workout routines and nutrition plans. Uses machine learning to analyze user data and integrates with wearables for real-time feedback.',
    stack: ['React Native', 'Python', 'TensorFlow', 'Firebase'],
    status: 'Live',
    statusColor: '#4ade80',
    metric: '10K+',
    metricLabel: 'active users',
    bg: 'linear-gradient(145deg, #120824 0%, #0b1630 60%, #050505 100%)',
    accent: '#a78bfa',
    large: true,
  },
  {
    id: 2,
    name: 'Patient Care Application',
    tag: 'Healthcare / Mobile',
    desc: 'User-friendly mobile app for improved patient care with appointment scheduling, medication reminders, and health tracking capabilities.',
    stack: ['Swift', 'Kotlin', 'Node.js', 'PostgreSQL'],
    status: 'Live',
    statusColor: '#4ade80',
    metric: '5K+',
    metricLabel: 'patients supported',
    bg: 'linear-gradient(145deg, #061808 0%, #0a1a0a 100%)',
    accent: '#4ade80',
    large: false,
  },
  {
    id: 3,
    name: 'Asset Management System',
    tag: 'Enterprise / SaaS',
    desc: 'Centralized platform for efficient tracking and organization of physical and digital assets. Features inventory management, usage monitoring, and real-time reporting.',
    stack: ['Vue.js', 'C#', 'SQL Server', 'AWS'],
    status: 'Live',
    statusColor: '#4ade80',
    metric: '500+',
    metricLabel: 'organizations',
    bg: 'linear-gradient(145deg, #1a1000 0%, #1f1500 100%)',
    accent: '#fbbf24',
    large: false,
  },
  {
    id: 4,
    name: 'Wisterias SaaS',
    tag: 'Web / SaaS',
    desc: 'Comprehensive SaaS web application with seamless functionality, scalability, and intuitive UI/UX design. Built for business operations at scale.',
    stack: ['Next.js', 'TypeScript', 'MongoDB', 'Vercel'],
    status: 'Live',
    statusColor: '#4ade80',
    metric: '100+',
    metricLabel: 'companies using',
    bg: 'linear-gradient(145deg, #04101a 0%, #071520 100%)',
    accent: '#38bdf8',
    large: true,
  },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.13 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 44, scale: 0.97 },
  show: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

/* ── 3-D tilt card ── */
function ProjectCard({ project, isMobile }: { project: typeof PROJECTS[0]; isMobile: boolean }) {
  const cardRef  = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const { c } = useTheme();

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotX = useSpring(useTransform(rawY, [-0.5, 0.5], [6, -6]),  { stiffness: 160, damping: 24 });
  const rotY = useSpring(useTransform(rawX, [-0.5, 0.5], [-6, 6]),  { stiffness: 160, damping: 24 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isMobile) return;
    const r = cardRef.current.getBoundingClientRect();
    rawX.set((e.clientX - r.left) / r.width  - 0.5);
    rawY.set((e.clientY - r.top)  / r.height - 0.5);
  };
  const handleLeave = () => {
    rawX.set(0);
    rawY.set(0);
    setHovered(false);
  };

  return (
    <motion.div
      variants={itemVariants}
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleLeave}
      whileHover={!isMobile ? { y: -8, boxShadow: `0 30px 60px ${project.accent}15` } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      style={{
        rotateX: rotX,
        rotateY: rotY,
        transformStyle: "preserve-3d",
        transformPerspective: 900,
        position: "relative",
        background: c.isDark ? project.bg : `linear-gradient(145deg, ${project.accent}08 0%, ${c.bgCard} 100%)`,
        borderRadius: 20,
        padding: isMobile ? "20px" : (project.large ? "40px" : "28px"),
        overflow: "hidden",
        border: `1px solid ${hovered ? project.accent + "50" : c.border}`,
        height: "100%",
        minHeight: isMobile ? 200 : (project.large ? 360 : 240),
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "border-color 0.3s ease",
        willChange: "transform",
      }}
    >
      {/* Radial glow on hover */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.35 }}
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `radial-gradient(ellipse 65% 55% at 25% 25%, ${project.accent}22 0%, transparent 65%)`,
        }}
      />

      {/* Shimmer sweep on enter */}
      <motion.div
        initial={{ x: "-110%" }}
        animate={{ x: hovered ? "220%" : "-110%" }}
        transition={{
          duration: hovered ? 0.72 : 0,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 3,
          pointerEvents: "none",
          background: `linear-gradient(108deg, transparent 20%, ${project.accent}1a 50%, transparent 80%)`,
          transform: "skewX(-8deg)",
        }}
      />

      {/* Top */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 16,
          }}
        >
          <div>
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: project.accent,
                display: "block",
                marginBottom: 8,
              }}
            >
              {project.tag}
            </motion.span>
            <h3
              style={{
                fontSize: project.large
                  ? "clamp(28px, 2.8vw, 44px)"
                  : "clamp(20px, 2.2vw, 30px)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                color: c.isDark ? "#f0f0f0" : c.text,
                margin: 0,
                lineHeight: 1,
              }}
            >
              {project.name}
            </h3>
          </div>
          {/* Pulsing status badge */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.3, 0.6] }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                position: "absolute",
                inset: -4,
                borderRadius: 99,
                background: `${project.statusColor}22`,
              }}
            />
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: project.statusColor,
                background: `${project.statusColor}16`,
                border: `1px solid ${project.statusColor}36`,
                padding: "4px 10px",
                borderRadius: 99,
                position: "relative",
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: project.statusColor,
                  display: "inline-block",
                }}
              />
              {project.status}
            </span>
          </div>
        </div>

        <p
          style={{
            fontSize: project.large ? 14 : 13,
            color: c.textMuted,
            lineHeight: 1.7,
            letterSpacing: "-0.01em",
            maxWidth: 480,
          }}
        >
          {project.desc}
        </p>
      </div>

      {/* Bottom */}
      <div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            margin: "20px 0",
          }}
        >
          {project.stack.map((tech, ti) => (
            <motion.span
              key={tech}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: ti * 0.06 }}
              whileHover={{
                scale: 1.12,
                borderColor: `${project.accent}88`,
                color: project.accent,
                boxShadow: `0 0 12px ${project.accent}30`,
              }}
              style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: c.isDark ? "#777" : c.textMuted,
                background: c.isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
                border: `1px solid ${c.isDark ? "rgba(255,255,255,0.07)" : c.border}`,
                padding: "4px 10px",
                borderRadius: 6,
                transition:
                  "color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease",
              }}
            >
              {tech}
            </motion.span>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 8,
            borderTop: `1px solid ${c.border}`,
            paddingTop: 20,
          }}
        >
          <motion.span
            animate={{ color: hovered ? project.accent : project.accent }}
            style={{
              fontSize: project.large
                ? "clamp(26px, 2.6vw, 38px)"
                : "clamp(20px, 2vw, 28px)",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              color: project.accent,
            }}
          >
            {project.metric}
          </motion.span>
          <span
            style={{
              fontSize: 11,
              color: c.textMuted,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            {project.metricLabel}
          </span>
        </div>
      </div>

      {/* Hover arrow */}
      <motion.div
        animate={{
          x: hovered ? 0 : 14,
          opacity: hovered ? 1 : 0,
          rotate: hovered ? 0 : -10,
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        style={{
          position: "absolute",
          bottom: project.large ? 40 : 28,
          right: project.large ? 40 : 28,
          width: 34,
          height: 34,
          borderRadius: "50%",
          background: project.accent,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 0 20px ${project.accent}55`,
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#000"
          strokeWidth="3"
        >
          <path
            d="M7 17L17 7M17 7H7M17 7v10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
    </motion.div>
  )
}

/* ── Section header word-reveal ── */
function HeaderWord({ text, inView, delay = 0, dim }: { text: string; inView: boolean; delay?: number; dim?: boolean }) {
  const { c } = useTheme();
  return (
    <span style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}>
      <motion.span
        style={{ display: 'inline-block', color: dim ? c.textMuted : (c.isDark ? c.text : c.accent) }}
        initial={{ y: '110%', opacity: 0 }}
        animate={inView ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {text}
      </motion.span>
    </span>
  );
}

export default function ProjectsSection() {
  const ref    = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-8%' });
  const { c } = useTheme();
  const isMobile = useIsMobile();

  return (
    <section
      ref={ref}
      style={{ padding: 'clamp(40px, 5vw, 80px) clamp(24px, 5vw, 80px)', background: c.bg, overflow: 'hidden' }}
    >
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        marginBottom: 'clamp(40px, 5vw, 72px)', flexWrap: 'wrap', gap: 32,
      }}>
        <div>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.4em', textTransform: 'uppercase', color: c.accent, marginBottom: 16 }}
          >
            Selected Work
          </motion.p>
          <h2 style={{
            fontSize: 'clamp(36px, 5vw, 68px)', fontWeight: 900,
            letterSpacing: '-0.05em', lineHeight: 0.92, margin: 0,
          }}>
            <HeaderWord text="Innovative" inView={inView} delay={0.06} />
            {' '}
            <HeaderWord text="App" inView={inView} delay={0.13} />
            <br />
            <HeaderWord text="Solutions" inView={inView} delay={0.2} dim />
            {' '}
            <HeaderWord text="Delivered." inView={inView} delay={0.27} dim />
          </h2>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <p style={{ fontSize: 13, color: c.textSub, lineHeight: 1.65, maxWidth: 260, margin: '0 0 20px 0' }}>
            From seed-stage startups to Fortune 500 infrastructure. Every engagement ships on time.
          </p>
          <motion.button
            whileHover={{ x: 6 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            style={{
              background: 'transparent', border: 'none', padding: 0,
              display: 'flex', alignItems: 'center', gap: 8,
              color: c.accent, fontSize: 12, fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase',
            }}
          >
            View all projects
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.button>
        </motion.div>
      </div>

      {/* Bento Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'show' : 'hidden'}
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gridTemplateRows: 'auto auto',
          gap: isMobile ? 16 : 12,
        }}
      >
        <div style={{ gridColumn: isMobile ? '1' : '1 / 3', gridRow: isMobile ? 'auto' : '1' }}>
          <ProjectCard project={PROJECTS[0]} isMobile={isMobile} />
        </div>
        <div style={{ gridColumn: isMobile ? '1' : '3', gridRow: isMobile ? 'auto' : '1' }}>
          <ProjectCard project={PROJECTS[1]} isMobile={isMobile} />
        </div>
        <div style={{ gridColumn: isMobile ? '1' : '1', gridRow: isMobile ? 'auto' : '2' }}>
          <ProjectCard project={PROJECTS[2]} isMobile={isMobile} />
        </div>
        <div style={{ gridColumn: isMobile ? '1' : '2 / 4', gridRow: isMobile ? 'auto' : '2' }}>
          <ProjectCard project={PROJECTS[3]} isMobile={isMobile} />
        </div>
      </motion.div>
    </section>
  );
}
