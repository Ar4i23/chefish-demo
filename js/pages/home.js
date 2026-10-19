import { getProduct, products } from '../data/catalog.js';
import { renderProductCard } from '../components/product-card.js';
import { t } from '../data/i18n.js';

const storySections = [
  { id: 'vegetables', image: '/assets/images/sections/vegetables.webp', titleKey: 'home.sections.vegetables', bodyKey: 'home.sections.vegetablesBody', position: 'feature-block--vegetables' },
  { id: 'sauce', image: '/assets/images/sections/sauce.webp', titleKey: 'home.sections.sauce', bodyKey: 'home.sections.sauceBody', position: 'feature-block--sauce' },
  { id: 'chicken', image: '/assets/images/sections/chicken.webp', titleKey: 'home.sections.chicken', bodyKey: 'home.sections.chickenBody', position: 'feature-block--chicken' },
  { id: 'assembly', image: '/assets/images/sections/assembly.webp', titleKey: 'home.sections.assembly', bodyKey: 'home.sections.assemblyBody', position: 'feature-block--assembly' },
];

export function renderHome(lang) {
  const hits = ['chicken-shawarma', 'fish-shawarma', 'tuna-roll', 'shrimp-roll']
    .map((id) => getProduct(id)).filter(Boolean);

  return `
    <main class="page page--home">
      <section class="hero" aria-labelledby="hero-title">
        <img class="hero__image" src="/assets/images/sections/hero-rolls.webp" alt="Три фирменные шаурмы CheFish на гриле" width="1800" height="1013" fetchpriority="high" />
        <div class="hero__scrim" aria-hidden="true"></div>
        <div class="container hero__layout">
          <div class="hero__content" data-reveal>
            <h1 class="hero__title" id="hero-title"><span>${t('hero.line1', lang)}</span><span>${t('hero.line2', lang)}</span><span class="hero__title-accent">${t('hero.line3', lang)}</span><span class="hero__title-accent hero__title-last">${t('hero.line4', lang)}</span></h1>
            <p class="hero__description">${t('hero.description', lang)}</p>
            <a class="button button--primary hero__cta" href="/menu" data-link>${t('action.order', lang)} <span aria-hidden="true">→</span></a>
          </div>
          <p class="hero__stamp" aria-label="Fresh and tasty">Fresh<br />&amp; Tasty</p>
        </div>
        <a class="hero__scroll" href="#story" data-link><span class="hero__scroll-mark" aria-hidden="true"></span>${t('hero.scroll', lang)}</a>
      </section>

      <section class="home-story" id="story" aria-label="${t('home.sections.vegetables', lang)}">
        ${storySections.map((section, index) => `
          <article class="feature-block ${section.position}" id="${section.id}" data-reveal>
            <img class="feature-block__image" src="${section.image}" alt="${t(section.titleKey, lang)} CheFish" width="1700" height="695" loading="lazy" />
            <div class="feature-block__scrim" aria-hidden="true"></div>
            <div class="container feature-block__inner">
              <div class="feature-block__content">
                <h2 class="feature-block__title">${t(section.titleKey, lang)}</h2>
                <p class="feature-block__description">${t(section.bodyKey, lang)}</p>
              </div>
            </div>
          </article>`).join('')}
      </section>

      <section class="combo-banner" id="combos">
        <img class="combo-banner__image" src="/assets/images/sections/combo-banner.webp" alt="Шаурма, картофель фри и кола CheFish" width="1700" height="695" loading="lazy" />
        <div class="combo-banner__scrim" aria-hidden="true"></div>
        <div class="container combo-banner__inner" data-reveal>
          <div class="combo-banner__content">
            <h2 class="combo-banner__title">${t('home.comboTitlePrefix', lang)}<span class="combo-banner__title-accent">${t('home.comboTitleAccent', lang)}</span></h2>
            <p class="combo-banner__description">${t('home.comboBody', lang)}</p>
            <a class="button button--primary" href="/menu?category=combo" data-link>${t('action.chooseCombo', lang)} <span aria-hidden="true">→</span></a>
          </div>
        </div>
      </section>

      <section class="bestsellers section-space" aria-labelledby="bestsellers-title">
        <div class="container">
          <div class="section-heading section-heading--row">
            <h2 class="section-heading__title" id="bestsellers-title">${t('home.hits', lang)}</h2>
            <a class="text-link" href="/menu" data-link>${t('action.viewMenu', lang)} <span aria-hidden="true">→</span></a>
          </div>
          <div class="bestsellers__grid">${hits.map((product) => renderProductCard(product, lang)).join('')}</div>
          <p class="price-note">${t('price.confirmed', lang)}</p>
        </div>
      </section>

      <section class="about-strip" id="about">
        <div class="container about-strip__inner" data-reveal>
          <h2 class="about-strip__title">${t('home.aboutTitle', lang)}</h2>
          <p class="about-strip__description">${t('home.aboutBody', lang)}</p>
        </div>
      </section>

      <section class="service-strip" id="delivery">
        <div class="container service-strip__inner">
          <div><h2 class="service-strip__title">${t('home.deliveryTitle', lang)}</h2><p>${t('home.deliveryBody', lang)}</p></div>
          <a class="button button--secondary" href="/checkout" data-link>${t('action.checkout', lang)} <span aria-hidden="true">→</span></a>
        </div>
      </section>
    </main>`;
}
