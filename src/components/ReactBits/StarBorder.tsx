import type { ReactNode, CSSProperties } from 'react';

interface StarBorderProps {
  children: ReactNode;
  className?: string;
  color?: string;
  speed?: string;
  thickness?: number;
}

export default function StarBorder({
  children,
  className = '',
  color = 'rgba(44, 159, 143, .9)',
  speed = '3.8s',
  thickness = 1
}: StarBorderProps) {
  return (
    <span
      className={`star-border ${className}`.trim()}
      style={
        {
          '--star-color': color,
          '--star-speed': speed,
          '--star-thickness': `${thickness}px`
        } as CSSProperties
      }
    >
      <span className="star-border-trail star-border-trail-bottom" />
      <span className="star-border-trail star-border-trail-top" />
      <span className="star-border-content">{children}</span>
    </span>
  );
}
