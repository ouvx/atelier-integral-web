export type CreditEntry =
  | string
  | { role?: string; name?: string; x?: string; suffix?: string };

export interface Work {
  id: string;
  title: string;
  category?: string;
  color_theme?: string;
  published_at?: string;
  thumbnail_url?: string;
  video_url_a?: string;
  video_url_b?: string;
  credits?: CreditEntry[];
}

export const shapes: Record<string, string> = {
  wt1: '<text x="150" y="135" text-anchor="middle" fill="rgba(200,216,248,.08)" font-family="serif" font-size="56" font-style="italic">∫</text>',
  wt2: '<polygon points="150,28 272,198 28,198" fill="none" stroke="rgba(240,200,216,.08)" stroke-width="1"/>',
  wt3: '<rect x="55" y="42" width="190" height="140" fill="none" stroke="rgba(200,240,232,.07)" stroke-width="1"/>',
  wt4: '<circle cx="150" cy="112" r="78" fill="none" stroke="rgba(200,240,232,.07)" stroke-width="1"/>'
};

export const STATIC_WORKS: Work[] = [
  {
    id: 'static-karaage-battle',
    title: 'からあげバトル - まいたけ vs ありけん',
    category: 'Music Video',
    color_theme: 'wt1',
    published_at: '2026-07-06',
    video_url_a: 'https://youtu.be/2ndCj9UMbeY?si=TZOzUzjctL7q_GVa',
    credits: [
      { role: 'Music / Lyrics', name: 'GYU P', x: 'GYUP_bokaroP' },
      { role: 'Guitar', name: '藍宮ことの', x: 'aimiya_138' },
      { role: 'Mix', name: 'じゅんぺ', x: 'multibandcomp' },
      { role: 'Illust', name: 'Lyon', x: 'DeabanNero' },
      { role: 'Storyboard', name: 'おぼろ', x: 'oboro_moon397' },
      { role: 'Movie / Lyrics', name: '暁闇 鬱', x: 'gyouan_utu_12' },
      { role: 'Prod', name: '岡崎有希', x: 'okazaki_yuki01' }
    ]
  },
  {
    id: 'static-soutaiteki-na-shiawase',
    title: '相対的な幸せに飽きたから - 月並みな青に纏われたい、ね。',
    category: 'Music Video',
    color_theme: 'wt3',
    published_at: '2026-07-01',
    video_url_a: 'https://youtu.be/2CQBHrpudio?si=pTOFGCtc9i9pI-Oj',
    credits: [
      { role: 'Music Direction', name: '壱 あれい', x: 'a0_2nomae' },
      { role: 'Vocal', name: '尾長真昼', x: 'ke64musham' },
      { role: 'Illust', name: 'たまら', x: 'yamasodachi55' },
      { role: 'Movie', name: 'KOHIRU', x: 'k0ii81' },
      { role: 'Prod / PM', name: '岡崎有希', x: 'okazaki_yuki01' }
    ]
  },
  {
    id: 'static-totemo-suteki-na-rokugatsu',
    title: 'とても素敵な六月でした - すたぽら',
    category: 'Music Video',
    color_theme: 'wt2',
    published_at: '2026-06-30',
    video_url_a: 'https://youtu.be/f8Fp6yAZijc?si=QBftmjAE1C3HLJIv',
    credits: [
      { role: 'Movie', name: '暁闇 鬱', x: 'gyouan_utu_12' },
      { role: 'Design', name: 'レイ', x: 'morinonaka__07' }
    ]
  },
  {
    id: 'static-non-breath-oblige',
    title: 'ノンブレス・オブリージュ - しほ',
    category: 'Music Video',
    color_theme: 'wt1',
    published_at: '2026-03-22',
    video_url_a: 'https://youtu.be/1qkTh9-bWs8?si=RyBWBQrBarLaFr4j',
    credits: [{ role: 'Movie', name: '暁闇 鬱', x: 'gyouan_utu_12' }]
  },
  {
    id: 'static-world-is-mine-cpk-remix',
    title: 'ワールドイズマイン CPK! Remix - しほ',
    category: 'Music Video',
    color_theme: 'wt2',
    published_at: '2026-05-24',
    video_url_a: 'https://youtu.be/ei3v8zuKBrU?si=iIuLizJsAxCr4Fi6',
    credits: [
      { role: 'Design', name: 'レイ', x: 'morinonaka__07' },
      { role: 'Lyric Motion', name: 'かるき', x: 'karukikk' },
      { role: 'Direction', name: '暁闇 鬱', x: 'gyouan_utu_12' }
    ]
  },
  {
    id: 'static-i-like-u',
    title: 'i like u - 雨宮みやび × TEMPLIME',
    category: 'Music Video',
    color_theme: 'wt3',
    published_at: '2026-05-17',
    video_url_a: 'https://youtu.be/jEUXHlO8-iY?si=SP9QUEq_N7ckBgDD',
    credits: [{ role: 'Movie', name: '暁闇 鬱', x: 'gyouan_utu_12' }]
  },
  {
    id: 'static-splash',
    title: 'Splash. - picco × VOLTA × 春猿火',
    category: 'Music Video',
    color_theme: 'wt4',
    published_at: '2026-03-30',
    thumbnail_url: 'https://youtu.be/pI8stbN6wJA?si=EfklqVIk35_ZV2sV',
    video_url_a: 'https://youtu.be/pI8stbN6wJA?si=EfklqVIk35_ZV2sV',
    video_url_b: 'https://youtu.be/kkTSKgaYrSQ?si=YqpsrRJtbBrZjTK0',
    credits: [
      { role: 'Typography & Logo Design', name: 'kohakuno', x: 'amber_layer01' },
      { role: 'Direction', name: '暁闇 鬱', x: 'gyouan_utu_12' },
      { role: 'Edit', name: 'はるきち', x: 'harukichi_eizou' }
    ]
  },
  {
    id: 'static-snowloop',
    title: 'snowloop* - 棗いつき × 藍月なくる × picco',
    category: 'Music Video',
    color_theme: 'wt1',
    published_at: '2025-12-25',
    thumbnail_url: 'https://youtu.be/efNl6gpXyJY?si=qFU9hl1i94BjKvqj',
    video_url_a: 'https://youtu.be/efNl6gpXyJY?si=qFU9hl1i94BjKvqj',
    video_url_b: 'https://youtu.be/28oJOKO4CSI?si=bagluThe8OaXLvK6',
    credits: [
      { role: 'Direction', name: '暁闇 鬱', x: 'gyouan_utu_12' },
      { role: 'Edit', name: 'はるきち', x: 'harukichi_eizou' }
    ]
  },
  {
    id: 'static-tryna',
    title: 'TRYNA - 秋奈 × picco',
    category: 'Music Video',
    color_theme: 'wt2',
    published_at: '2026-01-30',
    thumbnail_url: 'https://youtu.be/pBEYCYxbdFM?si=TeqDkrOMMyDt2RO0',
    video_url_a: 'https://youtu.be/pBEYCYxbdFM?si=TeqDkrOMMyDt2RO0',
    video_url_b: 'https://youtu.be/XhdZmDXjndw?si=LIbuGcIRrTjRg7rT',
    credits: [{ role: 'Movie', name: '暁闇 鬱', x: 'gyouan_utu_12' }]
  },
  {
    id: 'static-otomeroid-memeumeu-cover',
    title: 'OTOMEROID / めめうめう cover',
    category: 'Music Video',
    color_theme: 'wt3',
    published_at: '2026-01-21',
    video_url_a: 'https://youtu.be/O8KZN446Lis?si=Yut-vOTg6eH-owMg',
    credits: [
      { role: 'Edit', name: '深澄', x: 'Nyx02x' },
      { role: 'Direction', name: '暁闇 鬱', x: 'gyouan_utu_12' }
    ]
  },
  {
    id: 'static-be-my-guest',
    title: 'Be My Guest - lilia',
    category: 'Music Video',
    color_theme: 'wt3',
    published_at: '2025-11-15',
    video_url_a: 'https://youtu.be/7Kh3SazrH7Y?si=q6MnwlO_PqFJAEOn',
    credits: [
      { role: 'Edit', name: 'かるき', x: 'karukikk' },
      { role: 'Direction', name: '暁闇 鬱', x: 'gyouan_utu_12' }
    ]
  },
  {
    id: 'static-melancholy-kitchen',
    title: 'メランコリーキッチン - ぐっしゅん',
    category: 'Music Video',
    color_theme: 'wt4',
    published_at: '2026-06-06',
    video_url_a: 'https://youtu.be/VRHnZeC9erQ?si=0RBYjO-Ibo8WKoUD',
    credits: [
      { role: 'Edit', name: 'レイ', x: 'morinonaka__07' },
      { role: 'Direction', name: '暁闇 鬱', x: 'gyouan_utu_12' }
    ]
  }
];
