import { t } from '../data/i18n.js';

export function renderSliderArrow(direction, trackId, lang) {
  const isPrevious = direction === 'previous';
  return `<button class="showcase-controls__button" type="button" data-action="scroll-track" data-track="${trackId}" data-direction="${isPrevious ? -1 : 1}" aria-label="${t(isPrevious ? 'action.back' : 'action.next', lang)}" ${isPrevious ? 'disabled' : ''}>${isPrevious ? '←' : '→'}</button>`;
}
