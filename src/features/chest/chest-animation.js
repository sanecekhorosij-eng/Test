import { CHEST_CONFIG } from './chest-config.js';

export function playChestAnimation(view) {
  return new Promise((resolve) => {
    if (!view.chest || !view.reward) {
      resolve();
      return;
    }

    view.reward.hidden = true;
    view.chest.classList.remove('is-opening', 'is-open');
    void view.chest.offsetWidth;
    view.chest.classList.add('is-opening');

    window.setTimeout(() => {
      view.chest.classList.remove('is-opening');
      view.chest.classList.add('is-open');
      view.reward.hidden = false;
      resolve();
    }, CHEST_CONFIG.animationMs);
  });
}

export function resetChestAnimation(view) {
  view.chest?.classList.remove('is-opening', 'is-open');
  if (view.reward) view.reward.hidden = true;
}
