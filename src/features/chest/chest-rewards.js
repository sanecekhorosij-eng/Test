import { addCrystals } from '../../state/player-wallet.js';

const REWARDS = Object.freeze([
  { type: 'crystals', icon: '💎', label: '30 кристаллов', amount: 30, weight: 30 },
  { type: 'coins', icon: '🪙', label: '750 монет', amount: 750, weight: 45 },
  { type: 'item', icon: '🎁', label: 'Эпический контейнер', amount: 1, weight: 25 }
]);

export function drawChestReward(random = Math.random) {
  const totalWeight = REWARDS.reduce((sum, reward) => sum + reward.weight, 0);
  let roll = random() * totalWeight;

  for (const reward of REWARDS) {
    roll -= reward.weight;
    if (roll < 0) return { ...reward };
  }

  return { ...REWARDS[REWARDS.length - 1] };
}

export function applyChestReward(reward) {
  if (reward.type === 'crystals') addCrystals(reward.amount);
  return reward;
}
