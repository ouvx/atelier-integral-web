import { useEffect, useRef, useState } from 'react';

const DEFAULT_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_/#';

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

interface DecryptedTextProps {
  text: string;
  className?: string;
  encryptedClassName?: string;
  chars?: string;
  speed?: number;
  iterations?: number;
  trigger?: 'hover' | 'view';
}

export default function DecryptedText({
  text,
  className = '',
  encryptedClassName = '',
  chars = DEFAULT_CHARS,
  speed = 28,
  iterations = 9,
  trigger = 'hover'
}: DecryptedTextProps) {
  const [display, setDisplay] = useState(text);
  const [animating, setAnimating] = useState(false);
  const intervalRef = useRef<ReturnType<typeof window.setInterval> | null>(null);

  useEffect(() => {
    setDisplay(text);
  }, [text]);

  useEffect(() => () => { if (intervalRef.current !== null) window.clearInterval(intervalRef.current); }, []);

  const run = () => {
    if (animating || prefersReducedMotion()) return;
    setAnimating(true);
    let step = 0;

    if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => {
      step += 1;
      const locked = Math.floor((step / iterations) * text.length);
      const next = text
        .split('')
        .map((char, index) => {
          if (char === ' ' || index < locked) return char;
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');

      setDisplay(next);

      if (step >= iterations) {
        if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
        setDisplay(text);
        setAnimating(false);
      }
    }, speed);
  };

  const handlers = trigger === 'view' ? {} : {
    onMouseEnter: run,
    onFocus: run
  };

  useEffect(() => {
    if (trigger !== 'view') return undefined;
    const timeout = window.setTimeout(run, 120);
    return () => window.clearTimeout(timeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger, text]);

  return (
    <span
      className={`${className} ${animating ? encryptedClassName : ''}`.trim()}
      aria-label={text}
      {...handlers}
    >
      {display}
    </span>
  );
}
