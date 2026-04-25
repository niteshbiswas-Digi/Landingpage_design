'use client';
import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import {
  useTransform,
  useMotionValueEvent,
  AnimatePresence,
  motion,
  MotionValue,
  useSpring,
} from "framer-motion"

const FRAME_COUNT = 120;

const BEATS = [
  {
    id: 'A',
    eyebrow: 'Custom Solutions',
    title: 'Transforming\nIdeas into Apps.',
    sub: 'We turn your innovative ideas into cutting-edge mobile and web applications that propel your business to new digital heights.',
    cta: null,
    range: [0, 0.28] as [number, number],
  },
  {
    id: 'B',
    eyebrow: 'Expert Development',
    title: 'Strategic App\nDevelopment.',
    sub: 'From custom mobile apps to robust web solutions, we deliver scalable applications designed to meet your unique business needs.',
    cta: null,
    range: [0.32, 0.53] as [number, number],
  },
  {
    id: 'C',
    eyebrow: 'Innovative Technology',
    title: 'AI-Powered\nSolutions.',
    sub: 'Leverage our expertise in AI development, chatbots, and intelligent design to build next-generation applications.',
    cta: null,
    range: [0.57, 0.78] as [number, number],
  },
  {
    id: 'D',
    eyebrow: 'Your Trusted Partner',
    title: 'Let\'s Build\nYour Vision.',
    sub: 'Our team of expert developers and designers collaborate to deliver customized solutions tailored to your business goals. Start your transformation today.',
    cta: 'Start Your Project',
    range: [0.82, 1.0] as [number, number],
  },
];

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function beatOpacity(p: number, range: [number, number], isFirst: boolean, isLast: boolean): number {
  const [start, end] = range;
  const fadeCurve = 0.35;
  const fadeLen = (end - start) * fadeCurve;

  if (isFirst && p <= start) return 1;
  if (isLast && p >= end) return 1;

  if (p < start) return 0;
  if (p < start + fadeLen) return clamp((p - start) / fadeLen, 0, 1);
  if (p < end - fadeLen) return 1;
  if (p < end) return clamp((end - p) / fadeLen, 0, 1);
  return 0;
}

function beatY(p: number, range: [number, number], isFirst: boolean, isLast: boolean): number {
  const [start, end] = range;
  const fadeLen = (end - start) * 0.35;

  if (isFirst && p <= start) return 0;
  if (isLast && p >= end) return 0;

  if (p < start) return 30;
  if (p < start + fadeLen) return clamp(30 * (1 - (p - start) / fadeLen), 0, 30);
  if (p < end - fadeLen) return 0;
  if (p < end) return clamp(-20 * ((p - (end - fadeLen)) / fadeLen), -20, 0);
  return -20;
}

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

export default function RevealCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const isMobile = useIsMobile()

  const [loadedCount, setLoadedCount] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [progress, setProgress] = useState(0)
  const [animationComplete, setAnimationComplete] = useState(false)

  const cumulativeScrollRef = useRef(0)
  const animationProgress = useMemo(() => new MotionValue(0), [])
  const smoothedProgress = useSpring(animationProgress, {
    stiffness: 120,
    damping: 26,
    mass: 0.5,
    restDelta: 0.0005,
  })

  /* ── Preload ── */
  useEffect(() => {
    let n = 0
    const imgs: HTMLImageElement[] = []
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image()
      img.src = `/sequence/frame_${i}.webp`
      img.onload = () => {
        n++
        setLoadedCount(n)
        if (n === FRAME_COUNT) setIsLoaded(true)
      }
      imgs.push(img)
    }
    imagesRef.current = imgs
  }, [])

  /* ── Scroll-Lock Logic ── */
  useEffect(() => {
    if (!isLoaded) return

    const ANIMATION_DISTANCE = 3000

    const handleWheel = (e: WheelEvent) => {
      const delta = e.deltaY
      const currentScroll = cumulativeScrollRef.current

      // SCROLLING DOWN
      if (delta > 0) {
        // If animation still playing, lock it
        if (currentScroll < ANIMATION_DISTANCE) {
          e.preventDefault()
          const newScroll = Math.min(currentScroll + delta, ANIMATION_DISTANCE)
          cumulativeScrollRef.current = newScroll
          animationProgress.set(newScroll / ANIMATION_DISTANCE)
          setProgress(newScroll / ANIMATION_DISTANCE)

          if (newScroll >= ANIMATION_DISTANCE && !animationComplete) {
            setAnimationComplete(true)
          }
        }
        // Animation complete, allow page scroll
        else {
          return // Natural scroll
        }
      }

      // SCROLLING UP
      else if (delta < 0) {
        // Always lock scroll if we're at or past animation end (scrolling back into animation)
        if (currentScroll >= ANIMATION_DISTANCE) {
          // If page has scrolled down past the hero, let natural scroll bring user back first
          if (window.scrollY > 0) {
            return
          }
          e.preventDefault()
          const newScroll = Math.max(currentScroll + delta, 0)
          cumulativeScrollRef.current = newScroll
          animationProgress.set(newScroll / ANIMATION_DISTANCE)
          setProgress(newScroll / ANIMATION_DISTANCE)

          if (newScroll < ANIMATION_DISTANCE && animationComplete) {
            setAnimationComplete(false)
          }
        }
        // During animation, always lock
        else if (currentScroll > 0) {
          e.preventDefault()
          const newScroll = Math.max(currentScroll + delta, 0)
          cumulativeScrollRef.current = newScroll
          animationProgress.set(newScroll / ANIMATION_DISTANCE)
          setProgress(newScroll / ANIMATION_DISTANCE)
        }
        // At start (scroll = 0), allow normal scroll up
        else {
          return // Natural scroll
        }
      }
    }

    window.addEventListener("wheel", handleWheel, { passive: false })
    return () => window.removeEventListener("wheel", handleWheel)
  }, [isLoaded, animationProgress, animationComplete])

  const frameIdx = useTransform(
    smoothedProgress,
    [0, 1],
    [0, FRAME_COUNT - 1],
    { clamp: true }
  )

  /* ── Draw ── */
  const draw = useCallback((idx: number) => {
    const canvas = canvasRef.current
    const img = imagesRef.current[idx]
    if (!canvas || !img?.complete) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    if (!rect.width || !rect.height) return

    if (
      canvas.width !== Math.round(rect.width * dpr) ||
      canvas.height !== Math.round(rect.height * dpr)
    ) {
      canvas.width = Math.round(rect.width * dpr)
      canvas.height = Math.round(rect.height * dpr)
      ctx.scale(dpr, dpr)
    }

    ctx.fillStyle = "#000"
    ctx.fillRect(0, 0, rect.width, rect.height)

    const r = Math.min(
      rect.width / img.naturalWidth,
      rect.height / img.naturalHeight
    )
    const cx = (rect.width - img.naturalWidth * r) / 2
    const cy = (rect.height - img.naturalHeight * r) / 2

    ctx.drawImage(
      img,
      0,
      0,
      img.naturalWidth,
      img.naturalHeight,
      cx,
      cy,
      img.naturalWidth * r,
      img.naturalHeight * r
    )
  }, [])

  useMotionValueEvent(frameIdx, "change", (v) =>
    draw(Math.round(clamp(v, 0, FRAME_COUNT - 1)))
  )
  useMotionValueEvent(smoothedProgress, "change", (v) => setProgress(clamp(v as number, 0, 1)))

  // useEffect to handle initial draw and window resize

  useEffect(() => {
    if (!isLoaded) return
    // Scroll to top when loading completes
    window.scrollTo({ top: 0, behavior: "smooth" })
    draw(0)
    const onResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = 0
        canvasRef.current.height = 0
      }
      draw(Math.round(frameIdx.get()))
    }
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [isLoaded, draw, frameIdx])

  const pct = Math.round((loadedCount / FRAME_COUNT) * 100)
  const activeBeat = BEATS.findIndex(
    (b) => progress >= b.range[0] && progress < b.range[1]
  )

  // Mobile background color per beat
  const getBeatBgColor = () => {
    if (!isMobile) return "#000"
    switch (activeBeat) {
      case 1:
        return "radial-gradient(ellipse at 50% 50%, rgba(96,165,250,0.08) 0%, #050505 60%)"
      case 2:
        return "radial-gradient(ellipse at 30% 50%, rgba(167,139,250,0.07) 0%, #050505 65%)"
      case 3:
        return "radial-gradient(ellipse at 70% 50%, rgba(34,199,111,0.08) 0%, #050505 60%)"
      default:
        return "radial-gradient(ellipse at 20% 50%, rgba(34,199,111,0.06) 0%, transparent 55%), radial-gradient(ellipse at 80% 20%, rgba(167,139,250,0.05) 0%, transparent 50%), #050505"
    }
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        height: "100vh",
        width: "100%",
        background: "#000",
        zIndex: 1,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100vh",
          width: "100%",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: "stretch",
          background: isMobile ? getBeatBgColor() : "#000",
          transition: isMobile ? "background 1s ease-in-out" : "none",
          overflow: isMobile ? "visible" : "hidden",
          zIndex: 50,
        }}
      >
        {/* Mobile background orbs */}
        {isMobile && (
          <>
            <div
              className="orb-a"
              style={{
                position: "absolute",
                top: "-15%",
                left: "-20%",
                width: 280,
                height: 280,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(34,199,111,0.12) 0%, transparent 70%)",
                filter: "blur(60px)",
                pointerEvents: "none",
                zIndex: 0,
              }}
            />
            <div
              className="orb-b"
              style={{
                position: "absolute",
                bottom: "-10%",
                right: "-15%",
                width: 220,
                height: 220,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(167,139,250,0.1) 0%, transparent 70%)",
                filter: "blur(50px)",
                pointerEvents: "none",
                zIndex: 0,
              }}
            />
            {/* Dot grid overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                backgroundImage:
                  "radial-gradient(circle, rgba(255,255,255,0.015) 1px, transparent 1px)",
                backgroundSize: "36px 36px",
                opacity: 0.6,
                zIndex: 1,
              }}
            />
          </>
        )}

        {/* ── LEFT: Storytelling ── */}
        <div
          style={{
            flex: isMobile ? "none" : 1,
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: isMobile ? "80px 24px" : "0 80px",
            minHeight: isMobile ? "100vh" : "auto",
            overflow: "hidden",
            background: isMobile ? "transparent" : "rgba(5,5,5,0.7)",
            zIndex: 2,
          }}
        >
          {/* Mobile step indicator dots */}
          {isMobile && (
            <div
              style={{
                position: "absolute",
                top: 64,
                left: 24,
                display: "flex",
                gap: 12,
                alignItems: "center",
                zIndex: 10,
              }}
            >
              {BEATS.map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    width: i === activeBeat ? 24 : 6,
                    background: i === activeBeat ? "#22C76F" : "#1a1a1c",
                  }}
                  transition={{ duration: 0.5 }}
                  style={{
                    height: 6,
                    borderRadius: 99,
                  }}
                />
              ))}
            </div>
          )}

          {/* Mobile floating particles */}
          {isMobile && (
            <>
              <div
                style={{
                  position: "absolute",
                  top: "20%",
                  left: "15%",
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: "rgba(34,199,111,0.5)",
                  pointerEvents: "none",
                  animation: "float-up 3s ease-in-out infinite",
                  zIndex: 1,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "60%",
                  right: "12%",
                  width: 3,
                  height: 3,
                  borderRadius: "50%",
                  background: "rgba(34,199,111,0.4)",
                  pointerEvents: "none",
                  animation: "float-up 4s ease-in-out infinite 1.4s",
                  zIndex: 1,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "30%",
                  left: "20%",
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: "rgba(34,199,111,0.35)",
                  pointerEvents: "none",
                  animation: "float-up 5s ease-in-out infinite 2.8s",
                  zIndex: 1,
                }}
              />
            </>
          )}

          {!isMobile && (
            <div
              style={{
                position: "absolute",
                top: 48,
                left: 48,
                display: "flex",
                flexDirection: "column",
                gap: 12,
                alignItems: "flex-start",
              }}
            >
              {BEATS.map((b, i) => (
                <div
                  key={b.id}
                  style={{
                    width: 2,
                    borderRadius: 2,
                    background: i === activeBeat ? "#22C76F" : "#1a1a1c",
                    height: i === activeBeat ? 40 : 10,
                    transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                />
              ))}
            </div>
          )}

          {BEATS.map((beat, i) => {
            const isFirst = i === 0
            const isLast = i === BEATS.length - 1
            const op = beatOpacity(progress, beat.range, isFirst, isLast)
            const y = beatY(progress, beat.range, isFirst, isLast)
            if (op < 0.005) return null
            return (
              <div
                key={beat.id}
                style={{
                  position: "absolute",
                  padding: isMobile ? "0 24px" : "0 80px",
                  opacity: op,
                  transform: `translateY(${y}px)`,
                  textAlign: "left",
                  width: "100%",
                  zIndex: isFirst ? 5 : 4,
                  transition: "opacity 0.3s ease-out, transform 0.3s ease-out",
                  willChange: "opacity, transform",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 24,
                  }}
                >
                  {isMobile ? (
                    <>
                      <motion.div
                        animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        style={{
                          width: 4,
                          height: 4,
                          borderRadius: "50%",
                          background: "#22C76F",
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: "0.4em",
                          textTransform: "uppercase",
                          color: "#22C76F",
                        }}
                      >
                        {beat.eyebrow}
                      </span>
                    </>
                  ) : (
                    <>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          letterSpacing: "0.4em",
                          textTransform: "uppercase",
                          color: "#22C76F",
                        }}
                      >
                        {beat.eyebrow}
                      </span>
                      <div
                        style={{
                          flex: 1,
                          height: 1,
                          background: "rgba(34,199,111,0.2)",
                        }}
                      />
                    </>
                  )}
                </div>

                <h2
                  style={{
                    fontSize: isMobile
                      ? "clamp(32px, 7vw, 96px)"
                      : "clamp(48px, 6vw, 96px)",
                    fontWeight: 900,
                    letterSpacing: "-0.05em",
                    lineHeight: 0.9,
                    color: "#fff",
                    whiteSpace: "pre-line",
                    marginBottom: 32,
                    textShadow: "0 0 100px rgba(255,255,255,0.1)",
                  }}
                >
                  {beat.title}
                </h2>

                <p
                  style={{
                    fontSize: isMobile
                      ? "clamp(14px, 1.6vw, 24px)"
                      : "clamp(18px, 1.8vw, 24px)",
                    color: "#a1a1a6",
                    lineHeight: 1.6,
                    letterSpacing: "-0.02em",
                    maxWidth: isMobile ? "100%" : 520,
                    marginBottom: beat.cta ? 48 : 0,
                  }}
                >
                  {beat.sub}
                </p>

                {beat.cta && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.92 }}
                    style={{
                      padding: isMobile ? "13px 28px" : "16px 40px",
                      borderRadius: 12,
                      background: "#22C76F",
                      color: "#000",
                      fontWeight: 800,
                      fontSize: isMobile ? 13 : 15,
                      letterSpacing: "-0.01em",
                      border: "none",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 10,
                      boxShadow: "0 12px 40px rgba(34,199,111,0.35)",
                    }}
                  >
                    {beat.cta}
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                    >
                      <path
                        d="M5 12h14M12 5l7 7-7 7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.button>
                )}
              </div>
            )
          })}


          {/* Mobile scroll progress bar */}
          {isMobile && (
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 2,
                background:
                  "linear-gradient(90deg, #22C76F 0%, rgba(34,199,111,0.3) 100%)",
                width: `${progress * 100}%`,
                transition: "width 0.1s linear",
                zIndex: 10,
              }}
            />
          )}
        </div>

        {/* ── RIGHT: Visuals ── */}
        {!isMobile && (
          <div
            style={{
              position: "relative",
              width: "50%",
              height: "auto",
              flexShrink: 0,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 1,
                pointerEvents: "none",
                background: `radial-gradient(circle at 50% 60%, rgba(34,199,111,${(
                  0.06 +
                  progress * 0.2
                ).toFixed(3)}) 0%, transparent 65%)`,
              }}
            />

            <canvas
              ref={canvasRef}
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 2,
                width: "100%",
                height: "100%",
                display: "block",
              }}
            />

            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 180,
                zIndex: 3,
                background: "linear-gradient(to bottom, #000, transparent)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 180,
                zIndex: 3,
                background: "linear-gradient(to top, #000, transparent)",
                pointerEvents: "none",
              }}
            />
          </div>
        )}
      </div>

      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              background: "#000",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 32,
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              style={{
                width: 64,
                height: 64,
                borderRadius: 18,
                border: "1px solid rgba(34,199,111,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 60px rgba(34,199,111,0.2)",
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <polyline
                  points="16 18 22 12 16 6"
                  stroke="#22C76F"
                  strokeWidth="2.5"
                />
                <polyline
                  points="8 6 2 12 8 18"
                  stroke="rgba(255,255,255,0.4)"
                  strokeWidth="2.5"
                />
              </svg>
            </motion.div>
            <div style={{ textAlign: "center" }}>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{
                  fontSize: 11,
                  letterSpacing: "0.4em",
                  textTransform: "uppercase",
                  color: "#22C76F",
                  fontWeight: 900,
                  margin: 0,
                }}
              >
                UPCODO Digital
              </motion.p>
              <div
                style={{
                  width: 260,
                  height: 2,
                  background: "#111",
                  borderRadius: 99,
                  overflow: "hidden",
                  marginTop: 12,
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  style={{ height: "100%", background: "#22C76F" }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
