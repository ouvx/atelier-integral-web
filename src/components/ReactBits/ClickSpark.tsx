import { useCallback, useEffect, useRef } from 'react';

interface Spark {
  x: number;
  y: number;
  angle: number;
  start: number;
  index: number;
}

function shouldAnimate(): boolean {
  if (typeof window === 'undefined') return false;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const isWindows = /Windows/i.test(`${navigator.userAgent} ${navigator.platform}`);
  return finePointer && !reduced && !isWindows;
}

interface ClickSparkProps {
  color?: string;
  accentColor?: string;
  count?: number;
  radius?: number;
  size?: number;
  duration?: number;
}

export default function ClickSpark({
  color = 'rgba(23, 22, 19, .8)',
  accentColor = 'rgba(44, 159, 143, .8)',
  count = 8,
  radius = 30,
  size = 9,
  duration = 430
}: ClickSparkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparksRef = useRef<Spark[]>([]);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    const ctx = canvas.getContext('2d');
    ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
  }, []);

  useEffect(() => {
    if (!shouldAnimate()) return undefined;

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [resize]);

  useEffect(() => {
    if (!shouldAnimate()) return undefined;

    let rafId: number;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return undefined;

    const draw = (timestamp: number) => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      sparksRef.current = sparksRef.current.filter((spark) => {
        const elapsed = timestamp - spark.start;
        if (elapsed >= duration) return false;

        const t = elapsed / duration;
        const eased = t * (2 - t);
        const distance = eased * radius;
        const lineLength = size * (1 - eased);
        const x1 = spark.x + distance * Math.cos(spark.angle);
        const y1 = spark.y + distance * Math.sin(spark.angle);
        const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
        const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

        ctx.strokeStyle = spark.index % 3 === 0 ? accentColor : color;
        ctx.globalAlpha = 1 - eased;
        ctx.lineWidth = spark.index % 3 === 0 ? 1.8 : 1.2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.globalAlpha = 1;

        return true;
      });

      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafId);
  }, [accentColor, color, count, duration, radius, size]);

  useEffect(() => {
    if (!shouldAnimate()) return undefined;

    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const interactive = target?.closest?.('a, button, [role="button"], .site-name, .ptab');
      if (!interactive) return;

      const now = performance.now();
      const next: Spark[] = Array.from({ length: count }, (_, index) => ({
        x: event.clientX,
        y: event.clientY,
        angle: (Math.PI * 2 * index) / count,
        start: now,
        index
      }));
      sparksRef.current.push(...next);
    };

    window.addEventListener('click', onClick, true);
    return () => window.removeEventListener('click', onClick, true);
  }, [count]);

  return <canvas ref={canvasRef} className="click-spark-layer" aria-hidden="true" />;
}
