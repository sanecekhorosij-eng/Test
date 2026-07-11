import { CHEST_CONFIG } from './chest-config.js';
import { readChestReadyAt, writeChestReadyAt } from './chest-storage.js';
import { createChestTimer } from './chest-timer.js';
import { drawChestReward, applyChestReward } from './chest-rewards.js';
import { getChestView, renderChestTimer, renderCrystalBalance, renderChestReward } from './chest-view.js';
import { playChestAnimation, resetChestAnimation } from './chest-animation.js';
import { watchRewardedAd } from './chest-ad.js';
import { getCrystalBalance } from '../../state/player-wallet.js';

export function initChestFeature() {
  const view = getChestView();
  if (!view.root) return;

  let readyAt = readChestReadyAt();
  let opening = false;

  if (readyAt <= 0) {
    readyAt = Date.now() + CHEST_CONFIG.cooldownMs;
    writeChestReadyAt(readyAt);
  }

  const timer = createChestTimer({
    getReadyAt: () => readyAt,
    onTick: (state) => renderChestTimer(view, state)
  });

  const syncBalance = () => renderCrystalBalance(view, getCrystalBalance());

  async function revealReward({ restartFreeTimer }) {
    if (opening) return;

    opening = true;
    view.freeButton && (view.freeButton.disabled = true);
    view.adButton && (view.adButton.disabled = true);

    const reward = drawChestReward();
    renderChestReward(view, reward);
    await playChestAnimation(view);
    applyChestReward(reward);
    syncBalance();

    if (restartFreeTimer) {
      readyAt = Date.now() + CHEST_CONFIG.cooldownMs;
      writeChestReadyAt(readyAt);
      timer.refresh();
    }

    opening = false;
    view.adButton && (view.adButton.disabled = false);
    timer.refresh();
  }

  view.freeButton?.addEventListener('click', () => {
    if (readyAt > Date.now()) return;
    revealReward({ restartFreeTimer: true });
  });

  view.adButton?.addEventListener('click', async () => {
    if (opening) return;
    const completed = await watchRewardedAd(view.adButton);
    if (completed) await revealReward({ restartFreeTimer: false });
  });

  view.reward?.addEventListener('click', () => resetChestAnimation(view));

  window.addEventListener('wallet:changed', syncBalance);
  syncBalance();
  timer.start();
}
