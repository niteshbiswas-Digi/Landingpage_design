'use client';
import { useEffect, useRef, memo } from 'react';

const AnimatedCursor = memo(function AnimatedCursor() {
  const blobRef  = useRef<HTMLDivElement>(null);
  const dotRef   = useRef<HTMLDivElement>(null);
  const mouse    = useRef({ x: 0, y: 0 });
  const blobPos  = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      // Dot snaps instantly
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
      }
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    let raf: number;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const loop = () => {
      blobPos.current.x = lerp(blobPos.current.x, mouse.current.x, 0.052);
      blobPos.current.y = lerp(blobPos.current.y, mouse.current.y, 0.052);
      if (blobRef.current) {
        blobRef.current.style.transform =
          `translate(${blobPos.current.x - 280}px, ${blobPos.current.y - 280}px)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {/* Soft trailing blob */}
      <div
        ref={blobRef}
        style={{
          position: 'fixed', top: 0, left: 0, zIndex: 0,
          width: 560, height: 560, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245,166,35,0.045) 0%, rgba(245,166,35,0.015) 35%, transparent 70%)',
          pointerEvents: 'none', willChange: 'transform',
          mixBlendMode: 'screen',
        }}
      />
      {/* Sharp accent dot */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed', top: 0, left: 0, zIndex: 9999,
          width: 8, height: 8, borderRadius: '50%',
          background: '#f5a623',
          pointerEvents: 'none', willChange: 'transform',
          mixBlendMode: 'difference',
          opacity: 0.7,
        }}
      />
    </>
  );
});

export default AnimatedCursor;
