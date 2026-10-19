import { formatPrice } from '../core/format.js';
import { t } from '../data/i18n.js';

export function renderSuccessPage(lang) {
  let receipt = null;
  try { receipt = JSON.parse(window.sessionStorage.getItem('chefish.demo-receipt.v1') || 'null'); } catch { receipt = null; }
  if (!receipt?.id) {
    return `<main class="page page--success"><section class="success-card container"><div class="success-card__check success-card__check--blocked" aria-hidden="true">!</div><h1>${t('payment.title', lang)}</h1><p class="success-card__notice">${t('payment.notice', lang)}</p><div class="success-card__actions"><a class="button button--primary" href="/menu" data-link>${t('action.openMenu', lang)} →</a></div></section></main>`;
  }
  return `
    <main class="page page--success">
      <section class="success-card container">
        <div class="success-card__check" aria-hidden="true">✓</div>
        <h1>${t('success.title', lang)}</h1>
        <p class="success-card__notice">${t('success.notice', lang)}</p>
        <div class="success-card__details"><p><span>${t('success.number', lang)}</span><strong>${receipt.id}</strong></p><p><span>${t('cart.total', lang)}</span><strong>${formatPrice(receipt.totalTetri, lang)}</strong></p></div>
        <div class="success-card__actions"><a class="button button--primary" href="/menu" data-link>${t('action.openMenu', lang)} →</a></div>
      </section>
    </main>`;
}
