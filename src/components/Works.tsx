import { STATIC_WORKS, shapes } from '../data/works.ts';
import type { Work, CreditEntry } from '../data/works.ts';
import GradientText from './ReactBits/GradientText.tsx';
import Magnet from './ReactBits/Magnet.tsx';

function getYouTubeId(url: string | undefined): string | null {
  if (!url) return null;
  const m = String(url).match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/embed\/)([\w-]+)/);
  return m ? m[1] : null;
}

function getThumb(url: string | undefined): string | null {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : null;
}

function getFallback(url: string | undefined): string | null {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

function xProfileUrl(handle: string): string {
  return 'https://x.com/' + encodeURIComponent(String(handle).replace(/^@/, '').trim());
}

function xAvatarUrl(handle: string): string {
  return 'https://unavatar.io/x/' + encodeURIComponent(String(handle).replace(/^@/, '').trim());
}

function CreditChip({ c }: { c: CreditEntry }) {
  if (typeof c === 'string') return <span className="ctb">{c}</span>;
  const handle = String(c.x || '').replace(/^@/, '').trim();
  const label = `${c.role ? c.role + ': ' : ''}${c.name || ''}`;
  if (!handle) return <span className="ctb">{label}</span>;
  return (
    <span className="ctb">
      <a className="credit-link" href={xProfileUrl(handle)} target="_blank" rel="noopener noreferrer">
        <img className="credit-avatar" src={xAvatarUrl(handle)} alt="" loading="lazy" />
        <span>{label}</span>
      </a>
    </span>
  );
}

interface WorkCardProps {
  work: Work;
  onOpen: (work: Work) => void;
}

function WorkCard({ work, onOpen }: WorkCardProps) {
  const thumb = getThumb(work.thumbnail_url || work.video_url_a || work.video_url_b);
  const fallback = getFallback(work.thumbnail_url || work.video_url_a || work.video_url_b);
  const credits = Array.isArray(work.credits) ? work.credits : [];
  const isCompact = work.id === 'static-karaage-battle';

  return (
    <div className={`wi${credits.length ? ' has-credits' : ''}${isCompact ? ' wi--compact' : ''}`}>
      <button
        className="wi-open"
        type="button"
        aria-label={`${work.title}を開く`}
        onClick={() => onOpen(work)}
      >
        <div className={`wth ${work.color_theme || 'wt1'}${thumb ? ' has-thumb' : ''}`}>
          {thumb ? (
            <img
              className="work-thumb"
              src={thumb}
              alt=""
              loading="lazy"
              onError={(e) => {
                const img = e.currentTarget;
                img.onerror = null;
                if (fallback) img.src = fallback;
              }}
            />
          ) : (
            <svg className="ws" viewBox="0 0 300 225" dangerouslySetInnerHTML={{ __html: shapes[work.color_theme ?? ''] || shapes.wt1 }} />
          )}
        </div>
        <span className="wi-open-hint" aria-hidden="true">OPEN WORK</span>
      </button>
      <div className="wi-meta">
        <div className="wif">
          <div className="wc">{work.category || ''}</div>
          <div className="wn">{work.title}</div>
        </div>
        {credits.length > 0 && (
          <div className="wcr wi-credits">
            {credits.map((c, i) => <CreditChip key={i} c={c} />)}
          </div>
        )}
      </div>
    </div>
  );
}

interface WorksProps {
  onOpen: (work: Work) => void;
}

export default function Works({ onOpen }: WorksProps) {
  const sorted = [...STATIC_WORKS].sort(
    (a, b) => new Date(b.published_at ?? 0).getTime() - new Date(a.published_at ?? 0).getTime()
  );

  return (
    <div className="sec active" id="sec-works">
      <div className="sec-inner" style={{ maxWidth: '100%' }}>
        <div className="works-head">
          <div className="sec-label" style={{ marginBottom: 0 }}>
            <GradientText>WORKS</GradientText>
          </div>
          <div className="works-actions">
            <Magnet padding={30} strength={6}>
              <a
                className="works-link"
                href="https://www.foriio.com/gyouan-utu-12"
                target="_blank"
                rel="noopener noreferrer"
              >
                Gyouan Portfolio
              </a>
            </Magnet>
          </div>
        </div>
        <div className="works-categories">
          <span className="works-category-label">Music Video</span>
        </div>
        <div className="wg" id="works-grid">
          {sorted.map((w) => (
            <WorkCard key={w.id} work={w} onOpen={onOpen} />
          ))}
        </div>
      </div>
    </div>
  );
}
