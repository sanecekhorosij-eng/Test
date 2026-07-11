export function getChestView() {
  return {
    root: document.querySelector('[data-page="chest"]'),
    timer: document.getElementById('chest-page-timer'),
    homeTimer: document.getElementById('home-chest-timer'),
    freeButton: document.getElementById('chest-free-button'),
    adButton: document.getElementById('chest-ad-button'),
    balance: document.getElementById('chest-crystal-balance'),
    chest: document.getElementById('animated-chest'),
    reward: document.getElementById('chest-reward'),
    rewardIcon: document.getElementById('chest-reward-icon'),
    rewardText: document.getElementById('chest-reward-text')
  };
}

export function renderChestTimer(view, state) {
  if (view.timer) view.timer.textContent = state.ready ? 'Готово' : state.label;
  if (view.freeButton) {
    view.freeButton.disabled = !state.ready;
    view.freeButton.classList.toggle('is-ready', state.ready);
  }
  if (view.homeTimer) {
    view.homeTimer.textContent = state.ready ? 'ГОТОВО' : state.label;
    view.homeTimer.classList.toggle('ready', state.ready);
  }
}

export function renderCrystalBalance(view, crystals) {
  if (view.balance) view.balance.textContent = String(crystals);
}

export function renderChestReward(view, reward) {
  if (view.rewardIcon) view.rewardIcon.textContent = reward.icon;
  if (view.rewardText) view.rewardText.textContent = reward.label;
}
