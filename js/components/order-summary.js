import { getAddon, getProduct } from '../data/catalog.js';
import { formatPrice, escapeHtml, localized } from '../core/format.js';
import { getLinePricing, normalizeQuantity } from '../features/cart/cart-logic.js';
import { t } from '../data/i18n.js';

export function renderOrderLines(lines, lang, { editable = false } = {}) {
  return lines.map((line) => {
    const product = getProduct(line.productId);
    if (!product) return '';
    const pricing = getLinePricing(line);
    const quantity = normalizeQuantity(line.quantity);
    const addonsText = (line.addons ?? []).map((id) => getAddon(id)).filter(Boolean).map((addon) => localized(addon.name, lang)).join(', ');
    const linePrice = pricing.unitPriceTetri === null ? null : pricing.unitPriceTetri * quantity;
    return `
      <article class="order-line" data-order-line="${escapeHtml(line.key)}">
        <img class="order-line__image" src="${product.image}" alt="" width="84" height="84" loading="lazy" />
        <div class="order-line__content">
          <h3>${escapeHtml(localized(product.name, lang))}</h3>
          ${addonsText ? `<p class="order-line__addons">${escapeHtml(addonsText)}</p>` : ''}
          ${editable ? `<div class="quantity-control quantity-control--small"><button type="button" data-action="cart-quantity" data-key="${escapeHtml(line.key)}" data-delta="-1" aria-label="−">−</button><output>${quantity}</output><button type="button" data-action="cart-quantity" data-key="${escapeHtml(line.key)}" data-delta="1" aria-label="+">+</button></div>` : `<p class="order-line__quantity">× ${quantity}</p>`}
        </div>
        <div class="order-line__price">
          ${product.combo && pricing.regularUnitPriceTetri !== null ? `<del>${formatPrice(pricing.regularUnitPriceTetri * quantity, lang)}</del>` : ''}
          <strong>${formatPrice(linePrice, lang)}</strong>
          ${editable ? `<button class="order-line__remove" type="button" data-action="remove-cart-line" data-key="${escapeHtml(line.key)}">${t('action.remove', lang)}</button>` : ''}
        </div>
      </article>`;
  }).join('');
}

export function renderTotals(totals, lang, { showDelivery = true } = {}) {
  const itemsTotal = totals.hasUnknownPrice ? formatPrice(null, lang) : formatPrice(totals.regularSubtotalTetri, lang);
  const grandTotal = totals.hasUnknownPrice ? formatPrice(null, lang) : formatPrice(totals.totalTetri, lang);
  return `
    <div class="order-totals">
      <div><span>${t('cart.items', lang)}</span><strong>${itemsTotal}</strong></div>
      ${totals.discountTetri ? `<div class="order-totals__discount"><span>${t('cart.discount', lang)}</span><strong>− ${formatPrice(totals.discountTetri, lang)}</strong></div>` : ''}
      <div><span>${t('cart.packaging', lang)}</span><strong>${formatPrice(totals.packagingTetri, lang)}</strong></div>
      ${showDelivery ? `<div><span>${t('cart.delivery', lang)}</span><strong>${totals.deliveryTetri ? formatPrice(totals.deliveryTetri, lang) : t('cart.pickup', lang)}</strong></div>` : ''}
      <div class="order-totals__grand"><span>${t('cart.total', lang)}</span><strong>${grandTotal}</strong></div>
    </div>`;
}
