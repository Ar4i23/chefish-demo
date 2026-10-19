import { calculateCartTotals, getLinePricing } from '../features/cart/cart-logic.js';
import { getCart } from '../features/cart/cart-store.js';
import { renderOrderLines, renderTotals } from '../components/order-summary.js';
import { readCheckout } from '../features/checkout/checkout-store.js';
import { t } from '../data/i18n.js';

export function renderCartPage(lang) {
  const lines = getCart();
  if (!lines.length) {
    return `
      <main class="page page--cart">
        <section class="empty-cart container">
          <a class="back-link" href="/menu" data-link>← ${t('action.openMenu', lang)}</a>
          <div class="empty-cart__content"><h1>${t('cart.emptyTitle', lang)}</h1><p>${t('cart.emptyBody', lang)}</p><a class="button button--primary" href="/menu" data-link>${t('action.openMenu', lang)} <span aria-hidden="true">→</span></a></div>
        </section>
      </main>`;
  }

  const fulfillment = readCheckout().fulfillment;
  const cartTotals = calculateCartTotals(lines, fulfillment);
  const unknownPrice = lines.some((line) => getLinePricing(line).unitPriceTetri === null);
  return `
    <main class="page page--cart">
      <section class="page-hero page-hero--compact"><div class="container page-hero__inner"><a class="back-link" href="/menu" data-link>← ${t('action.continue', lang)}</a><h1 class="page-hero__title">${t('cart.title', lang)}</h1></div></section>
      <section class="cart-section container">
        <div class="cart-layout">
          <div class="cart-lines">${renderOrderLines(lines, lang, { editable: true })}</div>
          <aside class="order-panel">
            <h2>${t('cart.title', lang)}</h2>
            ${renderTotals(cartTotals, lang)}
            ${unknownPrice ? `<p class="form-note">${t('generic.toBeConfirmed', lang)}</p>` : ''}
            <a class="button button--primary button--block ${unknownPrice ? 'is-disabled' : ''}" ${unknownPrice ? 'aria-disabled="true"' : 'href="/checkout" data-link'}>${t('action.checkout', lang)} <span aria-hidden="true">→</span></a>
          </aside>
        </div>
        ${unknownPrice ? `<p class="price-note">${t('price.demo', lang)}</p>` : ''}
      </section>
    </main>`;
}
