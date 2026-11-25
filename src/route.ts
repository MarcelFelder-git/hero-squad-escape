// Tiny path router (no library needed).
export type Route = 'game' | 'presenter' | 'hall' | 'worksheet';

const path = window.location.pathname.replace(/\/+$/, '').toLowerCase();

/** true when the kids scanned the QR code of the worksheet (…/HERO) */
export const entryViaQr = path === '/hero';

export const route: Route =
  path === '/presenter' ? 'presenter' : path === '/hall' ? 'hall' : path === '/worksheet' ? 'worksheet' : 'game';

if (entryViaQr) window.history.replaceState(null, '', '/');
