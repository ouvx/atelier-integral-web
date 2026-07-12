import { useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';

interface MagnetLinesProps {
  rows?: number;
  columns?: number;
  baseAngle?: number;
  className?: string;
}

export default function MagnetLines({
  rows = 5,
  columns = 9,
  baseAngle = -12,
  className = ''
}: MagnetLinesProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return undefined;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    if (reduced || !finePointer) return undefined;

    const items = Array.from(container.querySelectorAll<HTMLSpanElement>('span'));

    const setPointer = (x: number, y: number) => {
      items.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = x - centerX;
        const dy = y - centerY;
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        item.style.setProperty('--rotate', `${angle}deg`);
      });
    };

    const onPointerMove = (event: PointerEvent) => setPointer(event.clientX, event.clientY);
    window.addEventListener('pointermove', onPointerMove);

    const rect = container.getBoundingClientRect();
    setPointer(rect.left + rect.width * 0.68, rect.top + rect.height * 0.28);

    return () => window.removeEventListener('pointermove', onPointerMove);
  }, []);

  return (
    <div
      ref={ref}
      className={`magnet-lines ${className}`.trim()}
      style={
        {
          '--rows': rows,
          '--columns': columns
        } as CSSProperties
      }
      aria-hidden="true"
    >
      {Array.from({ length: rows * columns }, (_, index) => (
        <span key={index} style={{ '--rotate': `${baseAngle}deg` } as CSSProperties} />
      ))}
    </div>
  );
}
