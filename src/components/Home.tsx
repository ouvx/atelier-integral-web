import { useEffect, useRef, useState } from 'react';
import { STATIC_WORKS, shapes } from '../data/works.ts';
import type { Work } from '../data/works.ts';
import type { RouteId } from '../routing.ts';
import { pathForRoute, shouldHandleClientNavigation } from '../routing.ts';
import type { MouseEvent } from 'react';
import CountUp from './ReactBits/CountUp.tsx';
import GradientText from './ReactBits/GradientText.tsx';
import Magnet from './ReactBits/Magnet.tsx';
import RevealOnView from './ReactBits/RevealOnView.tsx';
import ShinyText from './ReactBits/ShinyText.tsx';
import StarBorder from './ReactBits/StarBorder.tsx';
import TextType from './ReactBits/TextType.tsx';

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

function formatDate(d: string | undefined): string {
  if (!d) return '';
  return String(d).replaceAll('-', '.');
}

const MANUAL_NEWS = [
  { date: '2025-03-06', tag: 'INFO', text: 'ホームページを作成しました。' }
];

const WORK_NEWS_ITEMS = STATIC_WORKS.filter((work) => work.published_at)
  .map((work) => ({
    date: work.published_at ?? '',
    tag: 'WORKS',
    text: `作品「${work.title}」を公開しました`
  }))
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

const NEWS_ITEMS = [
  ...WORK_NEWS_ITEMS.slice(0, 5),
  ...MANUAL_NEWS
]
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

interface HomeProps {
  section: RouteId;
  onSection: (id: Exclude<RouteId, 'profile'>) => void;
  onOpenWork: (work: Work) => void;
}

export default function Home({ section, onSection, onOpenWork }: HomeProps) {
  const handleRouteClick = (event: MouseEvent<HTMLAnchorElement>, route: Exclude<RouteId, 'profile'>) => {
    if (!shouldHandleClientNavigation(event)) return;
    event.preventDefault();
    onSection(route);
  };
  const [heroWork, setHeroWork] = useState<Work>(STATIC_WORKS[0]);
  const [changing, setChanging] = useState<string | null>(null);
  const currentIdRef = useRef<string | undefined>(STATIC_WORKS[0]?.id);

  useEffect(() => {
    if (section !== 'home') return;

    function pickNext(): Work {
      const pool = STATIC_WORKS.filter((w) => w.id !== currentIdRef.current);
      return pool[Math.floor(Math.random() * pool.length)] || STATIC_WORKS[0];
    }

    function swap() {
      if (prefersReducedMotion()) {
        const next = pickNext();
        currentIdRef.current = next.id;
        setHeroWork(next);
        return;
      }
      const next = pickNext();
      setChanging('is-closing');
      setTimeout(() => {
        currentIdRef.current = next.id;
        setHeroWork(next);
        setChanging('is-revealing');
        setTimeout(() => setChanging(null), 490);
      }, 190);
    }

    const timer = setInterval(swap, 5200);
    return () => clearInterval(timer);
  }, [section]);

  const thumb = heroWork ? getThumb(heroWork.thumbnail_url || heroWork.video_url_a || heroWork.video_url_b) : null;
  const fallback = heroWork ? getFallback(heroWork.thumbnail_url || heroWork.video_url_a || heroWork.video_url_b) : null;

  const cardClass = ['hero-work tech-brackets', changing && `is-changing ${changing}`]
    .filter(Boolean).join(' ');

  return (
    <>
      {/* HERO */}
      <div id="hero" className={`active tech-brackets${section === 'home' ? '' : ''}`} style={{ display: section === 'home' ? 'block' : 'none' }}>
        <div className="tech-brackets-inner" />
        <div className="hero-layout">
          <div className="hero-copy">
            <div className="hero-label">
              <ShinyText>CREATIVE COLLECTIVE / INTERNET</ShinyText>
            </div>
            <h1 className="hero-title">
              <span className="title-mask"><span>Atelier</span></span><br />
              <span className="title-mask"><span className="outline-text">Integral</span></span>
            </h1>
            <p className="hero-sub">映像・音楽・制作ツールをつくるアトリエです。<br />複数人で一つの作品を微分積分しながら作ってゆきます</p>
            <div className="hero-type-line" aria-label="Atelier Integralの制作領域">
              <TextType
                texts={['music video direction', 'motion design system', 'creator tool development', 'integrated production']}
              />
            </div>
            <div className="hero-actions">
              <Magnet>
                <StarBorder>
                  <a className="hero-cta" href={pathForRoute('works')} onClick={(event) => handleRouteClick(event, 'works')}>Worksを見る</a>
                </StarBorder>
              </Magnet>
              <Magnet>
                <a className="hero-cta secondary" href={pathForRoute('contact')} onClick={(event) => handleRouteClick(event, 'contact')}>相談する</a>
              </Magnet>
            </div>
            <div className="hero-stats" aria-label="Atelier Integralの制作領域">
              <div className="hero-stat tech-brackets">
                <div className="tech-brackets-inner" />
                <strong><CountUp to={4} pad={2} /></strong><span>creative fields</span>
              </div>
              <div className="hero-stat tech-brackets">
                <div className="tech-brackets-inner" />
                <strong>∫</strong><span>integrated workflow</span>
              </div>
              <div className="hero-stat tech-brackets">
                <div className="tech-brackets-inner" />
                <strong><CountUp from={2021} to={2026} duration={1500} /></strong><span>atelier archive</span>
              </div>
            </div>
          </div>

          {heroWork && (
            <button
              className={cardClass}
              id="hero-work"
              type="button"
              aria-label={heroWork ? `${heroWork.title}を開く` : 'Featured work'}
              onClick={() => onOpenWork(heroWork)}
            >
              <div className="tech-brackets-inner" />
              <span className="glare-sheen" aria-hidden="true" />
              <div className="hero-work-thumb" id="hero-work-thumb">
                {thumb ? (
                  <img
                    src={thumb}
                    alt=""
                    onError={(e) => {
                      const img = e.currentTarget;
                      img.onerror = null;
                      if (fallback) img.src = fallback;
                    }}
                  />
                ) : (
                  <svg className="ws" viewBox="0 0 300 169" dangerouslySetInnerHTML={{ __html: shapes[heroWork.color_theme ?? ''] || shapes.wt1 }} />
                )}
              </div>
              <div className="hero-work-body">
                <div className="hero-work-label">
                  <span id="hero-work-category">{heroWork.category || 'WORKS'}</span>
                  <span id="hero-work-date">{formatDate(heroWork.published_at)}</span>
                </div>
                <div className="hero-work-title" id="hero-work-title">{heroWork.title}</div>
                <span className="hero-work-link">View work</span>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* NEWS */}
      <div className={`sec${section === 'news' ? ' active' : ''}`} id="sec-news" style={{ display: section === 'news' ? 'block' : 'none' }}>
        <div className="sec-inner">
          <div className="sec-label">NEWS</div>
          <h2 className="sec-title"><GradientText>Latest</GradientText></h2>
          <div className="news-list">
            {NEWS_ITEMS.map((item) => (
              <div className="news-item" key={`${item.date}-${item.text}`}>
                <span className="news-date">{formatDate(item.date)}</span>
                <span className="news-tag">{item.tag}</span>
                <span className="news-text">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ABOUT */}
      <div className={`sec${section === 'about' ? ' active' : ''}`} id="sec-about" style={{ display: section === 'about' ? 'block' : 'none' }}>
        <div className="sec-inner">
          <div className="sec-label">ABOUT</div>
          <h2 className="sec-title"><GradientText>Who we are</GradientText></h2>
          <p className="about-lead">
            Atelier Integral は、映像・音楽・制作ツールをつくるチームです。アイデアを話し合い、手を動かしながら、見る人・使う人に届く形にしていきます。
          </p>
          <div className="about-system-grid about-system-grid-static">
            <div className="role-list role-list-full">
              {[
                { num: '01', title: 'Producer', desc: '企画や進行を整理し、制作を前に進める' },
                { num: '02', title: 'Director', desc: '作品の方向性を決め、全体を見ながら形にする' },
                { num: '03', title: 'Editor', desc: '素材を整え、伝わりやすい流れにする' }
              ].map((r) => (
                <RevealOnView key={r.num} className="role-item" delay={Number(r.num) * 70}>
                  <span className="role-num">{r.num}</span>
                  <span className="role-title">{r.title}</span>
                  <span className="role-desc">{r.desc}</span>
                </RevealOnView>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* PLUGIN */}
      <div className={`sec${section === 'plugin' ? ' active' : ''}`} id="sec-plugin" style={{ display: section === 'plugin' ? 'block' : 'none' }}>
        <div className="sec-inner">
          <div className="sec-label">PLUGIN</div>
          <h2 className="sec-title"><GradientText>Tools for<br />Creators</GradientText></h2>
          <p className="plugin-intro">
            After Effects や Blender での制作を助ける小さなツールを作っています。作業を少し楽にして、表現に集中できるようにします。
          </p>
          <Magnet padding={28} strength={6}>
            <a className="plugin-link" href="https://okazakiyuki.booth.pm/" target="_blank" rel="noopener noreferrer">BOOTH</a>
          </Magnet>
        </div>
      </div>

      {/* CONTACT */}
      <div className={`sec${section === 'contact' ? ' active' : ''}`} id="sec-contact" style={{ display: section === 'contact' ? 'block' : 'none' }}>
        <div className="sec-inner">
          <div className="sec-label">CONTACT</div>
          <h2 className="sec-title"><GradientText>Let's build</GradientText></h2>
          <p className="contact-text">映像・音楽・制作ツールなど、制作のご相談や一緒に作りたいことがあればお気軽にご連絡ください。</p>
          <div className="contact-list">
            <div className="contact-item">
              <span className="contact-label">Mail</span>
              <Magnet padding={22} strength={7}>
                <a className="contact-val" href="mailto:atl.integral.info@gmail.com">atl.integral.info@gmail.com</a>
              </Magnet>
            </div>
            <div className="contact-item">
              <span className="contact-label">X</span>
              <Magnet padding={22} strength={7}>
                <a className="contact-val" href="https://x.com/Atl_Integral" target="_blank" rel="noopener noreferrer">@Atl_Integral</a>
              </Magnet>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}
