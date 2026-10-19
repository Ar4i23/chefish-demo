import { renderOrderLines, renderTotals } from '../components/order-summary.js';
import { calculateCartTotals, canCheckout } from '../features/cart/cart-logic.js';
import { getCart } from '../features/cart/cart-store.js';
import { readCheckout } from '../features/checkout/checkout-store.js';
import { t } from '../data/i18n.js';

export function renderPaymentPage(lang) {
  const lines = getCart();
  const checkout = readCheckout();
  if (!canCheckout(lines)) {
    return `<main class="page page--payment"><section class="payment-section container"><div class="payment-card payment-card--unavailable"><div class="payment-card__mark" aria-hidden="true">!</div><h1>${t('payment.title', lang)}</h1><p class="payment-card__notice">${t('checkout.empty', lang)}</p><a class="button button--primary" href="/menu" data-link>${t('action.openMenu', lang)} →</a></div></section></main>`;
  }

  const totals = calculateCartTotals(lines, checkout.fulfillment);
  const pickupLabel = checkout.fulfillment === 'delivery' ? t('checkout.delivery', lang) : t('checkout.pickup', lang);
  const deliveryAddress = checkout.fulfillment === 'delivery' ? checkout.address : 'CheFish · Batumi';
  return `
    <main class="page page--payment">
      <section class="payment-section container">
        <div class="payment-layout">
          <section class="payment-card payment-card--demo">
            <div class="payment-card__mark" aria-hidden="true">✓</div>
            <p class="payment-card__eyebrow">${t('payment.demoLabel', lang)}</p>
            <h1>${t('payment.title', lang)}</h1>
            <p class="payment-card__notice">${t('payment.notice', lang)}</p>
            <div class="payment-card__recipient"><span>${t('checkout.name', lang)}</span><strong>${checkout.name || '—'}</strong><span>${t('checkout.phone', lang)}</span><strong>${checkout.phone || '—'}</strong></div>
            <div class="payment-card__fulfillment"><span>${t('payment.method', lang)}</span><strong>${pickupLabel}</strong><span>${deliveryAddress || '—'}</span></div>
            <div class="payment-card__demo-actions">
              <button class="button button--primary" type="button" data-action="demo-payment-success">${t('payment.successAction', lang)} →</button>
              <button class="button button--secondary" type="button" data-action="demo-payment-failure">${t('payment.failAction', lang)}</button>
            </div>
            <a class="back-link payment-card__back" href="/checkout" data-link>← ${t('action.back', lang)}</a>
          </section>
          <aside class="order-panel payment-summary">
            <h2>${t('payment.summary', lang)}</h2>
            <div class="checkout-summary__lines">${renderOrderLines(lines, lang)}</div>
            ${renderTotals(totals, lang)}
          </aside>
        </div>
      </section>
    </main>`;
}

export function renderPaymentFailedPage(lang) {
  return `<main class="page page--payment-failed"><section class="payment-card payment-card--failed container"><div class="payment-card__mark" aria-hidden="true">!</div><p class="payment-card__eyebrow">${t('payment.demoLabel', lang)}</p><h1>${t('payment.failureTitle', lang)}</h1><p class="payment-card__notice">${t('payment.failureNotice', lang)}</p><div class="payment-card__demo-actions"><a class="button button--primary" href="/payment" data-link>${t('action.retry', lang)}</a><a class="button button--secondary" href="/cart" data-link>${t('cart.title', lang)}</a></div></section></main>`;
}
