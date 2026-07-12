import { useState, useEffect, useCallback, useRef, lazy, Suspense, Component } from 'react';
import type { ReactNode, ErrorInfo, HTMLAttributes, ComponentPropsWithoutRef } from 'react';

// Polyfill: `inert` is a valid HTML attribute not yet in React 18 types
type InertDivProps = ComponentPropsWithoutRef<'div'> & { inert?: boolean };
function InertDiv({ inert, ...props }: InertDivProps) {
  return <div {...(props as HTMLAttributes<HTMLDivElement>)} {...(inert ? { inert: '' } : {})} />;
}
import Loader from './components/Loader.tsx';
import Cursor from './components/Cursor.tsx';
import Sidebar from './components/Sidebar.tsx';
import Home from './components/Home.tsx';
import Works from './components/Works.tsx';
import Profile from './components/Profile.tsx';
import WorksModal from './components/WorksModal.tsx';
import ClickSpark from './components/ReactBits/ClickSpark.tsx';
import type { Work } from './data/works.ts';
import { pushRoute, readInitialRoute, routeFromPathname } from './routing.ts';
import type { RouteId } from './routing.ts';
import './components/Lanyard/Lanyard.css';

const Lanyard = lazy(() => import('./components/Lanyard/Lanyard.tsx'));

const LANYARD_SECTIONS = new Set(['home', 'news', 'about', 'plugin', 'contact', 'profile']);
const LOADER_SESSION_KEY = 'atelier-integral-loader-seen';
const LANYARD_QUERY = '(min-width: 1100px)';

function isWindowsPlatform(): boolean {
  return /Windows/i.test(`${navigator.userAgent} ${navigator.platform}`);
}

function canRenderLanyard(): boolean {
  return window.matchMedia(LANYARD_QUERY).matches
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

interface LanyardBoundaryProps {
  children: ReactNode;
}

interface LanyardBoundaryState {
  failed: boolean;
}

class LanyardBoundary extends Component<LanyardBoundaryProps, LanyardBoundaryState> {
  constructor(props: LanyardBoundaryProps) { super(props); this.state = { failed: false }; }
  static getDerivedStateFromError(_: Error): LanyardBoundaryState { return { failed: true }; }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  componentDidCatch(_error: Error, _info: ErrorInfo) {}
  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}

function initPerformance() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isWin = isWindowsPlatform();
  if (reduced) document.body.classList.add('performance-lite');
  else if (isWin) document.body.classList.add('windows-cursor-lite');
}

function hasSeenLoaderThisSession(): boolean {
  try {
    return window.sessionStorage.getItem(LOADER_SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

export default function App() {
  const [initialRoute] = useState(readInitialRoute);
  const [loaderDone, setLoaderDone] = useState(() => hasSeenLoaderThisSession());
  const [loaderFading, setLoaderFading] = useState(false);
  const [section, setSection] = useState<RouteId>(initialRoute === 'profile' ? 'home' : initialRoute);
  const [isProfile, setIsProfile] = useState(initialRoute === 'profile');
  const [modalWork, setModalWork] = useState<Work | null>(null);
  const [modalVer, setModalVer] = useState('a');
  const [canShowLanyard, setCanShowLanyard] = useState(() => canRenderLanyard());
  const modalTriggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => { initPerformance(); }, []);

  const applyRoute = useCallback((route: RouteId) => {
    setModalWork(null);
    modalTriggerRef.current = null;
    setIsProfile(route === 'profile');
    if (route !== 'profile') setSection(route);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const route = routeFromPathname(window.location.pathname);
      if (route) {
        applyRoute(route);
        return;
      }

      window.history.replaceState(null, '', '/');
      applyRoute('home');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [applyRoute]);

  useEffect(() => {
    const media = window.matchMedia(LANYARD_QUERY);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setCanShowLanyard(canRenderLanyard());
    update();
    media.addEventListener('change', update);
    reducedMotion.addEventListener('change', update);
    return () => {
      media.removeEventListener('change', update);
      reducedMotion.removeEventListener('change', update);
    };
  }, []);

  const handleLoaderDone = useCallback(() => {
    try {
      window.sessionStorage.setItem(LOADER_SESSION_KEY, '1');
    } catch {}
    setLoaderFading(true);
    setTimeout(() => setLoaderDone(true), 800);
  }, []);

  const goHome = useCallback(() => {
    pushRoute('home');
    applyRoute('home');
  }, [applyRoute]);

  const goSection = useCallback((id: Exclude<RouteId, 'profile'>) => {
    pushRoute(id);
    applyRoute(id);
  }, [applyRoute]);

  const goProfile = useCallback(() => {
    pushRoute('profile');
    applyRoute('profile');
  }, [applyRoute]);

  const openWork = useCallback((work: Work) => {
    modalTriggerRef.current = document.activeElement as HTMLElement | null;
    setModalWork(work);
    setModalVer('a');
  }, []);

  const closeModal = useCallback(() => setModalWork(null), []);

  const activeSec = isProfile ? 'profile' : section;
  const showLanyard = canShowLanyard && loaderDone && LANYARD_SECTIONS.has(activeSec);

  return (
    <>
      <div className="bg-orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <Cursor />
      <ClickSpark />

      {!loaderDone && (
        <div style={{
          opacity: loaderFading ? 0 : 1,
          transition: 'opacity .8s cubic-bezier(0.76,0,0.24,1)',
          position: 'fixed', inset: 0, zIndex: 99999,
          pointerEvents: loaderFading ? 'none' : 'auto'
        }}>
          <Loader onDone={handleLoaderDone} />
        </div>
      )}

      {showLanyard && (
        <LanyardBoundary>
          <Suspense fallback={null}>
            <Lanyard key={activeSec} />
          </Suspense>
        </LanyardBoundary>
      )}

      <InertDiv className={`page${!isProfile ? ' active' : ''}`} id="page-home" inert={!loaderDone}>
        <div className="layout">
          <Sidebar
            section={section}
            isProfile={isProfile}
            onHome={goHome}
            onSection={goSection}
            onProfile={goProfile}
          />
          <div className="main">
            <Home
              section={section}
              onSection={goSection}
              onOpenWork={openWork}
            />
            {section === 'works' && <Works onOpen={openWork} />}
            <footer className="site-footer">
              <span className="footer-name">Atelier Integral</span>
              <span className="footer-copy">© 2026 All rights reserved.</span>
            </footer>
          </div>
        </div>
      </InertDiv>

      <InertDiv
        id="page-profile"
        className={`profile-page${isProfile ? ' active' : ''}`}
        inert={!loaderDone}
      >
        <Sidebar
          section={section}
          isProfile={isProfile}
          onHome={goHome}
          onSection={goSection}
          onProfile={goProfile}
        />
        <Profile />
      </InertDiv>

      <WorksModal
        work={modalWork}
        onClose={closeModal}
        verTab={modalVer}
        onSwitchVer={setModalVer}
        triggerRef={modalTriggerRef}
      />
    </>
  );
}
