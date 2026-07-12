import { useEffect, useRef } from 'react';

function isWindowsPlatform(): boolean {
  return /Windows/i.test(navigator.userAgent || navigator.platform || '');
}
function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
function hasFinePointer(): boolean {
  return window.matchMedia('(pointer: fine)').matches;
}

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const useCursor = hasFinePointer() && !prefersReducedMotion();
    const useWindowsLite = isWindowsPlatform();

    if (!useCursor) return;

    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;
    let rafId: number;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.left = mouseX + 'px';
        dotRef.current.style.top = mouseY + 'px';
      }
      if (useWindowsLite && ringRef.current) {
        ringX = mouseX;
        ringY = mouseY;
        ringRef.current.style.left = ringX + 'px';
        ringRef.current.style.top = ringY + 'px';
      }
    };

    function tick() {
      if (mouseX !== -100 && !useWindowsLite) {
        ringX += (mouseX - ringX) * 0.32;
        ringY += (mouseY - ringY) * 0.32;
        if (ringRef.current) {
          ringRef.current.style.left = ringX + 'px';
          ringRef.current.style.top = ringY + 'px';
        }
      }
      rafId = requestAnimationFrame(tick);
    }

    const onEnter = (e: MouseEvent) => {
      const t = (e.target as Element).closest('a, button, .wi, .ptab, .color-btn, .site-name');
      if (!t) return;
      if (t.classList.contains('wi')) document.body.classList.add('hovering-work');
      else document.body.classList.add('hovering-link');
    };
    const onLeave = (e: MouseEvent) => {
      const t = (e.target as Element).closest('a, button, .wi, .ptab, .color-btn, .site-name');
      if (!t) return;
      document.body.classList.remove('hovering-link', 'hovering-work');
    };

    window.addEventListener('mousemove', onMove);
    document.body.addEventListener('mouseenter', onEnter, true);
    document.body.addEventListener('mouseleave', onLeave, true);
    if (!useWindowsLite) rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.body.removeEventListener('mouseenter', onEnter, true);
      document.body.removeEventListener('mouseleave', onLeave, true);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div className="cursor-dot" ref={dotRef} />
      <div className="cursor-ring" ref={ringRef}>
        <svg className="cursor-svg-integral" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 5c0-1.5-1-3-2.5-3S10 3.5 10 5v14c0 1.5 1 3 2.5 3S15 20.5 15 19" />
        </svg>
      </div>
    </>
  );
}
