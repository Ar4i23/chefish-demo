export function resolveRoute(pathname) {
  const basePath = globalThis.window?.CHEFISH_BASE_PATH || '';
  const appPath = basePath && (pathname === basePath || pathname.startsWith(`${basePath}/`)) ? pathname.slice(basePath.length) || '/' : pathname;
  const path = appPath.replace(/\/+$/, '') || '/';
  if (path === '/') return { name: 'home' };
  if (path === '/menu') return { name: 'menu' };
  const product = path.match(/^\/menu\/([^/]+)$/);
  if (product) return { name: 'product', productId: decodeURIComponent(product[1]) };
  if (path === '/cart') return { name: 'cart' };
  if (path === '/checkout') return { name: 'checkout' };
  if (path === '/payment' || path === '/payment/demo-checkout') return { name: 'payment' };
  if (path === '/payment/failed') return { name: 'paymentFailed' };
  if (path === '/order-success' || path === '/order/success') return { name: 'success' };
  return { name: 'notFound' };
}

export function navigate(target, { replace = false } = {}) {
  const basePath = window.CHEFISH_BASE_PATH || '';
  const nextTarget = basePath && target.startsWith('/') && !target.startsWith(`${basePath}/`) && target !== basePath
    ? `${basePath}${target}`
    : target;
  const next = new URL(nextTarget, window.location.origin);
  if (replace) window.history.replaceState({}, '', next.pathname + next.search + next.hash);
  else window.history.pushState({}, '', next.pathname + next.search + next.hash);
  window.dispatchEvent(new PopStateEvent('popstate'));
  if (next.hash) {
    requestAnimationFrame(() => document.querySelector(next.hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  } else {
    window.scrollTo(0, 0);
  }
}
