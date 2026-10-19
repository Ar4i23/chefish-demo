import { t } from '../data/i18n.js';

const bagIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l1 13H4L5 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></svg>';
const languageNames = { ru: 'Русский', en: 'English', ka: 'ქართული' };
const flags = {
  ru: '<svg viewBox="0 0 20 14" aria-hidden="true"><path fill="#fff" d="M0 0h20v4.67H0z"/><path fill="#2456a6" d="M0 4.67h20v4.66H0z"/><path fill="#d83232" d="M0 9.33h20V14H0z"/></svg>',
  en: '<svg viewBox="0 0 20 14" aria-hidden="true"><path fill="#012169" d="M0 0h20v14H0z"/><path d="m0 0 20 14M20 0 0 14" stroke="#fff" stroke-width="3.5"/><path d="m0 0 20 14M20 0 0 14" stroke="#c8102e" stroke-width="1.5"/><path stroke="#fff" stroke-width="5" d="M0 7h20M10 0v14"/><path stroke="#c8102e" stroke-width="2.5" d="M0 7h20M10 0v14"/></svg>',
  ka: '<svg viewBox="0 0 20 14" aria-hidden="true"><path fill="#fff" d="M0 0h20v14H0z"/><path fill="#d52b35" d="M8.5 0h3v14h-3zM0 5.5h20v3H0z"/><path fill="#fff" d="M3.2 2.2h2v2h-2zM14.8 2.2h2v2h-2zM3.2 9.8h2v2h-2zM14.8 9.8h2v2h-2z"/><path fill="#d52b35" d="M3.8 2.5h.8v1.4h-.8zM3.5 2.8h1.4v.8H3.5zM15.1 2.5h.8v1.4h-.8zM14.8 2.8h1.4v.8h-1.4zM3.8 10.1h.8v1.4h-.8zM3.5 10.4h1.4v.8H3.5zM15.1 10.1h.8v1.4h-.8zM14.8 10.4h1.4v.8h-1.4z"/></svg>',
};

export function renderHeader(lang, cartCount) {
  return `
    <header class="header">
      <div class="container header__inner">
        <a class="header__brand" href="/" data-link aria-label="CheFish — ${t('action.home', lang)}">
          <img class="header__logo" src="/assets/images/brand/chefish-logo.png" alt="CheFish" width="150" height="67" />
        </a>
        <nav class="header__nav" aria-label="${t('generic.menuOpen', lang)}">
          <a href="/menu" data-link>${t('nav.menu', lang)}</a>
          <a href="/#story" data-link>${t('nav.about', lang)}</a>
          <a href="/#delivery" data-link>${t('nav.delivery', lang)}</a>
          <a href="/#combos" data-link>${t('nav.offers', lang)}</a>
          <a href="/#contacts" data-link>${t('nav.contacts', lang)}</a>
        </nav>
        <div class="header__actions">
          <a class="header__icon-btn header__cart" href="/cart" data-link aria-label="${cartCount > 0 ? `${t('cart.title', lang)}: ${cartCount}` : t('cart.title', lang)}">
            ${bagIcon}${cartCount > 0 ? `<span class="cart-badge" aria-live="polite">${cartCount}</span>` : ''}
          </a>
          <div class="language-picker" data-language-picker>
            <button class="language-picker__trigger" type="button" data-action="language-toggle" aria-label="${t('generic.language', lang)}: ${languageNames[lang]}" aria-expanded="false" aria-haspopup="listbox">
              ${flags[lang]}<span>${lang.toUpperCase()}</span><span class="language-picker__chevron" aria-hidden="true">⌄</span>
            </button>
            <div class="language-picker__menu" data-language-menu role="listbox" aria-label="${t('generic.language', lang)}" hidden>
              ${['ru', 'en', 'ka'].map((code) => `<button type="button" class="language-picker__option ${code === lang ? 'is-active' : ''}" role="option" aria-selected="${code === lang}" data-language-option="${code}">${flags[code]}<span>${languageNames[code]}</span><span>${code.toUpperCase()}</span></button>`).join('')}
            </div>
          </div>
          <button class="header__menu-toggle" type="button" data-action="menu-toggle" aria-label="${t('generic.menuOpen', lang)}" aria-expanded="false"><span></span><span></span></button>
        </div>
      </div>
      <nav class="header__mobile-nav" data-mobile-nav aria-label="${t('generic.menuOpen', lang)}" hidden>
        <a href="/menu" data-link>${t('nav.menu', lang)}</a>
        <a href="/#story" data-link>${t('nav.about', lang)}</a>
        <a href="/#delivery" data-link>${t('nav.delivery', lang)}</a>
        <a href="/#combos" data-link>${t('nav.offers', lang)}</a>
        <a href="/#contacts" data-link>${t('nav.contacts', lang)}</a>
      </nav>
    </header>`;
}
