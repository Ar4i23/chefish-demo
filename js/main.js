import { renderHeader } from './components/header.js';
import { renderFooter } from './components/footer.js';
import { resolveRoute, navigate } from './core/router.js';
import { formatPrice } from './core/format.js';
import { getLanguage, setLanguage, t } from './data/i18n.js';
import { getProduct, priceForProduct } from './data/catalog.js';
import { renderHome } from './pages/home.js';
import { renderMenuPage } from './pages/menu.js';
import { renderProductPage } from './pages/product.js';
import { renderCartPage } from './pages/cart.js';
import { renderCheckoutPage } from './pages/checkout.js';
import { renderPaymentFailedPage, renderPaymentPage } from './pages/payment.js';
import { renderSuccessPage } from './pages/success.js';
import { renderNotFoundPage } from './pages/not-found.js';
import { addToCart, cartQuantity, clearCart, getCart, removeFromCart, updateCartQuantity } from './features/cart/cart-store.js';
import { calculateCartTotals, canCheckout } from './features/cart/cart-logic.js';
import { readCheckout, saveCheckout } from './features/checkout/checkout-store.js';
import { destroyDeliveryMap, geolocateOnMap, mountDeliveryMap } from './features/map/map-provider.js';

const app = document.querySelector('#app');
let toastTimeout;

function withBasePath(markup) {
  const basePath = window.CHEFISH_BASE_PATH || '';
  if (!basePath) return markup;
  return markup.replace(/\b(href|src|poster)="(\/(?!\/)[^"]*)"/g, (_, attribute, path) => `${attribute}="${basePath}${path}"`);
}

function getPage(route, lang) {
  switch (route.name) {
    case 'home': return renderHome(lang);
    case 'menu': return renderMenuPage(lang);
    case 'product': return renderProductPage(route.productId, lang) ?? renderNotFoundPage(lang);
    case 'cart': return renderCartPage(lang);
    case 'checkout': return renderCheckoutPage(lang);
    case 'payment': return renderPaymentPage(lang);
    case 'paymentFailed': return renderPaymentFailedPage(lang);
    case 'success': return renderSuccessPage(lang) ?? renderNotFoundPage(lang);
    default: return renderNotFoundPage(lang);
  }
}

function renderCurrent() {
  destroyDeliveryMap();
  const lang = getLanguage();
  const route = resolveRoute(window.location.pathname);
  const cartCount = cartQuantity(getCart());
  document.documentElement.lang = lang;
  document.body.dataset.route = route.name;
  app.innerHTML = withBasePath(`${renderHeader(lang, cartCount)}${getPage(route, lang)}${renderFooter(lang)}<div class="toast" data-toast role="status" aria-live="polite" hidden></div>`);
  initRevealMotion();
  initSliderControls();

  if (route.name === 'checkout' && readCheckout().fulfillment === 'delivery') {
    const mapNode = app.querySelector('[data-delivery-map]');
    const checkout = readCheckout();
    mountDeliveryMap(mapNode, checkout.coordinates, (point) => {
      saveCheckout({ coordinates: point });
      const hidden = app.querySelector('[name="coordinates"]');
      const status = app.querySelector('[data-location-status]');
      if (hidden) hidden.value = `${point.lat},${point.lng}`;
      if (status) status.textContent = `${t('checkout.locationSelected', lang)}: ${point.lat}, ${point.lng}`;
    }, () => {
      const fallback = app.querySelector('[data-map-fallback]');
      if (fallback) fallback.hidden = false;
    });
  }
}

function syncSliderControls(track) {
  if (!track) return;
  const maximum = track.scrollWidth - track.clientWidth;
  app.querySelectorAll(`[data-action="scroll-track"][data-track="${track.id}"]`).forEach((button) => {
    const direction = Number(button.dataset.direction);
    button.disabled = direction < 0 ? track.scrollLeft <= 1 : maximum <= 1 || track.scrollLeft >= maximum - 1;
  });
}

function initSliderControls() {
  app.querySelectorAll('.product-rail[id]').forEach((track) => {
    syncSliderControls(track);
    track.addEventListener('scroll', () => syncSliderControls(track), { passive: true });
  });
}

function initRevealMotion() {
  const targets = [...app.querySelectorAll('[data-reveal]')];
  if (!targets.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    targets.forEach((target) => target.classList.add('is-visible'));
    return;
  }
  document.documentElement.classList.add('motion-ready');
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      currentObserver.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
  targets.forEach((target) => observer.observe(target));
}

function refreshCartBadge() {
  const count = cartQuantity(getCart());
  const cartLink = app.querySelector('.header__cart');
  const lang = getLanguage();
  let badge = app.querySelector('.cart-badge');
  if (count > 0 && !badge && cartLink) {
    badge = document.createElement('span');
    badge.className = 'cart-badge';
    badge.setAttribute('aria-live', 'polite');
    cartLink.append(badge);
  }
  if (badge) {
    if (count > 0) badge.textContent = String(count);
    else badge.remove();
  }
  if (cartLink) cartLink.setAttribute('aria-label', count > 0 ? `${t('cart.title', lang)}: ${count}` : t('cart.title', lang));
}

function showToast(product) {
  const toast = app.querySelector('[data-toast]');
  if (!toast) return;
  const lang = getLanguage();
  const name = product?.name?.[lang] ?? product?.name?.ru ?? '';
  window.clearTimeout(toastTimeout);
  toast.innerHTML = withBasePath(`<img class="toast__image" src="${product?.image ?? ''}" alt="" /><div class="toast__content"><strong>${t('toast.added', lang)}</strong><span>${name}</span><a href="/cart" data-link>${t('toast.viewCart', lang)}</a></div><button class="toast__close" type="button" data-action="toast-close" aria-label="${t('action.close', lang)}">×</button>`);
  toast.hidden = false;
  requestAnimationFrame(() => toast.classList.add('is-visible'));
  toastTimeout = window.setTimeout(() => { toast.classList.remove('is-visible'); window.setTimeout(() => { toast.hidden = true; }, 180); }, 3800);
}

function readCheckoutForm(form) {
  const formData = new FormData(form);
  const coordinatesValue = String(formData.get('coordinates') ?? '').trim();
  const coords = coordinatesValue ? coordinatesValue.split(',').map((value) => Number(value.trim())) : [];
  const validCoords = coords.length === 2 && coords.every(Number.isFinite) ? { lat: coords[0], lng: coords[1] } : readCheckout().coordinates;
  return {
    name: String(formData.get('name') ?? '').trim(),
    phone: String(formData.get('phone') ?? '').trim(),
    fulfillment: String(formData.get('fulfillment') ?? 'pickup'),
    address: String(formData.get('address') ?? '').trim(),
    unit: String(formData.get('unit') ?? '').trim(),
    comment: String(formData.get('comment') ?? '').trim(),
    coordinates: validCoords,
  };
}

function updateProductTotal() {
  const panel = app.querySelector('[data-product-detail]');
  if (!panel) return;
  const product = getProduct(panel.dataset.productId);
  const base = priceForProduct(product);
  if (!Number.isInteger(base)) return;
  const quantity = Number(panel.querySelector('[data-product-quantity]')?.textContent || 1);
  const addonsTotal = [...panel.querySelectorAll('[data-product-addon]:checked')]
    .reduce((sum, input) => sum + Number(input.dataset.priceTetri || 0), 0);
  const unitTotal = base + addonsTotal;
  const lang = getLanguage();
  const price = formatPrice(unitTotal, lang);
  const currentPrice = panel.querySelector('[data-base-price]');
  const total = panel.querySelector('[data-product-total]');
  if (currentPrice) currentPrice.textContent = price;
  if (total) total.textContent = formatPrice(unitTotal * quantity, lang);
}

function handleClick(event) {
  const link = event.target.closest('a[data-link]');
  if (link && !event.defaultPrevented && !event.metaKey && !event.ctrlKey && !event.shiftKey && link.target !== '_blank') {
    event.preventDefault();
    navigate(link.getAttribute('href'));
    return;
  }

  const button = event.target.closest('[data-action]');
  if (!button || button.disabled) return;
  const action = button.dataset.action;

  if (action === 'language-toggle') {
    const menu = app.querySelector('[data-language-menu]');
    const open = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!open));
    if (menu) menu.hidden = open;
    if (!open) menu?.querySelector('[aria-selected="true"]')?.focus();
  }

  if (action === 'toast-close') {
    const toast = button.closest('[data-toast]');
    toast?.classList.remove('is-visible');
    window.setTimeout(() => { if (toast) toast.hidden = true; }, 180);
  }

  if (action === 'add-cart') {
    addToCart(button.dataset.productId);
    refreshCartBadge();
    showToast(getProduct(button.dataset.productId));
  }

  if (action === 'demo-payment-success') {
    const lines = getCart();
    if (!canCheckout(lines)) return;
    const checkout = readCheckout();
    const totals = calculateCartTotals(lines, checkout.fulfillment);
    const receipt = { id: `DEMO-${Date.now().toString().slice(-8)}`, totalTetri: totals.totalTetri, createdAt: new Date().toISOString() };
    try { window.sessionStorage.setItem('chefish.demo-receipt.v1', JSON.stringify(receipt)); } catch { /* Keep the demo flow available without storage. */ }
    clearCart();
    navigate('/order/success');
  }

  if (action === 'demo-payment-failure') navigate('/payment/failed');

  if (action === 'add-configured-product') {
    const panel = button.closest('[data-product-detail]');
    const productId = panel?.dataset.productId;
    const quantity = Number(panel?.querySelector('[data-product-quantity]')?.textContent || 1);
    const selectedAddons = [...(panel?.querySelectorAll('[data-product-addon]:checked') ?? [])].map((input) => input.value);
    addToCart(productId, { quantity, addons: selectedAddons });
    refreshCartBadge();
    showToast(getProduct(productId));
  }

  if (action === 'cart-quantity') {
    const line = getCart().find((item) => item.key === button.dataset.key);
    if (line) updateCartQuantity(line.key, line.quantity + Number(button.dataset.delta));
    renderCurrent();
  }

  if (action === 'remove-cart-line') {
    removeFromCart(button.dataset.key);
    renderCurrent();
  }

  if (action === 'product-quantity') {
    const output = app.querySelector('[data-product-quantity]');
    if (output) output.textContent = String(Math.min(99, Math.max(1, Number(output.textContent) + Number(button.dataset.delta))));
    updateProductTotal();
  }

  if (action === 'category-filter') {
    const url = new URL(window.location.href);
    url.searchParams.set('category', button.dataset.category);
    url.searchParams.delete('q');
    navigate(`${url.pathname}${url.search}`);
  }

  if (action === 'menu-toggle') {
    const nav = app.querySelector('[data-mobile-nav]');
    button.setAttribute('aria-expanded', String(nav?.hidden));
    if (nav) nav.hidden = !nav.hidden;
  }

  if (action === 'scroll-track') {
    const track = document.getElementById(button.dataset.track);
    const direction = Number(button.dataset.direction) || 1;
    track?.scrollBy({ left: direction * track.clientWidth * 0.78, behavior: 'smooth' });
    requestAnimationFrame(() => syncSliderControls(track));
  }

  if (action === 'geolocate') {
    const status = app.querySelector('[data-location-status]');
    button.disabled = true;
    geolocateOnMap().then((point) => {
      if (status) status.textContent = `${t('checkout.locationSelected', getLanguage())}: ${point.lat}, ${point.lng}`;
      const hidden = app.querySelector('[name="coordinates"]');
      if (hidden) hidden.value = `${point.lat},${point.lng}`;
      saveCheckout({ coordinates: point });
    }).catch((error) => {
      if (status) status.textContent = error?.code === 1 ? t('checkout.noMap', getLanguage()) : t('checkout.locationPending', getLanguage());
    }).finally(() => { button.disabled = false; });
  }

}

document.addEventListener('click', handleClick);

document.addEventListener('click', (event) => {
  const option = event.target.closest('[data-language-option]');
  if (option) {
    setLanguage(option.dataset.languageOption);
    renderCurrent();
  }
  if (!event.target.closest('[data-language-picker]')) {
    const trigger = app.querySelector('[data-action="language-toggle"]');
    const menu = app.querySelector('[data-language-menu]');
    trigger?.setAttribute('aria-expanded', 'false');
    if (menu) menu.hidden = true;
  }
});

document.addEventListener('keydown', (event) => {
  const picker = event.target.closest('[data-language-picker]');
  if (event.key === 'Escape') {
    const trigger = app.querySelector('[data-action="language-toggle"]');
    const menu = app.querySelector('[data-language-menu]');
    if (trigger?.getAttribute('aria-expanded') === 'true') {
      trigger.setAttribute('aria-expanded', 'false');
      if (menu) menu.hidden = true;
      trigger.focus();
    }
  }
  if (!picker || !['ArrowDown', 'ArrowUp'].includes(event.key)) return;
  event.preventDefault();
  const options = [...picker.querySelectorAll('[data-language-option]')];
  const index = options.indexOf(document.activeElement);
  const next = event.key === 'ArrowDown' ? (index + 1) % options.length : (index <= 0 ? options.length - 1 : index - 1);
  options[next]?.focus();
});

document.addEventListener('change', (event) => {
  if (event.target.matches('[data-product-addon]')) updateProductTotal();
  if (event.target.matches('[data-fulfillment]')) {
    const form = event.target.closest('[data-form="checkout"]');
    if (form) saveCheckout({ ...readCheckoutForm(form), fulfillment: event.target.value });
    renderCurrent();
    return;
  }
  if (event.target.matches('[data-checkout-field]')) {
    const form = event.target.closest('[data-form="checkout"]');
    if (form) saveCheckout(readCheckoutForm(form));
  }
});

document.addEventListener('input', (event) => {
  if (event.target.matches('[data-checkout-field]')) {
    const form = event.target.closest('[data-form="checkout"]');
    if (form) saveCheckout(readCheckoutForm(form));
  }
  if (event.target.matches('[data-product-addon]')) updateProductTotal();
});

document.addEventListener('submit', (event) => {
  const form = event.target;
  if (form.matches('[data-form="checkout"]')) {
    event.preventDefault();
    const lines = getCart();
    const message = app.querySelector('[data-checkout-message]');
    const checkout = readCheckoutForm(form);
    saveCheckout(checkout);
    if (!canCheckout(lines)) {
      if (message) { message.textContent = t('checkout.empty', getLanguage()); message.hidden = false; }
      return;
    }
    if (!form.reportValidity()) {
      if (message) { message.textContent = t('checkout.required', getLanguage()); message.hidden = false; }
      return;
    }
    navigate('/payment');
  }
});

window.addEventListener('popstate', renderCurrent);
window.addEventListener('resize', () => app.querySelectorAll('.product-rail[id]').forEach(syncSliderControls), { passive: true });
window.addEventListener('chefish:cart-change', refreshCartBadge);
renderCurrent();
