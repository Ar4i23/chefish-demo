import { t } from '../data/i18n.js';

export function renderFooter(lang) {
  return `
    <footer class="footer" id="contacts">
      <div class="container footer__main">
        <a class="footer__brand" href="/" data-link>
          <img src="/assets/images/brand/chefish-logo.png" alt="CheFish" width="126" height="56" loading="lazy" />
        </a>
        <p class="footer__description">${t('footer.note', lang)}</p>
        <nav class="footer__nav" aria-label="${t('nav.menu', lang)}">
          <a href="/menu" data-link>${t('nav.menu', lang)}</a>
          <a href="/#story" data-link>${t('nav.about', lang)}</a>
          <a href="/#delivery" data-link>${t('nav.delivery', lang)}</a>
          <a href="/cart" data-link>${t('cart.title', lang)}</a>
        </nav>
      </div>
      <div class="container footer__bottom">
        <span>© ${new Date().getFullYear()} CheFish</span>
        <span>${t('footer.paymentNote', lang)}</span>
      </div>
    </footer>`;
}
