import type { ReactNode } from 'react';

interface ShinyTextProps {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

export default function ShinyText({ children, className = '', disabled = false }: ShinyTextProps) {
  return (
    <span className={`shiny-text${disabled ? ' disabled' : ''} ${className}`.trim()}>
      {children}
    </span>
  );
}
