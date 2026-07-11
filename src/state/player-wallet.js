const STORAGE_KEY = 'playerCrystals';
const DEFAULT_CRYSTALS = 150;

function readBalance() {
  try {
    const value = Number(localStorage.getItem(STORAGE_KEY));
    return Number.isFinite(value) && value >= 0 ? value : DEFAULT_CRYSTALS;
  } catch (_) {
    return DEFAULT_CRYSTALS;
  }
}

function writeBalance(value) {
  try {
    localStorage.setItem(STORAGE_KEY, String(value));
  } catch (_) {
    // Баланс остаётся доступен в текущей сессии.
  }
}

let crystals = readBalance();

export function getCrystalBalance() {
  return crystals;
}

export function spendCrystals(amount) {
  if (!Number.isFinite(amount) || amount <= 0 || crystals < amount) return false;
  crystals -= amount;
  writeBalance(crystals);
  window.dispatchEvent(new CustomEvent('wallet:changed', { detail: { crystals } }));
  return true;
}

export function addCrystals(amount) {
  if (!Number.isFinite(amount) || amount <= 0) return crystals;
  crystals += amount;
  writeBalance(crystals);
  window.dispatchEvent(new CustomEvent('wallet:changed', { detail: { crystals } }));
  return crystals;
}
