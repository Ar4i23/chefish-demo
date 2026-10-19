import { addons, getProduct, priceForProduct } from '../data/catalog.js';
import { escapeHtml, formatPrice, localized } from '../core/format.js';
import { t } from '../data/i18n.js';

export function renderProductPage(productId, lang) {
  const product = getProduct(productId);
  if (!product) return null;
  const basePrice = priceForProduct(product);
  const productAddons = addons.filter((addon) => product.availableAddons.includes(addon.id));

  return `
    <main class="page page--product">
      <section class="product-detail container">
        <a class="back-link" href="/menu" data-link>← ${t('action.back', lang)}</a>
        <div class="product-detail__layout" data-product-detail data-product-id="${product.id}">
          <div class="product-detail__media"><img src="${product.image}" alt="${escapeHtml(localized(product.name, lang))}" width="920" height="920" fetchpriority="high" /></div>
          <div class="product-detail__content">
            <p class="product-detail__category">${t(`category.${product.category}`, lang)}</p>
            <h1 class="product-detail__title">${escapeHtml(localized(product.name, lang))}</h1>
            <p class="product-detail__price" data-base-price="${basePrice ?? ''}">${formatPrice(basePrice, lang)}</p>
            <p class="product-detail__description">${escapeHtml(localized(product.description, lang))}</p>
            ${product.ingredients?.[lang] ? `<section class="product-detail__section"><h2>${t('product.ingredients', lang)}</h2><p>${escapeHtml(localized(product.ingredients, lang))}</p>${product.compositionDraft ? `<p class="form-note">${t('product.compositionDraft', lang)}</p>` : ''}</section>` : ''}
            ${productAddons.length ? `<fieldset class="addon-list"><legend>${t('product.addons', lang)}</legend>${productAddons.map((addon) => `
              <label class="addon-option"><input type="checkbox" data-product-addon value="${addon.id}" data-price-tetri="${addon.priceTetri}" /><span>${escapeHtml(localized(addon.name, lang))}</span><span class="addon-option__price">+ ${formatPrice(addon.priceTetri, lang)}</span></label>`).join('')}</fieldset>` : ''}
            <div class="product-detail__purchase">
              <div class="quantity-control" aria-label="${t('product.quantity', lang)}">
                <button type="button" data-action="product-quantity" data-delta="-1" aria-label="−">−</button>
                <output data-product-quantity>1</output>
                <button type="button" data-action="product-quantity" data-delta="1" aria-label="+">+</button>
              </div>
              <div class="product-detail__purchase-total"><span>${t('product.total', lang)}</span><strong data-product-total>${formatPrice(basePrice, lang)}</strong></div>
            </div>
            <button class="button button--primary product-detail__add" type="button" data-action="add-configured-product" ${Number.isInteger(basePrice) ? '' : 'disabled'}>${t('action.addToCart', lang)} <span aria-hidden="true">→</span></button>
            <p class="price-note">${t(product.pricePending ? 'price.demo' : 'price.confirmed', lang)}</p>
          </div>
        </div>
      </section>
    </main>`;
}
