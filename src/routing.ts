export const ROUTE_IDS = ['home', 'works', 'profile', 'news', 'about', 'plugin', 'contact'] as const;

export type RouteId = typeof ROUTE_IDS[number];

const ROUTE_PATHS: Record<RouteId, string> = {
  home: '/',
  works: '/works',
  profile: '/profile',
  news: '/news',
  about: '/about',
  plugin: '/plugin',
  contact: '/contact'
};

const PATH_ROUTES = new Map(
  Object.entries(ROUTE_PATHS).map(([route, path]) => [path, route as RouteId])
);

function normalizePathname(pathname: string): string {
  if (pathname === '/') return pathname;
  return pathname.replace(/\/+$/, '');
}

export function routeFromPathname(pathname: string): RouteId | null {
  return PATH_ROUTES.get(normalizePathname(pathname)) ?? null;
}

export function pathForRoute(route: RouteId): string {
  return ROUTE_PATHS[route];
}

interface NavigationClick {
  button: number;
  defaultPrevented: boolean;
  metaKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
}

export function shouldHandleClientNavigation(event: NavigationClick): boolean {
  return event.button === 0
    && !event.defaultPrevented
    && !event.metaKey
    && !event.ctrlKey
    && !event.shiftKey
    && !event.altKey;
}

export function readInitialRoute(): RouteId {
  const route = routeFromPathname(window.location.pathname);
  if (route) return route;

  window.history.replaceState(null, '', '/');
  return 'home';
}

export function pushRoute(route: RouteId): void {
  const path = pathForRoute(route);
  if (window.location.pathname !== path) {
    window.history.pushState(null, '', path);
  }
}
