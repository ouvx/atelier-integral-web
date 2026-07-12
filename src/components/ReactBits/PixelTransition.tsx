import type { CSSProperties } from 'react';

interface PixelTransitionProps {
  cells?: number;
  className?: string;
}

export default function PixelTransition({ cells = 24, className = '' }: PixelTransitionProps) {
  return (
    <span className={`pixel-transition ${className}`.trim()} aria-hidden="true">
      {Array.from({ length: cells }, (_, index) => (
        <span key={index} style={{ '--pixel-index': index } as CSSProperties} />
      ))}
    </span>
  );
}
