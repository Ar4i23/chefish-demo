import { priceForProduct } from '../data/catalog.js';
import { localized, formatPrice, escapeHtml } from '../core/format.js';
import { t } from '../data/i18n.js';

export function renderProductCard(product, lang) {
  const price = priceForProduct(product);
  const addEnabled = Number.isInteger(price);
  const visibleName = product.menuName ? localized(product.menuName, lang) : localized(product.name, lang);
  return `
    <article class="product-card" data-ui>
      <a class="product-card__media" href="/menu/${encodeURIComponent(product.id)}" data-link aria-label="${escapeHtml(localized(product.name, lang))}">
        <img src="${product.image}" alt="${escapeHtml(localized(product.name, lang))}" loading="lazy" />
      </a>
      <div class="product-card__body">
        <h3 class="product-card__title"><a href="/menu/${encodeURIComponent(product.id)}" data-link>${escapeHtml(visibleName)}</a></h3>
        ${product.pricePending ? `<p class="product-card__pending">${t('product.pricePending', lang)}</p>` : ''}
        <div class="product-card__footer">
          <span class="product-card__price">${formatPrice(price, lang)}</span>
          <button class="button-add" type="button" data-action="add-cart" data-product-id="${product.id}" ${addEnabled ? '' : 'disabled'} aria-label="${t('action.add', lang)}: ${escapeHtml(localized(product.name, lang))}">+</button>
        </div>
      </div>
    </article>`;
}
