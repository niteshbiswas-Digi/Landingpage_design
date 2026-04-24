'use client';
import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';

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

/* ─────────────────────────────────────────────
   Thumbnail art components — one per post
───────────────────────────────────────────── */

function ChatbotThumbnail() {
  return (
    <div style={{
      width: '100%', height: '100%', position: 'relative', overflow: 'hidden',
      background: 'radial-gradient(ellipse at 30% 35%, rgba(167,139,250,0.18) 0%, #080808 65%)',
    }}>
      {/* Dot grid */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.022) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }} />

      {/* Neural-network lines */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.18 }} viewBox="0 0 400 280" preserveAspectRatio="xMidYMid slice">
        <line x1="20"  y1="260" x2="120" y2="190" stroke="#a78bfa" strokeWidth="0.8" />
        <line x1="120" y1="190" x2="220" y2="230" stroke="#a78bfa" strokeWidth="0.8" />
        <line x1="220" y1="230" x2="350" y2="200" stroke="#a78bfa" strokeWidth="0.8" />
        <line x1="120" y1="190" x2="180" y2="130" stroke="#a78bfa" strokeWidth="0.8" />
        <line x1="180" y1="130" x2="280" y2="150" stroke="#a78bfa" strokeWidth="0.8" />
        <line x1="280" y1="150" x2="380" y2="120" stroke="#a78bfa" strokeWidth="0.8" />
        {[
          [20,260],[120,190],[220,230],[350,200],[180,130],[280,150],[380,120],
        ].map(([cx,cy],i) => (
          <circle key={i} cx={cx} cy={cy} r="3.5" fill="#a78bfa" />
        ))}
      </svg>

      {/* Chat bubbles */}
      <div style={{
        position: 'absolute', top: '14%', left: '8%', right: '8%',
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        {/* User bubble */}
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            alignSelf: 'flex-end',
            background: 'rgba(167,139,250,0.14)',
            border: '1px solid rgba(167,139,250,0.3)',
            borderRadius: '14px 14px 3px 14px',
            padding: '9px 14px', maxWidth: '65%',
          }}
        >
          <div style={{ fontSize: 10, color: 'rgba(200,185,255,0.9)', lineHeight: 1.4 }}>
            How can AI help my business grow?
          </div>
        </motion.div>

        {/* AI response bubble */}
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.7 }}
          style={{
            alignSelf: 'flex-start',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: '14px 14px 14px 3px',
            padding: '9px 14px', maxWidth: '72%',
          }}
        >
          <div style={{ fontSize: 10, color: '#999', lineHeight: 1.5, marginBottom: 6 }}>
            AI chatbots automate 24/7 support, qualify leads, and personalise—
          </div>
          {/* Typing dots */}
          <div style={{ display: 'flex', gap: 4 }}>
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                animate={{ y: [0, -4, 0], opacity: [0.35, 1, 0.35] }}
                transition={{ duration: 0.75, repeat: Infinity, delay: i * 0.18 }}
                style={{ width: 5, height: 5, borderRadius: '50%', background: '#a78bfa' }}
              />
            ))}
          </div>
        </motion.div>

        {/* Third bubble */}
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.4 }}
          style={{
            alignSelf: 'flex-end',
            background: 'rgba(167,139,250,0.08)',
            border: '1px solid rgba(167,139,250,0.18)',
            borderRadius: '14px 14px 3px 14px',
            padding: '7px 12px', maxWidth: '45%',
          }}
        >
          <div style={{ fontSize: 9, color: 'rgba(200,185,255,0.65)', lineHeight: 1.4 }}>
            Tell me more ↗
          </div>
        </motion.div>
      </div>

      {/* AI badge bottom-right */}
      <div style={{
        position: 'absolute', bottom: 16, right: 16,
        background: 'rgba(167,139,250,0.12)', border: '1px solid rgba(167,139,250,0.28)',
        borderRadius: 8, padding: '5px 11px',
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <motion.div
          animate={{ scale: [1,1.4,1], opacity: [0.6,1,0.6] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          style={{ width: 5, height: 5, borderRadius: '50%', background: '#a78bfa' }}
        />
        <span style={{ fontSize: 8, fontWeight: 700, color: '#a78bfa', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          AI Powered
        </span>
      </div>
    </div>
  );
}

function MonorepoThumbnail() {
  return (
    <div style={{
      width: '100%', height: '100%', position: 'relative', overflow: 'hidden',
      background: 'radial-gradient(ellipse at 70% 25%, rgba(56,189,248,0.15) 0%, #080808 65%)',
    }}>
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.022) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }} />

      {/* Diagonal stripe accent */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.07,
        backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 18px, rgba(56,189,248,1) 18px, rgba(56,189,248,1) 19px)',
      }} />

      {/* Tree diagram */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 400 280" preserveAspectRatio="xMidYMid meet">
        {/* Root node */}
        <rect x="150" y="18" width="100" height="30" rx="6" fill="rgba(56,189,248,0.14)" stroke="rgba(56,189,248,0.45)" strokeWidth="1" />
        <text x="200" y="37" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="700" fontFamily="monospace">MONOREPO</text>

        {/* Root → branches */}
        <line x1="200" y1="48" x2="200" y2="72" stroke="rgba(56,189,248,0.35)" strokeWidth="1" strokeDasharray="4,3" />
        <line x1="80" y1="72" x2="320" y2="72" stroke="rgba(56,189,248,0.25)" strokeWidth="1" />
        <line x1="80"  y1="72" x2="80"  y2="98" stroke="rgba(56,189,248,0.35)" strokeWidth="1" strokeDasharray="4,3" />
        <line x1="200" y1="72" x2="200" y2="98" stroke="rgba(56,189,248,0.35)" strokeWidth="1" strokeDasharray="4,3" />
        <line x1="320" y1="72" x2="320" y2="98" stroke="rgba(56,189,248,0.35)" strokeWidth="1" strokeDasharray="4,3" />

        {/* Branch nodes */}
        {[
          { x: 40,  label: '/web-app'   },
          { x: 160, label: '/mobile'    },
          { x: 280, label: '/shared'    },
        ].map(({ x, label }) => (
          <g key={label}>
            <rect x={x} y="98" width="80" height="26" rx="5" fill="rgba(56,189,248,0.08)" stroke="rgba(56,189,248,0.28)" strokeWidth="1" />
            <text x={x + 40} y="115" textAnchor="middle" fill="rgba(56,189,248,0.85)" fontSize="8.5" fontFamily="monospace">{label}</text>
          </g>
        ))}

        {/* Sub-branches */}
        <line x1="80"  y1="124" x2="80"  y2="150" stroke="rgba(56,189,248,0.2)" strokeWidth="1" strokeDasharray="3,3" />
        <line x1="320" y1="124" x2="320" y2="150" stroke="rgba(56,189,248,0.2)" strokeWidth="1" strokeDasharray="3,3" />
        <rect x="42"  y="150" width="76" height="22" rx="4" fill="rgba(56,189,248,0.05)" stroke="rgba(56,189,248,0.15)" strokeWidth="1" />
        <text x="80"  y="164" textAnchor="middle" fill="rgba(56,189,248,0.55)" fontSize="7.5" fontFamily="monospace">components</text>
        <rect x="278" y="150" width="84" height="22" rx="4" fill="rgba(56,189,248,0.05)" stroke="rgba(56,189,248,0.15)" strokeWidth="1" />
        <text x="320" y="164" textAnchor="middle" fill="rgba(56,189,248,0.55)" fontSize="7.5" fontFamily="monospace">utils / hooks</text>

        {/* Version tags */}
        <rect x="290" y="195" width="90" height="18" rx="4" fill="rgba(56,189,248,0.06)" stroke="rgba(56,189,248,0.12)" strokeWidth="1" />
        <text x="335" y="207" textAnchor="middle" fill="rgba(56,189,248,0.45)" fontSize="7" fontFamily="monospace">v2.4.1-stable</text>
      </svg>

      {/* Badge */}
      <div style={{
        position: 'absolute', bottom: 14, left: 16,
        background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.25)',
        borderRadius: 7, padding: '4px 10px',
        fontSize: 8, fontWeight: 700, color: '#38bdf8', letterSpacing: '0.18em', textTransform: 'uppercase',
      }}>
        Single Source of Truth
      </div>
    </div>
  );
}

function PWAThumbnail() {
  return (
    <div style={{
      width: '100%', height: '100%', position: 'relative', overflow: 'hidden',
      background: 'radial-gradient(ellipse at 55% 30%, rgba(34,199,111,0.15) 0%, #080808 65%)',
    }}>
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.022) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }} />

      {/* React atom — centered */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -55%)',
      }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          style={{ width: 110, height: 110 }}
        >
          <svg viewBox="0 0 110 110" width="110" height="110">
            <circle cx="55" cy="55" r="7" fill="#22C76F" />
            <ellipse cx="55" cy="55" rx="48" ry="18" fill="none" stroke="rgba(34,199,111,0.45)" strokeWidth="1.5" />
            <ellipse cx="55" cy="55" rx="48" ry="18" fill="none" stroke="rgba(34,199,111,0.32)" strokeWidth="1.5" transform="rotate(60 55 55)" />
            <ellipse cx="55" cy="55" rx="48" ry="18" fill="none" stroke="rgba(34,199,111,0.25)" strokeWidth="1.5" transform="rotate(120 55 55)" />
            <circle cx="103" cy="55" r="4.5" fill="#22C76F" opacity="0.9" />
            <circle cx="31"  cy="74" r="3.5" fill="#22C76F" opacity="0.65" />
            <circle cx="31"  cy="36" r="3"   fill="#22C76F" opacity="0.5" />
          </svg>
        </motion.div>
      </div>

      {/* Capability pills top-left */}
      <div style={{
        position: 'absolute', top: 14, left: 14,
        display: 'flex', flexDirection: 'column', gap: 5,
      }}>
        {[
          { label: '⚡ Fast', delay: 0 },
          { label: '📶 Offline', delay: 0.15 },
          { label: '📱 Native feel', delay: 0.3 },
        ].map(({ label, delay }) => (
          <motion.div
            key={label}
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay }}
            style={{
              background: 'rgba(34,199,111,0.09)',
              border: '1px solid rgba(34,199,111,0.22)',
              borderRadius: 6, padding: '3px 9px',
              fontSize: 9, fontWeight: 700, color: 'rgba(34,199,111,0.9)',
            }}
          >
            {label}
          </motion.div>
        ))}
      </div>

      {/* Browser address bar — bottom */}
      <div style={{
        position: 'absolute', bottom: 14, left: 14, right: 14,
        background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 9, padding: '7px 12px',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {['#f43f5e','#22C76F','#4ade80'].map(c => (
            <div key={c} style={{ width: 6, height: 6, borderRadius: '50%', background: c, opacity: 0.7 }} />
          ))}
        </div>
        <div style={{
          flex: 1, height: 16,
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 4, display: 'flex', alignItems: 'center', padding: '0 8px',
        }}>
          <span style={{ fontSize: 8, color: '#444' }}>🔒 app.pwa / react.js</span>
        </div>
        {/* Install icon */}
        <div style={{
          background: 'rgba(34,199,111,0.15)', border: '1px solid rgba(34,199,111,0.3)',
          borderRadius: 5, padding: '2px 7px',
          fontSize: 8, fontWeight: 700, color: '#22C76F',
        }}>
          Install
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Post data
───────────────────────────────────────────── */

const POSTS = [
  {
    id: 1,
    category: 'AI & Chatbots',
    categoryColor: '#a78bfa',
    title: 'Why Every Business Needs a Chatbot for Customer Engagement',
    excerpt: 'Businesses are looking for innovative ways to enhance customer service, augment engagement, and streamline operations — and AI chatbots are leading the charge.',
    date: 'Apr 21, 2026',
    readTime: '5 min read',
    href: 'https://www.upcodo.com/blog/454/why-every-business-needs-a-chatbot-for-customer-engagement/',
    Thumbnail: ChatbotThumbnail,
  },
  {
    id: 2,
    category: 'Engineering',
    categoryColor: '#38bdf8',
    title: 'Building a Monorepo for Web and Mobile Apps',
    excerpt: 'A monorepo — a single repository containing multiple projects — streamlines workflows, enhances collaboration, and maintains consistency across platforms.',
    date: 'Dec 9, 2025',
    readTime: '7 min read',
    href: 'https://www.upcodo.com/blog/483/building-a-monorepo-for-web-and-mobile-apps/',
    Thumbnail: MonorepoThumbnail,
  },
  {
    id: 3,
    category: 'React · PWA',
    categoryColor: '#22C76F',
    title: "Mastering Progressive Web Apps with React.JS: A Beginner's Guide",
    excerpt: 'Progressive Web Apps have emerged as a powerful approach to building web applications that offer a native app-like experience — right in the browser.',
    date: 'Oct 31, 2025',
    readTime: '6 min read',
    href: 'https://www.upcodo.com/blog/482/mastering-progressive-web-apps-with-react-js-a-beginner-s-guide/',
    Thumbnail: PWAThumbnail,
  },
];

function ArrowIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

export default function BlogSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: false, margin: '-8%' });
  const isMobile = useIsMobile();
  const featured = POSTS[0];
  const rest = POSTS.slice(1);

  return (
    <section ref={ref} style={{
      background: '#050505',
      borderTop: '1px solid rgba(255,255,255,0.04)',
      padding: 'clamp(60px, 7vw, 100px) clamp(24px, 5vw, 80px)',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', bottom: -200, right: '15%', width: 520, height: 520,
        borderRadius: '50%', pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(34,199,111,0.04) 0%, transparent 65%)',
      }} />

      {/* Ghost watermark */}
      <div style={{
        position: 'absolute', right: -20, top: '10%', pointerEvents: 'none', userSelect: 'none',
        fontSize: 'clamp(80px, 14vw, 180px)', fontWeight: 900, letterSpacing: '-0.07em', lineHeight: 1,
        color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.018)',
        fontFamily: 'var(--font-outfit), sans-serif',
      }}>
        BLOG
      </div>

      {/* ── Header ── */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-end', flexWrap: 'wrap', gap: 24,
        marginBottom: 'clamp(36px, 4vw, 60px)',
        position: 'relative', zIndex: 2,
      }}>
        <div>
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
              style={{ width: 28, height: 1, background: '#22C76F', transformOrigin: 'left' }}
            />
            <p style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '0.4em',
              textTransform: 'uppercase', color: '#22C76F', margin: 0,
            }}>
              From the Desk
            </p>
          </motion.div>

          <h2 style={{
            fontSize: 'clamp(36px, 5vw, 68px)', fontWeight: 900,
            letterSpacing: '-0.05em', lineHeight: 0.92, margin: 0,
          }}>
            {[
              { text: 'Recent blog', color: '#f0f0f0', delay: 0.08 },
              { text: 'posts.', color: 'transparent', delay: 0.2, stroke: true },
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

        <motion.a
          href="https://www.upcodo.com/blog/"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ x: 5, color: '#22C76F' }}
          style={{
            display: 'flex', alignItems: 'center', gap: 9,
            fontSize: 11, fontWeight: 700, color: '#666',
            textDecoration: 'none', letterSpacing: '0.1em', textTransform: 'uppercase',
          }}
        >
          View all posts <ArrowIcon />
        </motion.a>
      </div>

      {/* ── Posts grid ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1.6fr 1fr',
        gridTemplateRows: isMobile ? 'auto' : 'auto auto',
        gap: 14,
        alignItems: 'start',
        position: 'relative', zIndex: 2,
      }}>

        {/* ── Featured post ── */}
        <motion.a
          href={featured.href}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 36 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.78, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -7 }}
          style={{
            gridRow: isMobile ? 'auto' : '1 / 3',
            background: '#0d0d0d',
            border: `1px solid rgba(255,255,255,0.05)`,
            borderRadius: 22, overflow: 'hidden',
            cursor: 'pointer', position: 'relative',
            textDecoration: 'none', display: 'block',
          }}
        >
          {/* Thumbnail */}
          <div style={{ height: isMobile ? 220 : 300, position: 'relative', overflow: 'hidden' }}>
            <featured.Thumbnail />

            {/* Category badge */}
            <div style={{
              position: 'absolute', top: 16, left: 16, zIndex: 3,
              background: `${featured.categoryColor}18`,
              border: `1px solid ${featured.categoryColor}35`,
              borderRadius: 7, padding: '5px 13px',
              fontSize: 9, fontWeight: 700, color: featured.categoryColor,
              letterSpacing: '0.25em', textTransform: 'uppercase',
            }}>
              {featured.category}
            </div>

            {/* Read-time badge */}
            <div style={{
              position: 'absolute', top: 16, right: 16, zIndex: 3,
              background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 6, padding: '4px 10px',
              fontSize: 9, fontWeight: 600, color: '#888', letterSpacing: '0.06em',
            }}>
              {featured.readTime}
            </div>

            {/* Bottom fade into card */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: 70,
              background: 'linear-gradient(to top, #0d0d0d 0%, transparent 100%)',
              pointerEvents: 'none',
            }} />
          </div>

          {/* Content */}
          <div style={{ padding: 30 }}>
            <div style={{
              display: 'flex', gap: 10, marginBottom: 16,
              fontSize: 9, color: '#555', letterSpacing: '0.1em',
              textTransform: 'uppercase', fontWeight: 600,
            }}>
              <span>{featured.date}</span>
              <span style={{ color: '#333' }}>·</span>
              <span>{featured.readTime}</span>
            </div>

            <h3 style={{
              fontSize: 'clamp(19px, 2.2vw, 26px)', fontWeight: 800,
              color: '#e8e8e8', letterSpacing: '-0.03em', lineHeight: 1.22,
              margin: '0 0 14px',
            }}>
              {featured.title}
            </h3>

            <p style={{
              fontSize: 13, color: '#666', lineHeight: 1.8,
              margin: '0 0 28px', letterSpacing: '-0.01em',
            }}>
              {featured.excerpt}
            </p>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{
                height: 1, marginBottom: 24, transformOrigin: 'left',
                background: 'linear-gradient(90deg, rgba(255,255,255,0.06) 0%, transparent 100%)',
              }}
            />

            <motion.span
              whileHover={{ gap: '14px' }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                fontSize: 12, fontWeight: 700, color: '#22C76F',
              }}
            >
              Read full article <ArrowIcon />
            </motion.span>
          </div>
        </motion.a>

        {/* ── Smaller posts ── */}
        {rest.map((post, i) => (
          <motion.a
            key={post.id}
            href={post.href}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.72, delay: 0.18 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -5 }}
            style={{
              background: '#0d0d0d',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: 18, overflow: 'hidden',
              cursor: 'pointer', position: 'relative',
              textDecoration: 'none', display: 'block',
            }}
          >
            {/* Thumbnail strip */}
            <div style={{ height: 140, position: 'relative', overflow: 'hidden' }}>
              <post.Thumbnail />

              {/* Top accent line */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.7, delay: 0.3 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                  background: `linear-gradient(90deg, ${post.categoryColor}80 0%, transparent 70%)`,
                  transformOrigin: 'left', zIndex: 3,
                }}
              />

              {/* Category badge */}
              <div style={{
                position: 'absolute', top: 12, left: 12, zIndex: 3,
                background: `${post.categoryColor}15`,
                border: `1px solid ${post.categoryColor}28`,
                borderRadius: 5, padding: '3px 9px',
                fontSize: 8, fontWeight: 700, color: post.categoryColor,
                letterSpacing: '0.2em', textTransform: 'uppercase',
              }}>
                {post.category}
              </div>

              {/* Bottom fade */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: 48,
                background: 'linear-gradient(to top, #0d0d0d 0%, transparent 100%)',
                pointerEvents: 'none',
              }} />
            </div>

            {/* Content */}
            <div style={{ padding: '16px 20px 20px' }}>
              <h3 style={{
                fontSize: 'clamp(14px, 1.5vw, 16px)', fontWeight: 700,
                color: '#ddd', letterSpacing: '-0.025em', lineHeight: 1.35,
                margin: '0 0 9px',
              }}>
                {post.title}
              </h3>
              <p style={{
                fontSize: 12, color: '#666', lineHeight: 1.72,
                margin: '0 0 16px', letterSpacing: '-0.01em',
              }}>
                {post.excerpt}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  fontSize: 9, color: '#4a4a4a', letterSpacing: '0.08em',
                  textTransform: 'uppercase', fontWeight: 600,
                }}>
                  {post.date} · {post.readTime}
                </span>
                <motion.span
                  whileHover={{ x: 4 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    fontSize: 11, fontWeight: 700, color: '#22C76F',
                  }}
                >
                  Read <ArrowIcon />
                </motion.span>
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
