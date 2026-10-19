import { categories, products } from '../data/catalog.js';
import { renderProductCard } from '../components/product-card.js';
import { t } from '../data/i18n.js';

export function renderMenuPage(lang) {
  const params = new URLSearchParams(window.location.search);
  const activeCategory = categories.some((category) => category.id === params.get('category')) ? params.get('category') : 'shawarma';
  const query = (params.get('q') || '').trim().toLocaleLowerCase(lang);
  const filtered = products.filter((product) => {
    const categoryMatch = product.category === activeCategory;
    const name = `${product.name[lang] ?? product.name.ru} ${product.menuName?.[lang] ?? ''}`;
    return categoryMatch && (!query || name.toLocaleLowerCase(lang).includes(query));
  });
  const priceNoteKey = activeCategory === 'combo' || activeCategory === 'drinks' ? 'price.demo' : 'price.confirmed';

  return `
    <main class="page page--menu">
      <section class="page-hero page-hero--menu">
        <div class="container page-hero__inner">
          <a class="back-link" href="/" data-link>← ${t('action.home', lang)}</a>
          <h1 class="page-hero__title">${t('menu.title', lang)}</h1>
          <p class="page-hero__description">${t('menu.subtitle', lang)}</p>
        </div>
      </section>
      <section class="menu-section">
        <div class="container">
          <div class="category-tabs" role="tablist" aria-label="${t('menu.title', lang)}">
            ${categories.map((category) => `<button class="category-tab ${activeCategory === category.id ? 'is-active' : ''}" type="button" role="tab" aria-selected="${activeCategory === category.id}" data-action="category-filter" data-category="${category.id}">${t(category.key, lang)}</button>`).join('')}
          </div>
          <div class="menu-grid" data-menu-grid>
            ${filtered.length ? filtered.map((product) => renderProductCard(product, lang)).join('') : `<p class="empty-state">${t('menu.empty', lang)}</p>`}
          </div>
          <p class="price-note">${t(priceNoteKey, lang)}</p>
        </div>
      </section>
    </main>`;
}
