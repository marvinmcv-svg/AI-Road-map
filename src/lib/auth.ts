// Client-side gate. Keeps students from casually browsing the portal, but a
// static site can always be inspected, so ALSO protect the deployment itself
// (e.g. Vercel Deployment Protection). See README.

// SHA-256 of the default password "change-me-teacher". Override at build time
// with VITE_PORTAL_PASSWORD_HASH (generate with `npm run hash-password`).
const DEFAULT_HASH = 'bb2bb36d581733924f848c94f2cd4430d246b7be241da453f220bdb1800fd777';
export const PASSWORD_HASH: string = import.meta.env.VITE_PORTAL_PASSWORD_HASH || DEFAULT_HASH;
export const USING_DEFAULT_PASSWORD = !import.meta.env.VITE_PORTAL_PASSWORD_HASH;

export async function sha256(text: string) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

const SESSION_HOURS = 12;

export function isUnlocked() {
  const until = Number(localStorage.getItem('aic.session') || 0);
  return until > Date.now();
}
export function unlock() {
  localStorage.setItem('aic.session', String(Date.now() + SESSION_HOURS * 3600_000));
}
export function lock() {
  localStorage.removeItem('aic.session');
}
