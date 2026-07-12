import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

function canUseMagnet(): boolean {
  if (typeof window === 'undefined') return false;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const windows = /Windows/i.test(navigator.userAgent || navigator.platform || '');
  return finePointer && !reduced && !windows;
}

interface MagnetProps {
  children: ReactNode;
  padding?: number;
  strength?: number;
  disabled?: boolean;
  className?: string;
  innerClassName?: string;
}

export default function Magnet({
  children,
  padding = 34,
  strength = 5.5,
  disabled = false,
  className = '',
  innerClassName = ''
}: MagnetProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setEnabled(canUseMagnet() && !disabled);
  }, [disabled]);

  useEffect(() => {
    if (!enabled) {
      setActive(false);
      setPosition({ x: 0, y: 0 });
      return undefined;
    }

    const onMove = (event: MouseEvent) => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distX = Math.abs(centerX - event.clientX);
      const distY = Math.abs(centerY - event.clientY);
      const inRange = distX < rect.width / 2 + padding && distY < rect.height / 2 + padding;

      if (!inRange) {
        setActive(false);
        setPosition({ x: 0, y: 0 });
        return;
      }

      setActive(true);
      setPosition({
        x: (event.clientX - centerX) / strength,
        y: (event.clientY - centerY) / strength
      });
    };

    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [enabled, padding, strength]);

  return (
    <span ref={ref} className={`magnet-wrap ${className}`.trim()}>
      <span
        className={`magnet-inner ${innerClassName}`.trim()}
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          transition: active
            ? 'transform .24s cubic-bezier(.18,.9,.2,1)'
            : 'transform .46s cubic-bezier(.18,.9,.2,1)'
        }}
      >
        {children}
      </span>
    </span>
  );
}
