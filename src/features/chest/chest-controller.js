import { CHEST_CONFIG } from './chest-config.js';
import { readChestReadyAt, writeChestReadyAt } from './chest-storage.js';
import { createChestTimer } from './chest-timer.js';
import { drawChestReward, applyChestReward } from './chest-rewards.js';
import { getChestView, renderChestTimer, renderCrystalBalance, renderChestReward } from './chest-view.js';
import { playChestAnimation, resetChestAnimation } from './chest-animation.js';
import { getCrystalBalance, spendCrystals } from '../../state/player-wallet.js';

export function initChestFeature() {
  const view = getChestView();
  if (!view.root) return;

  let readyAt = readChestReadyAt();
  let opening = false;

  const timer = createChestTimer({
    getReadyAt: () => readyAt,
    onTick: (state) => renderChestTimer(view, state)
  });

  const syncBalance = () => renderCrystalBalance(view, getCrystalBalance());

  async function openChest({ paid }) {
    if (opening) return;

    const isReady = readyAt <= Date.now();
    if (!paid && !isReady) return;

    if (paid && !spendCrystals(CHEST_CONFIG.paidOpenCost)) {
      window.dispatchEvent(new CustomEvent('app:toast', { detail: 'Недостаточно кристаллов' }));
      return;
    }

    opening = true;
    syncBalance();
    const reward = drawChestReward();
    renderChestReward(view, reward);
    await playChestAnimation(view);
    applyChestReward(reward);
    syncBalance();

    if (!paid) {
      readyAt = Date.now() + CHEST_CONFIG.cooldownMs;
      writeChestReadyAt(readyAt);
      timer.refresh();
    }

    opening = false;
  }

  view.freeButton?.addEventListener('click', () => openChest({ paid: false }));
  view.paidButton?.addEventListener('click', () => openChest({ paid: true }));

  view.reward?.addEventListener('click', () => {
    resetChestAnimation(view);
  });

  window.addEventListener('wallet:changed', syncBalance);
  syncBalance();
  timer.start();
}
