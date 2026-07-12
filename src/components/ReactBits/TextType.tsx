import { useEffect, useMemo, useState } from 'react';

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

interface TextTypeProps {
  texts: string | string[];
  className?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  pause?: number;
  cursor?: string;
}

export default function TextType({
  texts,
  className = '',
  typingSpeed = 54,
  deletingSpeed = 28,
  pause = 1300,
  cursor = '_'
}: TextTypeProps) {
  const list = useMemo(() => (Array.isArray(texts) ? texts : [texts]), [texts]);
  const [index, setIndex] = useState(0);
  const [shown, setShown] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!list.length) return undefined;
    if (prefersReducedMotion()) {
      setShown(list[0]);
      return undefined;
    }

    const full = list[index % list.length];
    let timeout: ReturnType<typeof window.setTimeout>;

    if (!deleting && shown.length < full.length) {
      timeout = window.setTimeout(() => setShown(full.slice(0, shown.length + 1)), typingSpeed);
    } else if (!deleting) {
      timeout = window.setTimeout(() => setDeleting(true), pause);
    } else if (shown.length > 0) {
      timeout = window.setTimeout(() => setShown(full.slice(0, shown.length - 1)), deletingSpeed);
    } else {
      timeout = window.setTimeout(() => {
        setDeleting(false);
        setIndex((current) => (current + 1) % list.length);
      }, 180);
    }

    return () => window.clearTimeout(timeout);
  }, [deleting, deletingSpeed, index, list, pause, shown, typingSpeed]);

  return (
    <span className={`text-type ${className}`.trim()}>
      <span className="text-type-content">{shown}</span>
      <span className="text-type-cursor" aria-hidden="true">{cursor}</span>
    </span>
  );
}
