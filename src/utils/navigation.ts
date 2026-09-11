/**
 * Unified SSO & Return Navigation Utility for JanaSamadhan Multi-Portal Ecosystem
 */
export function getReturnLoginUrl(): string {
  if (typeof window === 'undefined') return 'https://login-portal-jharkhand.vercel.app';
  try {
    const params = new URLSearchParams(window.location.search);
    const loginUrl = params.get('loginUrl');
    if (loginUrl) {
      sessionStorage.setItem('janasamadhan_login_url', loginUrl);
      return loginUrl;
    }
  } catch {}
  try {
    const stored = sessionStorage.getItem('janasamadhan_login_url');
    if (stored) return stored;
  } catch {}
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3000';
  }
  return 'https://login-portal-jharkhand.vercel.app';
}

export function handlePortalLogout(): void {
  const target = getReturnLoginUrl();
  try {
    sessionStorage.clear();
    localStorage.clear();
  } catch {}
  window.location.href = target;
}
