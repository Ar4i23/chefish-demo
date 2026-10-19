import { calculateCartTotals, canCheckout } from '../features/cart/cart-logic.js';
import { getCart } from '../features/cart/cart-store.js';
import { readCheckout } from '../features/checkout/checkout-store.js';
import { renderOrderLines, renderTotals } from '../components/order-summary.js';
import { escapeHtml } from '../core/format.js';
import { t } from '../data/i18n.js';

export function renderCheckoutPage(lang) {
  const lines = getCart();
  if (!lines.length) {
    return `<main class="page page--checkout"><section class="empty-cart container"><div class="empty-cart__content"><h1>${t('cart.emptyTitle', lang)}</h1><p>${t('checkout.empty', lang)}</p><a class="button button--primary" href="/menu" data-link>${t('action.openMenu', lang)} →</a></div></section></main>`;
  }

  const checkout = readCheckout();
  const totals = calculateCartTotals(lines, checkout.fulfillment);
  const pricesConfirmed = canCheckout(lines);
  return `
    <main class="page page--checkout">
      <section class="page-hero page-hero--compact"><div class="container page-hero__inner"><a class="back-link" href="/cart" data-link>← ${t('cart.title', lang)}</a><h1 class="page-hero__title">${t('checkout.title', lang)}</h1></div></section>
      <section class="checkout-section container">
        <form class="checkout-layout" data-form="checkout" novalidate>
          <div class="checkout-form">
            <fieldset class="form-section"><legend>${t('checkout.contact', lang)}</legend>
              <label class="form-field"><span>${t('checkout.name', lang)}</span><input name="name" autocomplete="name" required value="${escapeHtml(checkout.name)}" data-checkout-field /></label>
              <label class="form-field"><span>${t('checkout.phone', lang)}</span><input name="phone" type="tel" autocomplete="tel" inputmode="tel" required placeholder="+995 5XX XX XX XX" value="${escapeHtml(checkout.phone)}" data-checkout-field /></label>
            </fieldset>
            <fieldset class="form-section"><legend>${t('checkout.fulfillment', lang)}</legend>
              <div class="fulfillment-options">
                <label class="fulfillment-option ${checkout.fulfillment === 'delivery' ? 'is-selected' : ''}"><input type="radio" name="fulfillment" value="delivery" ${checkout.fulfillment === 'delivery' ? 'checked' : ''} data-fulfillment /><span><strong>${t('checkout.delivery', lang)}</strong><small>Batumi</small></span></label>
                <label class="fulfillment-option ${checkout.fulfillment === 'pickup' ? 'is-selected' : ''}"><input type="radio" name="fulfillment" value="pickup" ${checkout.fulfillment === 'pickup' ? 'checked' : ''} data-fulfillment /><span><strong>${t('checkout.pickup', lang)}</strong><small>CheFish</small></span></label>
              </div>
            </fieldset>
            ${checkout.fulfillment === 'delivery' ? `
              <fieldset class="form-section form-section--delivery"><legend>${t('checkout.mapTitle', lang)}</legend>
                <p class="form-note">${t('checkout.mapHint', lang)}</p>
                <div class="delivery-map" id="delivery-map" data-delivery-map></div>
                <div class="delivery-map__actions"><button class="button button--small button--secondary" type="button" data-action="geolocate">${t('action.useLocation', lang)}</button><span data-location-status>${checkout.coordinates ? t('checkout.locationSelected', lang) : t('checkout.locationPending', lang)}</span></div>
                <p class="form-note" data-map-fallback hidden>${t('checkout.noMap', lang)}</p>
                <label class="form-field"><span>${t('checkout.address', lang)}</span><input name="address" autocomplete="street-address" required value="${escapeHtml(checkout.address)}" data-checkout-field /></label>
                <label class="form-field"><span>${t('checkout.unit', lang)}</span><input name="unit" autocomplete="address-line2" value="${escapeHtml(checkout.unit)}" data-checkout-field /></label>
                <input type="hidden" name="coordinates" value="${checkout.coordinates ? `${checkout.coordinates.lat},${checkout.coordinates.lng}` : ''}" data-checkout-field />
              </fieldset>` : ''}
            <label class="form-field form-field--wide"><span>${t('checkout.comment', lang)}</span><textarea name="comment" rows="3" data-checkout-field>${escapeHtml(checkout.comment)}</textarea></label>
            <p class="checkout-message" data-checkout-message role="alert" hidden></p>
            <p class="form-note">${t('checkout.paymentHint', lang)}</p>
            ${!pricesConfirmed ? `<p class="checkout-message" role="status">${t('product.pricePending', lang)}</p>` : ''}
            <button class="button button--primary button--block checkout-form__submit" type="submit" ${pricesConfirmed ? '' : 'disabled'}>${t('action.continueToPayment', lang)} →</button>
          </div>
          <aside class="order-panel checkout-summary">
            <h2>${t('payment.summary', lang)}</h2>
            <div class="checkout-summary__lines">${renderOrderLines(lines, lang)}</div>
            ${renderTotals(totals, lang)}
            ${pricesConfirmed ? '' : `<p class="price-note">${t('price.demo', lang)}</p>`}
          </aside>
        </form>
      </section>
    </main>`;
}
