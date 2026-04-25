'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type ActivePage = 'home' | 'about' | 'services' | 'portfolio';

interface MegaItem { label: string; href: string }
interface MegaColumn { title: string; items: MegaItem[] }
interface NavLink { label: string; href: string; mega?: MegaColumn[] }

const E = [0.16, 1, 0.3, 1] as const;

const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  {
    label: 'Services', href: '/services',
    mega: [
      {
        title: 'Mobile Development', items: [
          { label: 'iOS App Development', href: '/services' },
          { label: 'Android Development', href: '/services' },
          { label: 'Flutter Apps', href: '/services' },
          { label: 'React Native', href: '/services' },
        ],
      },
      {
        title: 'Web Development', items: [
          { label: 'Next.js Applications', href: '/services' },
          { label: 'React Development', href: '/services' },
          { label: 'SaaS Platforms', href: '/services' },
          { label: 'E-commerce', href: '/services' },
        ],
      },
      {
        title: 'UI/UX Design', items: [
          { label: 'Product Design', href: '/services' },
          { label: 'Brand Identity', href: '/services' },
          { label: 'Motion Design', href: '/services' },
          { label: 'Prototyping', href: '/services' },
        ],
      },
      {
        title: 'Consulting', items: [
          { label: 'Digital Strategy', href: '/services' },
          { label: 'Tech Advisory', href: '/services' },
          { label: 'Product Management', href: '/services' },
          { label: 'Code Audit', href: '/services' },
        ],
      },
    ],
  },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Blog', href: '#' },
];

const PAGE_LABEL: Record<ActivePage, string> = {
  home: 'Home', about: 'About Us', services: 'Services', portfolio: 'Portfolio',
};

export default function Navigation({ activePage }: { activePage?: ActivePage }) {
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const menuTimeout = useRef<number | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const openMenu = useCallback((label: string) => {
    if (menuTimeout.current !== null) clearTimeout(menuTimeout.current);
    setActiveMenu(label);
  }, []);

  const closeMenu = useCallback(() => {
    menuTimeout.current = window.setTimeout(() => setActiveMenu(null), 150);
  }, []);

  const currentLabel = activePage ? PAGE_LABEL[activePage] : '';

  return (
    <>
      {/* ─────────────── NAV BAR ─────────────── */}
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: E }}
        onMouseLeave={closeMenu}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: isMobile ? '14px 20px' : scrolled ? '14px 48px' : '20px 48px',
          background: scrolled ? 'rgba(5,5,5,0.88)' : 'transparent',
          backdropFilter: scrolled ? 'blur(24px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(24px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : '1px solid transparent',
          transition: 'padding 0.45s ease, background 0.45s ease, border-color 0.45s ease',
          willChange: 'transform',
        }}
      >
        {/* ─ Logo ─ */}
        <motion.a
          href="/"
          style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}
          whileHover={{ scale: 1.03 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        >
          <img
            src="/Upcodo_logo.webp"
            alt="UpCodo Digital"
            style={{
              height: scrolled ? 28 : 34,
              width: 'auto',
              filter: 'brightness(0) invert(1)',
              opacity: 0.92,
              transition: 'height 0.45s ease',
            }}
          />
        </motion.a>

        {/* ─ Desktop Nav Links ─ */}
        {!isMobile && (
          <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {NAV_LINKS.map((link, i) => {
              const isActive = link.label === currentLabel;
              const isHovered = hoveredLink === link.label;
              return (
                <div
                  key={link.label}
                  style={{ position: 'relative' }}
                  onMouseEnter={() => {
                    setHoveredLink(link.label);
                    if (link.mega) openMenu(link.label);
                    else setActiveMenu(null);
                  }}
                  onMouseLeave={() => {
                    setHoveredLink(null);
                    if (link.mega) closeMenu();
                  }}
                >
                  <motion.a
                    href={link.href}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + i * 0.07, ease: E }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 4,
                      padding: '8px 14px',
                      fontSize: 13,
                      fontWeight: isActive ? 700 : 600,
                      color: isActive ? '#22C76F' : isHovered ? '#f0f0f0' : '#a0a0a0',
                      textDecoration: 'none',
                      letterSpacing: isHovered ? '0.03em' : '0.01em',
                      position: 'relative',
                      transition: 'color 0.2s ease, letter-spacing 0.2s ease',
                    }}
                  >
                    {link.label}
                    {link.mega && (
                      <svg
                        width="9" height="9" viewBox="0 0 9 9" fill="none"
                        style={{
                          opacity: 0.5,
                          transition: 'transform 0.22s ease',
                          transform: activeMenu === link.label ? 'rotate(180deg)' : 'none',
                        }}
                      >
                        <path d="M1.5 3L4.5 6L7.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                    {/* Active indicator */}
                    {isActive && (
                      <span style={{
                        position: 'absolute', bottom: 2, left: 14, right: 14,
                        height: 1.5, background: '#22C76F', borderRadius: 99,
                        display: 'block',
                      }} />
                    )}
                    {/* Hover underline — grows left → right */}
                    {!isActive && (
                      <motion.span
                        animate={{ scaleX: isHovered ? 1 : 0, opacity: isHovered ? 0.7 : 0 }}
                        transition={{ duration: 0.22, ease: 'easeOut' }}
                        style={{
                          position: 'absolute', bottom: 2, left: 14, right: 14,
                          height: 1, background: '#22C76F', borderRadius: 99,
                          transformOrigin: 'left', display: 'block',
                        }}
                      />
                    )}
                  </motion.a>
                </div>
              );
            })}
          </div>
        )}

        {/* ─ CTA ─ */}
        {!isMobile && (
          <motion.a
            href="#contact"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.55, ease: E }}
            whileHover={{ scale: 1.05, y: -2, boxShadow: '0 0 28px rgba(34,199,111,0.35)' }}
            style={{
              padding: '9px 22px',
              background: '#22C76F',
              color: '#050505',
              fontSize: 12, fontWeight: 700,
              letterSpacing: '0.05em', textTransform: 'uppercase',
              textDecoration: 'none',
              borderRadius: 99,
              willChange: 'transform',
              flexShrink: 0,
            }}
          >
            Contact Us
          </motion.a>
        )}

        {/* ─ Mobile Hamburger ─ */}
        {isMobile && (
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: 8, display: 'flex', flexDirection: 'column', gap: 5,
            }}
            aria-label="Toggle menu"
          >
            {[0, 1, 2].map(j => (
              <motion.span
                key={j}
                animate={{
                  rotate: mobileOpen ? (j === 0 ? 45 : j === 2 ? -45 : 0) : 0,
                  y: mobileOpen ? (j === 0 ? 9 : j === 2 ? -9 : 0) : 0,
                  opacity: mobileOpen && j === 1 ? 0 : 1,
                }}
                transition={{ duration: 0.28, ease: E }}
                style={{
                  display: 'block', width: 22, height: 1.5,
                  background: '#f0f0f0', borderRadius: 99,
                  transformOrigin: 'center',
                }}
              />
            ))}
          </button>
        )}

        {/* ─────────────── MEGA MENU ─────────────── */}
        <AnimatePresence>
          {!isMobile && activeMenu && (() => {
            const menuData = NAV_LINKS.find(l => l.label === activeMenu)?.mega;
            if (!menuData) return null;
            return (
              <motion.div
                key="mega"
                onMouseEnter={() => openMenu(activeMenu)}
                onMouseLeave={closeMenu}
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.32, ease: E }}
                style={{
                  position: 'absolute', top: '100%', left: 0, right: 0,
                  background: 'rgba(7,7,7,0.97)',
                  backdropFilter: 'blur(28px)',
                  WebkitBackdropFilter: 'blur(28px)',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '0 0 20px 20px',
                  padding: '44px 48px 52px',
                  display: 'grid',
                  gridTemplateColumns: `repeat(${menuData.length}, 1fr)`,
                  overflow: 'hidden',
                  willChange: 'transform',
                }}
              >
                {/* Radial green glow */}
                <div style={{
                  position: 'absolute', top: 0, left: '50%',
                  transform: 'translateX(-50%)',
                  width: 700, height: 220,
                  background: 'radial-gradient(ellipse at top, rgba(34,199,111,0.07) 0%, transparent 70%)',
                  pointerEvents: 'none',
                }} />

                {menuData.map((col, ci) => (
                  <motion.div
                    key={col.title}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: ci * 0.06, ease: E }}
                    style={{
                      padding: '0 28px',
                      borderLeft: ci > 0 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                    }}
                  >
                    <div style={{
                      fontSize: 10, fontWeight: 700,
                      color: '#22C76F',
                      letterSpacing: '0.14em', textTransform: 'uppercase',
                      marginBottom: 20,
                    }}>
                      {col.title}
                    </div>
                    {col.items.map((item, ii) => (
                      <MegaMenuItem
                        key={item.label}
                        item={item}
                        delay={ci * 0.06 + ii * 0.04}
                      />
                    ))}
                  </motion.div>
                ))}
              </motion.div>
            );
          })()}
        </AnimatePresence>
      </motion.nav>

      {/* ─────────────── MOBILE FULLSCREEN MENU ─────────────── */}
      <AnimatePresence>
        {isMobile && mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: E }}
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              zIndex: 999,
              background: 'rgba(5,5,5,0.97)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              display: 'flex', flexDirection: 'column',
              paddingTop: 76, overflowY: 'auto',
            }}
          >
            {NAV_LINKS.map((link, i) => {
              const isActive = link.label === currentLabel;
              const isExpanded = mobileExpanded === link.label;
              return (
                <div key={link.label}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.06, ease: E }}
                    onClick={() => link.mega
                      ? setMobileExpanded(isExpanded ? null : link.label)
                      : (window.location.href = link.href)
                    }
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '16px 28px',
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      cursor: 'pointer',
                    }}
                  >
                    <span style={{ fontSize: 18, fontWeight: 700, color: isActive ? '#22C76F' : '#e0e0e0' }}>
                      {link.label}
                    </span>
                    {link.mega && (
                      <motion.span
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.22 }}
                        style={{ color: '#22C76F', opacity: 0.7, fontSize: 18 }}
                      >
                        ↓
                      </motion.span>
                    )}
                  </motion.div>

                  <AnimatePresence>
                    {link.mega && isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: E }}
                        style={{ overflow: 'hidden', background: 'rgba(34,199,111,0.025)' }}
                      >
                        {link.mega.map(col => (
                          <div key={col.title} style={{ padding: '12px 28px 10px' }}>
                            <div style={{
                              fontSize: 10, fontWeight: 700, color: '#22C76F',
                              letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 8,
                            }}>
                              {col.title}
                            </div>
                            {col.items.map(item => (
                              <a
                                key={item.label}
                                href={item.href}
                                style={{
                                  display: 'block', padding: '6px 0',
                                  fontSize: 14, color: '#888', textDecoration: 'none',
                                }}
                              >
                                {item.label}
                              </a>
                            ))}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}

            <motion.a
              href="#contact"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: NAV_LINKS.length * 0.06, ease: E }}
              style={{
                margin: '28px 28px 40px',
                padding: '14px 20px',
                background: '#22C76F', color: '#050505',
                textAlign: 'center', textDecoration: 'none',
                borderRadius: 12, fontSize: 14, fontWeight: 700,
                letterSpacing: '0.05em', textTransform: 'uppercase',
              }}
            >
              Contact Us
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Mega Menu Item ──────────────────────────────────────────────────────────
function MegaMenuItem({ item, delay }: { item: MegaItem; delay: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.a
      href={item.href}
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, delay, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 9,
        padding: '7px 0',
        fontSize: 13.5, fontWeight: 500,
        color: hovered ? '#f0f0f0' : '#888',
        textDecoration: 'none',
        transform: hovered ? 'translateX(5px)' : 'translateX(0)',
        transition: 'color 0.18s ease, transform 0.18s ease',
      }}
    >
      <span style={{
        color: '#22C76F', fontSize: 14,
        opacity: hovered ? 1 : 0.45,
        transition: 'opacity 0.18s, transform 0.18s',
        transform: hovered ? 'translateX(2px)' : 'translateX(0)',
        display: 'inline-block',
      }}>
        ›
      </span>
      {item.label}
    </motion.a>
  );
}
