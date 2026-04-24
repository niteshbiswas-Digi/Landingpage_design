'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

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

const ease = [0.16, 1, 0.3, 1] as const;

const NAV_LINKS = [
  { label: 'About Us', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Jobs', href: '#' },
  { label: 'Blog', href: '#' },
  { label: 'Contact', href: '#' },
];

function SocialBtn({ name, href, children }: { name: string; href: string; children: React.ReactNode }) {
  return (
    <motion.a
      href={href}
      aria-label={name}
      whileHover={{ scale: 1.1, y: -3 }}
      whileTap={{ scale: 0.93 }}
      style={{
        width: 38, height: 38,
        borderRadius: 10,
        border: '1px solid rgba(255,255,255,0.07)',
        background: 'rgba(255,255,255,0.025)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#4a4a4a',
        textDecoration: 'none',
        transition: 'color 0.22s, border-color 0.22s, background 0.22s, box-shadow 0.22s',
        flexShrink: 0,
      }}
      onMouseEnter={e => {
        const el = e.currentTarget;
        el.style.color = '#22C76F';
        el.style.borderColor = 'rgba(34,199,111,0.32)';
        el.style.background = 'rgba(34,199,111,0.06)';
        el.style.boxShadow = '0 0 22px rgba(34,199,111,0.18), inset 0 0 14px rgba(34,199,111,0.04)';
      }}
      onMouseLeave={e => {
        const el = e.currentTarget;
        el.style.color = '#4a4a4a';
        el.style.borderColor = 'rgba(255,255,255,0.07)';
        el.style.background = 'rgba(255,255,255,0.025)';
        el.style.boxShadow = 'none';
      }}
    >
      {children}
    </motion.a>
  );
}

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const isMobile = useIsMobile();

  return (
    <motion.footer
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.9, ease }}
      style={{ background: '#050505', position: 'relative', overflow: 'hidden' }}
    >
      {/* Background orbs */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div
          className="orb-a"
          style={{
            position: 'absolute', width: 560, height: 560,
            top: '-20%', left: '-12%', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(34,199,111,0.05) 0%, transparent 68%)',
            filter: 'blur(48px)',
          }}
        />
        <div
          className="orb-b"
          style={{
            position: 'absolute', width: 400, height: 400,
            bottom: '5%', right: '-8%', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(167,139,250,0.035) 0%, transparent 70%)',
            filter: 'blur(48px)',
          }}
        />
        {/* Subtle dot grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.4) 30%, rgba(0,0,0,0.4) 70%, transparent 100%)',
        }} />
      </div>

      {/* Watermark */}
      <div style={{
        position: 'absolute', inset: 0, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none', overflow: 'hidden',
      }}>
        <span style={{
          fontSize: 'clamp(88px, 20vw, 240px)',
          fontWeight: 900, letterSpacing: '-0.06em',
          color: 'transparent',
          WebkitTextStroke: '1px rgba(255,255,255,0.022)',
          fontFamily: 'var(--font-outfit)',
          userSelect: 'none', whiteSpace: 'nowrap',
        }}>
          UPCODO
        </span>
      </div>

      {/* Animated top border */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={inView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 1.4, ease, delay: 0.1 }}
        style={{
          height: 1,
          background: 'linear-gradient(90deg, transparent 0%, rgba(34,199,111,0.18) 20%, rgba(34,199,111,0.55) 50%, rgba(34,199,111,0.18) 80%, transparent 100%)',
          transformOrigin: 'left',
        }}
      />

      {/* Main content */}
      <div style={{
        position: 'relative', zIndex: 1,
        padding: 'clamp(52px, 6.5vw, 88px) clamp(24px, 5vw, 80px) clamp(28px, 3.5vw, 44px)',
      }}>

        {/* 3-column grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '2.2fr 1fr 1.1fr',
          gap: isMobile ? '44px' : 'clamp(36px, 5vw, 80px)',
          marginBottom: 'clamp(40px, 5.5vw, 64px)',
          alignItems: 'start',
        }}>

          {/* ── Brand column ── */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, ease, delay: 0.18 }}
          >
            {/* Logo */}
            <div style={{ marginBottom: 22 }}>
              <img
                src="/Upcodo_logo.webp"
                alt="UpCodo Digital"
                style={{ height: 40, width: 'auto', filter: 'brightness(0) invert(1)', opacity: 0.9 }}
              />
            </div>

            {/* Tagline */}
            <p style={{
              color: '#4e4e4e',
              fontSize: 'clamp(12.5px, 1.2vw, 14px)',
              lineHeight: 1.88,
              maxWidth: 340,
              letterSpacing: '-0.01em',
              marginBottom: 30,
              fontFamily: 'var(--font-outfit)',
            }}>
              a sister company of{' '}
              <span style={{ color: '#787878', fontWeight: 600 }}>Digimonk Technologies,</span>{' '}
              dedicated to delivering high-end application development projects with excellence and innovation.
            </p>

            {/* Gold divider */}
            <div style={{
              width: 40, height: 1,
              background: 'linear-gradient(90deg, rgba(34,199,111,0.5), transparent)',
              marginBottom: 24,
            }} />

            {/* Social icons */}
            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
              <SocialBtn name="LinkedIn" href="#">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </SocialBtn>
              <SocialBtn name="YouTube" href="#">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </SocialBtn>
              <SocialBtn name="Instagram" href="#">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </SocialBtn>
              <SocialBtn name="Threads" href="#">
                <svg width="13" height="13" viewBox="0 0 192 192" fill="currentColor">
                  <path d="M141.537 88.988C140.71 88.592 139.87 88.21 139.019 87.845 137.537 60.538 122.616 44.905 97.562 44.745c-.114-.001-.227-.001-.34-.001-14.986 0-27.449 6.397-35.12 18.037l13.779 9.452C81.612 63.538 90.605 61.685 97.229 61.685c.077 0 .154 0 .229.001 8.249.053 14.474 2.451 18.503 7.128 2.932 3.405 4.893 8.111 5.864 14.05-7.314-1.243-15.224-1.625-23.68-1.14-23.82 1.372-39.134 15.265-38.105 34.569.522 9.792 5.4 18.216 13.735 23.719 7.047 4.652 16.124 6.927 25.557 6.412 12.458-.683 22.231-5.436 29.049-14.127 5.178-6.6 8.453-15.153 9.899-25.93 5.937 3.583 10.337 8.298 12.767 13.966 4.132 9.635 4.373 25.468-8.546 38.376-11.319 11.308-24.925 16.2-45.488 16.351-22.809-.169-40.059-7.484-51.275-21.742C35.236 139.966 29.808 120.682 29.605 96c.203-24.682 5.631-43.966 16.133-57.317C56.954 24.425 74.204 17.11 97.013 16.941c22.975.17 40.526 7.52 52.171 21.847 5.71 7.026 10.015 15.861 12.853 26.162l16.147-4.308c-3.44-12.68-8.853-23.606-16.219-32.668C147.036 9.607 125.202.195 97.07 0h-.114C68.882.194 47.292 9.642 32.788 28.028 19.882 44.486 13.224 67.316 13.001 95.932L13 96l.001.068c.223 28.616 6.881 51.446 19.787 67.904C47.292 182.358 68.882 191.806 96.957 192h.113c25.043-.173 42.637-6.708 57.131-21.189 18.963-18.945 18.392-42.692 12.142-57.27-4.484-10.454-13.033-19.045-24.723-24.651l-.083-.039zM98.44 129.507c-10.44.588-21.286-4.098-21.821-14.135-.397-7.442 5.296-15.746 22.461-16.735 1.966-.113 3.895-.168 5.79-.168 6.235 0 12.068.606 17.371 1.765-1.978 24.702-13.58 28.713-23.801 29.273z" />
                </svg>
              </SocialBtn>
              <SocialBtn name="Facebook" href="#">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </SocialBtn>
              <SocialBtn name="X" href="#">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </SocialBtn>
            </div>
          </motion.div>

          {/* ── Navigate column ── */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, ease, delay: 0.28 }}
          >
            <p style={{
              fontSize: 9, fontWeight: 700,
              letterSpacing: '0.42em',
              textTransform: 'uppercase',
              color: '#383838',
              marginBottom: 24,
              fontFamily: 'var(--font-outfit)',
            }}>
              Navigate
            </p>
            <nav>
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, ease, delay: 0.32 + i * 0.065 }}
                  whileHover={{ x: 6 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    fontSize: 13.5, color: '#5a5a5a', fontWeight: 500,
                    textDecoration: 'none', letterSpacing: '-0.015em',
                    padding: '8px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.028)',
                    transition: 'color 0.2s ease',
                    fontFamily: 'var(--font-outfit)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = '#22C76F';
                    const dot = e.currentTarget.querySelector('.nav-dot') as HTMLElement;
                    if (dot) dot.style.background = '#22C76F';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = '#5a5a5a';
                    const dot = e.currentTarget.querySelector('.nav-dot') as HTMLElement;
                    if (dot) dot.style.background = 'rgba(34,199,111,0.28)';
                  }}
                >
                  <span
                    className="nav-dot"
                    style={{
                      width: 3.5, height: 3.5, borderRadius: '50%',
                      background: 'rgba(34,199,111,0.28)',
                      flexShrink: 0,
                      transition: 'background 0.2s ease',
                    }}
                  />
                  {link.label}
                </motion.a>
              ))}
            </nav>
          </motion.div>

          {/* ── Connect column ── */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, ease, delay: 0.38 }}
          >
            <p style={{
              fontSize: 9, fontWeight: 700,
              letterSpacing: '0.42em',
              textTransform: 'uppercase',
              color: '#383838',
              marginBottom: 24,
              fontFamily: 'var(--font-outfit)',
            }}>
              Connect
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 28 }}>
              <div>
                <p style={{
                  fontSize: 9, color: '#383838', letterSpacing: '0.28em',
                  textTransform: 'uppercase', marginBottom: 7,
                  fontFamily: 'var(--font-outfit)',
                }}>
                  Email
                </p>
                <a
                  href="mailto:hello@upcodo.in"
                  style={{
                    fontSize: 13.5, color: '#5a5a5a', fontWeight: 500,
                    textDecoration: 'none', letterSpacing: '-0.01em',
                    transition: 'color 0.2s ease',
                    fontFamily: 'var(--font-outfit)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#22C76F'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#5a5a5a'; }}
                >
                  hello@upcodo.in
                </a>
              </div>
              <div>
                <p style={{
                  fontSize: 9, color: '#383838', letterSpacing: '0.28em',
                  textTransform: 'uppercase', marginBottom: 7,
                  fontFamily: 'var(--font-outfit)',
                }}>
                  Location
                </p>
                <p style={{
                  fontSize: 13.5, color: '#5a5a5a', fontWeight: 500,
                  letterSpacing: '-0.01em',
                  fontFamily: 'var(--font-outfit)',
                }}>
                  Noida, India
                </p>
              </div>
            </div>

            {/* CTA card */}
            <div style={{
              padding: '16px 18px',
              border: '1px solid rgba(34,199,111,0.1)',
              borderRadius: 12,
              background: 'rgba(34,199,111,0.025)',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 1,
                background: 'linear-gradient(90deg, transparent, rgba(34,199,111,0.35), transparent)',
              }} />
              <p style={{
                fontSize: 12, color: '#4e4e4e', lineHeight: 1.65,
                letterSpacing: '-0.01em', marginBottom: 12,
                fontFamily: 'var(--font-outfit)',
              }}>
                Have an idea in mind? Let's build something truly extraordinary together.
              </p>
              <motion.a
                href="#contact"
                whileHover={{ x: 4 }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  fontSize: 11, color: '#22C76F', fontWeight: 700,
                  textDecoration: 'none', letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-outfit)',
                }}
              >
                Start a project
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </motion.a>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.0, ease, delay: 0.55 }}
          style={{
            height: 1,
            background: 'rgba(255,255,255,0.038)',
            transformOrigin: 'left',
            marginBottom: 'clamp(18px, 2.5vw, 28px)',
          }}
        />

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, ease, delay: 0.68 }}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <span style={{
            fontSize: 10, color: '#333', fontWeight: 600,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            fontFamily: 'var(--font-outfit)',
          }}>
            © 2026 UpCodo Digital · All rights reserved
          </span>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            {['Privacy', 'Terms'].map(link => (
              <a
                key={link}
                href="#"
                style={{
                  fontSize: 10, color: '#333', fontWeight: 700,
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                  textDecoration: 'none', transition: 'color 0.2s ease',
                  fontFamily: 'var(--font-outfit)',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = '#22C76F'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#333'; }}
              >
                {link}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}
