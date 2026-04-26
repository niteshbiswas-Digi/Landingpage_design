'use client';

import { useRef, useState, useEffect } from 'react';
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

const COLUMNS = [
  {
    heading: 'Who We Are',
    links: [
      { label: 'About Us',        href: '/about' },
      { label: 'Leadership',      href: '#' },
      { label: 'Partners',        href: '#' },
      { label: 'Awards',          href: '#' },
      { label: 'Media Coverage',  href: '#' },
      { label: 'Events',          href: '#' },
      { label: 'CSR',             href: '#' },
      { label: 'Privacy Policy',  href: '#' },
    ],
  },
  {
    heading: 'What We Do',
    links: [
      { label: 'Services',           href: '/services' },
      { label: 'Technologies',       href: '#' },
      { label: 'Solutions',          href: '#' },
      { label: 'Industries',         href: '#' },
      { label: 'Portfolio',          href: '/portfolio' },
    ],
  },
  {
    heading: 'Insights',
    links: [
      { label: 'Blog',            href: '#' },
      { label: 'Case Studies',    href: '#' },
      { label: 'Whitepapers',     href: '#' },
      { label: 'Newsletter',      href: '#' },
      { label: 'Podcasts',        href: '#' },
      { label: 'Testimonials',    href: '#' },
    ],
  },
  {
    heading: 'Contact Us',
    links: [
      { label: 'Request for Services', href: '#' },
      { label: 'Join Us!',             href: '#' },
      { label: 'Media Queries',        href: '#' },
      { label: 'Career',               href: '#' },
    ],
  },
];

const SOCIALS = [
  {
    name: 'LinkedIn',
    href: '#',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: 'X',
    href: '#',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: 'Facebook',
    href: '#',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: '#',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    name: 'YouTube',
    href: '#',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

function ColHeading({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: 15, fontWeight: 700, color: '#4ADE80',
      marginBottom: 22, letterSpacing: '0.01em',
      fontFamily: 'var(--font-outfit)',
    }}>
      {children}
    </p>
  );
}

function FooterLink({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      style={{
        display: 'block',
        fontSize: 13.5, color: '#555', fontWeight: 400,
        textDecoration: 'none', letterSpacing: '-0.01em',
        padding: '5px 0',
        transition: 'color 0.2s ease',
        fontFamily: 'var(--font-outfit)',
        lineHeight: 1.5,
      }}
      onMouseEnter={e => { e.currentTarget.style.color = '#4ADE80'; }}
      onMouseLeave={e => { e.currentTarget.style.color = '#555'; }}
    >
      {label}
    </a>
  );
}

function SubscribeForm() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const inputStyle: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid rgba(255,255,255,0.12)',
    color: '#aaa',
    fontSize: 13,
    padding: '8px 0',
    width: '100%',
    outline: 'none',
    fontFamily: 'var(--font-outfit)',
    transition: 'border-color 0.2s ease',
  };

  return (
    <div>
      <ColHeading>Subscribe to our Insights</ColHeading>

      <div style={{ display: 'flex', gap: 16, marginBottom: 14 }}>
        <input
          placeholder="First name"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          style={inputStyle}
          onFocus={e => { e.currentTarget.style.borderBottomColor = '#4ADE80'; }}
          onBlur={e => { e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.12)'; }}
        />
        <input
          placeholder="Last name"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          style={inputStyle}
          onFocus={e => { e.currentTarget.style.borderBottomColor = '#4ADE80'; }}
          onBlur={e => { e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.12)'; }}
        />
      </div>

      <div style={{ position: 'relative', marginBottom: 28 }}>
        <input
          type="email"
          placeholder="Business Email*"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ ...inputStyle, paddingRight: 36 }}
          onFocus={e => { e.currentTarget.style.borderBottomColor = '#4ADE80'; }}
          onBlur={e => { e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.12)'; }}
        />
        <button
          type="button"
          style={{
            position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#555', padding: 4,
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#4ADE80'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#555'; }}
          aria-label="Subscribe"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Logo */}
      <div style={{ marginTop: 8 }}>
        <img
          src="/Upcodo_logo.webp"
          alt="UpCodo Digital"
          style={{ height: 52, width: 'auto', filter: 'brightness(0) invert(1)', opacity: 1, display: 'block', marginBottom: 14 }}
        />
        <span style={{
          fontSize: 11, color: '#333', fontWeight: 500,
          letterSpacing: '0.04em', fontFamily: 'var(--font-outfit)',
        }}>
          © 2026 UpCodo Digital
        </span>
      </div>
    </div>
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
      {/* Subtle background texture */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.022) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
        maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.25) 30%, rgba(0,0,0,0.25) 70%, transparent 100%)',
      }} />

      {/* Animated top border */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={inView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 1.4, ease, delay: 0.1 }}
        style={{
          height: 1,
          background: 'linear-gradient(90deg, transparent 0%, rgba(74,222,128,0.18) 20%, rgba(74,222,128,0.55) 50%, rgba(74,222,128,0.18) 80%, transparent 100%)',
          transformOrigin: 'left',
        }}
      />

      {/* Main content */}
      <div style={{
        position: 'relative', zIndex: 1,
        padding: 'clamp(48px, 5.5vw, 80px) clamp(24px, 5vw, 80px) clamp(32px, 4vw, 52px)',
      }}>

        {/* Top: 5-column grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : '1fr 1fr 1fr 1fr 1.4fr',
          gap: isMobile ? '40px 24px' : 'clamp(24px, 3.5vw, 56px)',
          marginBottom: 'clamp(44px, 5vw, 64px)',
          alignItems: 'start',
        }}>

          {COLUMNS.map((col, ci) => (
            <motion.div
              key={col.heading}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease, delay: 0.15 + ci * 0.08 }}
            >
              <ColHeading>{col.heading}</ColHeading>
              {col.links.map(l => (
                <FooterLink key={l.label} label={l.label} href={l.href} />
              ))}
            </motion.div>
          ))}

          {/* 5th column: social + subscribe */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease, delay: 0.47 }}
          >
            <ColHeading>Follow us on</ColHeading>

            {/* Social icons row */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 32 }}>
              {SOCIALS.map(s => (
                <motion.a
                  key={s.name}
                  href={s.href}
                  aria-label={s.name}
                  whileHover={{ scale: 1.12, y: -2 }}
                  whileTap={{ scale: 0.93 }}
                  style={{
                    width: 36, height: 36,
                    borderRadius: 8,
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.03)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#555',
                    textDecoration: 'none',
                    transition: 'color 0.22s, border-color 0.22s, background 0.22s, box-shadow 0.22s',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget;
                    el.style.color = '#4ADE80';
                    el.style.borderColor = 'rgba(74,222,128,0.35)';
                    el.style.background = 'rgba(74,222,128,0.07)';
                    el.style.boxShadow = '0 0 18px rgba(74,222,128,0.18)';
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget;
                    el.style.color = '#555';
                    el.style.borderColor = 'rgba(255,255,255,0.08)';
                    el.style.background = 'rgba(255,255,255,0.03)';
                    el.style.boxShadow = 'none';
                  }}
                >
                  {s.icon}
                </motion.a>
              ))}
            </div>

            <SubscribeForm />
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.0, ease, delay: 0.55 }}
          style={{
            height: 1,
            background: 'rgba(255,255,255,0.05)',
            transformOrigin: 'left',
            marginBottom: 'clamp(16px, 2vw, 24px)',
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
            fontSize: 11, color: '#333', fontWeight: 500,
            letterSpacing: '0.04em',
            fontFamily: 'var(--font-outfit)',
          }}>
            a sister company of{' '}
            <span style={{ color: '#444', fontWeight: 600 }}>Digimonk Technologies</span>
            {' '}— dedicated to high-end application development.
          </span>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            {['Privacy', 'Terms', 'Contact'].map(link => (
              <a
                key={link}
                href="#"
                style={{
                  fontSize: 11, color: '#333', fontWeight: 600,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  textDecoration: 'none', transition: 'color 0.2s ease',
                  fontFamily: 'var(--font-outfit)',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = '#4ADE80'; }}
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
