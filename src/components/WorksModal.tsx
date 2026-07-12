import { useEffect, useRef } from 'react';
import type { MutableRefObject } from 'react';
import GradientText from './ReactBits/GradientText.tsx';
import type { Work, CreditEntry } from '../data/works.ts';

function xProfileUrl(handle: string): string {
  return 'https://x.com/' + encodeURIComponent(String(handle).replace(/^@/, '').trim());
}

function xAvatarUrl(handle: string): string {
  return 'https://unavatar.io/x/' + encodeURIComponent(String(handle).replace(/^@/, '').trim());
}

function creditChip(c: CreditEntry, i: number) {
  if (typeof c === 'string') return <span key={i} className="ctb">{c}</span>;
  const handle = String(c.x || '').replace(/^@/, '').trim();
  const label = `${c.role ? c.role + ': ' : ''}${c.name || ''}${c.suffix ? ' (' + c.suffix + ')' : ''}`;
  if (!handle) return <span key={i} className="ctb">{label}</span>;
  return (
    <span key={i} className="ctb">
      <a className="credit-link" href={xProfileUrl(handle)} target="_blank" rel="noopener noreferrer">
        <img className="credit-avatar" src={xAvatarUrl(handle)} alt="" loading="lazy" />
        <span>{label}</span>
      </a>
    </span>
  );
}

function getYouTubeId(url: string | undefined): string | null {
  if (!url) return null;
  const m = String(url).match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/embed\/)([\w-]+)/);
  return m ? m[1] : null;
}

function getEmbedUrl(url: string | undefined): string | null {
  if (!url) return null;
  const yt = getYouTubeId(url);
  if (yt) return 'https://www.youtube-nocookie.com/embed/' + yt + '?rel=0&modestbranding=1';
  const nico = String(url).match(/nicovideo\.jp\/watch\/((?:sm|nm|so)?\d+)/);
  if (nico) return 'https://embed.nicovideo.jp/watch/' + nico[1];
  return null;
}

interface WorksModalProps {
  work: Work | null;
  onClose: () => void;
  verTab: string;
  onSwitchVer: (ver: string) => void;
  triggerRef: MutableRefObject<HTMLElement | null>;
}

export default function WorksModal({ work, onClose, verTab, onSwitchVer, triggerRef }: WorksModalProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const visible = !!work;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = work ? 'hidden' : '';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [work, onClose]);

  useEffect(() => {
    if (visible) {
      closeRef.current?.focus();
    } else if (triggerRef?.current) {
      triggerRef.current.focus();
      triggerRef.current = null;
    }
  }, [visible, triggerRef]);

  useEffect(() => {
    if (!visible) return;
    const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), iframe';
    function trapTab(e: KeyboardEvent) {
      if (e.key !== 'Tab') return;
      const box = boxRef.current;
      if (!box) return;
      const els = [...box.querySelectorAll<HTMLElement>(FOCUSABLE)];
      if (els.length === 0) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    document.addEventListener('keydown', trapTab);
    return () => document.removeEventListener('keydown', trapTab);
  }, [visible]);

  const w = work ?? ({} as Partial<Work>);

  const embedA = getEmbedUrl(w.video_url_a);
  const embedB = getEmbedUrl(w.video_url_b);
  const hasBoth = !!(embedA && embedB);
  const credits = Array.isArray(w.credits) ? w.credits : [];
  const activeVer = verTab || 'a';

  return (
    <div
      id="work-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-hidden={!visible}
      style={{
        display: 'flex',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        position: 'fixed',
        inset: 0,
        zIndex: 800,
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'opacity .3s'
      }}
    >
      <div id="modal-bg" onClick={onClose} />
      <div className="modal-box tech-brackets" ref={boxRef}>
        <div className="tech-brackets-inner" />
        <span className="glare-sheen" aria-hidden="true" />
        <div className="window-titlebar">
          <span className="window-sys-title">SYS // INTEGRAL_WORK_VIEWER</span>
          <div className="window-controls">
            <span className="win-btn" />
            <span className="win-btn" />
            <button className="win-btn win-close" onClick={onClose} aria-label="閉じる" ref={closeRef}>×</button>
          </div>
        </div>
        <div className="modal-header">
          <div className="modal-meta">
            <div id="modal-cat">{w.category || ''}</div>
            <div id="modal-title"><GradientText>{w.title || ''}</GradientText></div>
          </div>
        </div>
        <div className="modal-body">
          <div id="modal-credits">
            {credits.map((c, i) => creditChip(c, i))}
          </div>

          {hasBoth && (
            <div className="modal-ver-tabs" style={{ display: 'flex' }}>
              <button
                className={`ver-tab${activeVer === 'a' ? ' active' : ''}`}
                onClick={() => onSwitchVer('a')}
              >Ver.A</button>
              <button
                className={`ver-tab${activeVer === 'b' ? ' active' : ''}`}
                onClick={() => onSwitchVer('b')}
              >Ver.B</button>
            </div>
          )}

          {embedA && (!hasBoth || activeVer === 'a') && (
            <div className="modal-video-wrap">
              <iframe
                key={embedA}
                src={embedA}
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              />
              <a
                className="modal-video-link"
                href={w.video_url_a}
                target="_blank"
                rel="noopener noreferrer"
              >
                {hasBoth ? 'Ver.AをYouTubeで開く' : 'YouTubeで開く'}
              </a>
            </div>
          )}

          {embedB && activeVer === 'b' && (
            <div className="modal-video-wrap">
              <iframe
                key={embedB}
                src={embedB}
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              />
              <a
                className="modal-video-link"
                href={w.video_url_b}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver.BをYouTubeで開く
              </a>
            </div>
          )}

          {!embedA && !embedB && (
            <div className="modal-no-video">NO VIDEO</div>
          )}
        </div>
      </div>
    </div>
  );
}
