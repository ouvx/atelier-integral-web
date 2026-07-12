import { useState, useRef } from 'react';
import GradientText from './ReactBits/GradientText.tsx';
import Magnet from './ReactBits/Magnet.tsx';
import RevealOnView from './ReactBits/RevealOnView.tsx';

interface BioItem {
  year: string;
  text: string;
}

interface ProfileLink {
  label: string;
  href: string;
}

interface ProfileData {
  id: number;
  nameJp: string;
  nameEn: string;
  role: string;
  icon: string;
  iconClass: string;
  tags: string[];
  links: ProfileLink[];
  bio?: { label: string; items: BioItem[] };
  about?: string;
  fields: string[];
}

const profiles: ProfileData[] = [
  {
    id: 0,
    nameJp: '暁闇 鬱',
    nameEn: 'Gyouan Utu',
    role: '代表',
    icon: '/assets/gyouan-icon.png',
    iconClass: 'logo-avatar',
    tags: ['Music (Compose, Arrange, Mixing etc.)', 'Video', 'Develop', 'Creative Direction'],
    links: [
      { label: '@gyouan_utu_12', href: 'https://x.com/gyouan_utu_12' },
      { label: 'Portfolio', href: 'https://www.foriio.com/gyouan-utu-12' }
    ],
    bio: {
      label: 'BIOGRAPHY',
      items: [
        { year: '2021', text: 'ボカロPとして活動開始。VOCALOID作品の投稿をはじめ、楽曲制作・アレンジを中心に活動。' },
        { year: '2023', text: '映像クリエイターとして活動開始。MV制作・映像編集を本格的にスタート。音楽と映像の統合表現を探求。' },
        { year: '2024', text: '外部の映像制作チームに参加し、映像ディレクターとして制作に携わる。' }
      ]
    },
    fields: ['Music (Compose, Arrange, Mixing etc.)', 'Video', 'Develop', 'Creative Direction']
  },
  {
    id: 1,
    nameJp: '岡崎有希',
    nameEn: 'Okazaki Yuki',
    role: '副代表',
    icon: '/assets/okazaki-icon.jpg',
    iconClass: 'portrait-avatar',
    tags: ['Mixing', 'Develop', 'Produce'],
    links: [
      { label: '@okazaki_yuki01', href: 'https://x.com/okazaki_yuki01' }
    ],
    about: 'Mixエンジニア、プロジェクトマネージャーとして制作を支える。',
    fields: ['Mixing', 'Develop', 'Produce']
  }
];

export default function Profile() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const pf = profiles[active];
  const visibleLinks = pf.links.filter((link) => link.href.trim());

  function handleTabKeyDown(e: React.KeyboardEvent, idx: number) {
    let next = idx;
    if (e.key === 'ArrowRight') next = (idx + 1) % profiles.length;
    else if (e.key === 'ArrowLeft') next = (idx - 1 + profiles.length) % profiles.length;
    else return;
    e.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <div className="profile-main">
      <div className="profile-tabs" role="tablist" aria-label="メンバー選択">
        {profiles.map((p, idx) => (
          <button
            key={p.id}
            id={`ptab-${p.id}`}
            role="tab"
            aria-selected={active === p.id}
            aria-controls={`ppanel-${p.id}`}
            tabIndex={active === p.id ? 0 : -1}
            className={`ptab${active === p.id ? ' active' : ''}`}
            onClick={() => setActive(p.id)}
            onKeyDown={(e) => handleTabKeyDown(e, idx)}
            ref={(el) => { tabRefs.current[idx] = el; }}
          >
            {p.nameJp}
          </button>
        ))}
      </div>

      <div
        className="profile-pane active"
        role="tabpanel"
        id={`ppanel-${pf.id}`}
        aria-labelledby={`ptab-${pf.id}`}
      >
        <div className="profile-pane-grid">
          <div className="profile-summary">
            <div className="av-ring">
              <div className={`av-inner ${pf.iconClass}`}>
                <img src={pf.icon} alt={pf.nameJp} />
              </div>
            </div>
            <div className="profile-role">{pf.role}</div>
            <div className="profile-name-en"><GradientText>{pf.nameEn}</GradientText></div>
            <div className="profile-name-jp">{pf.nameJp}</div>
            <div className="profile-tags">
              {pf.tags.map((t, i) => (
                <RevealOnView key={i} as="span" className="profile-tag" delay={i * 55}>
                  {t}
                </RevealOnView>
              ))}
            </div>
            {visibleLinks.length > 0 && (
              <div className="profile-links">
                {visibleLinks.map((l, i) => (
                  <Magnet key={i} padding={22} strength={7}>
                    <a className="profile-link" href={l.href} target="_blank" rel="noopener noreferrer">
                      {l.label}
                    </a>
                  </Magnet>
                ))}
              </div>
            )}
          </div>

          <div className="profile-detail">
            {pf.bio && (
              <div className="bio-section">
                <div className="bio-label">{pf.bio.label}</div>
                {pf.bio.items.map((item, i) => (
                  <div key={i} className="bio-item">
                    <span className="bio-year">{item.year}</span>
                    <span className="bio-text">{item.text}</span>
                  </div>
                ))}
              </div>
            )}

            {pf.about && (
              <div className="bio-section">
                <div className="bio-label">ABOUT</div>
                <p style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 2 }}>{pf.about}</p>
              </div>
            )}

            <div className="bio-section" style={pf.about ? { marginTop: 32 } : {}}>
              <div className="bio-label">FIELDS</div>
              <div className="fields-grid">
                {pf.fields.map((f, i) => (
                  <RevealOnView key={i} as="span" className="field-item" delay={i * 45}>
                    {f}
                  </RevealOnView>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
