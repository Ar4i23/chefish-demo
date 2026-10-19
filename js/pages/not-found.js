import { t } from '../data/i18n.js';

export function renderNotFoundPage(lang) {
  return `
    <main class="page page--not-found">
      <section class="not-found container">
        <p class="not-found__code">404</p>
        <h1>${t('notFound.title', lang)}</h1>
        <p>${t('notFound.body', lang)}</p>
        <div class="not-found__actions"><a class="button button--primary" href="/" data-link>${t('action.home', lang)}</a><a class="button button--secondary" href="/menu" data-link>${t('action.openMenu', lang)}</a></div>
      </section>
    </main>`;
}
