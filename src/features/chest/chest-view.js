export function getChestView() {
  return {
    root: document.querySelector('[data-page="chest"]'),
    timer: document.getElementById('chest-page-timer'),
    freeButton: document.getElementById('chest-free-button'),
    paidButton: document.getElementById('chest-paid-button'),
    balance: document.getElementById('chest-crystal-balance'),
    chest: document.getElementById('animated-chest'),
    reward: document.getElementById('chest-reward'),
    rewardIcon: document.getElementById('chest-reward-icon'),
    rewardText: document.getElementById('chest-reward-text')
  };
}

export function renderChestTimer(view, state) {
  if (view.timer) view.timer.textContent = state.ready ? 'Сундук готов' : `Следующий сундук: ${state.label}`;
  if (view.freeButton) view.freeButton.hidden = !state.ready;
  if (view.paidButton) view.paidButton.hidden = state.ready;
}

export function renderCrystalBalance(view, crystals) {
  if (view.balance) view.balance.textContent = String(crystals);
}

export function renderChestReward(view, reward) {
  if (view.rewardIcon) view.rewardIcon.textContent = reward.icon;
  if (view.rewardText) view.rewardText.textContent = reward.label;
}
