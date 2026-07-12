import logoSrc from '../assets/logo.svg';
import DecryptedText from './ReactBits/DecryptedText.tsx';
import type { RouteId } from '../routing.ts';
import { pathForRoute, shouldHandleClientNavigation } from '../routing.ts';
import type { MouseEvent } from 'react';

interface SidebarProps {
  section: RouteId;
  isProfile: boolean;
  onHome: () => void;
  onSection: (id: Exclude<RouteId, 'profile'>) => void;
  onProfile: () => void;
}

export default function Sidebar({ section, onHome, onSection, onProfile, isProfile }: SidebarProps) {
  const navItems: Array<{ label: string; action: () => void; id: RouteId }> = [
    { label: 'News', action: () => onSection('news'), id: 'news' },
    { label: 'About', action: () => onSection('about'), id: 'about' },
    { label: 'Works', action: () => onSection('works'), id: 'works' },
    { label: 'Plugin', action: () => onSection('plugin'), id: 'plugin' },
    { label: 'Profile', action: onProfile, id: 'profile' },
    { label: 'Contact', action: () => onSection('contact'), id: 'contact' }
  ];

  const active = isProfile ? 'profile' : section;

  const handleNavigation = (event: MouseEvent<HTMLAnchorElement>, action: () => void) => {
    if (!shouldHandleClientNavigation(event)) return;
    event.preventDefault();
    action();
  };

  return (
    <aside className="sidebar">
      <div>
        <a className="site-name" href={pathForRoute('home')} onClick={(event) => handleNavigation(event, onHome)} aria-label="ホームへ移動">
          <span className="logo-mark">
            <img src={logoSrc} alt="" />
          </span>
          <span className="logo-word">Atelier<br />Integral</span>
        </a>
        <nav aria-label="サイトナビゲーション">
          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item.id} className="nav-item">
                <a
                  href={pathForRoute(item.id)}
                  onClick={(event) => handleNavigation(event, item.action)}
                  className={active === item.id ? 'active' : ''}
                  aria-current={active === item.id ? 'page' : undefined}
                >
                  <DecryptedText
                    text={item.label}
                    className="nav-decrypt"
                    encryptedClassName="is-encrypted"
                    speed={24}
                    iterations={7}
                  />
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="sidebar-foot">
        <div className="tech-barcode" style={{ marginBottom: 12 }}>portfolio</div>
        © 2026<br />Atelier Integral
      </div>
    </aside>
  );
}
