import { useEffect, useRef, useState } from 'react';

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

interface CountUpProps {
  from?: number;
  to: number;
  duration?: number;
  delay?: number;
  pad?: number;
  className?: string;
}

export default function CountUp({
  from = 0,
  to,
  duration = 1200,
  delay = 0,
  pad = 0,
  className = ''
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(from);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setValue(to);
      return undefined;
    }

    let rafId: number;
    let timeoutId: ReturnType<typeof window.setTimeout>;
    let observer: IntersectionObserver;
    let started = false;

    const start = () => {
      if (started) return;
      started = true;
      const startedAt = performance.now();

      const tick = (now: number) => {
        const progress = Math.min(1, (now - startedAt) / duration);
        setValue(Math.round(from + (to - from) * easeOutCubic(progress)));
        if (progress < 1) rafId = requestAnimationFrame(tick);
      };

      timeoutId = window.setTimeout(() => {
        rafId = requestAnimationFrame(tick);
      }, delay);
    };

    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          start();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(node);
    timeoutId = window.setTimeout(start, 180);

    return () => {
      window.clearTimeout(timeoutId);
      cancelAnimationFrame(rafId);
      observer?.disconnect();
    };
  }, [delay, duration, from, to]);

  return (
    <span ref={ref} className={className}>
      {String(value).padStart(pad, '0')}
    </span>
  );
}
