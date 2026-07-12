import { useEffect, useRef } from 'react';
import logoSrc from '../assets/logo.svg';
import DecryptedText from './ReactBits/DecryptedText.tsx';

const LOGS = [
  { limit: 20, text: 'BOOTING ATELIER SYSTEMS...' },
  { limit: 45, text: 'LOADING CREATIVE WORKFLOWS...' },
  { limit: 70, text: 'PARSING MUSIC & VIDEO CORE SCHEMAS...' },
  { limit: 88, text: 'COMPILING STYLES & INTERACTIVE GLOWS...' },
  { limit: 100, text: 'READY.' }
];

function getLogText(p: number): string {
  for (const log of LOGS) {
    if (p <= log.limit) return log.text;
  }
  return 'READY.';
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

interface LoaderProps {
  onDone?: () => void;
}

export default function Loader({ onDone }: LoaderProps) {
  const percentRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) {
      if (percentRef.current) percentRef.current.textContent = '100%';
      if (lineRef.current) lineRef.current.style.width = '100%';
      if (logRef.current) logRef.current.textContent = 'SYSTEM ACTIVE.';
      const timeout = window.setTimeout(() => onDone?.(), 100);
      return () => window.clearTimeout(timeout);
    }

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 8) + 2;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        if (percentRef.current) percentRef.current.textContent = '100%';
        if (lineRef.current) lineRef.current.style.width = '100%';
        if (logRef.current) logRef.current.textContent = 'SYSTEM ACTIVE.';
        setTimeout(() => onDone?.(), 350 + 800);
      } else {
        if (percentRef.current) percentRef.current.textContent = progress + '%';
        if (lineRef.current) lineRef.current.style.width = progress + '%';
        if (logRef.current) logRef.current.textContent = getLogText(progress);
      }
    }, 45);
    return () => clearInterval(interval);
  }, [onDone]);

  return (
    <div id="loader">
      <div className="loader-content tech-brackets">
        <div className="tech-brackets-inner" />
        <div className="loader-logo">
          <img src={logoSrc} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'invert(1)' }} />
        </div>
        <div className="loader-title">
          <DecryptedText text="ATELIER INTEGRAL" trigger="view" speed={22} iterations={10} />
        </div>
        <div className="loader-sys-info">SYSTEM INITIALIZATION // LOCAL RUNTIME</div>
        <div className="loader-progress-bar">
          <div className="loader-progress-line" ref={lineRef} />
        </div>
        <div className="loader-status">
          <span className="loader-log" ref={logRef}>LOADING INTEGRAL MODULES...</span>
          <span className="loader-percent" ref={percentRef}>0%</span>
        </div>
      </div>
    </div>
  );
}
